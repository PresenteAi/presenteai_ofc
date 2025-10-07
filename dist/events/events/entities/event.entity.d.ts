import { User } from '../../../users/users/entities/user.entity';
export declare enum EventType {
    WEDDING = "wedding",
    BABY_SHOWER = "baby_shower",
    HOUSEWARMING = "housewarming",
    BIRTHDAY = "birthday",
    GRADUATION = "graduation",
    ANNIVERSARY = "anniversary",
    OTHER = "other"
}
export declare class Event {
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
    startDate?: Date;
    endDate?: Date;
    publicUrl: string;
    isPublished: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
