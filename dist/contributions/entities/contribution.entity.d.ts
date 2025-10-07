import { GiftEvent } from '../../gifts/entities/gift-event.entity';
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    BOLETO = "boleto",
    PIX = "pix"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    REFUNDED = "refunded"
}
export declare class Contribution {
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
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    eventGift: GiftEvent;
    transactions: any[];
    canBeRefunded(): boolean;
    isFinalState(): boolean;
    getEffectiveAmount(): number;
    calculateNetAmount(): void;
    approve(transactionId: string, feePlatform?: number, feeGateway?: number): void;
    reject(): void;
    refund(): void;
}
