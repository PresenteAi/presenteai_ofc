"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MercadoPagoGatewayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoGatewayService = void 0;
const common_1 = require("@nestjs/common");
const transaction_entity_1 = require("../entities/transaction.entity");
let MercadoPagoGatewayService = MercadoPagoGatewayService_1 = class MercadoPagoGatewayService {
    logger = new common_1.Logger(MercadoPagoGatewayService_1.name);
    async createTransaction(params) {
        this.logger.log(`Creating MercadoPago transaction for amount: ${params.amount}`);
        try {
            const mockResponse = {
                id: `mp_pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'pending',
                paymentUrl: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mp_pref_test_${Date.now()}`,
                data: {
                    preference_id: `mp_pref_test_${Date.now()}`,
                    init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mp_pref_test_${Date.now()}`,
                    sandbox_init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=mp_pref_test_${Date.now()}`,
                    amount: params.amount,
                    currency: 'BRL',
                },
            };
            this.logger.log(`MercadoPago preference created: ${mockResponse.id}`);
            return mockResponse;
        }
        catch (error) {
            this.logger.error('Error creating MercadoPago preference', error);
            throw new Error(`MercadoPago transaction creation failed: ${error.message}`);
        }
    }
    async checkTransactionStatus(externalTransactionId) {
        this.logger.log(`Checking MercadoPago payment status: ${externalTransactionId}`);
        try {
            let status;
            let paymentDate;
            if (externalTransactionId.includes('approved')) {
                status = transaction_entity_1.TransactionStatus.PAID;
                paymentDate = new Date();
            }
            else if (externalTransactionId.includes('rejected')) {
                status = transaction_entity_1.TransactionStatus.FAILED;
            }
            else {
                status = transaction_entity_1.TransactionStatus.PROCESSING;
            }
            return {
                status,
                paymentDate,
                metadata: {
                    mercadopago_status: status === transaction_entity_1.TransactionStatus.PAID ? 'approved' :
                        status === transaction_entity_1.TransactionStatus.FAILED ? 'rejected' : 'pending',
                    payment_method_id: 'visa',
                    payment_type_id: 'credit_card',
                },
            };
        }
        catch (error) {
            this.logger.error('Error checking MercadoPago payment status', error);
            throw new Error(`MercadoPago status check failed: ${error.message}`);
        }
    }
    async processRefund(externalTransactionId, amount, reason) {
        this.logger.log(`Processing MercadoPago refund: ${externalTransactionId}, amount: ${amount}`);
        try {
            return {
                refundId: `mp_refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'approved',
                processedAt: new Date(),
                metadata: {
                    mercadopago_refund_status: 'approved',
                    original_payment: externalTransactionId,
                    refund_reason: reason,
                    refund_amount: amount,
                },
            };
        }
        catch (error) {
            this.logger.error('Error processing MercadoPago refund', error);
            throw new Error(`MercadoPago refund failed: ${error.message}`);
        }
    }
    validateWebhook(signature, payload) {
        try {
            return signature.length > 0 && payload.length > 0;
        }
        catch (error) {
            this.logger.error('MercadoPago webhook validation failed', error);
            return false;
        }
    }
    parseWebhookData(payload) {
        try {
            if (payload.type === 'payment') {
                const paymentStatus = payload.data?.status || payload.status;
                let status;
                let paymentDate;
                switch (paymentStatus) {
                    case 'approved':
                        status = transaction_entity_1.TransactionStatus.PAID;
                        paymentDate = new Date(payload.data?.date_approved || Date.now());
                        break;
                    case 'rejected':
                    case 'cancelled':
                        status = transaction_entity_1.TransactionStatus.FAILED;
                        break;
                    case 'refunded':
                    case 'charged_back':
                        status = transaction_entity_1.TransactionStatus.REFUNDED;
                        break;
                    default:
                        status = transaction_entity_1.TransactionStatus.PROCESSING;
                }
                return {
                    externalTransactionId: payload.data?.id?.toString() || payload.id?.toString(),
                    status,
                    paymentDate,
                    metadata: {
                        mercadopago_notification_id: payload.id,
                        mercadopago_notification_type: payload.type,
                        mercadopago_status: paymentStatus,
                        payment_method_id: payload.data?.payment_method_id,
                        payment_type_id: payload.data?.payment_type_id,
                    },
                };
            }
            return null;
        }
        catch (error) {
            this.logger.error('Error parsing MercadoPago webhook data', error);
            return null;
        }
    }
};
exports.MercadoPagoGatewayService = MercadoPagoGatewayService;
exports.MercadoPagoGatewayService = MercadoPagoGatewayService = MercadoPagoGatewayService_1 = __decorate([
    (0, common_1.Injectable)()
], MercadoPagoGatewayService);
//# sourceMappingURL=mercadopago-gateway.service.js.map