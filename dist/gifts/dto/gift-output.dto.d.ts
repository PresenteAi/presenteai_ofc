import { EventType } from '../entities/gift-template.entity';
export declare class GiftTemplateOutputDto {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    defaultValue?: number;
    eventType: EventType;
    isPublic: boolean;
    createdByUserId: number;
    createdAt: Date;
    updatedAt: Date;
    createdByUser?: {
        id: number;
        name: string;
        email: string;
    };
}
export declare class GiftTemplateChangedOutputDto {
    id: number;
    giftTemplateId: number;
    title: string;
    description: string;
    imageUrl: string;
    value: number;
    category: string;
    isPublic: boolean;
    createdByUserId: number;
    createdAt: Date;
    updatedAt: Date;
    giftTemplate?: GiftTemplateOutputDto;
    createdByUser?: {
        id: number;
        name: string;
        email: string;
    };
}
export declare class GiftEventOutputDto {
    id: number;
    eventId: number;
    giftTemplateId: number;
    giftTemplateChangedId: number;
    customValue: number;
    collectedValue: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    giftTemplate?: GiftTemplateOutputDto;
    giftTemplateChanged?: GiftTemplateChangedOutputDto;
}
