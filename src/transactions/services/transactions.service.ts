import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { PaymentGatewayFactory } from '../providers/payment-gateway.factory';
import { Transaction, TransactionStatus } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';
import { CreateTransactionResponseDto } from '../dto/transaction-response.dto';

/**
 * Service responsible for transaction management and gateway integration
 */
@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly gatewayFactory: PaymentGatewayFactory,
  ) {}

  /**
   * Create a new transaction and process it through the selected gateway
   * 
   * @param createTransactionDto - Transaction creation data
   * @returns Promise with created transaction and gateway response
   */
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<CreateTransactionResponseDto> {
    this.logger.log(`Creating transaction for contribution ${createTransactionDto.contributionId}`);

    // Validate gateway support
    if (!this.gatewayFactory.isGatewaySupported(createTransactionDto.paymentGateway)) {
      throw new BadRequestException(`Payment gateway ${createTransactionDto.paymentGateway} is not supported`);
    }

    // Create transaction entity
    const transaction = new Transaction();
    transaction.contributionId = createTransactionDto.contributionId;
    transaction.paymentGateway = createTransactionDto.paymentGateway;
    transaction.amount = createTransactionDto.amount;
    transaction.fee = createTransactionDto.fee || 0;
    transaction.status = TransactionStatus.INITIATED;
    transaction.metadata = createTransactionDto.metadata || {};

    // Save initial transaction
    const savedTransaction = await this.transactionRepository.save(transaction);
    this.logger.log(`Transaction ${savedTransaction.id} saved with status INITIATED`);

    try {
      // Get gateway service and create transaction
      const gatewayService = this.gatewayFactory.getGatewayService(createTransactionDto.paymentGateway);
      
      const gatewayResponse = await gatewayService.createTransaction({
        amount: createTransactionDto.amount,
        paymentMethodData: createTransactionDto.paymentMethodData,
        customer: createTransactionDto.customer,
        metadata: {
          ...createTransactionDto.metadata,
          internal_transaction_id: savedTransaction.id,
        },
      });

      // Update transaction with gateway response
      savedTransaction.externalTransactionId = gatewayResponse.id;
      savedTransaction.status = TransactionStatus.PROCESSING;
      savedTransaction.metadata = {
        ...savedTransaction.metadata,
        gateway_response: gatewayResponse.data,
      };

      const updatedTransaction = await this.transactionRepository.save(savedTransaction);
      this.logger.log(`Transaction ${updatedTransaction.id} updated with gateway ID: ${gatewayResponse.id}`);

      // Build response DTO
      const response: CreateTransactionResponseDto = {
        id: updatedTransaction.id,
        contributionId: updatedTransaction.contributionId,
        paymentGateway: updatedTransaction.paymentGateway,
        externalTransactionId: updatedTransaction.externalTransactionId,
        amount: updatedTransaction.amount,
        fee: updatedTransaction.fee,
        netAmount: updatedTransaction.netAmount,
        status: updatedTransaction.status,
        paymentDate: updatedTransaction.paymentDate,
        refundDate: updatedTransaction.refundDate,
        metadata: updatedTransaction.metadata,
        createdAt: updatedTransaction.createdAt,
        updatedAt: updatedTransaction.updatedAt,
        paymentUrl: gatewayResponse.paymentUrl,
      };

      return response;

    } catch (error) {
      this.logger.error(`Gateway transaction creation failed for transaction ${savedTransaction.id}`, error);
      
      // Update transaction status to failed
      savedTransaction.status = TransactionStatus.FAILED;
      savedTransaction.metadata = {
        ...savedTransaction.metadata,
        error: error.message,
        error_timestamp: new Date().toISOString(),
      };
      
      await this.transactionRepository.save(savedTransaction);
      
      throw new BadRequestException(`Payment gateway error: ${error.message}`);
    }
  }

  /**
   * Get transaction by ID
   * 
   * @param id - Transaction ID
   * @returns Promise with transaction
   * @throws NotFoundException if transaction not found
   */
  async findById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['contribution'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  /**
   * Get transactions by contribution ID
   * 
   * @param contributionId - Contribution ID
   * @returns Promise with array of transactions
   */
  async findByContributionId(contributionId: number): Promise<Transaction[]> {
    return this.transactionRepository.findByContributionId(contributionId);
  }

  /**
   * Update transaction status via gateway callback/webhook
   * 
   * @param id - Transaction ID
   * @param updateDto - Status update data
   * @returns Promise with updated transaction
   */
  async updateTransactionStatus(id: number, updateDto: UpdateTransactionStatusDto): Promise<Transaction> {
    this.logger.log(`Updating transaction ${id} status to ${updateDto.status}`);

    const transaction = await this.findById(id);

    if (transaction.isFinalState() && transaction.status !== updateDto.status) {
      throw new BadRequestException(`Transaction ${id} is in final state and cannot be modified`);
    }

    // Update transaction based on new status
    switch (updateDto.status) {
      case TransactionStatus.PAID:
        const paymentDate = updateDto.paymentDate ? new Date(updateDto.paymentDate) : new Date();
        transaction.markAsPaid(
          paymentDate,
          updateDto.externalTransactionId,
          updateDto.metadata
        );
        break;

      case TransactionStatus.FAILED:
        transaction.markAsFailed(updateDto.metadata);
        break;

      case TransactionStatus.REFUNDED:
        const refundDate = updateDto.refundDate ? new Date(updateDto.refundDate) : new Date();
        transaction.markAsRefunded(refundDate, updateDto.metadata);
        break;

      case TransactionStatus.PROCESSING:
        if (transaction.status === TransactionStatus.INITIATED) {
          transaction.startProcessing();
        }
        if (updateDto.metadata) {
          transaction.updateMetadata(updateDto.metadata);
        }
        break;

      default:
        throw new BadRequestException(`Invalid status transition to ${updateDto.status}`);
    }

    const updatedTransaction = await this.transactionRepository.save(transaction);
    this.logger.log(`Transaction ${id} status updated to ${updatedTransaction.status}`);

    return updatedTransaction;
  }

  /**
   * Sync transaction status with gateway
   * Useful for recovering from webhook failures or checking stale transactions
   * 
   * @param id - Transaction ID
   * @returns Promise with updated transaction
   */
  async syncTransactionStatus(id: number): Promise<Transaction> {
    this.logger.log(`Syncing transaction ${id} with gateway`);

    const transaction = await this.findById(id);

    if (!transaction.externalTransactionId) {
      throw new BadRequestException(`Transaction ${id} has no external transaction ID to sync`);
    }

    try {
      const gatewayService = this.gatewayFactory.getGatewayService(transaction.paymentGateway);
      const gatewayStatus = await gatewayService.checkTransactionStatus(transaction.externalTransactionId);

      // Update transaction if status changed
      if (gatewayStatus.status !== transaction.status) {
        const updateDto: UpdateTransactionStatusDto = {
          status: gatewayStatus.status,
          paymentDate: gatewayStatus.paymentDate?.toISOString(),
          metadata: gatewayStatus.metadata,
        };

        return this.updateTransactionStatus(id, updateDto);
      }

      return transaction;

    } catch (error) {
      this.logger.error(`Failed to sync transaction ${id} with gateway`, error);
      throw new BadRequestException(`Gateway sync failed: ${error.message}`);
    }
  }

  /**
   * Process refund for a transaction
   * 
   * @param id - Transaction ID
   * @param amount - Refund amount (optional, defaults to full amount)
   * @param reason - Refund reason
   * @returns Promise with updated transaction
   */
  async processRefund(id: number, amount?: number, reason?: string): Promise<Transaction> {
    this.logger.log(`Processing refund for transaction ${id}, amount: ${amount}`);

    const transaction = await this.findById(id);

    if (!transaction.canBeRefunded()) {
      throw new BadRequestException(`Transaction ${id} cannot be refunded`);
    }

    if (!transaction.externalTransactionId) {
      throw new BadRequestException(`Transaction ${id} has no external transaction ID for refund`);
    }

    try {
      const gatewayService = this.gatewayFactory.getGatewayService(transaction.paymentGateway);
      const refundResponse = await gatewayService.processRefund(
        transaction.externalTransactionId,
        amount,
        reason
      );

      // Update transaction status
      const updateDto: UpdateTransactionStatusDto = {
        status: TransactionStatus.REFUNDED,
        refundDate: refundResponse.processedAt.toISOString(),
        metadata: {
          refund_id: refundResponse.refundId,
          refund_amount: amount || transaction.amount,
          refund_reason: reason,
          ...refundResponse.metadata,
        },
      };

      return this.updateTransactionStatus(id, updateDto);

    } catch (error) {
      this.logger.error(`Failed to process refund for transaction ${id}`, error);
      throw new BadRequestException(`Refund processing failed: ${error.message}`);
    }
  }

  /**
   * Handle webhook notification from payment gateway
   * 
   * @param signature - Webhook signature for validation
   * @param payload - Webhook payload
   * @param gateway - Payment gateway type
   * @returns Promise with processing result
   */
  async handleWebhook(signature: string, payload: string, gateway: string): Promise<{ processed: boolean; transactionId?: number }> {
    this.logger.log(`Handling webhook from ${gateway}`);

    try {
      // Get gateway service and validate webhook
      const gatewayService = this.gatewayFactory.getGatewayService(gateway as any);
      
      if (!gatewayService.validateWebhook(signature, payload)) {
        this.logger.warn(`Invalid webhook signature from ${gateway}`);
        return { processed: false };
      }

      // Parse webhook data
      const webhookData = gatewayService.parseWebhookData(JSON.parse(payload));
      
      if (!webhookData) {
        this.logger.log(`Webhook from ${gateway} is not transaction-related`);
        return { processed: false };
      }

      // Find transaction by external ID
      const transaction = await this.transactionRepository.findByExternalTransactionId(
        webhookData.externalTransactionId
      );

      if (!transaction) {
        this.logger.warn(`Transaction not found for external ID: ${webhookData.externalTransactionId}`);
        return { processed: false };
      }

      // Update transaction status if needed
      if (webhookData.status !== transaction.status) {
        const updateDto: UpdateTransactionStatusDto = {
          status: webhookData.status,
          paymentDate: webhookData.paymentDate?.toISOString(),
          metadata: webhookData.metadata,
        };

        await this.updateTransactionStatus(transaction.id, updateDto);
        this.logger.log(`Transaction ${transaction.id} updated via webhook`);
      }

      return { processed: true, transactionId: transaction.id };

    } catch (error) {
      this.logger.error(`Webhook processing failed for ${gateway}`, error);
      return { processed: false };
    }
  }

  /**
   * Get transaction statistics for a contribution
   * 
   * @param contributionId - Contribution ID
   * @returns Promise with transaction statistics
   */
  async getTransactionStats(contributionId: number) {
    return this.transactionRepository.getTransactionStats(contributionId);
  }
}