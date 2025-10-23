import { WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';
export declare class WithdrawalFiltersDto {
    status?: WithdrawalStatus;
    paymentGateway?: WithdrawalGateway;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    userSearch?: string;
    page?: number;
    limit?: number;
    sortBy?: 'requestedAt' | 'totalAmount' | 'status' | 'updatedAt';
    sortOrder?: 'ASC' | 'DESC';
}
