import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsObject, IsDateString } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

/**
 * DTO for updating transaction status via gateway callbacks
 */
export class UpdateTransactionStatusDto {
  @ApiProperty({
    description: 'New transaction status',
    enum: TransactionStatus,
    example: TransactionStatus.PAID,
  })
  @IsEnum(TransactionStatus, { message: 'Invalid transaction status' })
  status: TransactionStatus;

  @ApiProperty({
    description: 'External transaction ID from the gateway',
    example: 'stripe_tx_1234567890',
    required: false,
  })
  @IsOptional()
  externalTransactionId?: string;

  @ApiProperty({
    description: 'Payment confirmation date (ISO 8601 format)',
    example: '2023-12-25T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Payment date must be a valid ISO date string' })
  paymentDate?: string;

  @ApiProperty({
    description: 'Refund processing date (ISO 8601 format)',
    example: '2023-12-26T15:45:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Refund date must be a valid ISO date string' })
  refundDate?: string;

  @ApiProperty({
    description: 'Additional metadata from the gateway webhook',
    example: {
      gateway_fee: 1.50,
      gateway_reference: 'ref_123456',
      webhook_id: 'wh_789012'
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Metadata must be an object' })
  metadata?: Record<string, any>;
}