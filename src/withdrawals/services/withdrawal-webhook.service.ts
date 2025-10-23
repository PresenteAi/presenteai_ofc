import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { WithdrawalsService } from '../services/withdrawals.service';
import { 
  WithdrawalWebhookDto, 
  StripeWithdrawalWebhookDto, 
  MercadoPagoWithdrawalWebhookDto, 
  PagarMeWithdrawalWebhookDto 
} from '../dto/withdrawal-webhook.dto';
import { WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';

@Injectable()
export class WithdrawalWebhookService {
  private readonly logger = new Logger(WithdrawalWebhookService.name);

  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  async handleStripeWebhook(payload: StripeWithdrawalWebhookDto): Promise<void> {
    this.logger.log(`Processing Stripe withdrawal webhook: ${payload.type}`);

    try {
      const webhookDto: WithdrawalWebhookDto = {
        gateway: WithdrawalGateway.STRIPE,
        externalId: payload.data.object.id,
        status: this.mapStripeStatus(payload.data.object.status),
        transactionReference: payload.data.object.id,
        feeAmount: payload.data.object.amount ? (payload.data.object.amount * 0.025) : undefined, // 2.5% fee example
        processedAt: payload.data.object.arrival_date ? new Date(payload.data.object.arrival_date * 1000).toISOString() : undefined,
        failureReason: payload.data.object.failure_message,
        metadata: payload.data.object.metadata,
      };

      await this.processWebhook(webhookDto);
    } catch (error) {
      this.logger.error(`Error processing Stripe webhook: ${error.message}`);
      throw new BadRequestException('Failed to process Stripe webhook');
    }
  }

  async handleMercadoPagoWebhook(payload: MercadoPagoWithdrawalWebhookDto): Promise<void> {
    this.logger.log(`Processing MercadoPago withdrawal webhook: ${payload.action}`);

    try {
      // In real implementation, you would fetch the transfer details using payload.data.id
      // For now, we'll create a basic webhook DTO structure
      const webhookDto: WithdrawalWebhookDto = {
        gateway: WithdrawalGateway.MERCADOPAGO,
        externalId: payload.data.id,
        status: this.mapMercadoPagoStatus(payload.action),
        transactionReference: payload.data.id,
        processedAt: payload.date_created,
        metadata: { action: payload.action, api_version: payload.api_version },
      };

      await this.processWebhook(webhookDto);
    } catch (error) {
      this.logger.error(`Error processing MercadoPago webhook: ${error.message}`);
      throw new BadRequestException('Failed to process MercadoPago webhook');
    }
  }

  async handlePagarMeWebhook(payload: PagarMeWithdrawalWebhookDto): Promise<void> {
    this.logger.log(`Processing Pagar.me withdrawal webhook: ${payload.event}`);

    try {
      const webhookDto: WithdrawalWebhookDto = {
        gateway: WithdrawalGateway.PAGARME,
        externalId: payload.current_status.id,
        status: this.mapPagarMeStatus(payload.current_status.status),
        transactionReference: payload.current_status.id,
        feeAmount: payload.current_status.fee / 100, // Convert from cents
        processedAt: payload.current_status.date_updated,
        metadata: { event: payload.event },
      };

      await this.processWebhook(webhookDto);
    } catch (error) {
      this.logger.error(`Error processing Pagar.me webhook: ${error.message}`);
      throw new BadRequestException('Failed to process Pagar.me webhook');
    }
  }

  private async processWebhook(webhookDto: WithdrawalWebhookDto): Promise<void> {
    try {
      // Find withdrawal by external reference
      const withdrawal = await this.withdrawalsService.findByExternalReference(
        webhookDto.externalId,
        webhookDto.gateway
      );

      if (!withdrawal) {
        this.logger.warn(`Withdrawal not found for external ID: ${webhookDto.externalId}`);
        return;
      }

      // Update withdrawal status
      await this.withdrawalsService.updateWithdrawalStatus(withdrawal.id, {
        status: webhookDto.status,
        transactionReference: webhookDto.transactionReference,
        processedAt: webhookDto.processedAt,
        fees: webhookDto.feeAmount,
        failureReason: webhookDto.failureReason,
        metadata: webhookDto.metadata,
      });

      this.logger.log(`Successfully updated withdrawal ${withdrawal.id} to status ${webhookDto.status}`);

      // Send notification to user about status change
      await this.notifyUserOfStatusChange(withdrawal.userId, withdrawal.id, webhookDto.status);

    } catch (error) {
      this.logger.error(`Error processing withdrawal webhook: ${error.message}`);
      throw error;
    }
  }

  private mapStripeStatus(stripeStatus: string): WithdrawalStatus {
    switch (stripeStatus) {
      case 'paid':
        return WithdrawalStatus.COMPLETED;
      case 'pending':
        return WithdrawalStatus.PROCESSING;
      case 'in_transit':
        return WithdrawalStatus.PROCESSING;
      case 'failed':
        return WithdrawalStatus.FAILED;
      case 'canceled':
        return WithdrawalStatus.FAILED;
      default:
        this.logger.warn(`Unknown Stripe status: ${stripeStatus}`);
        return WithdrawalStatus.PENDING;
    }
  }

  private mapMercadoPagoStatus(action: string): WithdrawalStatus {
    switch (action) {
      case 'transfer.created':
        return WithdrawalStatus.PROCESSING;
      case 'transfer.updated':
        return WithdrawalStatus.PROCESSING;
      case 'transfer.paid':
        return WithdrawalStatus.COMPLETED;
      case 'transfer.cancelled':
        return WithdrawalStatus.FAILED;
      default:
        this.logger.warn(`Unknown MercadoPago action: ${action}`);
        return WithdrawalStatus.PENDING;
    }
  }

  private mapPagarMeStatus(pagarMeStatus: string): WithdrawalStatus {
    switch (pagarMeStatus) {
      case 'processing':
        return WithdrawalStatus.PROCESSING;
      case 'transferred':
        return WithdrawalStatus.COMPLETED;
      case 'failed':
        return WithdrawalStatus.FAILED;
      case 'canceled':
        return WithdrawalStatus.FAILED;
      default:
        this.logger.warn(`Unknown Pagar.me status: ${pagarMeStatus}`);
        return WithdrawalStatus.PENDING;
    }
  }

  private async notifyUserOfStatusChange(userId: number, withdrawalId: number, status: WithdrawalStatus): Promise<void> {
    // TODO: Integrate with notifications service
    this.logger.log(`Should notify user ${userId} about withdrawal ${withdrawalId} status change to ${status}`);
    
    // Example integration:
    // await this.notificationsService.createNotification({
    //   userId,
    //   type: NotificationType.WITHDRAWAL_STATUS_UPDATE,
    //   title: 'Withdrawal Status Update',
    //   message: `Your withdrawal request has been ${status.toLowerCase()}`,
    //   data: { withdrawalId, status }
    // });
  }

  /**
   * Verify webhook signature for security
   */
  async verifyWebhookSignature(
    gateway: WithdrawalGateway,
    payload: string,
    signature: string,
    secret: string
  ): Promise<boolean> {
    const crypto = require('crypto');

    switch (gateway) {
      case WithdrawalGateway.STRIPE:
        const stripeSignature = crypto
          .createHmac('sha256', secret)
          .update(payload, 'utf8')
          .digest('hex');
        return `sha256=${stripeSignature}` === signature;

      case WithdrawalGateway.MERCADOPAGO:
        // MercadoPago uses different signature verification
        const mpSignature = crypto
          .createHmac('sha256', secret)
          .update(payload)
          .digest('hex');
        return mpSignature === signature;

      case WithdrawalGateway.PAGARME:
        // Pagar.me signature verification
        const pmSignature = crypto
          .createHmac('sha1', secret)
          .update(payload)
          .digest('hex');
        return pmSignature === signature;

      default:
        this.logger.warn(`Unknown gateway for signature verification: ${gateway}`);
        return false;
    }
  }
}