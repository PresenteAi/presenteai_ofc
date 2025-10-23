import { WithdrawalStatus } from '../entities/withdrawal.entity';
export interface BankAccountInfo {
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
export interface CreateWithdrawalParams {
    amount: number;
    bankAccount: BankAccountInfo;
    user: {
        id: number;
        name: string;
        email: string;
        document?: string;
    };
    metadata?: Record<string, any>;
}
export interface GatewayWithdrawalResponse {
    id: string;
    status: string;
    estimatedProcessingTime?: number;
    fees?: number;
    data?: Record<string, any>;
}
export interface WithdrawalStatusResponse {
    status: WithdrawalStatus;
    processedAt?: Date;
    fees?: number;
    metadata?: Record<string, any>;
}
export interface BalanceResponse {
    availableBalance: number;
    pendingWithdrawals: number;
    totalBalance: number;
    minimumWithdrawal: number;
    maximumWithdrawal: number;
}
export interface WithdrawalGatewayInterface {
    createWithdrawal(params: CreateWithdrawalParams): Promise<GatewayWithdrawalResponse>;
    checkWithdrawalStatus(externalWithdrawalId: string): Promise<WithdrawalStatusResponse>;
    getAvailableBalance(userId: number): Promise<BalanceResponse>;
    validateBankAccount(bankAccount: BankAccountInfo): Promise<{
        isValid: boolean;
        errors?: string[];
    }>;
    cancelWithdrawal(externalWithdrawalId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    validateWebhook(signature: string, payload: string): boolean;
    parseWebhookData(payload: Record<string, any>): {
        externalWithdrawalId: string;
        status: WithdrawalStatus;
        processedAt?: Date;
        fees?: number;
        metadata?: Record<string, any>;
    } | null;
    getGatewayConfig(): {
        name: string;
        minimumAmount: number;
        maximumAmount: number;
        processingTime: string;
        supportedCountries: string[];
        fees: {
            percentage?: number;
            fixed?: number;
            minimum?: number;
            maximum?: number;
        };
    };
}
export declare const WITHDRAWAL_GATEWAY_TOKEN = "WithdrawalGatewayProvider";
