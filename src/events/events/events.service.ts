import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventPaginationDto } from './dto/event-pagination.dto';
import { PaginatedEventsDto } from './dto/paginated-events.dto';
import { EventOutputDto } from './dto/event-output.dto';
import { EventType } from './entities/event.entity';

@Injectable()
export class EventsService {
    private readonly URL_REGEX = /^[a-z0-9-]+$/;
    private readonly COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    private readonly DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
    private readonly URL_HTTP_REGEX = /^https?:\/\/.+/;

    constructor(private readonly repository: EventsRepository) { }

    /**
     * Cria um novo evento com validações de segurança
     */
    async create(dto: CreateEventDto): Promise<EventOutputDto> {
        // Validações de entrada
        await this.validateCreateEventDto(dto);

        try {
            // Preparar dados do evento
            const eventData = {
                userId: dto.userId.trim(),
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
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Failed to create event');
        }
    }

    /**
     * Busca todos os eventos com paginação
     */
    async findAll(paginationDto: EventPaginationDto): Promise<PaginatedEventsDto> {
        // Sanitizar parâmetros de paginação
        const sanitizedPagination = this.sanitizePaginationDto(paginationDto);
        
        const { events, total } = await this.repository.findAll(sanitizedPagination);
        
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

    /**
     * Busca evento por ID
     */
    async findById(id: string): Promise<EventOutputDto> {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new BadRequestException('Invalid event ID');
        }

        const event = await this.repository.findById(id.trim());
        return this.mapToOutputDto(event);
    }

    /**
     * Busca evento por URL pública
     */
    async findByPublicUrl(publicUrl: string): Promise<EventOutputDto | null> {
        if (!publicUrl || typeof publicUrl !== 'string') {
            return null;
        }

        const event = await this.repository.findByPublicUrl(publicUrl.toLowerCase().trim());
        return event ? this.mapToOutputDto(event) : null;
    }

    /**
     * Busca eventos por usuário
     */
    async findByUserId(userId: string): Promise<EventOutputDto[]>;
    async findByUserId(userId: string, paginationDto: EventPaginationDto): Promise<PaginatedEventsDto>;
    async findByUserId(userId: string, paginationDto?: EventPaginationDto): Promise<EventOutputDto[] | PaginatedEventsDto> {
        if (!userId || typeof userId !== 'string') {
            if (paginationDto) {
                const emptyResult: PaginatedEventsDto = { 
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
            // Use findAll with userId filter for pagination
            paginationDto.userId = userId.trim();
            return this.findAll(paginationDto);
        } else {
            // Original behavior - return all events for user
            const events = await this.repository.findByUserId(userId.trim());
            return events.map(event => this.mapToOutputDto(event));
        }
    }

    /**
     * Atualiza um evento
     */
    async update(id: string, updateDto: UpdateEventDto, userId?: string): Promise<EventOutputDto> {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new BadRequestException('Invalid event ID');
        }

        // Verificar se o evento existe
        const existingEvent = await this.repository.findById(id.trim());

        // Verificar permissão (se userId fornecido, deve ser o dono do evento)
        if (userId && existingEvent.userId !== userId) {
            throw new ForbiddenException('You can only update your own events');
        }

        // Validar dados de atualização
        await this.validateUpdateEventDto(updateDto);

        const updateData: any = {};

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

        const updatedEvent = await this.repository.update(id.trim(), updateData);
        return this.mapToOutputDto(updatedEvent);
    }

    /**
     * Remove evento (soft delete)
     */
    async remove(id: string, userId?: string): Promise<void> {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new BadRequestException('Invalid event ID');
        }

        // Verificar se o evento existe
        const existingEvent = await this.repository.findById(id.trim());

        // Verificar permissão (se userId fornecido, deve ser o dono do evento)
        if (userId && existingEvent.userId !== userId) {
            throw new ForbiddenException('You can only delete your own events');
        }

        await this.repository.softDelete(id.trim());
    }

    /**
     * Publica/despublica um evento
     */
    async togglePublish(id: string, isPublished: boolean, userId?: string): Promise<EventOutputDto> {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new BadRequestException('Invalid event ID');
        }

        // Verificar se o evento existe
        const existingEvent = await this.repository.findById(id.trim());

        // Verificar permissão (se userId fornecido, deve ser o dono do evento)
        if (userId && existingEvent.userId !== userId) {
            throw new ForbiddenException('You can only modify your own events');
        }

        const updatedEvent = await this.repository.togglePublish(id.trim(), isPublished);
        return this.mapToOutputDto(updatedEvent);
    }

    /**
     * Conta eventos ativos
     */
    async countActiveEvents(): Promise<number> {
        return await this.repository.countActiveEvents();
    }

    /**
     * Conta eventos por usuário
     */
    async countByUserId(userId: string): Promise<number> {
        if (!userId || typeof userId !== 'string') {
            return 0;
        }

        return await this.repository.countByUserId(userId.trim());
    }

    /**
     * Busca eventos próximos do vencimento
     */
    async findUpcomingEvents(days: number = 7): Promise<EventOutputDto[]> {
        const events = await this.repository.findUpcomingEvents(days);
        return events.map(event => this.mapToOutputDto(event));
    }

    // ========== MÉTODOS PRIVADOS DE VALIDAÇÃO ==========

    private async validateCreateEventDto(dto: CreateEventDto): Promise<void> {
        const errors: string[] = [];

        // Validar userId
        if (!dto.userId || typeof dto.userId !== 'string' || dto.userId.trim().length === 0) {
            errors.push('User ID is required');
        }

        // Validar title
        if (!dto.title || typeof dto.title !== 'string') {
            errors.push('Title is required');
        } else if (dto.title.trim().length < 3) {
            errors.push('Title must be at least 3 characters long');
        } else if (dto.title.trim().length > 200) {
            errors.push('Title must not exceed 200 characters');
        }

        // Validar description
        if (dto.description !== undefined && dto.description !== null) {
            if (typeof dto.description !== 'string') {
                errors.push('Description must be a string');
            } else if (dto.description.trim().length > 2000) {
                errors.push('Description must not exceed 2000 characters');
            }
        }

        // Validar eventType
        if (!dto.eventType || !Object.values(EventType).includes(dto.eventType)) {
            errors.push('Valid event type is required');
        }

        // Validar coverImageUrl
        if (dto.coverImageUrl !== undefined && dto.coverImageUrl !== null) {
            if (typeof dto.coverImageUrl !== 'string') {
                errors.push('Cover image URL must be a string');
            } else if (dto.coverImageUrl.trim().length > 0 && !this.URL_HTTP_REGEX.test(dto.coverImageUrl.trim())) {
                errors.push('Cover image URL must be a valid HTTP/HTTPS URL');
            }
        }

        // Validar cores
        this.validateColor(dto.primaryColor, 'Primary color', errors);
        this.validateColor(dto.secondaryColor, 'Secondary color', errors);
        this.validateColor(dto.tertiaryColor, 'Tertiary color', errors);

        // Validar fontFamily
        if (dto.fontFamily !== undefined && dto.fontFamily !== null) {
            if (typeof dto.fontFamily !== 'string') {
                errors.push('Font family must be a string');
            } else if (dto.fontFamily.trim().length > 100) {
                errors.push('Font family must not exceed 100 characters');
            }
        }

        // Validar datas
        this.validateDate(dto.startDate, 'Start date', errors);
        this.validateDate(dto.endDate, 'End date', errors);

        // Validar se data de fim é depois da data de início
        if (dto.startDate && dto.endDate) {
            const startDate = new Date(dto.startDate);
            const endDate = new Date(dto.endDate);
            if (endDate <= startDate) {
                errors.push('End date must be after start date');
            }
        }

        // Validar publicUrl
        if (!dto.publicUrl || typeof dto.publicUrl !== 'string') {
            errors.push('Public URL is required');
        } else if (dto.publicUrl.trim().length < 3) {
            errors.push('Public URL must be at least 3 characters long');
        } else if (dto.publicUrl.trim().length > 100) {
            errors.push('Public URL must not exceed 100 characters');
        } else if (!this.URL_REGEX.test(dto.publicUrl.trim().toLowerCase())) {
            errors.push('Public URL must contain only lowercase letters, numbers, and hyphens');
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors.join(', '));
        }
    }

    private async validateUpdateEventDto(dto: UpdateEventDto): Promise<void> {
        const errors: string[] = [];

        // Validações similares ao create, mas todos os campos são opcionais
        if (dto.title !== undefined) {
            if (typeof dto.title !== 'string') {
                errors.push('Title must be a string');
            } else if (dto.title.trim().length < 3) {
                errors.push('Title must be at least 3 characters long');
            } else if (dto.title.trim().length > 200) {
                errors.push('Title must not exceed 200 characters');
            }
        }

        if (dto.description !== undefined && dto.description !== null) {
            if (typeof dto.description !== 'string') {
                errors.push('Description must be a string');
            } else if (dto.description.trim().length > 2000) {
                errors.push('Description must not exceed 2000 characters');
            }
        }

        if (dto.eventType !== undefined && !Object.values(EventType).includes(dto.eventType)) {
            errors.push('Valid event type is required');
        }

        if (dto.coverImageUrl !== undefined && dto.coverImageUrl !== null) {
            if (typeof dto.coverImageUrl !== 'string') {
                errors.push('Cover image URL must be a string');
            } else if (dto.coverImageUrl.trim().length > 0 && !this.URL_HTTP_REGEX.test(dto.coverImageUrl.trim())) {
                errors.push('Cover image URL must be a valid HTTP/HTTPS URL');
            }
        }

        // Validar cores
        this.validateColor(dto.primaryColor, 'Primary color', errors);
        this.validateColor(dto.secondaryColor, 'Secondary color', errors);
        this.validateColor(dto.tertiaryColor, 'Tertiary color', errors);

        if (dto.fontFamily !== undefined && dto.fontFamily !== null) {
            if (typeof dto.fontFamily !== 'string') {
                errors.push('Font family must be a string');
            } else if (dto.fontFamily.trim().length > 100) {
                errors.push('Font family must not exceed 100 characters');
            }
        }

        // Validar datas
        this.validateDate(dto.startDate, 'Start date', errors);
        this.validateDate(dto.endDate, 'End date', errors);

        if (dto.publicUrl !== undefined) {
            if (typeof dto.publicUrl !== 'string') {
                errors.push('Public URL must be a string');
            } else if (dto.publicUrl.trim().length < 3) {
                errors.push('Public URL must be at least 3 characters long');
            } else if (dto.publicUrl.trim().length > 100) {
                errors.push('Public URL must not exceed 100 characters');
            } else if (!this.URL_REGEX.test(dto.publicUrl.trim().toLowerCase())) {
                errors.push('Public URL must contain only lowercase letters, numbers, and hyphens');
            }
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors.join(', '));
        }
    }

    private validateColor(color: string | undefined, fieldName: string, errors: string[]): void {
        if (color !== undefined && color !== null) {
            if (typeof color !== 'string') {
                errors.push(`${fieldName} must be a string`);
            } else if (color.trim().length > 0 && !this.COLOR_REGEX.test(color.trim())) {
                errors.push(`${fieldName} must be a valid hex color (e.g., #FF6B6B)`);
            }
        }
    }

    private validateDate(date: string | undefined, fieldName: string, errors: string[]): void {
        if (date !== undefined && date !== null) {
            if (typeof date !== 'string') {
                errors.push(`${fieldName} must be a string`);
            } else if (date.trim().length > 0) {
                if (!this.DATE_REGEX.test(date.trim())) {
                    errors.push(`${fieldName} must be in YYYY-MM-DD format`);
                } else {
                    const parsedDate = new Date(date.trim());
                    if (isNaN(parsedDate.getTime())) {
                        errors.push(`${fieldName} must be a valid date`);
                    }
                }
            }
        }
    }

    private sanitizePaginationDto(dto: EventPaginationDto): EventPaginationDto {
        return {
            page: Math.max(1, dto.page || 1),
            limit: Math.min(100, Math.max(1, dto.limit || 10)),
            sortBy: ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'].includes(dto.sortBy || '') ? dto.sortBy : 'createdAt',
            sortOrder: dto.sortOrder === 'ASC' ? 'ASC' : 'DESC',
            search: dto.search ? dto.search.trim() : undefined,
            eventType: dto.eventType && Object.values(EventType).includes(dto.eventType) ? dto.eventType : undefined,
            userId: dto.userId ? dto.userId.trim() : undefined,
            isPublished: dto.isPublished,
            isActive: dto.isActive !== undefined ? dto.isActive : true
        };
    }

    private generateSlug(input: string): string {
        return input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    private mapToOutputDto(event: any): EventOutputDto {
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
            startDate: event.startDate ? event.startDate.toISOString().split('T')[0] : undefined,
            endDate: event.endDate ? event.endDate.toISOString().split('T')[0] : undefined,
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
}
