import { GiftEventStatus } from '../../entities/gift-event.entity';
export declare class UpdateGiftEventDto {
    giftTemplateId?: number;
    giftTemplateChangedId?: number;
    customValue?: number;
    collectedValue?: number;
    status?: GiftEventStatus;
}
