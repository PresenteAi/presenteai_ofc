import { User } from '../../users/users/entities/user.entity';
export declare enum EventType {
    WEDDING = "wedding",
    BABY_SHOWER = "baby_shower",
    HOUSEWARMING = "housewarming",
    BIRTHDAY = "birthday",
    GRADUATION = "graduation",
    OTHER = "other"
}
export declare class GiftTemplate {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    defaultValue: number;
    eventType: EventType;
    isPublic: boolean;
    createdByUserId: number;
    createdByUser: User;
    createdAt: Date;
    updatedAt: Date;
}
