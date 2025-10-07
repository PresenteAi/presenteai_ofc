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
exports.GiftEventOutputDto = exports.GiftTemplateChangedOutputDto = exports.GiftTemplateOutputDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const gift_template_entity_1 = require("../entities/gift-template.entity");
class GiftTemplateOutputDto {
    id;
    title;
    description;
    imageUrl;
    category;
    defaultValue;
    eventType;
    isPublic;
    createdByUserId;
    createdAt;
    updatedAt;
    createdByUser;
}
exports.GiftTemplateOutputDto = GiftTemplateOutputDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftTemplateOutputDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jogo de Panelas Antiaderente' }),
    __metadata("design:type", String)
], GiftTemplateOutputDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Conjunto completo de panelas antiaderentes com 5 peças' }),
    __metadata("design:type", String)
], GiftTemplateOutputDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/panelas.jpg' }),
    __metadata("design:type", String)
], GiftTemplateOutputDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cozinha' }),
    __metadata("design:type", String)
], GiftTemplateOutputDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 299.99 }),
    __metadata("design:type", Number)
], GiftTemplateOutputDto.prototype, "defaultValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'wedding', enum: gift_template_entity_1.EventType }),
    __metadata("design:type", String)
], GiftTemplateOutputDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], GiftTemplateOutputDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftTemplateOutputDto.prototype, "createdByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-10-07T12:00:00Z' }),
    __metadata("design:type", Date)
], GiftTemplateOutputDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-10-07T12:00:00Z' }),
    __metadata("design:type", Date)
], GiftTemplateOutputDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Informações do usuário criador'
    }),
    __metadata("design:type", Object)
], GiftTemplateOutputDto.prototype, "createdByUser", void 0);
class GiftTemplateChangedOutputDto {
    id;
    giftTemplateId;
    title;
    description;
    imageUrl;
    value;
    category;
    isPublic;
    createdByUserId;
    createdAt;
    updatedAt;
    giftTemplate;
    createdByUser;
}
exports.GiftTemplateChangedOutputDto = GiftTemplateChangedOutputDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftTemplateChangedOutputDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftTemplateChangedOutputDto.prototype, "giftTemplateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jogo de Panelas Premium' }),
    __metadata("design:type", String)
], GiftTemplateChangedOutputDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Versão premium com tampas de vidro' }),
    __metadata("design:type", String)
], GiftTemplateChangedOutputDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/panelas-premium.jpg' }),
    __metadata("design:type", String)
], GiftTemplateChangedOutputDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 399.99 }),
    __metadata("design:type", Number)
], GiftTemplateChangedOutputDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cozinha Premium' }),
    __metadata("design:type", String)
], GiftTemplateChangedOutputDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], GiftTemplateChangedOutputDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftTemplateChangedOutputDto.prototype, "createdByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-10-07T12:00:00Z' }),
    __metadata("design:type", Date)
], GiftTemplateChangedOutputDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-10-07T12:00:00Z' }),
    __metadata("design:type", Date)
], GiftTemplateChangedOutputDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template base de referência',
        type: GiftTemplateOutputDto
    }),
    __metadata("design:type", GiftTemplateOutputDto)
], GiftTemplateChangedOutputDto.prototype, "giftTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuário que criou a personalização'
    }),
    __metadata("design:type", Object)
], GiftTemplateChangedOutputDto.prototype, "createdByUser", void 0);
class GiftEventOutputDto {
    id;
    eventId;
    giftTemplateId;
    giftTemplateChangedId;
    customValue;
    collectedValue;
    status;
    createdAt;
    updatedAt;
    giftTemplate;
    giftTemplateChanged;
}
exports.GiftEventOutputDto = GiftEventOutputDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftEventOutputDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftEventOutputDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftEventOutputDto.prototype, "giftTemplateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], GiftEventOutputDto.prototype, "giftTemplateChangedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 350.00 }),
    __metadata("design:type", Number)
], GiftEventOutputDto.prototype, "customValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 125.50 }),
    __metadata("design:type", Number)
], GiftEventOutputDto.prototype, "collectedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'open' }),
    __metadata("design:type", String)
], GiftEventOutputDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-10-07T12:00:00Z' }),
    __metadata("design:type", Date)
], GiftEventOutputDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-10-07T12:00:00Z' }),
    __metadata("design:type", Date)
], GiftEventOutputDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template base (se usado)',
        type: GiftTemplateOutputDto
    }),
    __metadata("design:type", GiftTemplateOutputDto)
], GiftEventOutputDto.prototype, "giftTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template personalizado (se usado)',
        type: GiftTemplateChangedOutputDto
    }),
    __metadata("design:type", GiftTemplateChangedOutputDto)
], GiftEventOutputDto.prototype, "giftTemplateChanged", void 0);
//# sourceMappingURL=gift-output.dto.js.map