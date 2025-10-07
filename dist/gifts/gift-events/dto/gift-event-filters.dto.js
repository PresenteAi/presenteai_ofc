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
exports.GiftEventFiltersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const gift_event_entity_1 = require("../../entities/gift-event.entity");
class GiftEventFiltersDto {
    eventId;
    giftTemplateId;
    giftTemplateChangedId;
    status;
    minValue;
    maxValue;
    page = 1;
    limit = 10;
    sortBy = 'createdAt';
    sortOrder = 'DESC';
}
exports.GiftEventFiltersDto = GiftEventFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Filtrar por ID do evento',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'eventId must be an integer' }),
    (0, class_validator_1.IsPositive)({ message: 'eventId must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GiftEventFiltersDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Filtrar por ID do template base',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'giftTemplateId must be an integer' }),
    (0, class_validator_1.IsPositive)({ message: 'giftTemplateId must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GiftEventFiltersDto.prototype, "giftTemplateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Filtrar por ID do template personalizado',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'giftTemplateChangedId must be an integer' }),
    (0, class_validator_1.IsPositive)({ message: 'giftTemplateChangedId must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GiftEventFiltersDto.prototype, "giftTemplateChangedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: gift_event_entity_1.GiftEventStatus.OPEN,
        description: 'Filtrar por status',
        enum: gift_event_entity_1.GiftEventStatus,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gift_event_entity_1.GiftEventStatus, { message: 'status must be a valid GiftEventStatus' }),
    __metadata("design:type", String)
], GiftEventFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100.00,
        description: 'Valor mínimo efetivo (considerando customValue, templateChanged ou template)',
        required: false,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'minValue must be a number with up to 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'minValue cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GiftEventFiltersDto.prototype, "minValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 500.00,
        description: 'Valor máximo efetivo (considerando customValue, templateChanged ou template)',
        required: false,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'maxValue must be a number with up to 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'maxValue cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GiftEventFiltersDto.prototype, "maxValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Página (para paginação)',
        required: false,
        minimum: 1,
        default: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'page must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'page must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GiftEventFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Itens por página (para paginação)',
        required: false,
        minimum: 1,
        maximum: 100,
        default: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'limit must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'limit must be at most 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GiftEventFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'title',
        description: 'Campo para ordenação',
        required: false,
        enum: ['id', 'createdAt', 'updatedAt', 'collectedValue', 'title'],
        default: 'createdAt'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GiftEventFiltersDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'DESC',
        description: 'Direção da ordenação',
        required: false,
        enum: ['ASC', 'DESC'],
        default: 'DESC'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GiftEventFiltersDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=gift-event-filters.dto.js.map