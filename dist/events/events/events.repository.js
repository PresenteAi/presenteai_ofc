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
exports.EventsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
const typeorm_2 = require("@nestjs/typeorm");
let EventsRepository = class EventsRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(eventData) {
        try {
            const existingEvent = await this.repository.findOne({
                where: { publicUrl: eventData.publicUrl }
            });
            if (existingEvent) {
                throw new common_1.ConflictException('Public URL already exists');
            }
            const entity = this.repository.create(eventData);
            return await this.repository.save(entity);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create event');
        }
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, eventType, userId, isPublished, isActive = true } = paginationDto;
        const validSortFields = ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        const where = { isActive };
        if (search) {
            where.title = (0, typeorm_1.ILike)(`%${search}%`);
        }
        if (eventType && Object.values(event_entity_1.EventType).includes(eventType)) {
            where.eventType = eventType;
        }
        if (userId) {
            where.userId = userId;
        }
        if (isPublished !== undefined) {
            where.isPublished = isPublished;
        }
        const findOptions = {
            where,
            order: { [sortField]: order },
            skip: (page - 1) * limit,
            take: Math.min(limit, 100),
            relations: ['user'],
            select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                eventType: true,
                coverImageUrl: true,
                primaryColor: true,
                secondaryColor: true,
                tertiaryColor: true,
                fontFamily: true,
                startDate: true,
                endDate: true,
                publicUrl: true,
                isPublished: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        };
        const [events, total] = await this.repository.findAndCount(findOptions);
        return { events, total };
    }
    async findById(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid event ID');
        }
        const event = await this.repository.findOne({
            where: { id, isActive: true },
            relations: ['user'],
            select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                eventType: true,
                coverImageUrl: true,
                primaryColor: true,
                secondaryColor: true,
                tertiaryColor: true,
                fontFamily: true,
                startDate: true,
                endDate: true,
                publicUrl: true,
                isPublished: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event with id ${id} not found`);
        }
        return event;
    }
    async findByPublicUrl(publicUrl) {
        if (!publicUrl || typeof publicUrl !== 'string') {
            return null;
        }
        return await this.repository.findOne({
            where: { publicUrl: publicUrl.toLowerCase().trim(), isActive: true, isPublished: true },
            relations: ['user'],
            select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                eventType: true,
                coverImageUrl: true,
                primaryColor: true,
                secondaryColor: true,
                tertiaryColor: true,
                fontFamily: true,
                startDate: true,
                endDate: true,
                publicUrl: true,
                isPublished: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        });
    }
    async findByUserId(userId) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            return [];
        }
        return await this.repository.find({
            where: { userId, isActive: true },
            order: { createdAt: 'DESC' },
            relations: ['user'],
            select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                eventType: true,
                coverImageUrl: true,
                primaryColor: true,
                secondaryColor: true,
                tertiaryColor: true,
                fontFamily: true,
                startDate: true,
                endDate: true,
                publicUrl: true,
                isPublished: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        });
    }
    async update(id, updateData) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid event ID');
        }
        const existingEvent = await this.findById(id);
        if (updateData.publicUrl && updateData.publicUrl !== existingEvent.publicUrl) {
            const urlExists = await this.repository.findOne({
                where: { publicUrl: updateData.publicUrl.toLowerCase().trim() }
            });
            if (urlExists && urlExists.id !== id) {
                throw new common_1.ConflictException('Public URL already exists');
            }
            updateData.publicUrl = updateData.publicUrl.toLowerCase().trim();
        }
        updateData.updatedAt = new Date();
        try {
            await this.repository.update(id, updateData);
            return await this.findById(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update event');
        }
    }
    async softDelete(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid event ID');
        }
        const event = await this.findById(id);
        await this.repository.update(id, {
            isActive: false,
            updatedAt: new Date()
        });
    }
    async togglePublish(id, isPublished) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid event ID');
        }
        const event = await this.findById(id);
        await this.repository.update(id, {
            isPublished,
            updatedAt: new Date()
        });
        return await this.findById(id);
    }
    async countActiveEvents() {
        return await this.repository.count({ where: { isActive: true } });
    }
    async countByUserId(userId) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            return 0;
        }
        return await this.repository.count({
            where: { userId, isActive: true }
        });
    }
    async exists(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            return false;
        }
        const count = await this.repository.count({
            where: { id, isActive: true }
        });
        return count > 0;
    }
    async findUpcomingEvents(days = 7) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        return await this.repository.find({
            where: {
                endDate: (0, typeorm_1.Between)(today, futureDate),
                isActive: true,
                isPublished: true
            },
            relations: ['user'],
            select: {
                id: true,
                title: true,
                endDate: true,
                publicUrl: true,
                user: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        });
    }
};
exports.EventsRepository = EventsRepository;
exports.EventsRepository = EventsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], EventsRepository);
//# sourceMappingURL=events.repository.js.map