import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  Logger,
  ForbiddenException 
} from '@nestjs/common';
import { WithdrawalRepository } from '../repositories/withdrawal.repository';
import { TransactionRepository } from '../../transactions/repositories/transaction.repository';
import { Withdrawal, WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';
import { TransactionStatus } from '../../transactions/entities/transaction.entity';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';
import { UpdateWithdrawalStatusDto } from '../dto/update-withdrawal-status.dto';
import { CreateWithdrawalResponseDto, BalanceResponseDto } from '../dto/withdrawal-response.dto';
import { WithdrawalGatewayInterface, BankAccountInfo } from '../interfaces/withdrawal-gateway.interface';

/**
 * Service responsible for withdrawal management and gateway integration
 */
@Injectable()
export class WithdrawalsService {
  private readonly logger = new Logger(WithdrawalsService.name);

  constructor(
    private readonly withdrawalRepository: WithdrawalRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  /**
   * Create a new withdrawal request
   * 
   * @param userId - User requesting the withdrawal
   * @param createWithdrawalDto - Withdrawal creation data
   * @returns Promise with created withdrawal and gateway response
   */
  async createWithdrawal(
    userId: number, 
    createWithdrawalDto: CreateWithdrawalDto
  ): Promise<CreateWithdrawalResponseDto> {
    this.logger.log(`Creating withdrawal request for user ${userId}, amount: ${createWithdrawalDto.totalAmount}`);

    // 1. Validate user has sufficient balance
    const balance = await this.getUserBalance(userId);
    if (createWithdrawalDto.totalAmount > balance.availableBalance) {
      throw new BadRequestException(
        `Insufficient balance. Available: R$ ${balance.availableBalance.toFixed(2)}, Requested: R$ ${createWithdrawalDto.totalAmount.toFixed(2)}`
      );
    }

    // 2. Validate minimum withdrawal amount
    const minAmount = 10.00; // Configure this based on gateway limits
    if (createWithdrawalDto.totalAmount < minAmount) {
      throw new BadRequestException(`Minimum withdrawal amount is R$ ${minAmount.toFixed(2)}`);
    }

    // 3. Calculate platform fees
    const feeAmount = this.calculatePlatformFees(createWithdrawalDto.totalAmount);
    
    // 4. Create withdrawal entity
    const withdrawal = new Withdrawal();
    withdrawal.userId = userId;
    withdrawal.totalAmount = createWithdrawalDto.totalAmount;
    withdrawal.feeAmount = feeAmount;
    withdrawal.status = WithdrawalStatus.PENDING;
    withdrawal.paymentGateway = createWithdrawalDto.paymentGateway;
    withdrawal.setBankAccount(createWithdrawalDto.bankAccount);
    withdrawal.metadata = {
      ...createWithdrawalDto.metadata,
      requested_by: userId,
      balance_at_request: balance.availableBalance,
    };

    // 5. Save initial withdrawal
    const savedWithdrawal = await this.withdrawalRepository.save(withdrawal);
    this.logger.log(`Withdrawal ${savedWithdrawal.id} created with status PENDING`);

    // 6. If gateway is specified, try to process immediately
    let gatewayInfo: Record<string, any> | undefined;
    let estimatedProcessingTime: number | undefined;

    if (createWithdrawalDto.paymentGateway) {
      try {
        // TODO: Implement gateway integration when gateway services are ready
        // const gatewayResponse = await this.processWithGateway(savedWithdrawal);
        // gatewayInfo = gatewayResponse.data;
        // estimatedProcessingTime = gatewayResponse.estimatedProcessingTime;
        
        // For now, just log and set processing status
        this.logger.log(`Gateway processing would be initiated for withdrawal ${savedWithdrawal.id}`);
        estimatedProcessingTime = 24; // Mock: 24 hours
      } catch (error) {
        this.logger.error(`Gateway processing failed for withdrawal ${savedWithdrawal.id}`, error);
        // Continue with manual processing
      }
    }

    // 7. Build response DTO
    const response: CreateWithdrawalResponseDto = {
      id: savedWithdrawal.id,
      userId: savedWithdrawal.userId,
      totalAmount: savedWithdrawal.totalAmount,
      feeAmount: savedWithdrawal.feeAmount,
      netAmount: savedWithdrawal.netAmount,
      status: savedWithdrawal.status,
      paymentGateway: savedWithdrawal.paymentGateway,
      transactionReference: savedWithdrawal.transactionReference,
      bankAccount: this.maskBankAccount(savedWithdrawal.bankAccount),
      requestedAt: savedWithdrawal.requestedAt,
      processedAt: savedWithdrawal.processedAt,
      metadata: savedWithdrawal.metadata,
      createdAt: savedWithdrawal.createdAt,
      updatedAt: savedWithdrawal.updatedAt,
      estimatedProcessingTime,
      ...(gatewayInfo && { gatewayInfo }),
    };

    return response;
  }

  /**
   * Get withdrawal by ID with authorization check
   * 
   * @param id - Withdrawal ID
   * @param userId - User ID for authorization
   * @returns Promise with withdrawal
   */
  async findById(id: number, userId?: number): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }

    // Check authorization if userId is provided
    if (userId && withdrawal.userId !== userId) {
      throw new ForbiddenException('You can only access your own withdrawals');
    }

    return withdrawal;
  }

  /**
   * Get withdrawals by user ID
   * 
   * @param userId - User ID
   * @param status - Optional status filter
   * @returns Promise with array of withdrawals
   */
  async findByUserId(userId: number, status?: WithdrawalStatus): Promise<Withdrawal[]> {
    return this.withdrawalRepository.findByUserId(userId, status);
  }

  /**
   * Update withdrawal status via gateway callback/webhook
   * 
   * @param id - Withdrawal ID
   * @param updateDto - Status update data
   * @returns Promise with updated withdrawal
   */
  async updateWithdrawalStatus(id: number, updateDto: UpdateWithdrawalStatusDto): Promise<Withdrawal> {
    this.logger.log(`Updating withdrawal ${id} status to ${updateDto.status}`);

    const withdrawal = await this.withdrawalRepository.findOne({ where: { id } });
    if (!withdrawal) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }

    if (withdrawal.isFinalState() && withdrawal.status !== updateDto.status) {
      throw new BadRequestException(`Withdrawal ${id} is in final state and cannot be modified`);
    }

    // Update withdrawal based on new status
    switch (updateDto.status) {
      case WithdrawalStatus.PROCESSING:
        if (withdrawal.status === WithdrawalStatus.PENDING) {
          if (updateDto.transactionReference) {
            withdrawal.transactionReference = updateDto.transactionReference;
          }
          withdrawal.status = WithdrawalStatus.PROCESSING;
          if (updateDto.metadata) {
            withdrawal.updateMetadata(updateDto.metadata);
          }
        }
        break;

      case WithdrawalStatus.COMPLETED:
        const processedAt = updateDto.processedAt ? new Date(updateDto.processedAt) : new Date();
        withdrawal.markAsCompleted(
          processedAt,
          updateDto.transactionReference,
          updateDto.metadata
        );
        
        // Apply gateway fees if provided
        if (updateDto.fees !== undefined) {
          withdrawal.feeAmount = updateDto.fees;
          withdrawal.calculateNetAmount();
        }
        break;

      case WithdrawalStatus.FAILED:
        const failureDate = updateDto.processedAt ? new Date(updateDto.processedAt) : new Date();
        withdrawal.markAsFailed(updateDto.metadata, failureDate);
        break;

      default:
        throw new BadRequestException(`Invalid status transition to ${updateDto.status}`);
    }

    const updatedWithdrawal = await this.withdrawalRepository.save(withdrawal);
    this.logger.log(`Withdrawal ${id} status updated to ${updatedWithdrawal.status}`);

    return updatedWithdrawal;
  }

  /**
   * Cancel a pending withdrawal
   * 
   * @param id - Withdrawal ID
   * @param userId - User ID for authorization
   * @returns Promise with updated withdrawal
   */
  async cancelWithdrawal(id: number, userId: number): Promise<Withdrawal> {
    this.logger.log(`Cancelling withdrawal ${id} for user ${userId}`);

    const withdrawal = await this.findById(id, userId);

    if (!withdrawal.canBeCancelled()) {
      throw new BadRequestException(`Withdrawal ${id} cannot be cancelled. Current status: ${withdrawal.status}`);
    }

    // TODO: If withdrawal has gateway reference, attempt to cancel with gateway
    if (withdrawal.transactionReference) {
      this.logger.log(`Would cancel gateway withdrawal ${withdrawal.transactionReference}`);
      // await this.cancelWithGateway(withdrawal);
    }

    withdrawal.markAsFailed({ 
      cancellation_reason: 'Cancelled by user',
      cancelled_by: userId,
      cancelled_at: new Date().toISOString()
    });

    return this.withdrawalRepository.save(withdrawal);
  }

  /**
   * Find withdrawal by external reference from payment gateway
   * 
   * @param externalId - External reference ID from gateway
   * @param gateway - Payment gateway
   * @returns Promise with withdrawal or null
   */
  async findByExternalReference(
    externalId: string, 
    gateway: WithdrawalGateway
  ): Promise<Withdrawal | null> {
    this.logger.log(`Finding withdrawal by external reference: ${externalId} (${gateway})`);

    return this.withdrawalRepository.findOne({
      where: {
        transactionReference: externalId,
        paymentGateway: gateway,
      },
      relations: ['user'],
    });
  }

  /**
   * Get user's available balance for withdrawals
   * 
   * @param userId - User ID
   * @returns Promise with balance information
   */
  async getUserBalance(userId: number): Promise<BalanceResponseDto> {
    // 1. Get total from completed transactions where user is the recipient
    // This would typically come from contributions to events owned by the user
    // For now, we'll calculate from transactions (mock implementation)
    
    const completedTransactionsStats = await this.transactionRepository.createQueryBuilder('transaction')
      .leftJoin('contributions', 'contribution', 'transaction.contribution_id = contribution.id')
      .select([
        'SUM(CASE WHEN transaction.status = :paidStatus THEN transaction.net_amount ELSE 0 END) as totalEarned'
      ])
      .where('contribution.user_id = :userId', { userId }) // Assuming contributions have user_id
      .setParameter('paidStatus', TransactionStatus.PAID)
      .getRawOne();

    const totalEarned = parseFloat(completedTransactionsStats?.totalEarned) || 0;

    // 2. Get total pending withdrawals
    const pendingWithdrawals = await this.withdrawalRepository.getPendingWithdrawalsAmount(userId);

    // 3. Get total completed withdrawals
    const completedWithdrawals = await this.withdrawalRepository.createQueryBuilder('withdrawal')
      .select('SUM(withdrawal.net_amount)', 'sum')
      .where('withdrawal.user_id = :userId', { userId })
      .andWhere('withdrawal.status = :status', { status: WithdrawalStatus.COMPLETED })
      .getRawOne();

    const totalWithdrawn = parseFloat(completedWithdrawals?.sum) || 0;

    // 4. Calculate available balance
    const availableBalance = Math.max(0, totalEarned - totalWithdrawn - pendingWithdrawals);

    return {
      availableBalance,
      pendingWithdrawals,
      totalBalance: totalEarned - totalWithdrawn,
      minimumWithdrawal: 10.00,
      maximumWithdrawal: Math.min(availableBalance, 5000.00), // Platform limit
      currency: 'BRL',
    };
  }

  /**
   * Get withdrawal statistics for a user
   * 
   * @param userId - User ID
   * @returns Promise with withdrawal statistics
   */
  async getUserWithdrawalStats(userId: number) {
    return this.withdrawalRepository.getUserWithdrawalStats(userId);
  }

  /**
   * Calculate platform fees for withdrawal
   * 
   * @param amount - Withdrawal amount
   * @returns Fee amount
   */
  private calculatePlatformFees(amount: number): number {
    // Example fee structure:
    // - 3% platform fee
    // - Minimum fee: R$ 2.00
    // - Maximum fee: R$ 50.00
    
    const percentageFee = amount * 0.03;
    const minFee = 2.00;
    const maxFee = 50.00;
    
    return Math.min(Math.max(percentageFee, minFee), maxFee);
  }

  /**
   * Mask sensitive bank account information for responses
   * 
   * @param bankAccount - Bank account data
   * @returns Masked bank account data
   */
  private maskBankAccount(bankAccount: Record<string, any> | undefined): Record<string, any> | undefined {
    if (!bankAccount) {
      return undefined;
    }

    return {
      ...bankAccount,
      accountNumber: bankAccount.accountNumber 
        ? `*****${bankAccount.accountNumber.slice(-1)}` 
        : undefined,
      accountHolderDocument: bankAccount.accountHolderDocument
        ? `***${bankAccount.accountHolderDocument.slice(-3)}`
        : undefined,
    };
  }

  /**
   * Validate bank account information
   * 
   * @param bankAccount - Bank account data to validate
   * @returns Validation result
   */
  async validateBankAccount(bankAccount: BankAccountInfo): Promise<{
    isValid: boolean;
    errors?: string[];
  }> {
    const errors: string[] = [];

    // Basic validation (extend as needed)
    if (!bankAccount.bankCode || !/^\d{3}$/.test(bankAccount.bankCode)) {
      errors.push('Invalid bank code format');
    }

    if (!bankAccount.accountNumber || bankAccount.accountNumber.length < 4) {
      errors.push('Invalid account number');
    }

    if (!bankAccount.agency || bankAccount.agency.length < 3) {
      errors.push('Invalid agency number');
    }

    if (!bankAccount.accountHolderDocument || 
        (!/^\d{11}$/.test(bankAccount.accountHolderDocument) && 
         !/^\d{14}$/.test(bankAccount.accountHolderDocument))) {
      errors.push('Invalid document format (must be CPF or CNPJ)');
    }

    // TODO: Add more sophisticated validations
    // - Check if bank code exists
    // - Validate CPF/CNPJ algorithm
    // - Check account holder name format

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Find overdue withdrawals that need attention
   * 
   * @param hours - Hours threshold
   * @returns Promise with overdue withdrawals
   */
  async findOverdueWithdrawals(hours: number = 24): Promise<Withdrawal[]> {
    return this.withdrawalRepository.findOverdueWithdrawals(hours);
  }
}