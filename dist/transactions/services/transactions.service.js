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
var TransactionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const transaction_repository_1 = require("../repositories/transaction.repository");
const payment_gateway_factory_1 = require("../providers/payment-gateway.factory");
const transaction_entity_1 = require("../entities/transaction.entity");
let TransactionsService = TransactionsService_1 = class TransactionsService {
    transactionRepository;
    gatewayFactory;
    logger = new common_1.Logger(TransactionsService_1.name);
    constructor(transactionRepository, gatewayFactory) {
        this.transactionRepository = transactionRepository;
        this.gatewayFactory = gatewayFactory;
    }
    async createTransaction(createTransactionDto) {
        this.logger.log(`Creating transaction for contribution ${createTransactionDto.contributionId}`);
        if (!this.gatewayFactory.isGatewaySupported(createTransactionDto.paymentGateway)) {
            throw new common_1.BadRequestException(`Payment gateway ${createTransactionDto.paymentGateway} is not supported`);
        }
        const transaction = new transaction_entity_1.Transaction();
        transaction.contributionId = createTransactionDto.contributionId;
        transaction.paymentGateway = createTransactionDto.paymentGateway;
        transaction.amount = createTransactionDto.amount;
        transaction.fee = createTransactionDto.fee || 0;
        transaction.status = transaction_entity_1.TransactionStatus.INITIATED;
        transaction.metadata = createTransactionDto.metadata || {};
        const savedTransaction = await this.transactionRepository.save(transaction);
        this.logger.log(`Transaction ${savedTransaction.id} saved with status INITIATED`);
        try {
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
            savedTransaction.externalTransactionId = gatewayResponse.id;
            savedTransaction.status = transaction_entity_1.TransactionStatus.PROCESSING;
            savedTransaction.metadata = {
                ...savedTransaction.metadata,
                gateway_response: gatewayResponse.data,
            };
            const updatedTransaction = await this.transactionRepository.save(savedTransaction);
            this.logger.log(`Transaction ${updatedTransaction.id} updated with gateway ID: ${gatewayResponse.id}`);
            const response = {
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
        }
        catch (error) {
            this.logger.error(`Gateway transaction creation failed for transaction ${savedTransaction.id}`, error);
            savedTransaction.status = transaction_entity_1.TransactionStatus.FAILED;
            savedTransaction.metadata = {
                ...savedTransaction.metadata,
                error: error.message,
                error_timestamp: new Date().toISOString(),
            };
            await this.transactionRepository.save(savedTransaction);
            throw new common_1.BadRequestException(`Payment gateway error: ${error.message}`);
        }
    }
    async findById(id) {
        const transaction = await this.transactionRepository.findOne({
            where: { id },
            relations: ['contribution'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        return transaction;
    }
    async findByContributionId(contributionId) {
        return this.transactionRepository.findByContributionId(contributionId);
    }
    async updateTransactionStatus(id, updateDto) {
        this.logger.log(`Updating transaction ${id} status to ${updateDto.status}`);
        const transaction = await this.findById(id);
        if (transaction.isFinalState() && transaction.status !== updateDto.status) {
            throw new common_1.BadRequestException(`Transaction ${id} is in final state and cannot be modified`);
        }
        switch (updateDto.status) {
            case transaction_entity_1.TransactionStatus.PAID:
                const paymentDate = updateDto.paymentDate ? new Date(updateDto.paymentDate) : new Date();
                transaction.markAsPaid(paymentDate, updateDto.externalTransactionId, updateDto.metadata);
                break;
            case transaction_entity_1.TransactionStatus.FAILED:
                transaction.markAsFailed(updateDto.metadata);
                break;
            case transaction_entity_1.TransactionStatus.REFUNDED:
                const refundDate = updateDto.refundDate ? new Date(updateDto.refundDate) : new Date();
                transaction.markAsRefunded(refundDate, updateDto.metadata);
                break;
            case transaction_entity_1.TransactionStatus.PROCESSING:
                if (transaction.status === transaction_entity_1.TransactionStatus.INITIATED) {
                    transaction.startProcessing();
                }
                if (updateDto.metadata) {
                    transaction.updateMetadata(updateDto.metadata);
                }
                break;
            default:
                throw new common_1.BadRequestException(`Invalid status transition to ${updateDto.status}`);
        }
        const updatedTransaction = await this.transactionRepository.save(transaction);
        this.logger.log(`Transaction ${id} status updated to ${updatedTransaction.status}`);
        return updatedTransaction;
    }
    async syncTransactionStatus(id) {
        this.logger.log(`Syncing transaction ${id} with gateway`);
        const transaction = await this.findById(id);
        if (!transaction.externalTransactionId) {
            throw new common_1.BadRequestException(`Transaction ${id} has no external transaction ID to sync`);
        }
        try {
            const gatewayService = this.gatewayFactory.getGatewayService(transaction.paymentGateway);
            const gatewayStatus = await gatewayService.checkTransactionStatus(transaction.externalTransactionId);
            if (gatewayStatus.status !== transaction.status) {
                const updateDto = {
                    status: gatewayStatus.status,
                    paymentDate: gatewayStatus.paymentDate?.toISOString(),
                    metadata: gatewayStatus.metadata,
                };
                return this.updateTransactionStatus(id, updateDto);
            }
            return transaction;
        }
        catch (error) {
            this.logger.error(`Failed to sync transaction ${id} with gateway`, error);
            throw new common_1.BadRequestException(`Gateway sync failed: ${error.message}`);
        }
    }
    async processRefund(id, amount, reason) {
        this.logger.log(`Processing refund for transaction ${id}, amount: ${amount}`);
        const transaction = await this.findById(id);
        if (!transaction.canBeRefunded()) {
            throw new common_1.BadRequestException(`Transaction ${id} cannot be refunded`);
        }
        if (!transaction.externalTransactionId) {
            throw new common_1.BadRequestException(`Transaction ${id} has no external transaction ID for refund`);
        }
        try {
            const gatewayService = this.gatewayFactory.getGatewayService(transaction.paymentGateway);
            const refundResponse = await gatewayService.processRefund(transaction.externalTransactionId, amount, reason);
            const updateDto = {
                status: transaction_entity_1.TransactionStatus.REFUNDED,
                refundDate: refundResponse.processedAt.toISOString(),
                metadata: {
                    refund_id: refundResponse.refundId,
                    refund_amount: amount || transaction.amount,
                    refund_reason: reason,
                    ...refundResponse.metadata,
                },
            };
            return this.updateTransactionStatus(id, updateDto);
        }
        catch (error) {
            this.logger.error(`Failed to process refund for transaction ${id}`, error);
            throw new common_1.BadRequestException(`Refund processing failed: ${error.message}`);
        }
    }
    async handleWebhook(signature, payload, gateway) {
        this.logger.log(`Handling webhook from ${gateway}`);
        try {
            const gatewayService = this.gatewayFactory.getGatewayService(gateway);
            if (!gatewayService.validateWebhook(signature, payload)) {
                this.logger.warn(`Invalid webhook signature from ${gateway}`);
                return { processed: false };
            }
            const webhookData = gatewayService.parseWebhookData(JSON.parse(payload));
            if (!webhookData) {
                this.logger.log(`Webhook from ${gateway} is not transaction-related`);
                return { processed: false };
            }
            const transaction = await this.transactionRepository.findByExternalTransactionId(webhookData.externalTransactionId);
            if (!transaction) {
                this.logger.warn(`Transaction not found for external ID: ${webhookData.externalTransactionId}`);
                return { processed: false };
            }
            if (webhookData.status !== transaction.status) {
                const updateDto = {
                    status: webhookData.status,
                    paymentDate: webhookData.paymentDate?.toISOString(),
                    metadata: webhookData.metadata,
                };
                await this.updateTransactionStatus(transaction.id, updateDto);
                this.logger.log(`Transaction ${transaction.id} updated via webhook`);
            }
            return { processed: true, transactionId: transaction.id };
        }
        catch (error) {
            this.logger.error(`Webhook processing failed for ${gateway}`, error);
            return { processed: false };
        }
    }
    async getTransactionStats(contributionId) {
        return this.transactionRepository.getTransactionStats(contributionId);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_1.TransactionRepository,
        payment_gateway_factory_1.PaymentGatewayFactory])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map