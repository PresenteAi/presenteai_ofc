export declare enum WithdrawalStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum WithdrawalGateway {
    STRIPE = "stripe",
    PAYPAL = "paypal",
    PAGARME = "pagarme",
    MERCADOPAGO = "mercadopago",
    BANK_TRANSFER = "bank_transfer"
}
export declare class Withdrawal {
    id: number;
    userId: number;
    totalAmount: number;
    feeAmount: number;
    netAmount: number;
    status: WithdrawalStatus;
    paymentGateway?: WithdrawalGateway;
    transactionReference?: string;
    bankAccount?: Record<string, any>;
    requestedAt: Date;
    processedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    calculateNetAmount(): void;
    canBeCancelled(): boolean;
    isFinalState(): boolean;
    startProcessing(gateway: WithdrawalGateway, transactionReference?: string): void;
    markAsCompleted(processedAt: Date, transactionReference?: string, metadata?: Record<string, any>): void;
    markAsFailed(errorDetails?: Record<string, any>, processedAt?: Date): void;
    updateMetadata(newMetadata: Record<string, any>): void;
    setBankAccount(bankAccount: Record<string, any>): void;
    getProcessingTimeInSeconds(): number | null;
    isOverdue(hours?: number): boolean;
}
