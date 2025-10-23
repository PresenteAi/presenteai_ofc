import { WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';

/**
 * DTO for filtering withdrawal queries
 */
export class WithdrawalFiltersDto {
  status?: WithdrawalStatus;
  paymentGateway?: WithdrawalGateway;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userSearch?: string;
  page?: number = 1;
  limit?: number = 10;
  sortBy?: 'requestedAt' | 'totalAmount' | 'status' | 'updatedAt' = 'requestedAt';
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}