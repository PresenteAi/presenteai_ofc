import { TransactionStatus } from '../entities/transaction.entity';
export interface CreateTransactionParams {
    amount: number;
    paymentMethodData: Record<string, any>;
    customer?: {
        name: string;
        email?: string;
        document?: string;
    };
    metadata?: Record<string, any>;
}
export interface GatewayTransactionResponse {
    id: string;
    status: string;
    paymentUrl?: string;
    data?: Record<string, any>;
}
export interface TransactionStatusResponse {
    status: TransactionStatus;
    paymentDate?: Date;
    metadata?: Record<string, any>;
}
export interface RefundResponse {
    refundId: string;
    status: string;
    processedAt: Date;
    metadata?: Record<string, any>;
}
export interface PaymentGatewayInterface {
    createTransaction(params: CreateTransactionParams): Promise<GatewayTransactionResponse>;
    checkTransactionStatus(externalTransactionId: string): Promise<TransactionStatusResponse>;
    processRefund(externalTransactionId: string, amount?: number, reason?: string): Promise<RefundResponse>;
    validateWebhook(signature: string, payload: string): boolean;
    parseWebhookData(payload: Record<string, any>): {
        externalTransactionId: string;
        status: TransactionStatus;
        paymentDate?: Date;
        metadata?: Record<string, any>;
    } | null;
}
export declare const PAYMENT_GATEWAY_TOKEN = "PaymentGatewayProvider";
