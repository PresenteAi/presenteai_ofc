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
exports.CreateGiftTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const gift_template_entity_1 = require("../entities/gift-template.entity");
class CreateGiftTemplateDto {
    title;
    description;
    imageUrl;
    category;
    defaultValue;
    eventType;
    isPublic = true;
}
exports.CreateGiftTemplateDto = CreateGiftTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jogo de Panelas Antiaderente',
        description: 'Nome do presente (3-255 caracteres)',
        minLength: 3,
        maxLength: 255
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateGiftTemplateDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Conjunto completo de panelas antiaderentes com 5 peças, ideal para cozinha moderna',
        description: 'Descrição detalhada do presente',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateGiftTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/panelas.jpg',
        description: 'URL da imagem do presente',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateGiftTemplateDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Cozinha',
        description: 'Categoria do presente',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateGiftTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 299.99,
        description: 'Valor sugerido para o presente',
        required: false,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGiftTemplateDto.prototype, "defaultValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wedding',
        description: 'Tipo de evento sugerido para este presente',
        enum: gift_template_entity_1.EventType,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gift_template_entity_1.EventType),
    __metadata("design:type", String)
], CreateGiftTemplateDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Se o presente pode ser reutilizado por outros usuários',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGiftTemplateDto.prototype, "isPublic", void 0);
//# sourceMappingURL=create-gift-template.dto.js.map