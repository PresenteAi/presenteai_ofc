import { EventType } from '../entities/event.entity';
export declare class EventPaginationDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    eventType?: EventType;
    userId?: string;
    isPublished?: boolean;
    isActive?: boolean;
}
