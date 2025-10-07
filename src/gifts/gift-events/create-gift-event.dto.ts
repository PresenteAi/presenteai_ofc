import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsNumber, IsEnum, IsPositive, Min, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { GiftEventStatus } from '../entities/gift-event.entity';

export class CreateGiftEventDto {
  @ApiProperty({ 
    example: 1,
    description: 'ID do evento onde o presente será adicionado'
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  eventId: number;

  @ApiProperty({ 
    example: 1,
    description: 'ID do template base do presente (obrigatório se giftTemplateChangedId não fornecido)',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Gift template ID must be an integer' })
  @IsPositive({ message: 'Gift template ID must be positive' })
  @Type(() => Number)
  @ValidateIf((o) => !o.giftTemplateChangedId)
  giftTemplateId?: number;

  @ApiProperty({ 
    example: 1,
    description: 'ID do template personalizado (obrigatório se giftTemplateId não fornecido)',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Gift template changed ID must be an integer' })
  @IsPositive({ message: 'Gift template changed ID must be positive' })
  @Type(() => Number)
  @ValidateIf((o) => !o.giftTemplateId)
  giftTemplateChangedId?: number;

  @ApiProperty({ 
    example: 350.00,
    description: 'Valor final definido para este presente no evento',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'customValue must be greater than 0' })
  @Type(() => Number)
  customValue?: number;

  @ApiProperty({ 
    example: GiftEventStatus.OPEN,
    description: 'Status inicial do presente',
    enum: GiftEventStatus,
    default: GiftEventStatus.OPEN
  })
  @IsOptional()
  @IsEnum(GiftEventStatus)
  status?: GiftEventStatus = GiftEventStatus.OPEN;
}