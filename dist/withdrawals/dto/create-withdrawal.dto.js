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
exports.CreateWithdrawalDto = exports.BankAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
class BankAccountDto {
    bankCode;
    bankName;
    accountType;
    accountNumber;
    agency;
    accountHolderName;
    accountHolderDocument;
    accountHolderEmail;
    accountHolderPhone;
}
exports.BankAccountDto = BankAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bank code (e.g., 001 for Banco do Brasil)',
        example: '001',
    }),
    (0, class_validator_1.IsString)({ message: 'Bank code must be a string' }),
    (0, class_validator_1.Length)(3, 3, { message: 'Bank code must be exactly 3 digits' }),
    (0, class_validator_1.Matches)(/^\d{3}$/, { message: 'Bank code must contain only digits' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bank name',
        example: 'Banco do Brasil',
    }),
    (0, class_validator_1.IsString)({ message: 'Bank name must be a string' }),
    (0, class_validator_1.Length)(1, 100, { message: 'Bank name must be between 1 and 100 characters' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account type',
        enum: ['checking', 'savings'],
        example: 'checking',
    }),
    (0, class_validator_1.IsEnum)(['checking', 'savings'], { message: 'Account type must be checking or savings' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "accountType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account number',
        example: '12345-6',
    }),
    (0, class_validator_1.IsString)({ message: 'Account number must be a string' }),
    (0, class_validator_1.Length)(1, 20, { message: 'Account number must be between 1 and 20 characters' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Agency/branch number',
        example: '1234',
    }),
    (0, class_validator_1.IsString)({ message: 'Agency must be a string' }),
    (0, class_validator_1.Length)(1, 10, { message: 'Agency must be between 1 and 10 characters' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "agency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account holder full name',
        example: 'João Silva Santos',
    }),
    (0, class_validator_1.IsString)({ message: 'Account holder name must be a string' }),
    (0, class_validator_1.Length)(1, 100, { message: 'Account holder name must be between 1 and 100 characters' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "accountHolderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account holder document (CPF or CNPJ)',
        example: '12345678901',
    }),
    (0, class_validator_1.IsString)({ message: 'Document must be a string' }),
    (0, class_validator_1.Matches)(/^\d{11}$|^\d{14}$/, { message: 'Document must be a valid CPF (11 digits) or CNPJ (14 digits)' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "accountHolderDocument", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account holder email',
        example: 'joao.silva@email.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Must be a valid email address' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "accountHolderEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account holder phone number',
        example: '+5511999999999',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phone must be a string' }),
    (0, class_validator_1.Matches)(/^\+\d{10,15}$/, { message: 'Phone must be in international format (+5511999999999)' }),
    __metadata("design:type", String)
], BankAccountDto.prototype, "accountHolderPhone", void 0);
class CreateWithdrawalDto {
    totalAmount;
    paymentGateway;
    bankAccount;
    metadata;
}
exports.CreateWithdrawalDto = CreateWithdrawalDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount to withdraw',
        example: 500.00,
        type: 'number',
        format: 'decimal',
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Amount must be positive' }),
    (0, class_validator_1.Min)(0.01, { message: 'Minimum withdrawal amount is R$ 0.01' }),
    __metadata("design:type", Number)
], CreateWithdrawalDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred payment gateway for processing',
        enum: withdrawal_entity_1.WithdrawalGateway,
        example: withdrawal_entity_1.WithdrawalGateway.STRIPE,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(withdrawal_entity_1.WithdrawalGateway, { message: 'Invalid payment gateway' }),
    __metadata("design:type", String)
], CreateWithdrawalDto.prototype, "paymentGateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bank account information for the withdrawal',
        type: BankAccountDto,
    }),
    (0, class_validator_1.IsObject)({ message: 'Bank account must be an object' }),
    __metadata("design:type", BankAccountDto)
], CreateWithdrawalDto.prototype, "bankAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata for the withdrawal',
        example: {
            notes: 'Urgent withdrawal request',
            priority: 'high'
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    __metadata("design:type", Object)
], CreateWithdrawalDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-withdrawal.dto.js.map