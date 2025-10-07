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
exports.EventPaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const event_entity_1 = require("../entities/event.entity");
class EventPaginationDto {
    page = 1;
    limit = 10;
    sortBy = 'createdAt';
    sortOrder = 'DESC';
    search;
    eventType;
    userId;
    isPublished;
    isActive;
}
exports.EventPaginationDto = EventPaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Page number (minimum 1)',
        minimum: 1,
        default: 1,
        required: false
    }),
    __metadata("design:type", Number)
], EventPaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Number of items per page (1-100)',
        minimum: 1,
        maximum: 100,
        default: 10,
        required: false
    }),
    __metadata("design:type", Number)
], EventPaginationDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'title',
        description: 'Field to sort by',
        enum: ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'],
        required: false
    }),
    __metadata("design:type", String)
], EventPaginationDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'DESC',
        description: 'Sort direction',
        enum: ['ASC', 'DESC'],
        required: false
    }),
    __metadata("design:type", String)
], EventPaginationDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Casamento',
        description: 'Search term for title or description',
        required: false
    }),
    __metadata("design:type", String)
], EventPaginationDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wedding',
        description: 'Filter by event type',
        enum: event_entity_1.EventType,
        required: false
    }),
    __metadata("design:type", String)
], EventPaginationDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-string',
        description: 'Filter by user/organizer ID',
        required: false
    }),
    __metadata("design:type", String)
], EventPaginationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Filter by published status',
        required: false
    }),
    __metadata("design:type", Boolean)
], EventPaginationDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Filter by active status',
        required: false
    }),
    __metadata("design:type", Boolean)
], EventPaginationDto.prototype, "isActive", void 0);
//# sourceMappingURL=event-pagination.dto.js.map