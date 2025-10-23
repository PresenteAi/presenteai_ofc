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
exports.GiftEventsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gift_event_entity_1 = require("../../entities/gift-event.entity");
let GiftEventsRepository = class GiftEventsRepository {
    giftEventRepository;
    constructor(giftEventRepository) {
        this.giftEventRepository = giftEventRepository;
    }
    async create(createGiftEventDto) {
        const giftEvent = this.giftEventRepository.create(createGiftEventDto);
        return await this.giftEventRepository.save(giftEvent);
    }
    async findAll(filters) {
        const { eventId, giftTemplateId, giftTemplateChangedId, status, minValue, maxValue, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = filters || {};
        const where = {};
        if (eventId) {
            where.eventId = eventId;
        }
        if (giftTemplateId) {
            where.giftTemplateId = giftTemplateId;
        }
        if (giftTemplateChangedId) {
            where.giftTemplateChangedId = giftTemplateChangedId;
        }
        if (status) {
            where.status = status;
        }
        const queryBuilder = this.giftEventRepository.createQueryBuilder('giftEvent')
            .leftJoinAndSelect('giftEvent.event', 'event')
            .leftJoinAndSelect('giftEvent.giftTemplate', 'giftTemplate')
            .leftJoinAndSelect('giftEvent.giftTemplateChanged', 'giftTemplateChanged')
            .leftJoinAndSelect('giftTemplateChanged.giftTemplate', 'changedGiftTemplate');
        if (eventId) {
            queryBuilder.andWhere('giftEvent.eventId = :eventId', { eventId });
        }
        if (giftTemplateId) {
            queryBuilder.andWhere('giftEvent.giftTemplateId = :giftTemplateId', { giftTemplateId });
        }
        if (giftTemplateChangedId) {
            queryBuilder.andWhere('giftEvent.giftTemplateChangedId = :giftTemplateChangedId', { giftTemplateChangedId });
        }
        if (status) {
            queryBuilder.andWhere('giftEvent.status = :status', { status });
        }
        if (minValue !== undefined || maxValue !== undefined) {
            queryBuilder.andWhere((qb) => {
                let valueCondition = `
          CASE 
            WHEN giftEvent.customValue IS NOT NULL THEN giftEvent.customValue
            WHEN giftTemplateChanged.value IS NOT NULL THEN giftTemplateChanged.value
            WHEN giftTemplate.defaultValue IS NOT NULL THEN giftTemplate.defaultValue
            ELSE 0
          END
        `;
                if (minValue !== undefined && maxValue !== undefined) {
                    return `${valueCondition} BETWEEN :minValue AND :maxValue`;
                }
                else if (minValue !== undefined) {
                    return `${valueCondition} >= :minValue`;
                }
                else if (maxValue !== undefined) {
                    return `${valueCondition} <= :maxValue`;
                }
            });
            if (minValue !== undefined) {
                queryBuilder.setParameter('minValue', minValue);
            }
            if (maxValue !== undefined) {
                queryBuilder.setParameter('maxValue', maxValue);
            }
        }
        const validSortFields = ['id', 'createdAt', 'updatedAt', 'collectedValue'];
        if (validSortFields.includes(sortBy)) {
            queryBuilder.orderBy(`giftEvent.${sortBy}`, sortOrder);
        }
        else if (sortBy === 'title') {
            queryBuilder.orderBy(`
        CASE 
          WHEN giftTemplateChanged.title IS NOT NULL THEN giftTemplateChanged.title
          WHEN changedGiftTemplate.title IS NOT NULL THEN changedGiftTemplate.title
          WHEN giftTemplate.title IS NOT NULL THEN giftTemplate.title
          ELSE 'Untitled Gift'
        END
      `, sortOrder);
        }
        else {
            queryBuilder.orderBy('giftEvent.createdAt', 'DESC');
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        return await queryBuilder.getManyAndCount();
    }
    async findByEventId(eventId) {
        return await this.giftEventRepository.find({
            where: { eventId },
            relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return await this.giftEventRepository.findOne({
            where: { id },
            relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
        });
    }
    async findOneByEventAndTemplate(eventId, giftTemplateId, giftTemplateChangedId) {
        const where = { eventId };
        if (giftTemplateId) {
            where.giftTemplateId = giftTemplateId;
            where.giftTemplateChangedId = null;
        }
        else if (giftTemplateChangedId) {
            where.giftTemplateChangedId = giftTemplateChangedId;
            where.giftTemplateId = null;
        }
        return await this.giftEventRepository.findOne({
            where,
            relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
        });
    }
    async update(id, updateGiftEventDto) {
        await this.giftEventRepository.update(id, updateGiftEventDto);
        return await this.findOne(id);
    }
    async remove(id) {
        await this.giftEventRepository.delete(id);
    }
    async markAsCompleted(id) {
        const giftEvent = await this.findOne(id);
        if (!giftEvent) {
            return null;
        }
        const effectiveValue = giftEvent.getEffectiveValue();
        if (effectiveValue && Number(giftEvent.collectedValue) >= effectiveValue) {
            await this.giftEventRepository.update(id, { status: gift_event_entity_1.GiftEventStatus.COMPLETED });
            return await this.findOne(id);
        }
        return giftEvent;
    }
    async getStatsByEvent(eventId) {
        const gifts = await this.findByEventId(eventId);
        const stats = gifts.reduce((acc, gift) => {
            const effectiveValue = gift.getEffectiveValue() || 0;
            const collected = Number(gift.collectedValue);
            acc.totalValue += effectiveValue;
            acc.collectedValue += collected;
            if (gift.isCompleted()) {
                acc.completedGifts++;
            }
            else {
                acc.openGifts++;
            }
            acc.totalGifts++;
            return acc;
        }, {
            totalGifts: 0,
            completedGifts: 0,
            openGifts: 0,
            totalValue: 0,
            collectedValue: 0,
            averageProgress: 0,
        });
        if (stats.totalValue > 0) {
            stats.averageProgress = Math.round((stats.collectedValue / stats.totalValue) * 100);
        }
        return stats;
    }
};
exports.GiftEventsRepository = GiftEventsRepository;
exports.GiftEventsRepository = GiftEventsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gift_event_entity_1.GiftEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GiftEventsRepository);
//# sourceMappingURL=gift-events.repository.js.map