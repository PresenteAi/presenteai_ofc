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
    findById(id: number): Promise<Event>;
    findByPublicUrl(publicUrl: string): Promise<Event | null>;
    findByUserId(userId: number): Promise<Event[]>;
    update(id: number, updateData: Partial<Event>): Promise<Event>;
    softDelete(id: number): Promise<void>;
    countByUserId(userId: number): Promise<number>;
    exists(id: number): Promise<boolean>;
}
