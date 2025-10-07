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
exports.GiftTemplatePaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const gift_template_entity_1 = require("../entities/gift-template.entity");
class GiftTemplatePaginationDto {
    page = 1;
    limit = 10;
    sortBy;
    sortOrder = 'DESC';
    search;
    category;
    eventType;
    isPublic;
    createdByUserId;
}
exports.GiftTemplatePaginationDto = GiftTemplatePaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Número da página',
        required: false,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GiftTemplatePaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Itens por página (máximo 100)',
        required: false,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GiftTemplatePaginationDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'title',
        description: 'Campo para ordenação',
        required: false,
        enum: ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GiftTemplatePaginationDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ASC',
        description: 'Direção da ordenação',
        required: false,
        enum: ['ASC', 'DESC']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GiftTemplatePaginationDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'panelas',
        description: 'Busca por título ou descrição',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GiftTemplatePaginationDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Cozinha',
        description: 'Filtro por categoria',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GiftTemplatePaginationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wedding',
        description: 'Filtro por tipo de evento',
        enum: gift_template_entity_1.EventType,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gift_template_entity_1.EventType),
    __metadata("design:type", String)
], GiftTemplatePaginationDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Filtro por templates públicos',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GiftTemplatePaginationDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Filtro por usuário criador',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GiftTemplatePaginationDto.prototype, "createdByUserId", void 0);
//# sourceMappingURL=gift-template-pagination.dto.js.map