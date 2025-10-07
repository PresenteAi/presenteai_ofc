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
exports.CreateGiftTemplateChangedDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateGiftTemplateChangedDto {
    giftTemplateId;
    title;
    description;
    imageUrl;
    value;
    category;
    isPublic = false;
}
exports.CreateGiftTemplateChangedDto = CreateGiftTemplateChangedDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID do template base que será personalizado'
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateGiftTemplateChangedDto.prototype, "giftTemplateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jogo de Panelas Antiaderente Premium',
        description: 'Nome personalizado do presente',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateGiftTemplateChangedDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Conjunto premium com 7 peças, incluindo tampa de vidro',
        description: 'Descrição personalizada',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateGiftTemplateChangedDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/panelas-premium.jpg',
        description: 'URL da imagem personalizada',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateGiftTemplateChangedDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 399.99,
        description: 'Valor ajustado para o presente',
        required: false,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGiftTemplateChangedDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Cozinha Premium',
        description: 'Categoria personalizada',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateGiftTemplateChangedDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Se deseja tornar esta variação pública para outros usuários',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGiftTemplateChangedDto.prototype, "isPublic", void 0);
//# sourceMappingURL=create-gift-template-changed.dto.js.map