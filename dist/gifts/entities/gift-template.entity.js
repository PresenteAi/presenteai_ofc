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
exports.GiftTemplate = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/users/entities/user.entity");
var EventType;
(function (EventType) {
    EventType["WEDDING"] = "wedding";
    EventType["BABY_SHOWER"] = "baby_shower";
    EventType["HOUSEWARMING"] = "housewarming";
    EventType["BIRTHDAY"] = "birthday";
    EventType["GRADUATION"] = "graduation";
    EventType["OTHER"] = "other";
})(EventType || (exports.EventType = EventType = {}));
let GiftTemplate = class GiftTemplate {
    id;
    title;
    description;
    imageUrl;
    category;
    defaultValue;
    eventType;
    isPublic;
    createdByUserId;
    createdByUser;
    createdAt;
    updatedAt;
};
exports.GiftTemplate = GiftTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GiftTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], GiftTemplate.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GiftTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], GiftTemplate.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], GiftTemplate.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], GiftTemplate.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EventType,
        nullable: true
    }),
    __metadata("design:type", String)
], GiftTemplate.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], GiftTemplate.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], GiftTemplate.prototype, "createdByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_user_id' }),
    __metadata("design:type", user_entity_1.User)
], GiftTemplate.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GiftTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GiftTemplate.prototype, "updatedAt", void 0);
exports.GiftTemplate = GiftTemplate = __decorate([
    (0, typeorm_1.Entity)('gift_templates')
], GiftTemplate);
//# sourceMappingURL=gift-template.entity.js.map