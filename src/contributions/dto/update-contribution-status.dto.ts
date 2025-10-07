import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsNumber, 
  Min, 
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentStatus, PaymentMethod } from '../entities/contribution.entity';

/**
 * DTO for updating contribution payment status
 */
export class UpdateContributionStatusDto {
  @ApiProperty({
    description: 'New payment status',
    example: PaymentStatus.APPROVED,
    enum: PaymentStatus,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Transaction ID from payment gateway (required for approved payments)',
    example: 'txn_1234567890abcdef',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transactionId?: string;

  @ApiProperty({
    description: 'Platform fee amount (optional)',
    example: 5.50,
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => Number(value))
  feePlatform?: number;

  @ApiProperty({
    description: 'Gateway fee amount (optional)',
    example: 2.25,
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => Number(value))
  feeGateway?: number;
}

/**
 * DTO for contribution response
 */
export class ContributionResponseDto {
  @ApiProperty({
    description: 'Contribution unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Gift event ID',
    example: 1,
  })
  eventGiftId: number;

  @ApiProperty({
    description: 'User ID (if registered user)',
    example: 123,
    nullable: true,
  })
  userId?: number;

  @ApiProperty({
    description: 'Contributor name',
    example: 'João Silva',
  })
  contributorName: string;

  @ApiProperty({
    description: 'Contributor email',
    example: 'joao.silva@email.com',
    nullable: true,
  })
  contributorEmail?: string;

  @ApiProperty({
    description: 'Contribution amount',
    example: 150.75,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'BRL',
  })
  currency: string;

  @ApiProperty({
    description: 'Payment method',
    example: PaymentMethod.PIX,
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Payment status',
    example: PaymentStatus.APPROVED,
    enum: PaymentStatus,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_1234567890abcdef',
    nullable: true,
  })
  transactionId?: string;

  @ApiProperty({
    description: 'Platform fee',
    example: 5.50,
    nullable: true,
  })
  feePlatform?: number;

  @ApiProperty({
    description: 'Gateway fee',
    example: 2.25,
    nullable: true,
  })
  feeGateway?: number;

  @ApiProperty({
    description: 'Net amount after fees',
    example: 142.00,
    nullable: true,
  })
  netAmount?: number;

  @ApiProperty({
    description: 'Contributor message',
    example: 'Parabéns pelo casamento!',
    nullable: true,
  })
  message?: string;

  @ApiProperty({
    description: 'Refund date',
    example: '2024-12-25T10:30:00Z',
    nullable: true,
  })
  refundedAt?: Date;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-12-20T14:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-12-21T09:15:00Z',
  })
  updatedAt: Date;

  constructor(contribution: any) {
    this.id = contribution.id;
    this.eventGiftId = contribution.eventGiftId;
    this.userId = contribution.userId;
    this.contributorName = contribution.contributorName;
    this.contributorEmail = contribution.contributorEmail;
    this.amount = Number(contribution.amount);
    this.currency = contribution.currency;
    this.paymentMethod = contribution.paymentMethod;
    this.paymentStatus = contribution.paymentStatus;
    this.transactionId = contribution.transactionId;
    this.feePlatform = contribution.feePlatform ? Number(contribution.feePlatform) : undefined;
    this.feeGateway = contribution.feeGateway ? Number(contribution.feeGateway) : undefined;
    this.netAmount = contribution.netAmount ? Number(contribution.netAmount) : undefined;
    this.message = contribution.message;
    this.refundedAt = contribution.refundedAt;
    this.createdAt = contribution.createdAt;
    this.updatedAt = contribution.updatedAt;
  }
}