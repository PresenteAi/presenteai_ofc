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
exports.PagarMeWithdrawalWebhookDto = exports.MercadoPagoWithdrawalWebhookDto = exports.StripeWithdrawalWebhookDto = exports.WithdrawalWebhookDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
class WithdrawalWebhookDto {
    gateway;
    externalId;
    status;
    transactionReference;
    feeAmount;
    processedAt;
    failureReason;
    metadata;
}
exports.WithdrawalWebhookDto = WithdrawalWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gateway that sent the webhook' }),
    (0, class_validator_1.IsEnum)(withdrawal_entity_1.WithdrawalGateway),
    __metadata("design:type", String)
], WithdrawalWebhookDto.prototype, "gateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'External reference ID from payment gateway' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawalWebhookDto.prototype, "externalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New withdrawal status' }),
    (0, class_validator_1.IsEnum)(withdrawal_entity_1.WithdrawalStatus),
    __metadata("design:type", String)
], WithdrawalWebhookDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction reference from gateway' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawalWebhookDto.prototype, "transactionReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fee charged by gateway' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], WithdrawalWebhookDto.prototype, "feeAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When the withdrawal was processed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], WithdrawalWebhookDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Failure reason if applicable' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawalWebhookDto.prototype, "failureReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata from gateway' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WithdrawalWebhookDto.prototype, "metadata", void 0);
class StripeWithdrawalWebhookDto extends WithdrawalWebhookDto {
    type;
    data;
}
exports.StripeWithdrawalWebhookDto = StripeWithdrawalWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stripe event type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StripeWithdrawalWebhookDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stripe payout object' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StripeWithdrawalWebhookDto.prototype, "data", void 0);
class MercadoPagoWithdrawalWebhookDto extends WithdrawalWebhookDto {
    action;
    api_version;
    data;
    date_created;
}
exports.MercadoPagoWithdrawalWebhookDto = MercadoPagoWithdrawalWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MercadoPago action type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MercadoPagoWithdrawalWebhookDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MercadoPago API version' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MercadoPagoWithdrawalWebhookDto.prototype, "api_version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MercadoPago data object' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MercadoPagoWithdrawalWebhookDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notification date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], MercadoPagoWithdrawalWebhookDto.prototype, "date_created", void 0);
class PagarMeWithdrawalWebhookDto extends WithdrawalWebhookDto {
    event;
    current_status;
}
exports.PagarMeWithdrawalWebhookDto = PagarMeWithdrawalWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pagar.me event name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagarMeWithdrawalWebhookDto.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pagar.me transfer object' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PagarMeWithdrawalWebhookDto.prototype, "current_status", void 0);
//# sourceMappingURL=withdrawal-webhook.dto.js.map