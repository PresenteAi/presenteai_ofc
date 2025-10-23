import { EventType } from '../entities/gift-template.entity';
export declare class CreateGiftTemplateDto {
    title: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    defaultValue?: number;
    eventType?: EventType;
    isPublic?: boolean;
}
