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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftTemplatesChangedRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gift_template_changed_entity_1 = require("../entities/gift-template-changed.entity");
let GiftTemplatesChangedRepository = class GiftTemplatesChangedRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto, createdByUserId) {
        const giftTemplateChanged = this.repository.create({
            ...dto,
            createdByUserId,
        });
        return await this.repository.save(giftTemplateChanged);
    }
    async findAll() {
        return await this.repository.find({
            relations: ['giftTemplate', 'createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid gift template changed ID');
        }
        const giftTemplateChanged = await this.repository.findOne({
            where: { id },
            relations: ['giftTemplate', 'createdByUser'],
        });
        if (!giftTemplateChanged) {
            throw new common_1.NotFoundException('Gift template changed not found');
        }
        return giftTemplateChanged;
    }
    async findByUserId(userId) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            return [];
        }
        return await this.repository.find({
            where: { createdByUserId: userId },
            relations: ['giftTemplate', 'createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByGiftTemplateId(giftTemplateId) {
        if (!giftTemplateId || typeof giftTemplateId !== 'number' || giftTemplateId <= 0) {
            return [];
        }
        return await this.repository.find({
            where: { giftTemplateId },
            relations: ['giftTemplate', 'createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findPublicChanged() {
        return await this.repository.find({
            where: { isPublic: true },
            relations: ['giftTemplate', 'createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateData) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid gift template changed ID');
        }
        const existingTemplate = await this.findById(id);
        await this.repository.update(id, {
            ...updateData,
            updatedAt: new Date(),
        });
        return await this.findById(id);
    }
    async remove(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid gift template changed ID');
        }
        const template = await this.findById(id);
        await this.repository.remove(template);
    }
    async countByUserId(userId) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            return 0;
        }
        return await this.repository.count({
            where: { createdByUserId: userId },
        });
    }
    async countByGiftTemplateId(giftTemplateId) {
        if (!giftTemplateId || typeof giftTemplateId !== 'number' || giftTemplateId <= 0) {
            return 0;
        }
        return await this.repository.count({
            where: { giftTemplateId },
        });
    }
};
exports.GiftTemplatesChangedRepository = GiftTemplatesChangedRepository;
exports.GiftTemplatesChangedRepository = GiftTemplatesChangedRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gift_template_changed_entity_1.GiftTemplateChanged)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GiftTemplatesChangedRepository);
//# sourceMappingURL=gift-templates-changed.repository.js.map