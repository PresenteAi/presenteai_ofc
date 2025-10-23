// Main module export
export { TransactionsModule } from './transactions.module';

// Entities
export { Transaction, TransactionStatus, PaymentGateway } from './entities/transaction.entity';

// Services
export { TransactionsService } from './services/transactions.service';

// Controllers
export { TransactionsController } from './controllers/transactions.controller';

// Repositories
export { TransactionRepository } from './repositories/transaction.repository';

// DTOs
export { CreateTransactionDto } from './dto/create-transaction.dto';
export { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
export { TransactionResponseDto, CreateTransactionResponseDto } from './dto/transaction-response.dto';

// Interfaces
export type { 
  PaymentGatewayInterface,
  CreateTransactionParams,
  GatewayTransactionResponse,
  TransactionStatusResponse,
  RefundResponse,
} from './interfaces/payment-gateway.interface';

export { PAYMENT_GATEWAY_TOKEN } from './interfaces/payment-gateway.interface';

// Providers
export { PaymentGatewayFactory } from './providers/payment-gateway.factory';
export { StripeGatewayService } from './providers/stripe-gateway.service';