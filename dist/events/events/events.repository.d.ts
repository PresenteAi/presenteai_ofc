import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventPaginationDto } from './dto/event-pagination.dto';
export declare class EventsRepository {
    private readonly repository;
    constructor(repository: Repository<Event>);
    create(eventData: Partial<Event>): Promise<Event>;
    findAll(paginationDto: EventPaginationDto): Promise<{
        events: Event[];
        total: number;
    }>;
    findById(id: string): Promise<Event>;
    findByPublicUrl(publicUrl: string): Promise<Event | null>;
    findByUserId(userId: string): Promise<Event[]>;
    update(id: string, updateData: Partial<Event>): Promise<Event>;
    softDelete(id: string): Promise<void>;
    togglePublish(id: string, isPublished: boolean): Promise<Event>;
    countActiveEvents(): Promise<number>;
    countByUserId(userId: string): Promise<number>;
    exists(id: string): Promise<boolean>;
    findUpcomingEvents(days?: number): Promise<Event[]>;
}
