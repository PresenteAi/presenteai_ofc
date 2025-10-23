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
exports.WithdrawalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const withdrawals_service_1 = require("../services/withdrawals.service");
const create_withdrawal_dto_1 = require("../dto/create-withdrawal.dto");
const update_withdrawal_status_dto_1 = require("../dto/update-withdrawal-status.dto");
const withdrawal_response_dto_1 = require("../dto/withdrawal-response.dto");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
let WithdrawalsController = class WithdrawalsController {
    withdrawalsService;
    constructor(withdrawalsService) {
        this.withdrawalsService = withdrawalsService;
    }
    async createWithdrawal(user, createWithdrawalDto) {
        return this.withdrawalsService.createWithdrawal(user.userId, createWithdrawalDto);
    }
    async getUserBalance(user) {
        return this.withdrawalsService.getUserBalance(user.userId);
    }
    async getUserWithdrawalStats(user) {
        return this.withdrawalsService.getUserWithdrawalStats(user.userId);
    }
    async getWithdrawal(id, user) {
        const withdrawal = await this.withdrawalsService.findById(id, user.userId);
        return {
            id: withdrawal.id,
            userId: withdrawal.userId,
            totalAmount: withdrawal.totalAmount,
            feeAmount: withdrawal.feeAmount,
            netAmount: withdrawal.netAmount,
            status: withdrawal.status,
            paymentGateway: withdrawal.paymentGateway,
            transactionReference: withdrawal.transactionReference,
            bankAccount: withdrawal.bankAccount,
            requestedAt: withdrawal.requestedAt,
            processedAt: withdrawal.processedAt,
            metadata: withdrawal.metadata,
            createdAt: withdrawal.createdAt,
            updatedAt: withdrawal.updatedAt,
        };
    }
    async getUserWithdrawals(user, status) {
        const withdrawals = await this.withdrawalsService.findByUserId(user.userId, status);
        return withdrawals.map(withdrawal => ({
            id: withdrawal.id,
            userId: withdrawal.userId,
            totalAmount: withdrawal.totalAmount,
            feeAmount: withdrawal.feeAmount,
            netAmount: withdrawal.netAmount,
            status: withdrawal.status,
            paymentGateway: withdrawal.paymentGateway,
            transactionReference: withdrawal.transactionReference,
            bankAccount: withdrawal.bankAccount,
            requestedAt: withdrawal.requestedAt,
            processedAt: withdrawal.processedAt,
            metadata: withdrawal.metadata,
            createdAt: withdrawal.createdAt,
            updatedAt: withdrawal.updatedAt,
        }));
    }
    async updateWithdrawalStatus(id, updateWithdrawalStatusDto) {
        const withdrawal = await this.withdrawalsService.updateWithdrawalStatus(id, updateWithdrawalStatusDto);
        return {
            id: withdrawal.id,
            userId: withdrawal.userId,
            totalAmount: withdrawal.totalAmount,
            feeAmount: withdrawal.feeAmount,
            netAmount: withdrawal.netAmount,
            status: withdrawal.status,
            paymentGateway: withdrawal.paymentGateway,
            transactionReference: withdrawal.transactionReference,
            bankAccount: withdrawal.bankAccount,
            requestedAt: withdrawal.requestedAt,
            processedAt: withdrawal.processedAt,
            metadata: withdrawal.metadata,
            createdAt: withdrawal.createdAt,
            updatedAt: withdrawal.updatedAt,
        };
    }
    async cancelWithdrawal(id, user) {
        const withdrawal = await this.withdrawalsService.cancelWithdrawal(id, user.userId);
        return {
            id: withdrawal.id,
            userId: withdrawal.userId,
            totalAmount: withdrawal.totalAmount,
            feeAmount: withdrawal.feeAmount,
            netAmount: withdrawal.netAmount,
            status: withdrawal.status,
            paymentGateway: withdrawal.paymentGateway,
            transactionReference: withdrawal.transactionReference,
            bankAccount: withdrawal.bankAccount,
            requestedAt: withdrawal.requestedAt,
            processedAt: withdrawal.processedAt,
            metadata: withdrawal.metadata,
            createdAt: withdrawal.createdAt,
            updatedAt: withdrawal.updatedAt,
        };
    }
    async validateBankAccount(bankAccount) {
        return this.withdrawalsService.validateBankAccount(bankAccount);
    }
    async getOverdueWithdrawals(hours = 24) {
        const withdrawals = await this.withdrawalsService.findOverdueWithdrawals(hours);
        return withdrawals.map(withdrawal => ({
            id: withdrawal.id,
            userId: withdrawal.userId,
            totalAmount: withdrawal.totalAmount,
            feeAmount: withdrawal.feeAmount,
            netAmount: withdrawal.netAmount,
            status: withdrawal.status,
            paymentGateway: withdrawal.paymentGateway,
            transactionReference: withdrawal.transactionReference,
            bankAccount: withdrawal.bankAccount,
            requestedAt: withdrawal.requestedAt,
            processedAt: withdrawal.processedAt,
            metadata: withdrawal.metadata,
            createdAt: withdrawal.createdAt,
            updatedAt: withdrawal.updatedAt,
        }));
    }
};
exports.WithdrawalsController = WithdrawalsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new withdrawal request',
        description: 'Creates a withdrawal request for the authenticated user with the specified amount and bank account',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Withdrawal request created successfully',
        type: withdrawal_response_dto_1.CreateWithdrawalResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data, insufficient balance, or validation error',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_withdrawal_dto_1.CreateWithdrawalDto]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "createWithdrawal", null);
__decorate([
    (0, common_1.Get)('balance'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user available balance',
        description: 'Retrieves the current available balance and withdrawal information for the authenticated user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Balance information retrieved successfully',
        type: withdrawal_response_dto_1.BalanceResponseDto,
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getUserBalance", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user withdrawal statistics',
        description: 'Retrieves withdrawal statistics and history for the authenticated user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Withdrawal statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number', example: 10 },
                completed: { type: 'number', example: 8 },
                pending: { type: 'number', example: 1 },
                failed: { type: 'number', example: 1 },
                totalAmount: { type: 'number', example: 2500.00 },
                completedAmount: { type: 'number', example: 2000.00 },
                pendingAmount: { type: 'number', example: 300.00 },
            },
        },
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getUserWithdrawalStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get withdrawal by ID',
        description: 'Retrieves detailed information about a specific withdrawal',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Withdrawal ID',
        type: 'integer',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Withdrawal found',
        type: withdrawal_response_dto_1.WithdrawalResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Withdrawal not found',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Access denied - you can only access your own withdrawals',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getWithdrawal", null);
__decorate([
    (0, common_1.Get)('user/me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user withdrawals',
        description: 'Retrieves all withdrawals for the authenticated user',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        description: 'Filter by withdrawal status',
        enum: withdrawal_entity_1.WithdrawalStatus,
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Withdrawals retrieved successfully',
        type: [withdrawal_response_dto_1.WithdrawalResponseDto],
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getUserWithdrawals", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update withdrawal status',
        description: 'Updates withdrawal status via gateway callback or system intervention',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Withdrawal ID',
        type: 'integer',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Withdrawal status updated successfully',
        type: withdrawal_response_dto_1.WithdrawalResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Withdrawal not found',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid status transition or withdrawal in final state',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_withdrawal_status_dto_1.UpdateWithdrawalStatusDto]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "updateWithdrawalStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel a withdrawal request',
        description: 'Cancels a pending withdrawal request for the authenticated user',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Withdrawal ID',
        type: 'integer',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Withdrawal cancelled successfully',
        type: withdrawal_response_dto_1.WithdrawalResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Withdrawal not found',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Withdrawal cannot be cancelled (not in pending status)',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Access denied - you can only cancel your own withdrawals',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "cancelWithdrawal", null);
__decorate([
    (0, common_1.Post)('validate-bank-account'),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate bank account information',
        description: 'Validates bank account details before creating a withdrawal',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bank account validation result',
        schema: {
            type: 'object',
            properties: {
                isValid: { type: 'boolean', example: true },
                errors: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Invalid bank code format'],
                    nullable: true
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "validateBankAccount", null);
__decorate([
    (0, common_1.Get)('admin/overdue'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get overdue withdrawals (Admin)',
        description: 'Retrieves withdrawals that are pending for too long and need attention',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'hours',
        description: 'Hours threshold for considering overdue',
        type: 'number',
        required: false,
        example: 24,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overdue withdrawals retrieved successfully',
        type: [withdrawal_response_dto_1.WithdrawalResponseDto],
    }),
    __param(0, (0, common_1.Query)('hours', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getOverdueWithdrawals", null);
exports.WithdrawalsController = WithdrawalsController = __decorate([
    (0, swagger_1.ApiTags)('withdrawals'),
    (0, common_1.Controller)('withdrawals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [withdrawals_service_1.WithdrawalsService])
], WithdrawalsController);
//# sourceMappingURL=withdrawals.controller.js.map