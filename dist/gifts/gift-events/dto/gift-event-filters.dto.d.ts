import { GiftEventStatus } from '../../entities/gift-event.entity';
export declare class GiftEventFiltersDto {
    eventId?: number;
    giftTemplateId?: number;
    giftTemplateChangedId?: number;
    status?: GiftEventStatus;
    minValue?: number;
    maxValue?: number;
    page?: number;
    limit?: number;
    sortBy?: 'id' | 'createdAt' | 'updatedAt' | 'collectedValue' | 'title';
    sortOrder?: 'ASC' | 'DESC';
}
