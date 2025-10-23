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
exports.ContributionResponseDto = exports.UpdateContributionStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contribution_entity_1 = require("../entities/contribution.entity");
class UpdateContributionStatusDto {
    paymentStatus;
    transactionId;
    feePlatform;
    feeGateway;
}
exports.UpdateContributionStatusDto = UpdateContributionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New payment status',
        example: contribution_entity_1.PaymentStatus.APPROVED,
        enum: contribution_entity_1.PaymentStatus,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contribution_entity_1.PaymentStatus),
    __metadata("design:type", String)
], UpdateContributionStatusDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction ID from payment gateway (required for approved payments)',
        example: 'txn_1234567890abcdef',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateContributionStatusDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Platform fee amount (optional)',
        example: 5.50,
        type: Number,
        minimum: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], UpdateContributionStatusDto.prototype, "feePlatform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gateway fee amount (optional)',
        example: 2.25,
        type: Number,
        minimum: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], UpdateContributionStatusDto.prototype, "feeGateway", void 0);
class ContributionResponseDto {
    id;
    eventGiftId;
    userId;
    contributorName;
    contributorEmail;
    amount;
    currency;
    paymentMethod;
    paymentStatus;
    transactionId;
    feePlatform;
    feeGateway;
    netAmount;
    message;
    refundedAt;
    createdAt;
    updatedAt;
    constructor(contribution) {
        this.id = contribution.id;
        this.eventGiftId = contribution.eventGiftId;
        this.userId = contribution.userId;
        this.contributorName = contribution.contributorName;
        this.contributorEmail = contribution.contributorEmail;
        this.amount = Number(contribution.amount);
        this.currency = contribution.currency;
        this.paymentMethod = contribution.paymentMethod;
        this.paymentStatus = contribution.paymentStatus;
        this.transactionId = contribution.transactionId;
        this.feePlatform = contribution.feePlatform ? Number(contribution.feePlatform) : undefined;
        this.feeGateway = contribution.feeGateway ? Number(contribution.feeGateway) : undefined;
        this.netAmount = contribution.netAmount ? Number(contribution.netAmount) : undefined;
        this.message = contribution.message;
        this.refundedAt = contribution.refundedAt;
        this.createdAt = contribution.createdAt;
        this.updatedAt = contribution.updatedAt;
    }
}
exports.ContributionResponseDto = ContributionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contribution unique identifier',
        example: 1,
    }),
    __metadata("design:type", Number)
], ContributionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gift event ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], ContributionResponseDto.prototype, "eventGiftId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID (if registered user)',
        example: 123,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ContributionResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contributor name',
        example: 'João Silva',
    }),
    __metadata("design:type", String)
], ContributionResponseDto.prototype, "contributorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contributor email',
        example: 'joao.silva@email.com',
        nullable: true,
    }),
    __metadata("design:type", String)
], ContributionResponseDto.prototype, "contributorEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contribution amount',
        example: 150.75,
    }),
    __metadata("design:type", Number)
], ContributionResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'BRL',
    }),
    __metadata("design:type", String)
], ContributionResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method',
        example: contribution_entity_1.PaymentMethod.PIX,
        enum: contribution_entity_1.PaymentMethod,
    }),
    __metadata("design:type", String)
], ContributionResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment status',
        example: contribution_entity_1.PaymentStatus.APPROVED,
        enum: contribution_entity_1.PaymentStatus,
    }),
    __metadata("design:type", String)
], ContributionResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction ID',
        example: 'txn_1234567890abcdef',
        nullable: true,
    }),
    __metadata("design:type", String)
], ContributionResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Platform fee',
        example: 5.50,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ContributionResponseDto.prototype, "feePlatform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gateway fee',
        example: 2.25,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ContributionResponseDto.prototype, "feeGateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Net amount after fees',
        example: 142.00,
        nullable: true,
    }),
    __metadata("design:type", Number)
], ContributionResponseDto.prototype, "netAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contributor message',
        example: 'Parabéns pelo casamento!',
        nullable: true,
    }),
    __metadata("design:type", String)
], ContributionResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund date',
        example: '2024-12-25T10:30:00Z',
        nullable: true,
    }),
    __metadata("design:type", Date)
], ContributionResponseDto.prototype, "refundedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation date',
        example: '2024-12-20T14:30:00Z',
    }),
    __metadata("design:type", Date)
], ContributionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2024-12-21T09:15:00Z',
    }),
    __metadata("design:type", Date)
], ContributionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=update-contribution-status.dto.js.map