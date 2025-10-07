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
exports.CreateTransactionResponseDto = exports.TransactionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const transaction_entity_1 = require("../entities/transaction.entity");
class TransactionResponseDto {
    id;
    contributionId;
    paymentGateway;
    externalTransactionId;
    amount;
    fee;
    netAmount;
    status;
    paymentDate;
    refundDate;
    metadata;
    createdAt;
    updatedAt;
}
exports.TransactionResponseDto = TransactionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction unique identifier',
        example: 1,
    }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Associated contribution ID',
        example: 123,
    }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "contributionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment gateway used',
        enum: transaction_entity_1.PaymentGateway,
        example: transaction_entity_1.PaymentGateway.STRIPE,
    }),
    __metadata("design:type", String)
], TransactionResponseDto.prototype, "paymentGateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'External transaction ID from gateway',
        example: 'stripe_tx_1234567890',
        nullable: true,
    }),
    __metadata("design:type", String)
], TransactionResponseDto.prototype, "externalTransactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction amount',
        example: 50.00,
    }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gateway fee',
        example: 2.50,
    }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "fee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Net amount after fees',
        example: 47.50,
    }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "netAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current transaction status',
        enum: transaction_entity_1.TransactionStatus,
        example: transaction_entity_1.TransactionStatus.PAID,
    }),
    __metadata("design:type", String)
], TransactionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment confirmation date',
        example: '2023-12-25T10:30:00.000Z',
        nullable: true,
    }),
    __metadata("design:type", Date)
], TransactionResponseDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund processing date',
        example: '2023-12-26T15:45:00.000Z',
        nullable: true,
    }),
    __metadata("design:type", Date)
], TransactionResponseDto.prototype, "refundDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional transaction metadata',
        example: {
            gateway_fee: 1.50,
            gateway_reference: 'ref_123456'
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], TransactionResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction creation date',
        example: '2023-12-25T09:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TransactionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2023-12-25T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], TransactionResponseDto.prototype, "updatedAt", void 0);
class CreateTransactionResponseDto extends TransactionResponseDto {
    paymentUrl;
}
exports.CreateTransactionResponseDto = CreateTransactionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment URL for redirect (if applicable)',
        example: 'https://checkout.stripe.com/pay/cs_test_123456',
        nullable: true,
    }),
    __metadata("design:type", String)
], CreateTransactionResponseDto.prototype, "paymentUrl", void 0);
//# sourceMappingURL=transaction-response.dto.js.map