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
exports.GiftTemplateChanged = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/users/entities/user.entity");
const gift_template_entity_1 = require("./gift-template.entity");
let GiftTemplateChanged = class GiftTemplateChanged {
    id;
    giftTemplateId;
    giftTemplate;
    title;
    description;
    imageUrl;
    value;
    category;
    isPublic;
    createdByUserId;
    createdByUser;
    createdAt;
    updatedAt;
};
exports.GiftTemplateChanged = GiftTemplateChanged;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GiftTemplateChanged.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], GiftTemplateChanged.prototype, "giftTemplateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gift_template_entity_1.GiftTemplate),
    (0, typeorm_1.JoinColumn)({ name: 'gift_template_id' }),
    __metadata("design:type", gift_template_entity_1.GiftTemplate)
], GiftTemplateChanged.prototype, "giftTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], GiftTemplateChanged.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GiftTemplateChanged.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], GiftTemplateChanged.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], GiftTemplateChanged.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], GiftTemplateChanged.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], GiftTemplateChanged.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], GiftTemplateChanged.prototype, "createdByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_user_id' }),
    __metadata("design:type", user_entity_1.User)
], GiftTemplateChanged.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GiftTemplateChanged.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GiftTemplateChanged.prototype, "updatedAt", void 0);
exports.GiftTemplateChanged = GiftTemplateChanged = __decorate([
    (0, typeorm_1.Entity)('gift_templates_changed')
], GiftTemplateChanged);
//# sourceMappingURL=gift-template-changed.entity.js.map