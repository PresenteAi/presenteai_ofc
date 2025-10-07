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
exports.PaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaginationDto {
    page = 1;
    limit = 10;
    sortBy = 'createdAt';
    sortOrder = 'DESC';
    search;
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Page number (minimum 1)',
        minimum: 1,
        default: 1,
        required: false
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
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
], PaginationDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'name',
        description: 'Field to sort by',
        enum: ['name', 'email', 'createdAt', 'updatedAt'],
        required: false
    }),
    __metadata("design:type", String)
], PaginationDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'DESC',
        description: 'Sort direction',
        enum: ['ASC', 'DESC'],
        required: false
    }),
    __metadata("design:type", String)
], PaginationDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'João',
        description: 'Search term for name or email',
        required: false
    }),
    __metadata("design:type", String)
], PaginationDto.prototype, "search", void 0);
//# sourceMappingURL=pagination.dto.js.map