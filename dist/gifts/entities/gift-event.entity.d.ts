import { Event } from '../../events/events/entities/event.entity';
import { GiftTemplate } from './gift-template.entity';
import { GiftTemplateChanged } from './gift-template-changed.entity';
export declare enum GiftEventStatus {
    OPEN = "open",
    COMPLETED = "completed"
}
export declare class GiftEvent {
    id: number;
    eventId: number;
    event: Event;
    giftTemplateId: number;
    giftTemplate: GiftTemplate;
    giftTemplateChangedId: number;
    giftTemplateChanged: GiftTemplateChanged;
    customValue: number;
    collectedValue: number;
    status: GiftEventStatus;
    createdAt: Date;
    updatedAt: Date;
    getEffectiveValue(): number | null;
    getEffectiveTitle(): string;
    getEffectiveDescription(): string | null;
    getEffectiveImageUrl(): string | null;
    getEffectiveCategory(): string | null;
    getProgressPercentage(): number;
    getRemainingValue(): number;
    isCompleted(): boolean;
    canReceiveContributions(): boolean;
}
