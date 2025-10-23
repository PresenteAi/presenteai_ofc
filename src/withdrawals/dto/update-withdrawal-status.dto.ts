import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsObject, IsDateString, IsString } from 'class-validator';
import { WithdrawalStatus } from '../entities/withdrawal.entity';

/**
 * DTO for updating withdrawal status via gateway callbacks
 */
export class UpdateWithdrawalStatusDto {
  @ApiProperty({
    description: 'New withdrawal status',
    enum: WithdrawalStatus,
    example: WithdrawalStatus.COMPLETED,
  })
  @IsEnum(WithdrawalStatus, { message: 'Invalid withdrawal status' })
  status: WithdrawalStatus;

  @ApiProperty({
    description: 'External transaction reference from the gateway',
    example: 'stripe_payout_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Transaction reference must be a string' })
  transactionReference?: string;

  @ApiProperty({
    description: 'Processing completion date (ISO 8601 format)',
    example: '2023-12-25T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Processed date must be a valid ISO date string' })
  processedAt?: string;

  @ApiProperty({
    description: 'Gateway fees applied to the withdrawal',
    example: 15.50,
    required: false,
  })
  @IsOptional()
  fees?: number;

  @ApiProperty({
    description: 'Failure reason if withdrawal failed',
    example: 'Insufficient funds in gateway account',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Failure reason must be a string' })
  failureReason?: string;

  @ApiProperty({
    description: 'Additional metadata from the gateway webhook',
    example: {
      gateway_fee: 15.50,
      gateway_reference: 'ref_123456',
      processing_time: 3600,
      webhook_id: 'wh_789012'
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Metadata must be an object' })
  metadata?: Record<string, any>;
}