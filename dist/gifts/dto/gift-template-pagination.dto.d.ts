import { EventType } from '../entities/gift-template.entity';
export declare class GiftTemplatePaginationDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    category?: string;
    eventType?: EventType;
    createdByUserId?: number;
}
