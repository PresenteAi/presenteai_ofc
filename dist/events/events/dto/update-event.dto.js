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
exports.UpdateEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const event_entity_1 = require("../entities/event.entity");
class UpdateEventDto {
    title;
    description;
    eventType;
    coverImageUrl;
    primaryColor;
    secondaryColor;
    tertiaryColor;
    fontFamily;
    startDate;
    endDate;
    publicUrl;
    isPublished;
    isActive;
}
exports.UpdateEventDto = UpdateEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Casamento Ana & João - Atualizado',
        description: 'Event title (3-200 characters)',
        minLength: 3,
        maxLength: 200,
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Nova descrição do evento!',
        description: 'Event description or host message (max 2000 characters)',
        required: false,
        maxLength: 2000
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'baby_shower',
        description: 'Type of event',
        enum: event_entity_1.EventType,
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/new-cover.jpg',
        description: 'Cover image URL (must be valid URL)',
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "coverImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#FF0000',
        description: 'Primary theme color (hex format)',
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#00FF00',
        description: 'Secondary theme color (hex format)',
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "secondaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#0000FF',
        description: 'Tertiary theme color (hex format)',
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "tertiaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Arial',
        description: 'Font family name (max 100 characters)',
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "fontFamily", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-30',
        description: 'Event start date (YYYY-MM-DD format)',
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-25',
        description: 'Contribution end date (YYYY-MM-DD format)',
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'novo-casamento-ana-joao-2025',
        description: 'Unique public URL slug (3-100 characters, alphanumeric and hyphens only)',
        minLength: 3,
        maxLength: 100,
        required: false
    }),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "publicUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the event is published',
        required: false
    }),
    __metadata("design:type", Boolean)
], UpdateEventDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the event is active',
        required: false
    }),
    __metadata("design:type", Boolean)
], UpdateEventDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-event.dto.js.map