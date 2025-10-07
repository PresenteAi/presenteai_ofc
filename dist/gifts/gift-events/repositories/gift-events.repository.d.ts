import { Repository } from 'typeorm';
import { GiftEvent } from '../../entities/gift-event.entity';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { UpdateGiftEventDto } from '../dto/update-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';
export declare class GiftEventsRepository {
    private readonly giftEventRepository;
    constructor(giftEventRepository: Repository<GiftEvent>);
    create(createGiftEventDto: CreateGiftEventDto): Promise<GiftEvent>;
    findAll(filters?: GiftEventFiltersDto): Promise<[GiftEvent[], number]>;
    findByEventId(eventId: number): Promise<GiftEvent[]>;
    findOne(id: number): Promise<GiftEvent | null>;
    findOneByEventAndTemplate(eventId: number, giftTemplateId?: number, giftTemplateChangedId?: number): Promise<GiftEvent | null>;
    update(id: number, updateGiftEventDto: UpdateGiftEventDto): Promise<GiftEvent | null>;
    remove(id: number): Promise<void>;
    updateCollectedValue(id: number, collectedValue: number): Promise<GiftEvent | null>;
    markAsCompleted(id: number): Promise<GiftEvent | null>;
    getStatsByEvent(eventId: number): Promise<{
        totalGifts: number;
        completedGifts: number;
        openGifts: number;
        totalValue: number;
        collectedValue: number;
        averageProgress: number;
    }>;
}
