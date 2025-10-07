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
exports.CreateGiftEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const gift_event_entity_1 = require("../entities/gift-event.entity");
class CreateGiftEventDto {
    eventId;
    giftTemplateId;
    giftTemplateChangedId;
    customValue;
    status = gift_event_entity_1.GiftEventStatus.OPEN;
}
exports.CreateGiftEventDto = CreateGiftEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID do evento onde o presente será adicionado'
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateGiftEventDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID do template base do presente (obrigatório se giftTemplateChangedId não fornecido)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Gift template ID must be an integer' }),
    (0, class_validator_1.IsPositive)({ message: 'Gift template ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.ValidateIf)((o) => !o.giftTemplateChangedId),
    __metadata("design:type", Number)
], CreateGiftEventDto.prototype, "giftTemplateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID do template personalizado (obrigatório se giftTemplateId não fornecido)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Gift template changed ID must be an integer' }),
    (0, class_validator_1.IsPositive)({ message: 'Gift template changed ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.ValidateIf)((o) => !o.giftTemplateId),
    __metadata("design:type", Number)
], CreateGiftEventDto.prototype, "giftTemplateChangedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 350.00,
        description: 'Valor final definido para este presente no evento',
        required: false,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01, { message: 'customValue must be greater than 0' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateGiftEventDto.prototype, "customValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: gift_event_entity_1.GiftEventStatus.OPEN,
        description: 'Status inicial do presente',
        enum: gift_event_entity_1.GiftEventStatus,
        default: gift_event_entity_1.GiftEventStatus.OPEN
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gift_event_entity_1.GiftEventStatus),
    __metadata("design:type", String)
], CreateGiftEventDto.prototype, "status", void 0);
//# sourceMappingURL=create-gift-event.dto.js.map