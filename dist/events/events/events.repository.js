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
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, eventType, userId, isPublished, isActive } = paginationDto;
        const validSortFields = ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        const where = {};
        if (isActive !== undefined && isActive !== null) {
            let activeValue;
            if (typeof isActive === 'string') {
                activeValue = isActive.toLowerCase() === 'true';
            }
            else {
                activeValue = Boolean(isActive);
            }
            console.log('isActive conversion:', {
                original: isActive,
                originalType: typeof isActive,
                converted: activeValue,
                convertedType: typeof activeValue
            });
            where.isActive = activeValue;
        }
        console.log('Repository - Initial params with types:');
        console.log('- page:', page, typeof page);
        console.log('- limit:', limit, typeof limit);
        console.log('- sortBy:', sortBy, typeof sortBy);
        console.log('- sortOrder:', sortOrder, typeof sortOrder);
        console.log('- search:', search, typeof search);
        console.log('- eventType:', eventType, typeof eventType);
        console.log('- userId:', userId, typeof userId);
        console.log('- isPublished:', isPublished, typeof isPublished);
        console.log('- isActive:', isActive, typeof isActive);
        if (search) {
            where.title = (0, typeorm_1.ILike)(`%${search}%`);
        }
        if (eventType && Object.values(event_entity_1.EventType).includes(eventType)) {
            where.eventType = eventType;
        }
        if (userId) {
            where.userId = userId;
        }
        if (isPublished !== undefined && isPublished !== null) {
            let publishedValue;
            if (typeof isPublished === 'string') {
                publishedValue = isPublished.toLowerCase() === 'true';
            }
            else {
                publishedValue = Boolean(isPublished);
            }
            console.log('isPublished conversion:', {
                original: isPublished,
                originalType: typeof isPublished,
                converted: publishedValue,
                convertedType: typeof publishedValue
            });
            where.isPublished = publishedValue;
        }
        console.log('Repository - Final WHERE clause:', JSON.stringify(where, null, 2));
        const debugEvent = await this.repository.findOne({ where: { id: 1 } });
        console.log('Debug - Event ID 1 exists in DB:', !!debugEvent);
        if (debugEvent) {
            console.log('Debug - Event ID 1 data:', {
                id: debugEvent.id,
                userId: debugEvent.userId,
                isPublished: debugEvent.isPublished,
                isActive: debugEvent.isActive,
                title: debugEvent.title
            });
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
        console.log('Repository - Final findOptions:', JSON.stringify(findOptions, null, 2));
        const [events, total] = await this.repository.findAndCount(findOptions);
        console.log('Repository - SQL Result:');
        console.log('- Events found:', events.length);
        console.log('- Total count:', total);
        console.log('- Sample events (first 3):');
        events.slice(0, 3).forEach((event, index) => {
            console.log(`  Event ${index + 1}:`, {
                id: event.id,
                title: event.title,
                userId: event.userId,
                isPublished: event.isPublished,
                isActive: event.isActive
            });
        });
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
            isPublished: false,
            updatedAt: new Date()
        });
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
};
exports.EventsRepository = EventsRepository;
exports.EventsRepository = EventsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], EventsRepository);
//# sourceMappingURL=events.repository.js.map