import { EventType } from '../entities/event.entity';
export declare class EventOutputDto {
    id: string;
    userId: string;
    title: string;
    description?: string;
    eventType: EventType;
    coverImageUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
    fontFamily?: string;
    startDate?: string;
    endDate?: string;
    publicUrl: string;
    isPublished: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}
