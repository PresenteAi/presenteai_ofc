import { WithdrawalStatus } from '../entities/withdrawal.entity';
export declare class UpdateWithdrawalStatusDto {
    status: WithdrawalStatus;
    transactionReference?: string;
    processedAt?: string;
    fees?: number;
    failureReason?: string;
    metadata?: Record<string, any>;
}
