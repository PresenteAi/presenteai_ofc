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
exports.GiftEvent = exports.GiftEventStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const event_entity_1 = require("../../events/events/entities/event.entity");
const gift_template_entity_1 = require("./gift-template.entity");
const gift_template_changed_entity_1 = require("./gift-template-changed.entity");
var GiftEventStatus;
(function (GiftEventStatus) {
    GiftEventStatus["OPEN"] = "open";
    GiftEventStatus["COMPLETED"] = "completed";
})(GiftEventStatus || (exports.GiftEventStatus = GiftEventStatus = {}));
let GiftEvent = class GiftEvent {
    id;
    eventId;
    event;
    giftTemplateId;
    giftTemplate;
    giftTemplateChangedId;
    giftTemplateChanged;
    customValue;
    collectedValue;
    status;
    createdAt;
    updatedAt;
    getEffectiveValue() {
        if (this.customValue)
            return this.customValue;
        if (this.giftTemplateChanged?.value)
            return this.giftTemplateChanged.value;
        if (this.giftTemplate?.defaultValue)
            return this.giftTemplate.defaultValue;
        return null;
    }
    getEffectiveTitle() {
        if (this.giftTemplateChanged) {
            return this.giftTemplateChanged.title || this.giftTemplateChanged.giftTemplate?.title || 'Untitled Gift';
        }
        return this.giftTemplate?.title || 'Untitled Gift';
    }
    getEffectiveDescription() {
        if (this.giftTemplateChanged) {
            return this.giftTemplateChanged.description || this.giftTemplateChanged.giftTemplate?.description || null;
        }
        return this.giftTemplate?.description || null;
    }
    getEffectiveImageUrl() {
        if (this.giftTemplateChanged) {
            return this.giftTemplateChanged.imageUrl || this.giftTemplateChanged.giftTemplate?.imageUrl || null;
        }
        return this.giftTemplate?.imageUrl || null;
    }
    getEffectiveCategory() {
        if (this.giftTemplateChanged) {
            return this.giftTemplateChanged.category || this.giftTemplateChanged.giftTemplate?.category || null;
        }
        return this.giftTemplate?.category || null;
    }
    getProgressPercentage() {
        const effectiveValue = this.getEffectiveValue();
        if (!effectiveValue || effectiveValue <= 0)
            return 0;
        return Math.min(100, Math.round((Number(this.collectedValue) / effectiveValue) * 100));
    }
    getRemainingValue() {
        const effectiveValue = this.getEffectiveValue();
        if (!effectiveValue)
            return 0;
        return Math.max(0, effectiveValue - Number(this.collectedValue));
    }
    isCompleted() {
        return this.status === GiftEventStatus.COMPLETED;
    }
    canReceiveContributions() {
        return this.status === GiftEventStatus.OPEN;
    }
};
exports.GiftEvent = GiftEvent;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Unique identifier of the gift event' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GiftEvent.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the event this gift belongs to' }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], GiftEvent.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_1.Event)
], GiftEvent.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: false,
        description: 'ID of the base gift template (mutually exclusive with giftTemplateChangedId)'
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], GiftEvent.prototype, "giftTemplateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gift_template_entity_1.GiftTemplate, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'gift_template_id' }),
    __metadata("design:type", gift_template_entity_1.GiftTemplate)
], GiftEvent.prototype, "giftTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: false,
        description: 'ID of the customized gift template (mutually exclusive with giftTemplateId)'
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], GiftEvent.prototype, "giftTemplateChangedId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gift_template_changed_entity_1.GiftTemplateChanged, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'gift_template_changed_id' }),
    __metadata("design:type", gift_template_changed_entity_1.GiftTemplateChanged)
], GiftEvent.prototype, "giftTemplateChanged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 299.99,
        required: false,
        description: 'Custom value for this specific gift instance (overrides template values)'
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], GiftEvent.prototype, "customValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 150.00,
        description: 'Amount collected so far for this gift'
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], GiftEvent.prototype, "collectedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'open',
        enum: GiftEventStatus,
        description: 'Current status of the gift collection'
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: GiftEventStatus,
        default: GiftEventStatus.OPEN
    }),
    __metadata("design:type", String)
], GiftEvent.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when the gift was added to the event' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GiftEvent.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when the gift was last updated' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GiftEvent.prototype, "updatedAt", void 0);
exports.GiftEvent = GiftEvent = __decorate([
    (0, typeorm_1.Entity)('gift_events'),
    (0, typeorm_1.Check)(`(gift_template_id IS NOT NULL AND gift_template_changed_id IS NULL) OR (gift_template_id IS NULL AND gift_template_changed_id IS NOT NULL)`)
], GiftEvent);
//# sourceMappingURL=gift-event.entity.js.map