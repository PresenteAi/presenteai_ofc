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
exports.UpdateGiftEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const gift_event_entity_1 = require("../../entities/gift-event.entity");
class UpdateGiftEventDto {
    giftTemplateId;
    giftTemplateChangedId;
    customValue;
    collectedValue;
    status;
}
exports.UpdateGiftEventDto = UpdateGiftEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID do template base do presente',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Gift template ID must be an integer' }),
    (0, class_validator_1.IsPositive)({ message: 'Gift template ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateGiftEventDto.prototype, "giftTemplateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID do template personalizado',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Gift template changed ID must be an integer' }),
    (0, class_validator_1.IsPositive)({ message: 'Gift template changed ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateGiftEventDto.prototype, "giftTemplateChangedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 350.00,
        description: 'Valor final personalizado para este presente',
        required: false,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'customValue must be a number with up to 2 decimal places' }),
    (0, class_validator_1.Min)(0.01, { message: 'customValue must be greater than 0' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateGiftEventDto.prototype, "customValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 150.00,
        description: 'Valor arrecadado para este presente',
        required: false,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'collectedValue must be a number with up to 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'collectedValue cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateGiftEventDto.prototype, "collectedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: gift_event_entity_1.GiftEventStatus.COMPLETED,
        description: 'Status do presente no evento',
        enum: gift_event_entity_1.GiftEventStatus,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gift_event_entity_1.GiftEventStatus, { message: 'status must be a valid GiftEventStatus' }),
    __metadata("design:type", String)
], UpdateGiftEventDto.prototype, "status", void 0);
//# sourceMappingURL=update-gift-event.dto.js.map