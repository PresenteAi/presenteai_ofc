import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventPaginationDto } from './dto/event-pagination.dto';
import { PaginatedEventsDto } from './dto/paginated-events.dto';
import { EventOutputDto } from './dto/event-output.dto';
export declare class EventsController {
    private readonly service;
    constructor(service: EventsService);
    create(dto: CreateEventDto, userId: string): Promise<EventOutputDto>;
    findAll(paginationDto: EventPaginationDto, userId: string): Promise<PaginatedEventsDto>;
    findById(id: string, userId: string): Promise<EventOutputDto>;
    findByPublicUrl(publicUrl: string): Promise<EventOutputDto | null>;
    update(id: string, updateDto: UpdateEventDto, userId: string): Promise<EventOutputDto>;
    remove(id: string, userId: string): Promise<void>;
    togglePublish(id: string, body: {
        isPublished: boolean;
    }, userId: string): Promise<EventOutputDto>;
    countActiveEvents(): Promise<{
        count: number;
    }>;
    findUpcomingEvents(days?: number): Promise<EventOutputDto[]>;
}
