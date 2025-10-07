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
exports.CreateEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const event_entity_1 = require("../entities/event.entity");
class CreateEventDto {
    userId;
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
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-string',
        description: 'Reference to the event organizer (User ID)'
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Casamento Ana & João',
        description: 'Event title (3-200 characters)',
        minLength: 3,
        maxLength: 200
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Venham celebrar conosco este momento especial!',
        description: 'Event description or host message (max 2000 characters)',
        required: false,
        maxLength: 2000
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wedding',
        description: 'Type of event',
        enum: event_entity_1.EventType
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/cover.jpg',
        description: 'Cover image URL (must be valid URL)',
        required: false
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "coverImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#FF6B6B',
        description: 'Primary theme color (hex format)',
        required: false
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#4ECDC4',
        description: 'Secondary theme color (hex format)',
        required: false
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "secondaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#45B7D1',
        description: 'Tertiary theme color (hex format)',
        required: false
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "tertiaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Roboto',
        description: 'Font family name (max 100 characters)',
        required: false
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "fontFamily", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-25',
        description: 'Event start date (YYYY-MM-DD format)',
        required: false
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-20',
        description: 'Contribution end date (YYYY-MM-DD format)',
        required: false
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'casamento-ana-joao-2025',
        description: 'Unique public URL slug (3-100 characters, alphanumeric and hyphens only)',
        minLength: 3,
        maxLength: 100
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "publicUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether the event should be published immediately',
        required: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isPublished", void 0);
//# sourceMappingURL=create-event.dto.js.map