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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WithdrawalWebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalWebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const withdrawal_webhook_service_1 = require("../services/withdrawal-webhook.service");
const withdrawal_webhook_dto_1 = require("../dto/withdrawal-webhook.dto");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
let WithdrawalWebhooksController = WithdrawalWebhooksController_1 = class WithdrawalWebhooksController {
    withdrawalWebhookService;
    logger = new common_1.Logger(WithdrawalWebhooksController_1.name);
    constructor(withdrawalWebhookService) {
        this.withdrawalWebhookService = withdrawalWebhookService;
    }
    async handleStripeWebhook(payload, signature) {
        this.logger.log(`Received Stripe webhook: ${payload.type}`);
        if (!signature) {
            throw new common_1.UnauthorizedException('Missing Stripe signature');
        }
        const isValidSignature = await this.withdrawalWebhookService.verifyWebhookSignature(withdrawal_entity_1.WithdrawalGateway.STRIPE, JSON.stringify(payload), signature, process.env.STRIPE_WEBHOOK_SECRET || '');
        if (!isValidSignature) {
            this.logger.warn('Invalid Stripe webhook signature');
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        if (!payload.type.startsWith('payout.')) {
            this.logger.log(`Ignoring non-payout event: ${payload.type}`);
            return { success: true };
        }
        try {
            await this.withdrawalWebhookService.handleStripeWebhook(payload);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to process Stripe webhook: ${error.message}`);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    async handleMercadoPagoWebhook(payload, signature) {
        this.logger.log(`Received MercadoPago webhook: ${payload.action}`);
        if (!signature) {
            throw new common_1.UnauthorizedException('Missing MercadoPago signature');
        }
        const isValidSignature = await this.withdrawalWebhookService.verifyWebhookSignature(withdrawal_entity_1.WithdrawalGateway.MERCADOPAGO, JSON.stringify(payload), signature, process.env.MERCADOPAGO_WEBHOOK_SECRET || '');
        if (!isValidSignature) {
            this.logger.warn('Invalid MercadoPago webhook signature');
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        if (!payload.action.startsWith('transfer.')) {
            this.logger.log(`Ignoring non-transfer action: ${payload.action}`);
            return { success: true };
        }
        try {
            await this.withdrawalWebhookService.handleMercadoPagoWebhook(payload);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to process MercadoPago webhook: ${error.message}`);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    async handlePagarMeWebhook(payload, signature) {
        this.logger.log(`Received Pagar.me webhook: ${payload.event}`);
        if (!signature) {
            throw new common_1.UnauthorizedException('Missing Pagar.me signature');
        }
        const isValidSignature = await this.withdrawalWebhookService.verifyWebhookSignature(withdrawal_entity_1.WithdrawalGateway.PAGARME, JSON.stringify(payload), signature, process.env.PAGARME_WEBHOOK_SECRET || '');
        if (!isValidSignature) {
            this.logger.warn('Invalid Pagar.me webhook signature');
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        if (!payload.event.includes('transfer')) {
            this.logger.log(`Ignoring non-transfer event: ${payload.event}`);
            return { success: true };
        }
        try {
            await this.withdrawalWebhookService.handlePagarMeWebhook(payload);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to process Pagar.me webhook: ${error.message}`);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    async handleTestWebhook(payload) {
        this.logger.log('Received test webhook:', JSON.stringify(payload));
        return {
            success: true,
            received: payload
        };
    }
};
exports.WithdrawalWebhooksController = WithdrawalWebhooksController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('stripe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Stripe withdrawal webhook endpoint',
        description: 'Receives notifications from Stripe about withdrawal status changes'
    }),
    (0, swagger_1.ApiHeader)({
        name: 'stripe-signature',
        description: 'Stripe webhook signature for verification',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid signature' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [withdrawal_webhook_dto_1.StripeWithdrawalWebhookDto, String]),
    __metadata("design:returntype", Promise)
], WithdrawalWebhooksController.prototype, "handleStripeWebhook", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('mercadopago'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'MercadoPago withdrawal webhook endpoint',
        description: 'Receives notifications from MercadoPago about withdrawal status changes'
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-signature',
        description: 'MercadoPago webhook signature for verification',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid signature' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [withdrawal_webhook_dto_1.MercadoPagoWithdrawalWebhookDto, String]),
    __metadata("design:returntype", Promise)
], WithdrawalWebhooksController.prototype, "handleMercadoPagoWebhook", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('pagarme'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Pagar.me withdrawal webhook endpoint',
        description: 'Receives notifications from Pagar.me about withdrawal status changes'
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-hub-signature',
        description: 'Pagar.me webhook signature for verification',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid signature' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-hub-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [withdrawal_webhook_dto_1.PagarMeWithdrawalWebhookDto, String]),
    __metadata("design:returntype", Promise)
], WithdrawalWebhooksController.prototype, "handlePagarMeWebhook", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('test'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Test webhook endpoint',
        description: 'Test endpoint for webhook integration development'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test webhook received' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WithdrawalWebhooksController.prototype, "handleTestWebhook", null);
exports.WithdrawalWebhooksController = WithdrawalWebhooksController = WithdrawalWebhooksController_1 = __decorate([
    (0, swagger_1.ApiTags)('withdrawal-webhooks'),
    (0, common_1.Controller)('withdrawals/webhooks'),
    __metadata("design:paramtypes", [withdrawal_webhook_service_1.WithdrawalWebhookService])
], WithdrawalWebhooksController);
//# sourceMappingURL=withdrawal-webhooks.controller.js.map