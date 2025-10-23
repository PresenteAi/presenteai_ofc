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
exports.PaginatedEventsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const event_output_dto_1 = require("./event-output.dto");
class PaginatedEventsDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasNext;
    hasPrev;
}
exports.PaginatedEventsDto = PaginatedEventsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [event_output_dto_1.EventOutputDto],
        description: 'Array of events'
    }),
    __metadata("design:type", Array)
], PaginatedEventsDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Total number of events'
    }),
    __metadata("design:type", Number)
], PaginatedEventsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Current page number'
    }),
    __metadata("design:type", Number)
], PaginatedEventsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Number of items per page'
    }),
    __metadata("design:type", Number)
], PaginatedEventsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Total number of pages'
    }),
    __metadata("design:type", Number)
], PaginatedEventsDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether there is a next page'
    }),
    __metadata("design:type", Boolean)
], PaginatedEventsDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether there is a previous page'
    }),
    __metadata("design:type", Boolean)
], PaginatedEventsDto.prototype, "hasPrev", void 0);
//# sourceMappingURL=paginated-events.dto.js.map