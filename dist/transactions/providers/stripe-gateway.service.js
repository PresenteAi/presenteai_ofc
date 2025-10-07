"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StripeGatewayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeGatewayService = void 0;
const common_1 = require("@nestjs/common");
const transaction_entity_1 = require("../entities/transaction.entity");
let StripeGatewayService = StripeGatewayService_1 = class StripeGatewayService {
    logger = new common_1.Logger(StripeGatewayService_1.name);
    async createTransaction(params) {
        this.logger.log(`Creating Stripe transaction for amount: ${params.amount}`);
        try {
            const mockResponse = {
                id: `stripe_pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'requires_confirmation',
                paymentUrl: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
                data: {
                    client_secret: 'pi_test_client_secret',
                    amount: params.amount,
                    currency: 'brl',
                },
            };
            this.logger.log(`Stripe transaction created: ${mockResponse.id}`);
            return mockResponse;
        }
        catch (error) {
            this.logger.error('Error creating Stripe transaction', error);
            throw new Error(`Stripe transaction creation failed: ${error.message}`);
        }
    }
    async checkTransactionStatus(externalTransactionId) {
        this.logger.log(`Checking Stripe transaction status: ${externalTransactionId}`);
        try {
            let status;
            let paymentDate;
            if (externalTransactionId.includes('paid')) {
                status = transaction_entity_1.TransactionStatus.PAID;
                paymentDate = new Date();
            }
            else if (externalTransactionId.includes('failed')) {
                status = transaction_entity_1.TransactionStatus.FAILED;
            }
            else {
                status = transaction_entity_1.TransactionStatus.PROCESSING;
            }
            return {
                status,
                paymentDate,
                metadata: {
                    stripe_status: status === transaction_entity_1.TransactionStatus.PAID ? 'succeeded' : 'processing',
                    last_payment_error: status === transaction_entity_1.TransactionStatus.FAILED ? 'card_declined' : null,
                },
            };
        }
        catch (error) {
            this.logger.error('Error checking Stripe transaction status', error);
            throw new Error(`Stripe status check failed: ${error.message}`);
        }
    }
    async processRefund(externalTransactionId, amount, reason) {
        this.logger.log(`Processing Stripe refund: ${externalTransactionId}, amount: ${amount}`);
        try {
            return {
                refundId: `stripe_re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'succeeded',
                processedAt: new Date(),
                metadata: {
                    stripe_refund_status: 'succeeded',
                    original_transaction: externalTransactionId,
                    refund_reason: reason,
                },
            };
        }
        catch (error) {
            this.logger.error('Error processing Stripe refund', error);
            throw new Error(`Stripe refund failed: ${error.message}`);
        }
    }
    validateWebhook(signature, payload) {
        try {
            return signature.length > 0 && payload.length > 0;
        }
        catch (error) {
            this.logger.error('Stripe webhook validation failed', error);
            return false;
        }
    }
    parseWebhookData(payload) {
        try {
            if (payload.type === 'payment_intent.succeeded') {
                return {
                    externalTransactionId: payload.data?.object?.id,
                    status: transaction_entity_1.TransactionStatus.PAID,
                    paymentDate: new Date(payload.data?.object?.created * 1000),
                    metadata: {
                        stripe_event_id: payload.id,
                        stripe_event_type: payload.type,
                    },
                };
            }
            if (payload.type === 'payment_intent.payment_failed') {
                return {
                    externalTransactionId: payload.data?.object?.id,
                    status: transaction_entity_1.TransactionStatus.FAILED,
                    metadata: {
                        stripe_event_id: payload.id,
                        stripe_event_type: payload.type,
                        failure_reason: payload.data?.object?.last_payment_error?.message,
                    },
                };
            }
            return null;
        }
        catch (error) {
            this.logger.error('Error parsing Stripe webhook data', error);
            return null;
        }
    }
};
exports.StripeGatewayService = StripeGatewayService;
exports.StripeGatewayService = StripeGatewayService = StripeGatewayService_1 = __decorate([
    (0, common_1.Injectable)()
], StripeGatewayService);
//# sourceMappingURL=stripe-gateway.service.js.map