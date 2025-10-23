"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WithdrawalWebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalWebhookService = void 0;
const common_1 = require("@nestjs/common");
const withdrawals_service_1 = require("../services/withdrawals.service");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
let WithdrawalWebhookService = WithdrawalWebhookService_1 = class WithdrawalWebhookService {
    withdrawalsService;
    logger = new common_1.Logger(WithdrawalWebhookService_1.name);
    constructor(withdrawalsService) {
        this.withdrawalsService = withdrawalsService;
    }
    async handleStripeWebhook(payload) {
        this.logger.log(`Processing Stripe withdrawal webhook: ${payload.type}`);
        try {
            const webhookDto = {
                gateway: withdrawal_entity_1.WithdrawalGateway.STRIPE,
                externalId: payload.data.object.id,
                status: this.mapStripeStatus(payload.data.object.status),
                transactionReference: payload.data.object.id,
                feeAmount: payload.data.object.amount ? (payload.data.object.amount * 0.025) : undefined,
                processedAt: payload.data.object.arrival_date ? new Date(payload.data.object.arrival_date * 1000).toISOString() : undefined,
                failureReason: payload.data.object.failure_message,
                metadata: payload.data.object.metadata,
            };
            await this.processWebhook(webhookDto);
        }
        catch (error) {
            this.logger.error(`Error processing Stripe webhook: ${error.message}`);
            throw new common_1.BadRequestException('Failed to process Stripe webhook');
        }
    }
    async handleMercadoPagoWebhook(payload) {
        this.logger.log(`Processing MercadoPago withdrawal webhook: ${payload.action}`);
        try {
            const webhookDto = {
                gateway: withdrawal_entity_1.WithdrawalGateway.MERCADOPAGO,
                externalId: payload.data.id,
                status: this.mapMercadoPagoStatus(payload.action),
                transactionReference: payload.data.id,
                processedAt: payload.date_created,
                metadata: { action: payload.action, api_version: payload.api_version },
            };
            await this.processWebhook(webhookDto);
        }
        catch (error) {
            this.logger.error(`Error processing MercadoPago webhook: ${error.message}`);
            throw new common_1.BadRequestException('Failed to process MercadoPago webhook');
        }
    }
    async handlePagarMeWebhook(payload) {
        this.logger.log(`Processing Pagar.me withdrawal webhook: ${payload.event}`);
        try {
            const webhookDto = {
                gateway: withdrawal_entity_1.WithdrawalGateway.PAGARME,
                externalId: payload.current_status.id,
                status: this.mapPagarMeStatus(payload.current_status.status),
                transactionReference: payload.current_status.id,
                feeAmount: payload.current_status.fee / 100,
                processedAt: payload.current_status.date_updated,
                metadata: { event: payload.event },
            };
            await this.processWebhook(webhookDto);
        }
        catch (error) {
            this.logger.error(`Error processing Pagar.me webhook: ${error.message}`);
            throw new common_1.BadRequestException('Failed to process Pagar.me webhook');
        }
    }
    async processWebhook(webhookDto) {
        try {
            const withdrawal = await this.withdrawalsService.findByExternalReference(webhookDto.externalId, webhookDto.gateway);
            if (!withdrawal) {
                this.logger.warn(`Withdrawal not found for external ID: ${webhookDto.externalId}`);
                return;
            }
            await this.withdrawalsService.updateWithdrawalStatus(withdrawal.id, {
                status: webhookDto.status,
                transactionReference: webhookDto.transactionReference,
                processedAt: webhookDto.processedAt,
                fees: webhookDto.feeAmount,
                failureReason: webhookDto.failureReason,
                metadata: webhookDto.metadata,
            });
            this.logger.log(`Successfully updated withdrawal ${withdrawal.id} to status ${webhookDto.status}`);
            await this.notifyUserOfStatusChange(withdrawal.userId, withdrawal.id, webhookDto.status);
        }
        catch (error) {
            this.logger.error(`Error processing withdrawal webhook: ${error.message}`);
            throw error;
        }
    }
    mapStripeStatus(stripeStatus) {
        switch (stripeStatus) {
            case 'paid':
                return withdrawal_entity_1.WithdrawalStatus.COMPLETED;
            case 'pending':
                return withdrawal_entity_1.WithdrawalStatus.PROCESSING;
            case 'in_transit':
                return withdrawal_entity_1.WithdrawalStatus.PROCESSING;
            case 'failed':
                return withdrawal_entity_1.WithdrawalStatus.FAILED;
            case 'canceled':
                return withdrawal_entity_1.WithdrawalStatus.FAILED;
            default:
                this.logger.warn(`Unknown Stripe status: ${stripeStatus}`);
                return withdrawal_entity_1.WithdrawalStatus.PENDING;
        }
    }
    mapMercadoPagoStatus(action) {
        switch (action) {
            case 'transfer.created':
                return withdrawal_entity_1.WithdrawalStatus.PROCESSING;
            case 'transfer.updated':
                return withdrawal_entity_1.WithdrawalStatus.PROCESSING;
            case 'transfer.paid':
                return withdrawal_entity_1.WithdrawalStatus.COMPLETED;
            case 'transfer.cancelled':
                return withdrawal_entity_1.WithdrawalStatus.FAILED;
            default:
                this.logger.warn(`Unknown MercadoPago action: ${action}`);
                return withdrawal_entity_1.WithdrawalStatus.PENDING;
        }
    }
    mapPagarMeStatus(pagarMeStatus) {
        switch (pagarMeStatus) {
            case 'processing':
                return withdrawal_entity_1.WithdrawalStatus.PROCESSING;
            case 'transferred':
                return withdrawal_entity_1.WithdrawalStatus.COMPLETED;
            case 'failed':
                return withdrawal_entity_1.WithdrawalStatus.FAILED;
            case 'canceled':
                return withdrawal_entity_1.WithdrawalStatus.FAILED;
            default:
                this.logger.warn(`Unknown Pagar.me status: ${pagarMeStatus}`);
                return withdrawal_entity_1.WithdrawalStatus.PENDING;
        }
    }
    async notifyUserOfStatusChange(userId, withdrawalId, status) {
        this.logger.log(`Should notify user ${userId} about withdrawal ${withdrawalId} status change to ${status}`);
    }
    async verifyWebhookSignature(gateway, payload, signature, secret) {
        const crypto = require('crypto');
        switch (gateway) {
            case withdrawal_entity_1.WithdrawalGateway.STRIPE:
                const stripeSignature = crypto
                    .createHmac('sha256', secret)
                    .update(payload, 'utf8')
                    .digest('hex');
                return `sha256=${stripeSignature}` === signature;
            case withdrawal_entity_1.WithdrawalGateway.MERCADOPAGO:
                const mpSignature = crypto
                    .createHmac('sha256', secret)
                    .update(payload)
                    .digest('hex');
                return mpSignature === signature;
            case withdrawal_entity_1.WithdrawalGateway.PAGARME:
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
};
exports.WithdrawalWebhookService = WithdrawalWebhookService;
exports.WithdrawalWebhookService = WithdrawalWebhookService = WithdrawalWebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [withdrawals_service_1.WithdrawalsService])
], WithdrawalWebhookService);
//# sourceMappingURL=withdrawal-webhook.service.js.map