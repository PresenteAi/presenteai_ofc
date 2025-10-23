import { WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';
export declare class WithdrawalResponseDto {
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
}
export declare class CreateWithdrawalResponseDto extends WithdrawalResponseDto {
    estimatedProcessingTime?: number;
    gatewayInfo?: Record<string, any>;
}
export declare class BalanceResponseDto {
    availableBalance: number;
    pendingWithdrawals: number;
    totalBalance: number;
    minimumWithdrawal: number;
    maximumWithdrawal: number;
    currency: string;
}
