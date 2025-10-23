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
exports.PaginatedGiftEventsDto = exports.PaginatedGiftTemplatesChangedDto = exports.PaginatedGiftTemplatesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const gift_output_dto_1 = require("./gift-output.dto");
class PaginatedGiftTemplatesDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasPrevious;
    hasNext;
}
exports.PaginatedGiftTemplatesDto = PaginatedGiftTemplatesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de templates de presentes',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    __metadata("design:type", Array)
], PaginatedGiftTemplatesDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Total de itens' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Página atual' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Itens por página' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Total de páginas' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Tem página anterior' }),
    __metadata("design:type", Boolean)
], PaginatedGiftTemplatesDto.prototype, "hasPrevious", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Tem próxima página' }),
    __metadata("design:type", Boolean)
], PaginatedGiftTemplatesDto.prototype, "hasNext", void 0);
class PaginatedGiftTemplatesChangedDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasPrevious;
    hasNext;
}
exports.PaginatedGiftTemplatesChangedDto = PaginatedGiftTemplatesChangedDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de templates personalizados',
        type: [gift_output_dto_1.GiftTemplateChangedOutputDto]
    }),
    __metadata("design:type", Array)
], PaginatedGiftTemplatesChangedDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Total de itens' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesChangedDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Página atual' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesChangedDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Itens por página' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesChangedDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Total de páginas' }),
    __metadata("design:type", Number)
], PaginatedGiftTemplatesChangedDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Tem página anterior' }),
    __metadata("design:type", Boolean)
], PaginatedGiftTemplatesChangedDto.prototype, "hasPrevious", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Tem próxima página' }),
    __metadata("design:type", Boolean)
], PaginatedGiftTemplatesChangedDto.prototype, "hasNext", void 0);
class PaginatedGiftEventsDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasPrevious;
    hasNext;
}
exports.PaginatedGiftEventsDto = PaginatedGiftEventsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de presentes do evento',
        type: [gift_output_dto_1.GiftEventOutputDto]
    }),
    __metadata("design:type", Array)
], PaginatedGiftEventsDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Total de itens' }),
    __metadata("design:type", Number)
], PaginatedGiftEventsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Página atual' }),
    __metadata("design:type", Number)
], PaginatedGiftEventsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Itens por página' }),
    __metadata("design:type", Number)
], PaginatedGiftEventsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Total de páginas' }),
    __metadata("design:type", Number)
], PaginatedGiftEventsDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Tem página anterior' }),
    __metadata("design:type", Boolean)
], PaginatedGiftEventsDto.prototype, "hasPrevious", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Tem próxima página' }),
    __metadata("design:type", Boolean)
], PaginatedGiftEventsDto.prototype, "hasNext", void 0);
//# sourceMappingURL=paginated-gifts.dto.js.map