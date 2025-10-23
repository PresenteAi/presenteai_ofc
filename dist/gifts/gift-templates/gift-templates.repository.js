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
exports.GiftTemplatesRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gift_template_entity_1 = require("../entities/gift-template.entity");
let GiftTemplatesRepository = class GiftTemplatesRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto, createdByUserId) {
        const giftTemplate = this.repository.create({
            ...dto,
            createdByUserId,
        });
        return await this.repository.save(giftTemplate);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, category, eventType, createdByUserId, } = paginationDto;
        const queryBuilder = this.repository.createQueryBuilder('giftTemplate')
            .leftJoinAndSelect('giftTemplate.createdByUser', 'user');
        queryBuilder.andWhere('giftTemplate.isPublic = :isPublic', { isPublic: true });
        if (search) {
            queryBuilder.andWhere('(giftTemplate.title LIKE :search OR giftTemplate.description LIKE :search)', { search: `%${search}%` });
        }
        if (category) {
            queryBuilder.andWhere('giftTemplate.category = :category', { category });
        }
        if (eventType) {
            queryBuilder.andWhere('giftTemplate.eventType = :eventType', { eventType });
        }
        if (createdByUserId) {
            queryBuilder.andWhere('giftTemplate.createdByUserId = :createdByUserId', { createdByUserId });
        }
        const validSortFields = ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`giftTemplate.${sortField}`, sortOrder);
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            data: items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasPrevious: page > 1,
            hasNext: page < Math.ceil(total / limit),
        };
    }
    async findById(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid gift template ID');
        }
        const giftTemplate = await this.repository.findOne({
            where: { id },
            relations: ['createdByUser'],
        });
        if (!giftTemplate) {
            throw new common_1.NotFoundException('Gift template not found');
        }
        return giftTemplate;
    }
    async findByUserId(userId) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            return [];
        }
        return await this.repository.find({
            where: { createdByUserId: userId },
            relations: ['createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateData) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid gift template ID');
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
            throw new common_1.BadRequestException('Invalid gift template ID');
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
    async findPublicTemplates() {
        return await this.repository.find({
            where: { isPublic: true },
            relations: ['createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByCategory(category) {
        if (!category) {
            return [];
        }
        return await this.repository.find({
            where: {
                category,
                isPublic: true
            },
            relations: ['createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByEventType(eventType) {
        return await this.repository.find({
            where: {
                eventType,
                isPublic: true
            },
            relations: ['createdByUser'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.GiftTemplatesRepository = GiftTemplatesRepository;
exports.GiftTemplatesRepository = GiftTemplatesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gift_template_entity_1.GiftTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GiftTemplatesRepository);
//# sourceMappingURL=gift-templates.repository.js.map