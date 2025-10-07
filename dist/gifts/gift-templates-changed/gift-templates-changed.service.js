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
exports.GiftTemplatesChangedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gift_template_entity_1 = require("../entities/gift-template.entity");
const gift_templates_changed_repository_1 = require("./gift-templates-changed.repository");
let GiftTemplatesChangedService = class GiftTemplatesChangedService {
    giftTemplatesChangedRepository;
    giftTemplateRepository;
    constructor(giftTemplatesChangedRepository, giftTemplateRepository) {
        this.giftTemplatesChangedRepository = giftTemplatesChangedRepository;
        this.giftTemplateRepository = giftTemplateRepository;
    }
    async create(createGiftTemplateChangedDto, userId) {
        const giftTemplate = await this.giftTemplateRepository.findOne({
            where: { id: createGiftTemplateChangedDto.giftTemplateId },
        });
        if (!giftTemplate) {
            throw new common_1.NotFoundException(`Gift template with ID ${createGiftTemplateChangedDto.giftTemplateId} not found`);
        }
        if (!giftTemplate.isPublic && giftTemplate.createdByUserId !== userId) {
            throw new common_1.ForbiddenException('You can only customize public templates or your own templates');
        }
        return this.giftTemplatesChangedRepository.create(createGiftTemplateChangedDto, userId);
    }
    async findAll() {
        return this.giftTemplatesChangedRepository.findAll();
    }
    async findById(id, userId) {
        const giftTemplateChanged = await this.giftTemplatesChangedRepository.findById(id);
        if (!giftTemplateChanged.isPublic && giftTemplateChanged.createdByUserId !== userId) {
            throw new common_1.ForbiddenException('You can only view public customizations or your own');
        }
        return giftTemplateChanged;
    }
    async findByUserId(userId) {
        return this.giftTemplatesChangedRepository.findByUserId(userId);
    }
    async findByGiftTemplateId(giftTemplateId) {
        return this.giftTemplatesChangedRepository.findByGiftTemplateId(giftTemplateId);
    }
    async findPublicChanged() {
        return this.giftTemplatesChangedRepository.findPublicChanged();
    }
    async update(id, updateGiftTemplateChangedDto, userId) {
        const giftTemplateChanged = await this.giftTemplatesChangedRepository.findById(id);
        if (!giftTemplateChanged) {
            throw new common_1.NotFoundException(`Gift template changed with ID ${id} not found`);
        }
        if (giftTemplateChanged.createdByUserId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own customizations');
        }
        if (updateGiftTemplateChangedDto.giftTemplateId) {
            const newGiftTemplate = await this.giftTemplateRepository.findOne({
                where: { id: updateGiftTemplateChangedDto.giftTemplateId },
            });
            if (!newGiftTemplate) {
                throw new common_1.NotFoundException(`Gift template with ID ${updateGiftTemplateChangedDto.giftTemplateId} not found`);
            }
            if (!newGiftTemplate.isPublic && newGiftTemplate.createdByUserId !== userId) {
                throw new common_1.ForbiddenException('You can only reference public templates or your own templates');
            }
        }
        return this.giftTemplatesChangedRepository.update(id, updateGiftTemplateChangedDto);
    }
    async remove(id, userId) {
        const giftTemplateChanged = await this.giftTemplatesChangedRepository.findById(id);
        if (!giftTemplateChanged) {
            throw new common_1.NotFoundException(`Gift template changed with ID ${id} not found`);
        }
        if (giftTemplateChanged.createdByUserId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own customizations');
        }
        await this.giftTemplatesChangedRepository.remove(id);
    }
    async countByUserId(userId) {
        return this.giftTemplatesChangedRepository.countByUserId(userId);
    }
    async countByGiftTemplateId(giftTemplateId) {
        return this.giftTemplatesChangedRepository.countByGiftTemplateId(giftTemplateId);
    }
    async getCombinedData(id, userId) {
        const giftTemplateChanged = await this.findById(id, userId);
        return {
            id: giftTemplateChanged.id,
            giftTemplateId: giftTemplateChanged.giftTemplateId,
            baseTemplate: giftTemplateChanged.giftTemplate,
            title: giftTemplateChanged.title || giftTemplateChanged.giftTemplate.title,
            description: giftTemplateChanged.description || giftTemplateChanged.giftTemplate.description,
            imageUrl: giftTemplateChanged.imageUrl || giftTemplateChanged.giftTemplate.imageUrl,
            value: giftTemplateChanged.value || giftTemplateChanged.giftTemplate.defaultValue,
            category: giftTemplateChanged.category || giftTemplateChanged.giftTemplate.category,
            isPublic: giftTemplateChanged.isPublic,
            createdByUserId: giftTemplateChanged.createdByUserId,
            createdAt: giftTemplateChanged.createdAt,
            updatedAt: giftTemplateChanged.updatedAt,
        };
    }
};
exports.GiftTemplatesChangedService = GiftTemplatesChangedService;
exports.GiftTemplatesChangedService = GiftTemplatesChangedService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(gift_template_entity_1.GiftTemplate)),
    __metadata("design:paramtypes", [gift_templates_changed_repository_1.GiftTemplatesChangedRepository,
        typeorm_2.Repository])
], GiftTemplatesChangedService);
//# sourceMappingURL=gift-templates-changed.service.js.map