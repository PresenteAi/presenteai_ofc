import { TransactionStatus } from '../entities/transaction.entity';
export declare class UpdateTransactionStatusDto {
    status: TransactionStatus;
    externalTransactionId?: string;
    paymentDate?: string;
    refundDate?: string;
    metadata?: Record<string, any>;
}
