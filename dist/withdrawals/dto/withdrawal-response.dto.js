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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceResponseDto = exports.CreateWithdrawalResponseDto = exports.WithdrawalResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
class WithdrawalResponseDto {
    id;
    userId;
    totalAmount;
    feeAmount;
    netAmount;
    status;
    paymentGateway;
    transactionReference;
    bankAccount;
    requestedAt;
    processedAt;
    metadata;
    createdAt;
    updatedAt;
}
exports.WithdrawalResponseDto = WithdrawalResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Withdrawal unique identifier',
        example: 1,
    }),
    __metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who requested the withdrawal',
        example: 123,
    }),
    __metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount requested',
        example: 500.00,
    }),
    __metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Platform/gateway fee',
        example: 15.00,
    }),
    __metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "feeAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Net amount to be transferred',
        example: 485.00,
    }),
    __metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "netAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current withdrawal status',
        enum: withdrawal_entity_1.WithdrawalStatus,
        example: withdrawal_entity_1.WithdrawalStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], WithdrawalResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment gateway used for processing',
        enum: withdrawal_entity_1.WithdrawalGateway,
        example: withdrawal_entity_1.WithdrawalGateway.STRIPE,
        nullable: true,
    }),
    __metadata("design:type", String)
], WithdrawalResponseDto.prototype, "paymentGateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'External transaction reference from gateway',
        example: 'stripe_payout_1234567890',
        nullable: true,
    }),
    __metadata("design:type", String)
], WithdrawalResponseDto.prototype, "transactionReference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bank account information',
        example: {
            bankName: 'Banco do Brasil',
            accountType: 'checking',
            accountNumber: '*****-6',
            agency: '1234'
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], WithdrawalResponseDto.prototype, "bankAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when withdrawal was requested',
        example: '2023-12-25T09:00:00.000Z',
    }),
    __metadata("design:type", Date)
], WithdrawalResponseDto.prototype, "requestedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when withdrawal was processed',
        example: '2023-12-25T10:30:00.000Z',
        nullable: true,
    }),
    __metadata("design:type", Date)
], WithdrawalResponseDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional withdrawal metadata',
        example: {
            gateway_fee: 15.50,
            processing_time: 3600,
            notes: 'Processed successfully'
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], WithdrawalResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Withdrawal creation date',
        example: '2023-12-25T09:00:00.000Z',
    }),
    __metadata("design:type", Date)
], WithdrawalResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2023-12-25T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], WithdrawalResponseDto.prototype, "updatedAt", void 0);
class CreateWithdrawalResponseDto extends WithdrawalResponseDto {
    estimatedProcessingTime;
    gatewayInfo;
}
exports.CreateWithdrawalResponseDto = CreateWithdrawalResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated processing time in hours',
        example: 24,
        nullable: true,
    }),
    __metadata("design:type", Number)
], CreateWithdrawalResponseDto.prototype, "estimatedProcessingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gateway-specific information',
        example: {
            gatewayWithdrawalId: 'stripe_payout_123',
            estimatedArrival: '2023-12-26T10:30:00.000Z',
            trackingUrl: 'https://dashboard.stripe.com/...'
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], CreateWithdrawalResponseDto.prototype, "gatewayInfo", void 0);
class BalanceResponseDto {
    availableBalance;
    pendingWithdrawals;
    totalBalance;
    minimumWithdrawal;
    maximumWithdrawal;
    currency;
}
exports.BalanceResponseDto = BalanceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available balance for withdrawal',
        example: 1250.00,
    }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "availableBalance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount currently being processed in pending withdrawals',
        example: 300.00,
    }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "pendingWithdrawals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total balance (available + pending)',
        example: 1550.00,
    }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "totalBalance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum amount allowed for withdrawal',
        example: 10.00,
    }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "minimumWithdrawal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum amount allowed for withdrawal',
        example: 5000.00,
    }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "maximumWithdrawal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'BRL',
    }),
    __metadata("design:type", String)
], BalanceResponseDto.prototype, "currency", void 0);
//# sourceMappingURL=withdrawal-response.dto.js.map