import { IsEnum, IsOptional, IsString, IsNumber, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';

export class WithdrawalWebhookDto {
  @ApiProperty({ description: 'Gateway that sent the webhook' })
  @IsEnum(WithdrawalGateway)
  gateway: WithdrawalGateway;

  @ApiProperty({ description: 'External reference ID from payment gateway' })
  @IsString()
  externalId: string;

  @ApiProperty({ description: 'New withdrawal status' })
  @IsEnum(WithdrawalStatus)
  status: WithdrawalStatus;

  @ApiPropertyOptional({ description: 'Transaction reference from gateway' })
  @IsOptional()
  @IsString()
  transactionReference?: string;

  @ApiPropertyOptional({ description: 'Fee charged by gateway' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  feeAmount?: number;

  @ApiPropertyOptional({ description: 'When the withdrawal was processed' })
  @IsOptional()
  @IsDateString()
  processedAt?: string;

  @ApiPropertyOptional({ description: 'Failure reason if applicable' })
  @IsOptional()
  @IsString()
  failureReason?: string;

  @ApiPropertyOptional({ description: 'Additional metadata from gateway' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class StripeWithdrawalWebhookDto extends WithdrawalWebhookDto {
  @ApiProperty({ description: 'Stripe event type' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Stripe payout object' })
  @IsObject()
  data: {
    object: {
      id: string;
      status: string;
      amount: number;
      currency: string;
      failure_code?: string;
      failure_message?: string;
      arrival_date?: number;
      metadata?: Record<string, any>;
    };
  };
}

export class MercadoPagoWithdrawalWebhookDto extends WithdrawalWebhookDto {
  @ApiProperty({ description: 'MercadoPago action type' })
  @IsString()
  action: string;

  @ApiProperty({ description: 'MercadoPago API version' })
  @IsString()
  api_version: string;

  @ApiProperty({ description: 'MercadoPago data object' })
  @IsObject()
  data: {
    id: string;
  };

  @ApiPropertyOptional({ description: 'Notification date' })
  @IsOptional()
  @IsDateString()
  date_created?: string;
}

export class PagarMeWithdrawalWebhookDto extends WithdrawalWebhookDto {
  @ApiProperty({ description: 'Pagar.me event name' })
  @IsString()
  event: string;

  @ApiProperty({ description: 'Pagar.me transfer object' })
  @IsObject()
  current_status: {
    id: string;
    status: string;
    amount: number;
    fee: number;
    date_created: string;
    date_updated: string;
  };
}