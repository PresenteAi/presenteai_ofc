import { PaymentStatus, PaymentMethod } from '../entities/contribution.entity';
export declare class UpdateContributionStatusDto {
    paymentStatus: PaymentStatus;
    transactionId?: string;
    feePlatform?: number;
    feeGateway?: number;
}
export declare class ContributionResponseDto {
    id: number;
    eventGiftId: number;
    userId?: number;
    contributorName: string;
    contributorEmail?: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    transactionId?: string;
    feePlatform?: number;
    feeGateway?: number;
    netAmount?: number;
    message?: string;
    refundedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(contribution: any);
}
