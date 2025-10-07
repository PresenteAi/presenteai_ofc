import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionStatus, PaymentGateway } from '../entities/transaction.entity';
export declare class TransactionRepository extends Repository<Transaction> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByContributionId(contributionId: number): Promise<Transaction[]>;
    findByExternalTransactionId(externalTransactionId: string): Promise<Transaction | null>;
    findByGatewayAndStatus(gateway: PaymentGateway, status: TransactionStatus): Promise<Transaction[]>;
    findStaleTransactions(minutes?: number): Promise<Transaction[]>;
    getTransactionStats(contributionId: number): Promise<{
        total: number;
        paid: number;
        failed: number;
        totalAmount: number;
        paidAmount: number;
    }>;
    findTransactionsNeedingSync(gatewayTypes?: PaymentGateway[]): Promise<Transaction[]>;
    findSuccessfulTransactions(startDate: Date, endDate: Date, gateway?: PaymentGateway): Promise<Transaction[]>;
}
