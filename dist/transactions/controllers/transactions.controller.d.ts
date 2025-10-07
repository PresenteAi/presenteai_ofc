import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';
import { TransactionResponseDto, CreateTransactionResponseDto } from '../dto/transaction-response.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<CreateTransactionResponseDto>;
    getTransaction(id: number): Promise<TransactionResponseDto>;
    updateTransactionStatus(id: number, updateTransactionStatusDto: UpdateTransactionStatusDto): Promise<TransactionResponseDto>;
    getTransactionsByContribution(contributionId: number): Promise<TransactionResponseDto[]>;
    syncTransaction(id: number): Promise<TransactionResponseDto>;
    processRefund(id: number, amount?: number, reason?: string): Promise<TransactionResponseDto>;
    handleWebhook(gateway: string, signature: string, payload: Buffer): Promise<{
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
