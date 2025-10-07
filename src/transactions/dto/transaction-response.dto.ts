import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus, PaymentGateway } from '../entities/transaction.entity';

/**
 * Transaction response DTO for API responses
 */
export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Associated contribution ID',
    example: 123,
  })
  contributionId: number;

  @ApiProperty({
    description: 'Payment gateway used',
    enum: PaymentGateway,
    example: PaymentGateway.STRIPE,
  })
  paymentGateway: PaymentGateway;

  @ApiProperty({
    description: 'External transaction ID from gateway',
    example: 'stripe_tx_1234567890',
    nullable: true,
  })
  externalTransactionId?: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 50.00,
  })
  amount: number;

  @ApiProperty({
    description: 'Gateway fee',
    example: 2.50,
  })
  fee: number;

  @ApiProperty({
    description: 'Net amount after fees',
    example: 47.50,
  })
  netAmount: number;

  @ApiProperty({
    description: 'Current transaction status',
    enum: TransactionStatus,
    example: TransactionStatus.PAID,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Payment confirmation date',
    example: '2023-12-25T10:30:00.000Z',
    nullable: true,
  })
  paymentDate?: Date;

  @ApiProperty({
    description: 'Refund processing date',
    example: '2023-12-26T15:45:00.000Z',
    nullable: true,
  })
  refundDate?: Date;

  @ApiProperty({
    description: 'Additional transaction metadata',
    example: {
      gateway_fee: 1.50,
      gateway_reference: 'ref_123456'
    },
    nullable: true,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Transaction creation date',
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
 * Response DTO for transaction creation
 */
export class CreateTransactionResponseDto extends TransactionResponseDto {
  @ApiProperty({
    description: 'Payment URL for redirect (if applicable)',
    example: 'https://checkout.stripe.com/pay/cs_test_123456',
    nullable: true,
  })
  paymentUrl?: string;
}