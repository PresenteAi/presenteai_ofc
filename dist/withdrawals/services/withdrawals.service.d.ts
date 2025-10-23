import { WithdrawalRepository } from '../repositories/withdrawal.repository';
import { TransactionRepository } from '../../transactions/repositories/transaction.repository';
import { Withdrawal, WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';
import { UpdateWithdrawalStatusDto } from '../dto/update-withdrawal-status.dto';
import { CreateWithdrawalResponseDto, BalanceResponseDto } from '../dto/withdrawal-response.dto';
import { BankAccountInfo } from '../interfaces/withdrawal-gateway.interface';
export declare class WithdrawalsService {
    private readonly withdrawalRepository;
    private readonly transactionRepository;
    private readonly logger;
    constructor(withdrawalRepository: WithdrawalRepository, transactionRepository: TransactionRepository);
    createWithdrawal(userId: number, createWithdrawalDto: CreateWithdrawalDto): Promise<CreateWithdrawalResponseDto>;
    findById(id: number, userId?: number): Promise<Withdrawal>;
    findByUserId(userId: number, status?: WithdrawalStatus): Promise<Withdrawal[]>;
    updateWithdrawalStatus(id: number, updateDto: UpdateWithdrawalStatusDto): Promise<Withdrawal>;
    cancelWithdrawal(id: number, userId: number): Promise<Withdrawal>;
    findByExternalReference(externalId: string, gateway: WithdrawalGateway): Promise<Withdrawal | null>;
    getUserBalance(userId: number): Promise<BalanceResponseDto>;
    getUserWithdrawalStats(userId: number): Promise<{
        total: number;
        completed: number;
        pending: number;
        failed: number;
        totalAmount: number;
        completedAmount: number;
        pendingAmount: number;
    }>;
    private calculatePlatformFees;
    private maskBankAccount;
    validateBankAccount(bankAccount: BankAccountInfo): Promise<{
        isValid: boolean;
        errors?: string[];
    }>;
    findOverdueWithdrawals(hours?: number): Promise<Withdrawal[]>;
}
