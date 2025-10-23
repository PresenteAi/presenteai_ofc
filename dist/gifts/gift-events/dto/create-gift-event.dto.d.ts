import { GiftEventStatus } from '../../entities/gift-event.entity';
export declare class CreateGiftEventDto {
    eventId: number;
    giftTemplateId?: number;
    giftTemplateChangedId?: number;
    customValue?: number;
    status?: GiftEventStatus;
}
