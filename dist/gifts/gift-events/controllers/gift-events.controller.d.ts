import { GiftEventsService } from '../services/gift-events.service';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';
import { GiftEventResponseDto, PaginatedGiftEventResponseDto } from '../dto/gift-event-response.dto';
export declare class GiftEventsController {
    private readonly giftEventsService;
    constructor(giftEventsService: GiftEventsService);
    create(createGiftEventDto: CreateGiftEventDto): Promise<GiftEventResponseDto>;
    findAll(filters: GiftEventFiltersDto): Promise<PaginatedGiftEventResponseDto>;
    findByEventId(eventId: number): Promise<GiftEventResponseDto[]>;
    getEventStats(eventId: number): Promise<{
        totalGifts: number;
        completedGifts: number;
        openGifts: number;
        totalValue: number;
        collectedValue: number;
        averageProgress: number;
    }>;
    findOne(id: number): Promise<GiftEventResponseDto>;
    markAsCompleted(id: number): Promise<GiftEventResponseDto>;
    reopenGift(id: number): Promise<GiftEventResponseDto>;
    remove(id: number): Promise<void>;
}
