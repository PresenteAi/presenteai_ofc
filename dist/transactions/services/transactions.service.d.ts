import { TransactionRepository } from '../repositories/transaction.repository';
import { PaymentGatewayFactory } from '../providers/payment-gateway.factory';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';
import { CreateTransactionResponseDto } from '../dto/transaction-response.dto';
export declare class TransactionsService {
    private readonly transactionRepository;
    private readonly gatewayFactory;
    private readonly logger;
    constructor(transactionRepository: TransactionRepository, gatewayFactory: PaymentGatewayFactory);
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<CreateTransactionResponseDto>;
    findById(id: number): Promise<Transaction>;
    findByContributionId(contributionId: number): Promise<Transaction[]>;
    updateTransactionStatus(id: number, updateDto: UpdateTransactionStatusDto): Promise<Transaction>;
    syncTransactionStatus(id: number): Promise<Transaction>;
    processRefund(id: number, amount?: number, reason?: string): Promise<Transaction>;
    handleWebhook(signature: string, payload: string, gateway: string): Promise<{
        processed: boolean;
        transactionId?: number;
    }>;
    getTransactionStats(contributionId: number): Promise<{
        total: number;
        paid: number;
        failed: number;
        totalAmount: number;
        paidAmount: number;
    }>;
}
