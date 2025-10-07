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
exports.PaginatedGiftEventResponseDto = exports.GiftEventResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GiftEventResponseDto {
    id;
    eventId;
    eventTitle;
    giftTemplateId;
    giftTemplateChangedId;
    title;
    description;
    imageUrl;
    category;
    effectiveValue;
    customValue;
    collectedValue;
    remainingValue;
    progressPercentage;
    status;
    canReceiveContributions;
    isCompleted;
    createdAt;
    updatedAt;
    constructor(giftEvent) {
        this.id = giftEvent.id;
        this.eventId = giftEvent.eventId;
        this.eventTitle = giftEvent.event?.title || '';
        this.giftTemplateId = giftEvent.giftTemplateId;
        this.giftTemplateChangedId = giftEvent.giftTemplateChangedId;
        this.title = giftEvent.getEffectiveTitle();
        this.description = giftEvent.getEffectiveDescription() || undefined;
        this.imageUrl = giftEvent.getEffectiveImageUrl() || undefined;
        this.category = giftEvent.getEffectiveCategory() || undefined;
        this.effectiveValue = giftEvent.getEffectiveValue() || 0;
        this.customValue = giftEvent.customValue;
        this.collectedValue = Number(giftEvent.collectedValue);
        this.remainingValue = giftEvent.getRemainingValue();
        this.progressPercentage = giftEvent.getProgressPercentage();
        this.status = giftEvent.status;
        this.canReceiveContributions = giftEvent.canReceiveContributions();
        this.isCompleted = giftEvent.isCompleted();
        this.createdAt = giftEvent.createdAt;
        this.updatedAt = giftEvent.updatedAt;
    }
}
exports.GiftEventResponseDto = GiftEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID único do presente no evento' }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID do evento' }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Festa de Aniversário', description: 'Título do evento' }),
    __metadata("design:type", String)
], GiftEventResponseDto.prototype, "eventTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID do template base', required: false }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "giftTemplateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID do template personalizado', required: false }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "giftTemplateChangedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Smartphone Samsung Galaxy S24', description: 'Título efetivo do presente' }),
    __metadata("design:type", String)
], GiftEventResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Smartphone top de linha com 256GB', description: 'Descrição efetiva do presente', required: false }),
    __metadata("design:type", String)
], GiftEventResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/smartphone.jpg', description: 'URL da imagem efetiva', required: false }),
    __metadata("design:type", String)
], GiftEventResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Eletrônicos', description: 'Categoria efetiva do presente', required: false }),
    __metadata("design:type", String)
], GiftEventResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200.00, description: 'Valor efetivo do presente' }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "effectiveValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500.00, description: 'Valor personalizado definido no evento', required: false }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "customValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 750.00, description: 'Valor arrecadado até o momento' }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "collectedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 750.00, description: 'Valor restante para completar' }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "remainingValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 62.5, description: 'Porcentagem de progresso (0-100)' }),
    __metadata("design:type", Number)
], GiftEventResponseDto.prototype, "progressPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'open', description: 'Status atual do presente', enum: ['open', 'completed'] }),
    __metadata("design:type", String)
], GiftEventResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Se o presente pode receber contribuições' }),
    __metadata("design:type", Boolean)
], GiftEventResponseDto.prototype, "canReceiveContributions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Se o presente foi completado' }),
    __metadata("design:type", Boolean)
], GiftEventResponseDto.prototype, "isCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data de criação' }),
    __metadata("design:type", Date)
], GiftEventResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data da última atualização' }),
    __metadata("design:type", Date)
], GiftEventResponseDto.prototype, "updatedAt", void 0);
class PaginatedGiftEventResponseDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasNextPage;
    hasPreviousPage;
}
exports.PaginatedGiftEventResponseDto = PaginatedGiftEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [GiftEventResponseDto], description: 'Lista de presentes no evento' }),
    __metadata("design:type", Array)
], PaginatedGiftEventResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Total de itens' }),
    __metadata("design:type", Number)
], PaginatedGiftEventResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Página atual' }),
    __metadata("design:type", Number)
], PaginatedGiftEventResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Itens por página' }),
    __metadata("design:type", Number)
], PaginatedGiftEventResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Total de páginas' }),
    __metadata("design:type", Number)
], PaginatedGiftEventResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Se há próxima página' }),
    __metadata("design:type", Boolean)
], PaginatedGiftEventResponseDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Se há página anterior' }),
    __metadata("design:type", Boolean)
], PaginatedGiftEventResponseDto.prototype, "hasPreviousPage", void 0);
//# sourceMappingURL=gift-event-response.dto.js.map