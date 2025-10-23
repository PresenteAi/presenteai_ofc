import { PaymentStatus, PaymentMethod } from '../entities/contribution.entity';
export declare class ContributionFiltersDto {
    eventGiftId?: number;
    userId?: number;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}
