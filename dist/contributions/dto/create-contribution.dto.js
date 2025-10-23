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
exports.CreateContributionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contribution_entity_1 = require("../entities/contribution.entity");
class CreateContributionDto {
    eventGiftId;
    userId;
    contributorName;
    contributorEmail;
    amount;
    currency = 'BRL';
    paymentMethod;
    message;
}
exports.CreateContributionDto = CreateContributionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the gift event receiving the contribution',
        example: 1,
        type: Number,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateContributionDto.prototype, "eventGiftId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the registered user making the contribution (optional for anonymous contributions)',
        example: 123,
        type: Number,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateContributionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the contributor',
        example: 'João Silva',
        maxLength: 255,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateContributionDto.prototype, "contributorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of the contributor (optional)',
        example: 'joao.silva@email.com',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateContributionDto.prototype, "contributorEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contribution amount in the specified currency',
        example: 150.75,
        type: Number,
        minimum: 0.01,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], CreateContributionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code (ISO 4217)',
        example: 'BRL',
        default: 'BRL',
        maxLength: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateContributionDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method used for the contribution',
        example: contribution_entity_1.PaymentMethod.PIX,
        enum: contribution_entity_1.PaymentMethod,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contribution_entity_1.PaymentMethod),
    __metadata("design:type", String)
], CreateContributionDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional message from the contributor',
        example: 'Parabéns pelo casamento! Desejo muitas felicidades!',
        maxLength: 1000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateContributionDto.prototype, "message", void 0);
//# sourceMappingURL=create-contribution.dto.js.map