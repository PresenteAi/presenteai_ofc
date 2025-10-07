import { EventOutputDto } from './event-output.dto';
export declare class PaginatedEventsDto {
    data: EventOutputDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
