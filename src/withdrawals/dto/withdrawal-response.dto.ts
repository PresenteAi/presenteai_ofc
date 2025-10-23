import { ApiProperty } from '@nestjs/swagger';
import { WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';

/**
 * Withdrawal response DTO for API responses
 */
export class WithdrawalResponseDto {
  @ApiProperty({
    description: 'Withdrawal unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User ID who requested the withdrawal',
    example: 123,
  })
  userId: number;

  @ApiProperty({
    description: 'Total amount requested',
    example: 500.00,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Platform/gateway fee',
    example: 15.00,
  })
  feeAmount: number;

  @ApiProperty({
    description: 'Net amount to be transferred',
    example: 485.00,
  })
  netAmount: number;

  @ApiProperty({
    description: 'Current withdrawal status',
    enum: WithdrawalStatus,
    example: WithdrawalStatus.COMPLETED,
  })
  status: WithdrawalStatus;

  @ApiProperty({
    description: 'Payment gateway used for processing',
    enum: WithdrawalGateway,
    example: WithdrawalGateway.STRIPE,
    nullable: true,
  })
  paymentGateway?: WithdrawalGateway;

  @ApiProperty({
    description: 'External transaction reference from gateway',
    example: 'stripe_payout_1234567890',
    nullable: true,
  })
  transactionReference?: string;

  @ApiProperty({
    description: 'Bank account information',
    example: {
      bankName: 'Banco do Brasil',
      accountType: 'checking',
      accountNumber: '*****-6',
      agency: '1234'
    },
    nullable: true,
  })
  bankAccount?: Record<string, any>;

  @ApiProperty({
    description: 'Date when withdrawal was requested',
    example: '2023-12-25T09:00:00.000Z',
  })
  requestedAt: Date;

  @ApiProperty({
    description: 'Date when withdrawal was processed',
    example: '2023-12-25T10:30:00.000Z',
    nullable: true,
  })
  processedAt?: Date;

  @ApiProperty({
    description: 'Additional withdrawal metadata',
    example: {
      gateway_fee: 15.50,
      processing_time: 3600,
      notes: 'Processed successfully'
    },
    nullable: true,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Withdrawal creation date',
    example: '2023-12-25T09:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-12-25T10:30:00.000Z',
  })
  updatedAt: Date;
}

/**
 * Response DTO for withdrawal creation
 */
export class CreateWithdrawalResponseDto extends WithdrawalResponseDto {
  @ApiProperty({
    description: 'Estimated processing time in hours',
    example: 24,
    nullable: true,
  })
  estimatedProcessingTime?: number;

  @ApiProperty({
    description: 'Gateway-specific information',
    example: {
      gatewayWithdrawalId: 'stripe_payout_123',
      estimatedArrival: '2023-12-26T10:30:00.000Z',
      trackingUrl: 'https://dashboard.stripe.com/...'
    },
    nullable: true,
  })
  gatewayInfo?: Record<string, any>;
}

/**
 * Balance information DTO
 */
export class BalanceResponseDto {
  @ApiProperty({
    description: 'Available balance for withdrawal',
    example: 1250.00,
  })
  availableBalance: number;

  @ApiProperty({
    description: 'Amount currently being processed in pending withdrawals',
    example: 300.00,
  })
  pendingWithdrawals: number;

  @ApiProperty({
    description: 'Total balance (available + pending)',
    example: 1550.00,
  })
  totalBalance: number;

  @ApiProperty({
    description: 'Minimum amount allowed for withdrawal',
    example: 10.00,
  })
  minimumWithdrawal: number;

  @ApiProperty({
    description: 'Maximum amount allowed for withdrawal',
    example: 5000.00,
  })
  maximumWithdrawal: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'BRL',
  })
  currency: string;
}