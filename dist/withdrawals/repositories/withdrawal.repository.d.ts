import { Repository, DataSource } from 'typeorm';
import { Withdrawal, WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';
export declare class WithdrawalRepository extends Repository<Withdrawal> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByUserId(userId: number, status?: WithdrawalStatus): Promise<Withdrawal[]>;
    findByTransactionReference(transactionReference: string): Promise<Withdrawal | null>;
    findByGatewayAndStatus(gateway: WithdrawalGateway, status: WithdrawalStatus): Promise<Withdrawal[]>;
    findOverdueWithdrawals(hours?: number): Promise<Withdrawal[]>;
    getUserWithdrawalStats(userId: number): Promise<{
        total: number;
        completed: number;
        pending: number;
        failed: number;
        totalAmount: number;
        completedAmount: number;
        pendingAmount: number;
    }>;
    getPendingWithdrawalsAmount(userId: number): Promise<number>;
    findWithdrawalsNeedingSync(gatewayTypes?: WithdrawalGateway[]): Promise<Withdrawal[]>;
    findCompletedWithdrawals(startDate: Date, endDate: Date, gateway?: WithdrawalGateway): Promise<Withdrawal[]>;
    getProcessingTimeStats(gateway?: WithdrawalGateway, days?: number): Promise<{
        averageProcessingTime: number;
        medianProcessingTime: number;
        minProcessingTime: number;
        maxProcessingTime: number;
        totalWithdrawals: number;
    }>;
}
