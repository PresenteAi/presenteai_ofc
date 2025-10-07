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
exports.UserOutputDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserOutputDto {
    id;
    name;
    email;
    isActive;
    isIndicated;
    indicatedById;
    createdAt;
    updatedAt;
    lastLoginAt;
}
exports.UserOutputDto = UserOutputDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-string',
        description: 'Unique identifier of the user'
    }),
    __metadata("design:type", String)
], UserOutputDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'João Silva',
        description: 'Full name of the user'
    }),
    __metadata("design:type", String)
], UserOutputDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'joao@email.com',
        description: 'Email address of the user'
    }),
    __metadata("design:type", String)
], UserOutputDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indicates if the user is active'
    }),
    __metadata("design:type", Boolean)
], UserOutputDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Indicates if the user was indicated by another user'
    }),
    __metadata("design:type", Boolean)
], UserOutputDto.prototype, "isIndicated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID of the user who indicated this user',
        required: false
    }),
    __metadata("design:type", Number)
], UserOutputDto.prototype, "indicatedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-06T12:00:00Z',
        description: 'Date when the user was created'
    }),
    __metadata("design:type", Date)
], UserOutputDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-06T12:00:00Z',
        description: 'Date when the user was last updated'
    }),
    __metadata("design:type", Date)
], UserOutputDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-06T12:00:00Z',
        description: 'Date of the last login',
        required: false
    }),
    __metadata("design:type", Date)
], UserOutputDto.prototype, "lastLoginAt", void 0);
//# sourceMappingURL=default.output.dto.js.map