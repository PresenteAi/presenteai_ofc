import { PaymentGatewayInterface, CreateTransactionParams, GatewayTransactionResponse, TransactionStatusResponse, RefundResponse } from '../interfaces/payment-gateway.interface';
import { TransactionStatus } from '../entities/transaction.entity';
export declare class MercadoPagoGatewayService implements PaymentGatewayInterface {
    private readonly logger;
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
