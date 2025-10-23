import { User } from '../../users/users/entities/user.entity';
import { GiftTemplate } from './gift-template.entity';
export declare class GiftTemplateChanged {
    id: number;
    giftTemplateId: number;
    giftTemplate: GiftTemplate;
    title: string;
    description: string;
    imageUrl: string;
    value: number;
    category: string;
    isPublic: boolean;
    createdByUserId: number;
    createdByUser: User;
    createdAt: Date;
    updatedAt: Date;
}
