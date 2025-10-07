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
exports.EventOutputDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const event_entity_1 = require("../entities/event.entity");
class EventOutputDto {
    id;
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
    isActive;
    createdAt;
    updatedAt;
    user;
}
exports.EventOutputDto = EventOutputDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-string',
        description: 'Unique identifier of the event'
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-string',
        description: 'Reference to the event organizer'
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Casamento Ana & João',
        description: 'Event title'
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Venham celebrar conosco este momento especial!',
        description: 'Event description or host message',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wedding',
        description: 'Type of event',
        enum: event_entity_1.EventType
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/cover.jpg',
        description: 'Cover image URL',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "coverImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#FF6B6B',
        description: 'Primary theme color',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#4ECDC4',
        description: 'Secondary theme color',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "secondaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#45B7D1',
        description: 'Tertiary theme color',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "tertiaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Roboto',
        description: 'Font family used in the event page',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "fontFamily", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-25',
        description: 'Event start date',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-20',
        description: 'Contribution end date',
        required: false
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'casamento-ana-joao-2025',
        description: 'Unique public URL slug for guests'
    }),
    __metadata("design:type", String)
], EventOutputDto.prototype, "publicUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the event is publicly visible'
    }),
    __metadata("design:type", Boolean)
], EventOutputDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the event is active'
    }),
    __metadata("design:type", Boolean)
], EventOutputDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-06T12:00:00Z',
        description: 'Date when the event was created'
    }),
    __metadata("design:type", Date)
], EventOutputDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-06T12:00:00Z',
        description: 'Date when the event was last updated'
    }),
    __metadata("design:type", Date)
], EventOutputDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 'user-uuid',
            name: 'João Silva',
            email: 'joao@email.com'
        },
        description: 'Event organizer information',
        required: false
    }),
    __metadata("design:type", Object)
], EventOutputDto.prototype, "user", void 0);
//# sourceMappingURL=event-output.dto.js.map