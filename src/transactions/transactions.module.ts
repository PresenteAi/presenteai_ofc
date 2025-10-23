import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { PaymentGatewayFactory } from './providers/payment-gateway.factory';
import { StripeGatewayService } from './providers/stripe-gateway.service';

/**
 * Transactions module managing payment processing and gateway integration
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionRepository,
    PaymentGatewayFactory,
    StripeGatewayService,
    // Add other gateway services here as they are implemented
    // MercadoPagoGatewayService,
    // PagarMeGatewayService,
  ],
  exports: [
    TransactionsService,
    TransactionRepository,
    PaymentGatewayFactory,
  ],
})
export class TransactionsModule {}