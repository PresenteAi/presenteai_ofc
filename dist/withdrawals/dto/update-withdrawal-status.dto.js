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
exports.UpdateWithdrawalStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
class UpdateWithdrawalStatusDto {
    status;
    transactionReference;
    processedAt;
    fees;
    failureReason;
    metadata;
}
exports.UpdateWithdrawalStatusDto = UpdateWithdrawalStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New withdrawal status',
        enum: withdrawal_entity_1.WithdrawalStatus,
        example: withdrawal_entity_1.WithdrawalStatus.COMPLETED,
    }),
    (0, class_validator_1.IsEnum)(withdrawal_entity_1.WithdrawalStatus, { message: 'Invalid withdrawal status' }),
    __metadata("design:type", String)
], UpdateWithdrawalStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'External transaction reference from the gateway',
        example: 'stripe_payout_1234567890',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Transaction reference must be a string' }),
    __metadata("design:type", String)
], UpdateWithdrawalStatusDto.prototype, "transactionReference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Processing completion date (ISO 8601 format)',
        example: '2023-12-25T10:30:00.000Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Processed date must be a valid ISO date string' }),
    __metadata("design:type", String)
], UpdateWithdrawalStatusDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gateway fees applied to the withdrawal',
        example: 15.50,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateWithdrawalStatusDto.prototype, "fees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Failure reason if withdrawal failed',
        example: 'Insufficient funds in gateway account',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Failure reason must be a string' }),
    __metadata("design:type", String)
], UpdateWithdrawalStatusDto.prototype, "failureReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata from the gateway webhook',
        example: {
            gateway_fee: 15.50,
            gateway_reference: 'ref_123456',
            processing_time: 3600,
            webhook_id: 'wh_789012'
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    __metadata("design:type", Object)
], UpdateWithdrawalStatusDto.prototype, "metadata", void 0);
//# sourceMappingURL=update-withdrawal-status.dto.js.map