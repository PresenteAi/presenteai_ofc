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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transactions_service_1 = require("../services/transactions.service");
const create_transaction_dto_1 = require("../dto/create-transaction.dto");
const update_transaction_status_dto_1 = require("../dto/update-transaction-status.dto");
const transaction_response_dto_1 = require("../dto/transaction-response.dto");
let TransactionsController = class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async createTransaction(createTransactionDto) {
        return this.transactionsService.createTransaction(createTransactionDto);
    }
    async getTransaction(id) {
        const transaction = await this.transactionsService.findById(id);
        return {
            id: transaction.id,
            contributionId: transaction.contributionId,
            paymentGateway: transaction.paymentGateway,
            externalTransactionId: transaction.externalTransactionId,
            amount: transaction.amount,
            fee: transaction.fee,
            netAmount: transaction.netAmount,
            status: transaction.status,
            paymentDate: transaction.paymentDate,
            refundDate: transaction.refundDate,
            metadata: transaction.metadata,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
    async updateTransactionStatus(id, updateTransactionStatusDto) {
        const transaction = await this.transactionsService.updateTransactionStatus(id, updateTransactionStatusDto);
        return {
            id: transaction.id,
            contributionId: transaction.contributionId,
            paymentGateway: transaction.paymentGateway,
            externalTransactionId: transaction.externalTransactionId,
            amount: transaction.amount,
            fee: transaction.fee,
            netAmount: transaction.netAmount,
            status: transaction.status,
            paymentDate: transaction.paymentDate,
            refundDate: transaction.refundDate,
            metadata: transaction.metadata,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
    async getTransactionsByContribution(contributionId) {
        const transactions = await this.transactionsService.findByContributionId(contributionId);
        return transactions.map(transaction => ({
            id: transaction.id,
            contributionId: transaction.contributionId,
            paymentGateway: transaction.paymentGateway,
            externalTransactionId: transaction.externalTransactionId,
            amount: transaction.amount,
            fee: transaction.fee,
            netAmount: transaction.netAmount,
            status: transaction.status,
            paymentDate: transaction.paymentDate,
            refundDate: transaction.refundDate,
            metadata: transaction.metadata,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        }));
    }
    async syncTransaction(id) {
        const transaction = await this.transactionsService.syncTransactionStatus(id);
        return {
            id: transaction.id,
            contributionId: transaction.contributionId,
            paymentGateway: transaction.paymentGateway,
            externalTransactionId: transaction.externalTransactionId,
            amount: transaction.amount,
            fee: transaction.fee,
            netAmount: transaction.netAmount,
            status: transaction.status,
            paymentDate: transaction.paymentDate,
            refundDate: transaction.refundDate,
            metadata: transaction.metadata,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
    async processRefund(id, amount, reason) {
        const transaction = await this.transactionsService.processRefund(id, amount, reason);
        return {
            id: transaction.id,
            contributionId: transaction.contributionId,
            paymentGateway: transaction.paymentGateway,
            externalTransactionId: transaction.externalTransactionId,
            amount: transaction.amount,
            fee: transaction.fee,
            netAmount: transaction.netAmount,
            status: transaction.status,
            paymentDate: transaction.paymentDate,
            refundDate: transaction.refundDate,
            metadata: transaction.metadata,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
    async handleWebhook(gateway, signature, payload) {
        const payloadString = payload.toString();
        return this.transactionsService.handleWebhook(signature, payloadString, gateway);
    }
    async getTransactionStats(contributionId) {
        return this.transactionsService.getTransactionStats(contributionId);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new transaction',
        description: 'Creates a new transaction and processes it through the selected payment gateway',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transaction created successfully',
        type: transaction_response_dto_1.CreateTransactionResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or payment gateway error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get transaction by ID',
        description: 'Retrieves detailed information about a specific transaction',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Transaction ID',
        type: 'integer',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transaction found',
        type: transaction_response_dto_1.TransactionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Transaction not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransaction", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update transaction status',
        description: 'Updates transaction status via gateway callback or manual intervention',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Transaction ID',
        type: 'integer',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transaction status updated successfully',
        type: transaction_response_dto_1.TransactionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Transaction not found',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid status transition or transaction in final state',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_transaction_status_dto_1.UpdateTransactionStatusDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateTransactionStatus", null);
__decorate([
    (0, common_1.Get)('contribution/:contributionId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get transactions by contribution ID',
        description: 'Retrieves all transactions associated with a specific contribution',
    }),
    (0, swagger_1.ApiParam)({
        name: 'contributionId',
        description: 'Contribution ID',
        type: 'integer',
        example: 123,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transactions found',
        type: [transaction_response_dto_1.TransactionResponseDto],
    }),
    __param(0, (0, common_1.Param)('contributionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionsByContribution", null);
__decorate([
    (0, common_1.Post)(':id/sync'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Sync transaction with gateway',
        description: 'Synchronizes transaction status with the payment gateway',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Transaction ID',
        type: 'integer',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transaction synchronized successfully',
        type: transaction_response_dto_1.TransactionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Transaction not found',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Transaction has no external ID or gateway sync failed',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "syncTransaction", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Process transaction refund',
        description: 'Processes a refund for a paid transaction through the payment gateway',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Transaction ID',
        type: 'integer',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'amount',
        description: 'Refund amount (optional, defaults to full amount)',
        type: 'number',
        required: false,
        example: 25.00,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'reason',
        description: 'Refund reason',
        type: 'string',
        required: false,
        example: 'Customer request',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Refund processed successfully',
        type: transaction_response_dto_1.TransactionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Transaction not found',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Transaction cannot be refunded or refund processing failed',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('amount')),
    __param(2, (0, common_1.Query)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Post)('webhook/:gateway'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle payment gateway webhook',
        description: 'Processes webhook notifications from payment gateways',
    }),
    (0, swagger_1.ApiParam)({
        name: 'gateway',
        description: 'Payment gateway name',
        type: 'string',
        example: 'stripe',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Stripe-Signature',
        description: 'Webhook signature for validation',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Webhook processed successfully',
        schema: {
            type: 'object',
            properties: {
                processed: { type: 'boolean', example: true },
                transactionId: { type: 'number', example: 1 },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid webhook signature or processing error',
    }),
    __param(0, (0, common_1.Param)('gateway')),
    __param(1, (0, common_1.Headers)('x-stripe-signature')),
    __param(2, (0, common_1.RawBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Buffer]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('contribution/:contributionId/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get transaction statistics',
        description: 'Retrieves transaction statistics for a specific contribution',
    }),
    (0, swagger_1.ApiParam)({
        name: 'contributionId',
        description: 'Contribution ID',
        type: 'integer',
        example: 123,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transaction statistics',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number', example: 5 },
                paid: { type: 'number', example: 3 },
                failed: { type: 'number', example: 1 },
                totalAmount: { type: 'number', example: 150.00 },
                paidAmount: { type: 'number', example: 142.50 },
            },
        },
    }),
    __param(0, (0, common_1.Param)('contributionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionStats", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('transactions'),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map