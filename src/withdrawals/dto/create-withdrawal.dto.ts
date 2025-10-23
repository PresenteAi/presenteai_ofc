import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNumber, 
  IsOptional, 
  IsObject, 
  IsPositive, 
  Min, 
  IsEnum,
  IsString,
  IsEmail,
  Length,
  Matches
} from 'class-validator';
import { WithdrawalGateway } from '../entities/withdrawal.entity';

/**
 * Bank account DTO for withdrawal requests
 */
export class BankAccountDto {
  @ApiProperty({
    description: 'Bank code (e.g., 001 for Banco do Brasil)',
    example: '001',
  })
  @IsString({ message: 'Bank code must be a string' })
  @Length(3, 3, { message: 'Bank code must be exactly 3 digits' })
  @Matches(/^\d{3}$/, { message: 'Bank code must contain only digits' })
  bankCode: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'Banco do Brasil',
  })
  @IsString({ message: 'Bank name must be a string' })
  @Length(1, 100, { message: 'Bank name must be between 1 and 100 characters' })
  bankName: string;

  @ApiProperty({
    description: 'Account type',
    enum: ['checking', 'savings'],
    example: 'checking',
  })
  @IsEnum(['checking', 'savings'], { message: 'Account type must be checking or savings' })
  accountType: 'checking' | 'savings';

  @ApiProperty({
    description: 'Account number',
    example: '12345-6',
  })
  @IsString({ message: 'Account number must be a string' })
  @Length(1, 20, { message: 'Account number must be between 1 and 20 characters' })
  accountNumber: string;

  @ApiProperty({
    description: 'Agency/branch number',
    example: '1234',
  })
  @IsString({ message: 'Agency must be a string' })
  @Length(1, 10, { message: 'Agency must be between 1 and 10 characters' })
  agency: string;

  @ApiProperty({
    description: 'Account holder full name',
    example: 'João Silva Santos',
  })
  @IsString({ message: 'Account holder name must be a string' })
  @Length(1, 100, { message: 'Account holder name must be between 1 and 100 characters' })
  accountHolderName: string;

  @ApiProperty({
    description: 'Account holder document (CPF or CNPJ)',
    example: '12345678901',
  })
  @IsString({ message: 'Document must be a string' })
  @Matches(/^\d{11}$|^\d{14}$/, { message: 'Document must be a valid CPF (11 digits) or CNPJ (14 digits)' })
  accountHolderDocument: string;

  @ApiProperty({
    description: 'Account holder email',
    example: 'joao.silva@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  accountHolderEmail?: string;

  @ApiProperty({
    description: 'Account holder phone number',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+\d{10,15}$/, { message: 'Phone must be in international format (+5511999999999)' })
  accountHolderPhone?: string;
}

/**
 * DTO for creating a new withdrawal request
 */
export class CreateWithdrawalDto {
  @ApiProperty({
    description: 'Total amount to withdraw',
    example: 500.00,
    type: 'number',
    format: 'decimal',
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  @Min(0.01, { message: 'Minimum withdrawal amount is R$ 0.01' })
  totalAmount: number;

  @ApiProperty({
    description: 'Preferred payment gateway for processing',
    enum: WithdrawalGateway,
    example: WithdrawalGateway.STRIPE,
    required: false,
  })
  @IsOptional()
  @IsEnum(WithdrawalGateway, { message: 'Invalid payment gateway' })
  paymentGateway?: WithdrawalGateway;

  @ApiProperty({
    description: 'Bank account information for the withdrawal',
    type: BankAccountDto,
  })
  @IsObject({ message: 'Bank account must be an object' })
  bankAccount: BankAccountDto;

  @ApiProperty({
    description: 'Additional metadata for the withdrawal',
    example: {
      notes: 'Urgent withdrawal request',
      priority: 'high'
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Metadata must be an object' })
  metadata?: Record<string, any>;
}