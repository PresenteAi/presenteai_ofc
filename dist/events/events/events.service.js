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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const events_repository_1 = require("./events.repository");
const event_entity_1 = require("./entities/event.entity");
let EventsService = class EventsService {
    repository;
    URL_REGEX = /^[a-z0-9-]+$/;
    COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
    URL_HTTP_REGEX = /^https?:\/\/.+/;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        await this.validateCreateEventDto(dto);
        try {
            const eventData = {
                userId: dto.userId,
                title: dto.title.trim(),
                description: dto.description?.trim() || undefined,
                eventType: dto.eventType,
                coverImageUrl: dto.coverImageUrl?.trim() || undefined,
                primaryColor: dto.primaryColor?.trim() || undefined,
                secondaryColor: dto.secondaryColor?.trim() || undefined,
                tertiaryColor: dto.tertiaryColor?.trim() || undefined,
                fontFamily: dto.fontFamily?.trim() || undefined,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                publicUrl: this.generateSlug(dto.publicUrl.trim()),
                isPublished: dto.isPublished || false,
                isActive: true,
            };
            const event = await this.repository.create(eventData);
            return this.mapToOutputDto(event);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create event');
        }
    }
    async findAll(paginationDto) {
        console.log('=== EVENTS FINDALL DEBUG ===');
        console.log('Original DTO received:', JSON.stringify(paginationDto, null, 2));
        const sanitizedPagination = this.sanitizePaginationDto(paginationDto);
        console.log('Sanitized pagination:', JSON.stringify(sanitizedPagination, null, 2));
        const { events, total } = await this.repository.findAll(sanitizedPagination);
        console.log('Events found:', events.length);
        console.log('Total count:', total);
        const totalPages = Math.ceil(total / (sanitizedPagination.limit || 10));
        const hasNext = (sanitizedPagination.page || 1) < totalPages;
        const hasPrev = (sanitizedPagination.page || 1) > 1;
        return {
            data: events.map(event => this.mapToOutputDto(event)),
            total,
            page: sanitizedPagination.page || 1,
            limit: sanitizedPagination.limit || 10,
            totalPages,
            hasNext,
            hasPrev
        };
    }
    async findById(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid event ID');
        }
        const event = await this.repository.findById(id);
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return this.mapToOutputDto(event);
    }
    async findByPublicUrl(publicUrl) {
        if (!publicUrl || typeof publicUrl !== 'string') {
            return null;
        }
        const event = await this.repository.findByPublicUrl(publicUrl.toLowerCase().trim());
        return event ? this.mapToOutputDto(event) : null;
    }
    async findByUserId(userId, paginationDto) {
        if (!userId || typeof userId !== 'string') {
            if (paginationDto) {
                const emptyResult = {
                    data: [],
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false
                };
                return emptyResult;
            }
            return [];
        }
        if (paginationDto) {
            paginationDto.userId = Number(userId);
            return this.findAll(paginationDto);
        }
        else {
            const events = await this.repository.findByUserId(Number(userId));
            return events.map(event => this.mapToOutputDto(event));
        }
    }
    async update(id, updateDto, userId) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid event ID');
        }
        const existingEvent = await this.repository.findById(id);
        if (userId && existingEvent.userId !== Number(userId)) {
            throw new common_1.ForbiddenException('You can only update your own events');
        }
        await this.validateUpdateEventDto(updateDto);
        const updateData = {};
        if (updateDto.title !== undefined) {
            updateData.title = updateDto.title.trim();
        }
        if (updateDto.description !== undefined) {
            updateData.description = updateDto.description ? updateDto.description.trim() : undefined;
        }
        if (updateDto.eventType !== undefined) {
            updateData.eventType = updateDto.eventType;
        }
        if (updateDto.coverImageUrl !== undefined) {
            updateData.coverImageUrl = updateDto.coverImageUrl ? updateDto.coverImageUrl.trim() : undefined;
        }
        if (updateDto.primaryColor !== undefined) {
            updateData.primaryColor = updateDto.primaryColor ? updateDto.primaryColor.trim() : undefined;
        }
        if (updateDto.secondaryColor !== undefined) {
            updateData.secondaryColor = updateDto.secondaryColor ? updateDto.secondaryColor.trim() : undefined;
        }
        if (updateDto.tertiaryColor !== undefined) {
            updateData.tertiaryColor = updateDto.tertiaryColor ? updateDto.tertiaryColor.trim() : undefined;
        }
        if (updateDto.fontFamily !== undefined) {
            updateData.fontFamily = updateDto.fontFamily ? updateDto.fontFamily.trim() : undefined;
        }
        if (updateDto.startDate !== undefined) {
            updateData.startDate = updateDto.startDate ? new Date(updateDto.startDate) : undefined;
        }
        if (updateDto.endDate !== undefined) {
            updateData.endDate = updateDto.endDate ? new Date(updateDto.endDate) : undefined;
        }
        if (updateDto.publicUrl !== undefined) {
            updateData.publicUrl = this.generateSlug(updateDto.publicUrl.trim());
        }
        if (updateDto.isPublished !== undefined) {
            updateData.isPublished = updateDto.isPublished;
        }
        if (updateDto.isActive !== undefined) {
            updateData.isActive = updateDto.isActive;
        }
        const updatedEvent = await this.repository.update(id, updateData);
        return this.mapToOutputDto(updatedEvent);
    }
    async remove(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new common_1.BadRequestException('Invalid event ID');
        }
        const existingEvent = await this.repository.findById(id);
        await this.repository.softDelete(id);
    }
    async countByUserId(userId) {
        if (!userId || typeof userId !== 'string') {
            return 0;
        }
        return await this.repository.countByUserId(Number(userId));
    }
    async validateCreateEventDto(dto) {
        const errors = [];
        if (!dto.userId || typeof dto.userId !== 'number' || dto.userId <= 0) {
            errors.push('User ID is required');
        }
        if (!dto.title || typeof dto.title !== 'string') {
            errors.push('Title is required');
        }
        else if (dto.title.trim().length < 3) {
            errors.push('Title must be at least 3 characters long');
        }
        else if (dto.title.trim().length > 200) {
            errors.push('Title must not exceed 200 characters');
        }
        if (dto.description !== undefined && dto.description !== null) {
            if (typeof dto.description !== 'string') {
                errors.push('Description must be a string');
            }
            else if (dto.description.trim().length > 2000) {
                errors.push('Description must not exceed 2000 characters');
            }
        }
        if (!dto.eventType || !Object.values(event_entity_1.EventType).includes(dto.eventType)) {
            errors.push('Valid event type is required');
        }
        if (dto.coverImageUrl !== undefined && dto.coverImageUrl !== null) {
            if (typeof dto.coverImageUrl !== 'string') {
                errors.push('Cover image URL must be a string');
            }
            else if (dto.coverImageUrl.trim().length > 0 && !this.URL_HTTP_REGEX.test(dto.coverImageUrl.trim())) {
                errors.push('Cover image URL must be a valid HTTP/HTTPS URL');
            }
        }
        this.validateColor(dto.primaryColor, 'Primary color', errors);
        this.validateColor(dto.secondaryColor, 'Secondary color', errors);
        this.validateColor(dto.tertiaryColor, 'Tertiary color', errors);
        if (dto.fontFamily !== undefined && dto.fontFamily !== null) {
            if (typeof dto.fontFamily !== 'string') {
                errors.push('Font family must be a string');
            }
            else if (dto.fontFamily.trim().length > 100) {
                errors.push('Font family must not exceed 100 characters');
            }
        }
        this.validateDate(dto.startDate, 'Start date', errors);
        this.validateDate(dto.endDate, 'End date', errors);
        if (dto.startDate && dto.endDate) {
            const startDate = new Date(dto.startDate);
            const endDate = new Date(dto.endDate);
            if (endDate <= startDate) {
                errors.push('End date must be after start date');
            }
        }
        if (!dto.publicUrl || typeof dto.publicUrl !== 'string') {
            errors.push('Public URL is required');
        }
        else if (dto.publicUrl.trim().length < 3) {
            errors.push('Public URL must be at least 3 characters long');
        }
        else if (dto.publicUrl.trim().length > 100) {
            errors.push('Public URL must not exceed 100 characters');
        }
        else if (!this.URL_REGEX.test(dto.publicUrl.trim().toLowerCase())) {
            errors.push('Public URL must contain only lowercase letters, numbers, and hyphens');
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join(', '));
        }
    }
    async validateUpdateEventDto(dto) {
        const errors = [];
        if (dto.title !== undefined) {
            if (typeof dto.title !== 'string') {
                errors.push('Title must be a string');
            }
            else if (dto.title.trim().length < 3) {
                errors.push('Title must be at least 3 characters long');
            }
            else if (dto.title.trim().length > 200) {
                errors.push('Title must not exceed 200 characters');
            }
        }
        if (dto.description !== undefined && dto.description !== null) {
            if (typeof dto.description !== 'string') {
                errors.push('Description must be a string');
            }
            else if (dto.description.trim().length > 2000) {
                errors.push('Description must not exceed 2000 characters');
            }
        }
        if (dto.eventType !== undefined && !Object.values(event_entity_1.EventType).includes(dto.eventType)) {
            errors.push('Valid event type is required');
        }
        if (dto.coverImageUrl !== undefined && dto.coverImageUrl !== null) {
            if (typeof dto.coverImageUrl !== 'string') {
                errors.push('Cover image URL must be a string');
            }
            else if (dto.coverImageUrl.trim().length > 0 && !this.URL_HTTP_REGEX.test(dto.coverImageUrl.trim())) {
                errors.push('Cover image URL must be a valid HTTP/HTTPS URL');
            }
        }
        this.validateColor(dto.primaryColor, 'Primary color', errors);
        this.validateColor(dto.secondaryColor, 'Secondary color', errors);
        this.validateColor(dto.tertiaryColor, 'Tertiary color', errors);
        if (dto.fontFamily !== undefined && dto.fontFamily !== null) {
            if (typeof dto.fontFamily !== 'string') {
                errors.push('Font family must be a string');
            }
            else if (dto.fontFamily.trim().length > 100) {
                errors.push('Font family must not exceed 100 characters');
            }
        }
        this.validateDate(dto.startDate, 'Start date', errors);
        this.validateDate(dto.endDate, 'End date', errors);
        if (dto.publicUrl !== undefined) {
            if (typeof dto.publicUrl !== 'string') {
                errors.push('Public URL must be a string');
            }
            else if (dto.publicUrl.trim().length < 3) {
                errors.push('Public URL must be at least 3 characters long');
            }
            else if (dto.publicUrl.trim().length > 100) {
                errors.push('Public URL must not exceed 100 characters');
            }
            else if (!this.URL_REGEX.test(dto.publicUrl.trim().toLowerCase())) {
                errors.push('Public URL must contain only lowercase letters, numbers, and hyphens');
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join(', '));
        }
    }
    validateColor(color, fieldName, errors) {
        if (color !== undefined && color !== null) {
            if (typeof color !== 'string') {
                errors.push(`${fieldName} must be a string`);
            }
            else if (color.trim().length > 0 && !this.COLOR_REGEX.test(color.trim())) {
                errors.push(`${fieldName} must be a valid hex color (e.g., #FF6B6B)`);
            }
        }
    }
    validateDate(date, fieldName, errors) {
        if (date !== undefined && date !== null) {
            if (typeof date !== 'string') {
                errors.push(`${fieldName} must be a string`);
            }
            else if (date.trim().length > 0) {
                if (!this.DATE_REGEX.test(date.trim())) {
                    errors.push(`${fieldName} must be in YYYY-MM-DD format`);
                }
                else {
                    const parsedDate = new Date(date.trim());
                    if (isNaN(parsedDate.getTime())) {
                        errors.push(`${fieldName} must be a valid date`);
                    }
                }
            }
        }
    }
    sanitizePaginationDto(dto) {
        return {
            page: Math.max(1, dto.page || 1),
            limit: Math.min(100, Math.max(1, dto.limit || 10)),
            sortBy: ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'].includes(dto.sortBy || '') ? dto.sortBy : 'createdAt',
            sortOrder: dto.sortOrder === 'ASC' ? 'ASC' : 'DESC',
            search: dto.search ? dto.search.trim() : undefined,
            eventType: dto.eventType && Object.values(event_entity_1.EventType).includes(dto.eventType) ? dto.eventType : undefined,
            userId: dto.userId ? dto.userId : undefined,
            isPublished: dto.isPublished,
            isActive: dto.isActive !== undefined ? dto.isActive : true
        };
    }
    generateSlug(input) {
        return input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    mapToOutputDto(event) {
        const formatDate = (date) => {
            if (!date)
                return undefined;
            if (typeof date === 'string') {
                const dateObj = new Date(date);
                if (isNaN(dateObj.getTime()))
                    return undefined;
                return dateObj.toISOString().split('T')[0];
            }
            if (date instanceof Date) {
                if (isNaN(date.getTime()))
                    return undefined;
                return date.toISOString().split('T')[0];
            }
            try {
                const dateObj = new Date(date);
                if (isNaN(dateObj.getTime()))
                    return undefined;
                return dateObj.toISOString().split('T')[0];
            }
            catch {
                return undefined;
            }
        };
        return {
            id: event.id,
            userId: event.userId,
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            coverImageUrl: event.coverImageUrl,
            primaryColor: event.primaryColor,
            secondaryColor: event.secondaryColor,
            tertiaryColor: event.tertiaryColor,
            fontFamily: event.fontFamily,
            startDate: formatDate(event.startDate),
            endDate: formatDate(event.endDate),
            publicUrl: event.publicUrl,
            isPublished: event.isPublished,
            isActive: event.isActive,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            user: event.user ? {
                id: event.user.id,
                name: event.user.name,
                email: event.user.email
            } : undefined
        };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_repository_1.EventsRepository])
], EventsService);
//# sourceMappingURL=events.service.js.map