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
exports.CreateTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const transaction_entity_1 = require("../entities/transaction.entity");
class CreateTransactionDto {
    contributionId;
    paymentGateway;
    amount;
    fee;
    paymentMethodData;
    customer;
    metadata;
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the contribution this transaction belongs to',
        example: 123,
        type: 'integer',
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Contribution ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Contribution ID must be positive' }),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "contributionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment gateway to process the transaction',
        enum: transaction_entity_1.PaymentGateway,
        example: transaction_entity_1.PaymentGateway.STRIPE,
    }),
    (0, class_validator_1.IsEnum)(transaction_entity_1.PaymentGateway, { message: 'Invalid payment gateway' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paymentGateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction amount in the specified currency',
        example: 50.00,
        type: 'number',
        format: 'decimal',
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Amount must be positive' }),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gateway fee for this transaction',
        example: 2.50,
        type: 'number',
        format: 'decimal',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Fee must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Fee cannot be negative' }),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "fee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method specific data for the gateway',
        example: {
            card: {
                number: '4242424242424242',
                exp_month: 12,
                exp_year: 2025,
                cvc: '123'
            }
        },
    }),
    (0, class_validator_1.IsObject)({ message: 'Payment method data must be an object' }),
    __metadata("design:type", Object)
], CreateTransactionDto.prototype, "paymentMethodData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer information for the transaction',
        example: {
            name: 'João Silva',
            email: 'joao@example.com',
            document: '12345678901'
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Customer data must be an object' }),
    __metadata("design:type", Object)
], CreateTransactionDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata for the transaction',
        example: {
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0...'
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    __metadata("design:type", Object)
], CreateTransactionDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-transaction.dto.js.map