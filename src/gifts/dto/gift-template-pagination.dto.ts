import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EventType } from '../entities/gift-template.entity';

export class GiftTemplatePaginationDto {
  @ApiProperty({ 
    example: 1,
    description: 'Número da página',
    required: false,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    example: 10,
    description: 'Itens por página (máximo 100)',
    required: false,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ 
    example: 'title',
    description: 'Campo para ordenação',
    required: false,
    enum: ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt']
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ 
    example: 'ASC',
    description: 'Direção da ordenação',
    required: false,
    enum: ['ASC', 'DESC']
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ 
    example: 'panelas',
    description: 'Busca por título ou descrição',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: 'Cozinha',
    description: 'Filtro por categoria',
    required: false
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    example: 'wedding',
    description: 'Filtro por tipo de evento',
    enum: EventType,
    required: false
  })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiProperty({ 
    example: 1,
    description: 'Filtro por usuário criador',
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  createdByUserId?: number;
}