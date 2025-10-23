import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  Min, 
  MaxLength, 
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentMethod } from '../entities/contribution.entity';

/**
 * DTO for creating a new contribution
 */
export class CreateContributionDto {
  @ApiProperty({
    description: 'ID of the gift event receiving the contribution',
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  eventGiftId: number;

  @ApiProperty({
    description: 'ID of the registered user making the contribution (optional for anonymous contributions)',
    example: 123,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiProperty({
    description: 'Name of the contributor',
    example: 'João Silva',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  contributorName: string;

  @ApiProperty({
    description: 'Email of the contributor (optional)',
    example: 'joao.silva@email.com',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contributorEmail?: string;

  @ApiProperty({
    description: 'Contribution amount in the specified currency',
    example: 150.75,
    type: Number,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Transform(({ value }) => Number(value))
  amount: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'BRL',
    default: 'BRL',
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency: string = 'BRL';

  @ApiProperty({
    description: 'Payment method used for the contribution',
    example: PaymentMethod.PIX,
    enum: PaymentMethod,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Optional message from the contributor',
    example: 'Parabéns pelo casamento! Desejo muitas felicidades!',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}