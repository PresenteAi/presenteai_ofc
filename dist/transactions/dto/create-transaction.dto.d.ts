import { PaymentGateway } from '../entities/transaction.entity';
export declare class CreateTransactionDto {
    contributionId: number;
    paymentGateway: PaymentGateway;
    amount: number;
    fee?: number;
    paymentMethodData: Record<string, any>;
    customer?: {
        name: string;
        email?: string;
        document?: string;
    };
    metadata?: Record<string, any>;
}
