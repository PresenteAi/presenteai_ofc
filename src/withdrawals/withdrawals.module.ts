import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from './entities/withdrawal.entity';
import { WithdrawalsController } from './controllers/withdrawals.controller';
import { WithdrawalWebhooksController } from './controllers/withdrawal-webhooks.controller';
import { WithdrawalsService } from './services/withdrawals.service';
import { WithdrawalWebhookService } from './services/withdrawal-webhook.service';
import { WithdrawalRepository } from './repositories/withdrawal.repository';
import { TransactionRepository } from '../transactions/repositories/transaction.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Withdrawal]),
  ],
  controllers: [
    WithdrawalsController,
    WithdrawalWebhooksController,
  ],
  providers: [
    WithdrawalsService,
    WithdrawalWebhookService,
    WithdrawalRepository,
    TransactionRepository,
  ],
  exports: [
    WithdrawalsService,
    WithdrawalWebhookService,
    WithdrawalRepository,
  ],
})
export class WithdrawalsModule {}