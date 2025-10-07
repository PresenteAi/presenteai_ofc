import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, ILike, FindManyOptions, Between } from 'typeorm';
import { Event, EventType } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventPaginationDto } from './dto/event-pagination.dto';

@Injectable()
export class EventsRepository {
    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,
    ) { }

    /**
     * Cria um novo evento após verificar se a URL pública não existe
     */
    async create(eventData: Partial<Event>): Promise<Event> {
        try {
            // Verificar se a URL pública já existe
            const existingEvent = await this.repository.findOne({ 
                where: { publicUrl: eventData.publicUrl } 
            });

            if (existingEvent) {
                throw new ConflictException('Public URL already exists');
            }

            const entity = this.repository.create(eventData);
            return await this.repository.save(entity);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Failed to create event');
        }
    }

    /**
     * Busca todos os eventos com paginação e filtros
     */
    async findAll(paginationDto: EventPaginationDto): Promise<{ events: Event[]; total: number }> {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'DESC', 
            search,
            eventType,
            userId,
            isPublished,
            isActive = true
        } = paginationDto;
        
        // Validação de parâmetros
        const validSortFields = ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        
        const where: any = { isActive };
        
        // Filtros
        if (search) {
            where.title = ILike(`%${search}%`);
        }

        if (eventType && Object.values(EventType).includes(eventType)) {
            where.eventType = eventType;
        }

        if (userId) {
            where.userId = userId;
        }

        if (isPublished !== undefined) {
            where.isPublished = isPublished;
        }

        const findOptions: FindManyOptions<Event> = {
            where,
            order: { [sortField]: order },
            skip: (page - 1) * limit,
            take: Math.min(limit, 100), // Limita a 100 itens por página
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

    /**
     * Busca evento por ID (apenas ativos)
     */
    async findById(id: number): Promise<Event> {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new BadRequestException('Invalid event ID');
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
            throw new NotFoundException(`Event with id ${id} not found`);
        }
        return event;
    }

    /**
     * Busca evento por URL pública
     */
    async findByPublicUrl(publicUrl: string): Promise<Event | null> {
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

    /**
     * Busca eventos por usuário
     */
    async findByUserId(userId: number): Promise<Event[]> {
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

    /**
     * Atualiza um evento
     */
    async update(id: number, updateData: Partial<Event>): Promise<Event> {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new BadRequestException('Invalid event ID');
        }

        // Verificar se o evento existe
        const existingEvent = await this.findById(id);
        
        // Se está atualizando URL pública, verificar se não existe outro evento com esta URL
        if (updateData.publicUrl && updateData.publicUrl !== existingEvent.publicUrl) {
            const urlExists = await this.repository.findOne({
                where: { publicUrl: updateData.publicUrl.toLowerCase().trim() }
            });
            
            if (urlExists && urlExists.id !== id) {
                throw new ConflictException('Public URL already exists');
            }

            updateData.publicUrl = updateData.publicUrl.toLowerCase().trim();
        }

        // Atualizar updatedAt
        updateData.updatedAt = new Date();

        try {
            await this.repository.update(id, updateData);
            return await this.findById(id);
        } catch (error) {
            throw new BadRequestException('Failed to update event');
        }
    }

    /**
     * Soft delete - desativa o evento ao invés de deletar
     */
    async softDelete(id: number): Promise<void> {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new BadRequestException('Invalid event ID');
        }

        const event = await this.findById(id);
        
        await this.repository.update(id, { 
            isActive: false,
            updatedAt: new Date()
        });
    }

    /**
     * Publica/despublica um evento
     */
    async togglePublish(id: number, isPublished: boolean): Promise<Event> {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new BadRequestException('Invalid event ID');
        }

        const event = await this.findById(id);
        
        await this.repository.update(id, {
            isPublished,
            updatedAt: new Date()
        });

        return await this.findById(id);
    }

    /**
     * Conta eventos ativos
     */
    async countActiveEvents(): Promise<number> {
        return await this.repository.count({ where: { isActive: true } });
    }

    /**
     * Conta eventos por usuário
     */
    async countByUserId(userId: number): Promise<number> {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            return 0;
        }

        return await this.repository.count({
            where: { userId, isActive: true }
        });
    }

    /**
     * Verifica se um evento existe pelo ID
     */
    async exists(id: number): Promise<boolean> {
        if (!id || typeof id !== 'number' || id <= 0) {
            return false;
        }

        const count = await this.repository.count({ 
            where: { id, isActive: true } 
        });
        return count > 0;
    }

    /**
     * Busca eventos próximos do vencimento (para notificações)
     */
    async findUpcomingEvents(days: number = 7): Promise<Event[]> {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        return await this.repository.find({
            where: {
                endDate: Between(today, futureDate),
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
}
