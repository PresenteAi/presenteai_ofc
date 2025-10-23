import { TransactionStatus, PaymentGateway } from '../entities/transaction.entity';
export declare class TransactionResponseDto {
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
}
export declare class CreateTransactionResponseDto extends TransactionResponseDto {
    paymentUrl?: string;
}
