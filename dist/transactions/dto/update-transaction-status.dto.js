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
exports.UpdateTransactionStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const transaction_entity_1 = require("../entities/transaction.entity");
class UpdateTransactionStatusDto {
    status;
    externalTransactionId;
    paymentDate;
    refundDate;
    metadata;
}
exports.UpdateTransactionStatusDto = UpdateTransactionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New transaction status',
        enum: transaction_entity_1.TransactionStatus,
        example: transaction_entity_1.TransactionStatus.PAID,
    }),
    (0, class_validator_1.IsEnum)(transaction_entity_1.TransactionStatus, { message: 'Invalid transaction status' }),
    __metadata("design:type", String)
], UpdateTransactionStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'External transaction ID from the gateway',
        example: 'stripe_tx_1234567890',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTransactionStatusDto.prototype, "externalTransactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment confirmation date (ISO 8601 format)',
        example: '2023-12-25T10:30:00.000Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Payment date must be a valid ISO date string' }),
    __metadata("design:type", String)
], UpdateTransactionStatusDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund processing date (ISO 8601 format)',
        example: '2023-12-26T15:45:00.000Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Refund date must be a valid ISO date string' }),
    __metadata("design:type", String)
], UpdateTransactionStatusDto.prototype, "refundDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata from the gateway webhook',
        example: {
            gateway_fee: 1.50,
            gateway_reference: 'ref_123456',
            webhook_id: 'wh_789012'
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    __metadata("design:type", Object)
], UpdateTransactionStatusDto.prototype, "metadata", void 0);
//# sourceMappingURL=update-transaction-status.dto.js.map