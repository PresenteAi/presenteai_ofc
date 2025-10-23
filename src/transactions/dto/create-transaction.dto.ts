import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsObject, IsPositive, Min } from 'class-validator';
import { PaymentGateway } from '../entities/transaction.entity';

/**
 * DTO for creating a new transaction
 */
export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the contribution this transaction belongs to',
    example: 123,
    type: 'integer',
  })
  @IsNumber({}, { message: 'Contribution ID must be a number' })
  @IsPositive({ message: 'Contribution ID must be positive' })
  contributionId: number;

  @ApiProperty({
    description: 'Payment gateway to process the transaction',
    enum: PaymentGateway,
    example: PaymentGateway.STRIPE,
  })
  @IsEnum(PaymentGateway, { message: 'Invalid payment gateway' })
  paymentGateway: PaymentGateway;

  @ApiProperty({
    description: 'Transaction amount in the specified currency',
    example: 50.00,
    type: 'number',
    format: 'decimal',
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  amount: number;

  @ApiProperty({
    description: 'Gateway fee for this transaction',
    example: 2.50,
    type: 'number',
    format: 'decimal',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Fee must be a number' })
  @Min(0, { message: 'Fee cannot be negative' })
  fee?: number;

  @ApiProperty({
    description: 'Payment method specific data for the gateway',
    example: {
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123'
      }
    },
  })
  @IsObject({ message: 'Payment method data must be an object' })
  paymentMethodData: Record<string, any>;

  @ApiProperty({
    description: 'Customer information for the transaction',
    example: {
      name: 'João Silva',
      email: 'joao@example.com',
      document: '12345678901'
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Customer data must be an object' })
  customer?: {
    name: string;
    email?: string;
    document?: string;
  };

  @ApiProperty({
    description: 'Additional metadata for the transaction',
    example: {
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0...'
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Metadata must be an object' })
  metadata?: Record<string, any>;
}