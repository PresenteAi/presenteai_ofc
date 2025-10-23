import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, IsPositive, IsNumber, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { GiftEventStatus } from '../../entities/gift-event.entity';

export class GiftEventFiltersDto {
  @ApiProperty({
    example: 1,
    description: 'Filtrar por ID do evento',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'eventId must be an integer' })
  @IsPositive({ message: 'eventId must be positive' })
  @Type(() => Number)
  eventId?: number;

  @ApiProperty({
    example: 1,
    description: 'Filtrar por ID do template base',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'giftTemplateId must be an integer' })
  @IsPositive({ message: 'giftTemplateId must be positive' })
  @Type(() => Number)
  giftTemplateId?: number;

  @ApiProperty({
    example: 1,
    description: 'Filtrar por ID do template personalizado',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'giftTemplateChangedId must be an integer' })
  @IsPositive({ message: 'giftTemplateChangedId must be positive' })
  @Type(() => Number)
  giftTemplateChangedId?: number;

  @ApiProperty({
    example: GiftEventStatus.OPEN,
    description: 'Filtrar por status',
    enum: GiftEventStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(GiftEventStatus, { message: 'status must be a valid GiftEventStatus' })
  status?: GiftEventStatus;

  @ApiProperty({
    example: 100.00,
    description: 'Valor mínimo efetivo (considerando customValue, templateChanged ou template)',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'minValue must be a number with up to 2 decimal places' })
  @Min(0, { message: 'minValue cannot be negative' })
  @Type(() => Number)
  minValue?: number;

  @ApiProperty({
    example: 500.00,
    description: 'Valor máximo efetivo (considerando customValue, templateChanged ou template)',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'maxValue must be a number with up to 2 decimal places' })
  @Min(0, { message: 'maxValue cannot be negative' })
  @Type(() => Number)
  maxValue?: number;

  @ApiProperty({
    example: 1,
    description: 'Página (para paginação)',
    required: false,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Itens por página (para paginação)',
    required: false,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit must be at most 100' })
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    example: 'title',
    description: 'Campo para ordenação',
    required: false,
    enum: ['id', 'createdAt', 'updatedAt', 'collectedValue', 'title'],
    default: 'createdAt'
  })
  @IsOptional()
  sortBy?: 'id' | 'createdAt' | 'updatedAt' | 'collectedValue' | 'title' = 'createdAt';

  @ApiProperty({
    example: 'DESC',
    description: 'Direção da ordenação',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'DESC'
  })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}