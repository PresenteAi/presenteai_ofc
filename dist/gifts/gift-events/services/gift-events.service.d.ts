import { GiftEventsRepository } from '../repositories/gift-events.repository';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { UpdateGiftEventDto } from '../dto/update-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';
import { GiftEventResponseDto, PaginatedGiftEventResponseDto } from '../dto/gift-event-response.dto';
export declare class GiftEventsService {
    private readonly giftEventsRepository;
    constructor(giftEventsRepository: GiftEventsRepository);
    create(createGiftEventDto: CreateGiftEventDto): Promise<GiftEventResponseDto>;
    findAll(filters?: GiftEventFiltersDto): Promise<PaginatedGiftEventResponseDto>;
    findByEventId(eventId: number): Promise<GiftEventResponseDto[]>;
    findOne(id: number): Promise<GiftEventResponseDto>;
    update(id: number, updateGiftEventDto: UpdateGiftEventDto): Promise<GiftEventResponseDto>;
    remove(id: number): Promise<void>;
    updateCollectedValue(id: number, collectedValue: number): Promise<GiftEventResponseDto>;
    addContribution(id: number, contributionAmount: number): Promise<GiftEventResponseDto>;
    markAsCompleted(id: number): Promise<GiftEventResponseDto>;
    reopenGift(id: number): Promise<GiftEventResponseDto>;
    getEventStats(eventId: number): Promise<{
        totalGifts: number;
        completedGifts: number;
        openGifts: number;
        totalValue: number;
        collectedValue: number;
        averageProgress: number;
    }>;
    private checkAndMarkAsCompleted;
}
