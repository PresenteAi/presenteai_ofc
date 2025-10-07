import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventPaginationDto } from './dto/event-pagination.dto';
import { PaginatedEventsDto } from './dto/paginated-events.dto';
import { EventOutputDto } from './dto/event-output.dto';
export declare class EventsController {
    private readonly service;
    constructor(service: EventsService);
    create(dto: CreateEventDto, userId: number): Promise<EventOutputDto>;
    findAll(paginationDto: EventPaginationDto, userId: number): Promise<PaginatedEventsDto>;
    findById(id: number, userId: number): Promise<EventOutputDto>;
    findByPublicUrl(publicUrl: string): Promise<EventOutputDto | null>;
    update(id: number, updateDto: UpdateEventDto, userId: number): Promise<EventOutputDto>;
    remove(id: number, userId: number): Promise<void>;
    togglePublish(id: number, isPublished: boolean, userId: number): Promise<EventOutputDto>;
    countActiveEvents(): Promise<{
        count: number;
    }>;
    findUpcomingEvents(days?: number): Promise<EventOutputDto[]>;
    test(): Promise<any>;
}
