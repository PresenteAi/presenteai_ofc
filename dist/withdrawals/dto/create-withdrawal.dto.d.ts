import { WithdrawalGateway } from '../entities/withdrawal.entity';
export declare class BankAccountDto {
    bankCode: string;
    bankName: string;
    accountType: 'checking' | 'savings';
    accountNumber: string;
    agency: string;
    accountHolderName: string;
    accountHolderDocument: string;
    accountHolderEmail?: string;
    accountHolderPhone?: string;
}
export declare class CreateWithdrawalDto {
    totalAmount: number;
    paymentGateway?: WithdrawalGateway;
    bankAccount: BankAccountDto;
    metadata?: Record<string, any>;
}
