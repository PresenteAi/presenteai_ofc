import { Contribution } from '../../contributions/entities/contribution.entity';
export declare enum TransactionStatus {
    INITIATED = "initiated",
    PROCESSING = "processing",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentGateway {
    STRIPE = "stripe",
    MERCADOPAGO = "mercadopago",
    PAGARME = "pagarme"
}
export declare class Transaction {
    id: number;
    contributionId: number;
    paymentGateway: PaymentGateway;
    externalTransactionId?: string;
    amount: number;
    fee: number;
    netAmount: number;
    status: TransactionStatus;
    paymentDate?: Date;
    refundDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    contribution: Contribution;
    calculateNetAmount(): void;
    canBeRefunded(): boolean;
    isFinalState(): boolean;
    markAsPaid(paymentDate: Date, externalTransactionId?: string, metadata?: Record<string, any>): void;
    markAsFailed(errorDetails?: Record<string, any>): void;
    markAsRefunded(refundDate: Date, refundMetadata?: Record<string, any>): void;
    startProcessing(): void;
    updateMetadata(newMetadata: Record<string, any>): void;
}
