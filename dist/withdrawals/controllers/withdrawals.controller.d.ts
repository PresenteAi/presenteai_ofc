import { WithdrawalsService } from '../services/withdrawals.service';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';
import { UpdateWithdrawalStatusDto } from '../dto/update-withdrawal-status.dto';
import { WithdrawalResponseDto, CreateWithdrawalResponseDto, BalanceResponseDto } from '../dto/withdrawal-response.dto';
import { WithdrawalStatus } from '../entities/withdrawal.entity';
export declare class WithdrawalsController {
    private readonly withdrawalsService;
    constructor(withdrawalsService: WithdrawalsService);
    createWithdrawal(user: {
        userId: number;
    }, createWithdrawalDto: CreateWithdrawalDto): Promise<CreateWithdrawalResponseDto>;
    getUserBalance(user: {
        userId: number;
    }): Promise<BalanceResponseDto>;
    getUserWithdrawalStats(user: {
        userId: number;
    }): Promise<{
        total: number;
        completed: number;
        pending: number;
        failed: number;
        totalAmount: number;
        completedAmount: number;
        pendingAmount: number;
    }>;
    getWithdrawal(id: number, user: {
        userId: number;
    }): Promise<WithdrawalResponseDto>;
    getUserWithdrawals(user: {
        userId: number;
    }, status?: WithdrawalStatus): Promise<WithdrawalResponseDto[]>;
    updateWithdrawalStatus(id: number, updateWithdrawalStatusDto: UpdateWithdrawalStatusDto): Promise<WithdrawalResponseDto>;
    cancelWithdrawal(id: number, user: {
        userId: number;
    }): Promise<WithdrawalResponseDto>;
    validateBankAccount(bankAccount: any): Promise<{
        isValid: boolean;
        errors?: string[];
    }>;
    getOverdueWithdrawals(hours?: number): Promise<WithdrawalResponseDto[]>;
}
