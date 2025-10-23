import { PaymentMethod } from '../entities/contribution.entity';
export declare class CreateContributionDto {
    eventGiftId: number;
    userId?: number;
    contributorName: string;
    contributorEmail?: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    message?: string;
}
