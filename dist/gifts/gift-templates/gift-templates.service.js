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
exports.GiftTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const gift_templates_repository_1 = require("./gift-templates.repository");
const gift_template_entity_1 = require("../entities/gift-template.entity");
let GiftTemplatesService = class GiftTemplatesService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto, userId) {
        this.validateCreateDto(dto);
        const giftTemplate = await this.repository.create(dto, userId);
        return this.mapToOutputDto(giftTemplate);
    }
    async findAll(paginationDto) {
        const sanitizedDto = this.sanitizePaginationDto(paginationDto);
        const result = await this.repository.findAll(sanitizedDto);
        return {
            ...result,
            data: result.data.map(template => this.mapToOutputDto(template)),
        };
    }
    async findById(id) {
        const giftTemplate = await this.repository.findById(id);
        return this.mapToOutputDto(giftTemplate);
    }
    async findByUserId(userId) {
        const templates = await this.repository.findByUserId(userId);
        return templates.map(template => this.mapToOutputDto(template));
    }
    async update(id, dto, userId) {
        const existingTemplate = await this.repository.findById(id);
        if (existingTemplate.createdByUserId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own gift templates');
        }
        this.validateUpdateDto(dto);
        const updatedTemplate = await this.repository.update(id, dto);
        return this.mapToOutputDto(updatedTemplate);
    }
    async remove(id, userId) {
        const existingTemplate = await this.repository.findById(id);
        if (existingTemplate.createdByUserId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own gift templates');
        }
        await this.repository.remove(id);
    }
    async findPublicTemplates() {
        const templates = await this.repository.findPublicTemplates();
        return templates.map(template => this.mapToOutputDto(template));
    }
    async findByCategory(category) {
        if (!category || typeof category !== 'string' || category.trim().length === 0) {
            throw new common_1.BadRequestException('Category is required');
        }
        const templates = await this.repository.findByCategory(category.trim());
        return templates.map(template => this.mapToOutputDto(template));
    }
    async findByEventType(eventType) {
        if (!eventType || !Object.values(gift_template_entity_1.EventType).includes(eventType)) {
            throw new common_1.BadRequestException('Valid event type is required');
        }
        const templates = await this.repository.findByEventType(eventType);
        return templates.map(template => this.mapToOutputDto(template));
    }
    async getUserTemplatesCount(userId) {
        return await this.repository.countByUserId(userId);
    }
    validateCreateDto(dto) {
        const errors = [];
        if (!dto.title || typeof dto.title !== 'string' || dto.title.trim().length < 3) {
            errors.push('Title must be at least 3 characters long');
        }
        if (dto.title && dto.title.length > 255) {
            errors.push('Title cannot exceed 255 characters');
        }
        if (dto.description && typeof dto.description !== 'string') {
            errors.push('Description must be a string');
        }
        if (dto.description && dto.description.length > 1000) {
            errors.push('Description cannot exceed 1000 characters');
        }
        if (dto.imageUrl && typeof dto.imageUrl !== 'string') {
            errors.push('Image URL must be a string');
        }
        if (dto.defaultValue && (typeof dto.defaultValue !== 'number' || dto.defaultValue < 0)) {
            errors.push('Default value must be a positive number');
        }
        if (dto.eventType && !Object.values(gift_template_entity_1.EventType).includes(dto.eventType)) {
            errors.push('Invalid event type');
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join('; '));
        }
    }
    validateUpdateDto(dto) {
        const errors = [];
        if (dto.title !== undefined) {
            if (!dto.title || typeof dto.title !== 'string' || dto.title.trim().length < 3) {
                errors.push('Title must be at least 3 characters long');
            }
            if (dto.title.length > 255) {
                errors.push('Title cannot exceed 255 characters');
            }
        }
        if (dto.description !== undefined && dto.description !== null) {
            if (typeof dto.description !== 'string') {
                errors.push('Description must be a string');
            }
            if (dto.description.length > 1000) {
                errors.push('Description cannot exceed 1000 characters');
            }
        }
        if (dto.defaultValue !== undefined && dto.defaultValue !== null) {
            if (typeof dto.defaultValue !== 'number' || dto.defaultValue < 0) {
                errors.push('Default value must be a positive number');
            }
        }
        if (dto.eventType !== undefined && dto.eventType !== null) {
            if (!Object.values(gift_template_entity_1.EventType).includes(dto.eventType)) {
                errors.push('Invalid event type');
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join('; '));
        }
    }
    sanitizePaginationDto(dto) {
        return {
            page: Math.max(1, dto.page || 1),
            limit: Math.min(100, Math.max(1, dto.limit || 10)),
            sortBy: ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt'].includes(dto.sortBy || '')
                ? dto.sortBy : 'createdAt',
            sortOrder: dto.sortOrder === 'ASC' ? 'ASC' : 'DESC',
            search: dto.search ? dto.search.trim() : undefined,
            category: dto.category ? dto.category.trim() : undefined,
            eventType: dto.eventType && Object.values(gift_template_entity_1.EventType).includes(dto.eventType)
                ? dto.eventType : undefined,
            isPublic: dto.isPublic,
            createdByUserId: dto.createdByUserId ? dto.createdByUserId : undefined,
        };
    }
    mapToOutputDto(giftTemplate) {
        return {
            id: giftTemplate.id,
            title: giftTemplate.title,
            description: giftTemplate.description,
            imageUrl: giftTemplate.imageUrl,
            category: giftTemplate.category,
            defaultValue: giftTemplate.defaultValue ? parseFloat(giftTemplate.defaultValue) : undefined,
            eventType: giftTemplate.eventType,
            isPublic: giftTemplate.isPublic,
            createdByUserId: giftTemplate.createdByUserId,
            createdAt: giftTemplate.createdAt,
            updatedAt: giftTemplate.updatedAt,
            createdByUser: giftTemplate.createdByUser ? {
                id: giftTemplate.createdByUser.id,
                name: giftTemplate.createdByUser.name,
                email: giftTemplate.createdByUser.email,
            } : undefined,
        };
    }
};
exports.GiftTemplatesService = GiftTemplatesService;
exports.GiftTemplatesService = GiftTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gift_templates_repository_1.GiftTemplatesRepository])
], GiftTemplatesService);
//# sourceMappingURL=gift-templates.service.js.map