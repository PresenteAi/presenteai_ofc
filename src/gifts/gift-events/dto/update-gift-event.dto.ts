import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { GiftEventStatus } from '../../entities/gift-event.entity';

export class UpdateGiftEventDto {
  @ApiProperty({ 
    example: 1,
    description: 'ID do template base do presente',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Gift template ID must be an integer' })
  @IsPositive({ message: 'Gift template ID must be positive' })
  @Type(() => Number)
  giftTemplateId?: number;

  @ApiProperty({ 
    example: 1,
    description: 'ID do template personalizado',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Gift template changed ID must be an integer' })
  @IsPositive({ message: 'Gift template changed ID must be positive' })
  @Type(() => Number)
  giftTemplateChangedId?: number;
  @ApiProperty({ 
    example: 350.00,
    description: 'Valor final personalizado para este presente',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'customValue must be a number with up to 2 decimal places' })
  @Min(0.01, { message: 'customValue must be greater than 0' })
  @Type(() => Number)
  customValue?: number;

  @ApiProperty({ 
    example: 150.00,
    description: 'Valor arrecadado para este presente',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'collectedValue must be a number with up to 2 decimal places' })
  @Min(0, { message: 'collectedValue cannot be negative' })
  @Type(() => Number)
  collectedValue?: number;

  @ApiProperty({ 
    example: GiftEventStatus.COMPLETED,
    description: 'Status do presente no evento',
    enum: GiftEventStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(GiftEventStatus, { message: 'status must be a valid GiftEventStatus' })
  status?: GiftEventStatus;
}