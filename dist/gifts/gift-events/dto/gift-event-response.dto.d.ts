import { GiftEvent } from '../../entities/gift-event.entity';
export declare class GiftEventResponseDto {
    id: number;
    eventId: number;
    eventTitle: string;
    giftTemplateId?: number;
    giftTemplateChangedId?: number;
    title: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    effectiveValue: number;
    customValue?: number;
    collectedValue: number;
    remainingValue: number;
    progressPercentage: number;
    status: string;
    canReceiveContributions: boolean;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(giftEvent: GiftEvent);
}
export declare class PaginatedGiftEventResponseDto {
    data: GiftEventResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
