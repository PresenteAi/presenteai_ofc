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
exports.ContributionFiltersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contribution_entity_1 = require("../entities/contribution.entity");
class ContributionFiltersDto {
    eventGiftId;
    userId;
    paymentStatus;
    paymentMethod;
    fromDate;
    toDate;
    page = 1;
    limit = 20;
}
exports.ContributionFiltersDto = ContributionFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by gift event ID',
        example: 1,
        type: Number,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ContributionFiltersDto.prototype, "eventGiftId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by user ID',
        example: 123,
        type: Number,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ContributionFiltersDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by payment status',
        example: contribution_entity_1.PaymentStatus.APPROVED,
        enum: contribution_entity_1.PaymentStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contribution_entity_1.PaymentStatus),
    __metadata("design:type", String)
], ContributionFiltersDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by payment method',
        example: contribution_entity_1.PaymentMethod.PIX,
        enum: contribution_entity_1.PaymentMethod,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contribution_entity_1.PaymentMethod),
    __metadata("design:type", String)
], ContributionFiltersDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter contributions from date (ISO 8601)',
        example: '2024-12-01T00:00:00Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ContributionFiltersDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter contributions to date (ISO 8601)',
        example: '2024-12-31T23:59:59Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ContributionFiltersDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
        default: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 1),
    __metadata("design:type", Number)
], ContributionFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => Math.min(parseInt(value) || 20, 100)),
    __metadata("design:type", Number)
], ContributionFiltersDto.prototype, "limit", void 0);
//# sourceMappingURL=contribution-filters.dto.js.map