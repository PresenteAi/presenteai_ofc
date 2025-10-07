import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUrl, IsBoolean, IsNumber, MinLength, MaxLength, IsPositive, Min } from 'class-validator';
import { EventType } from '../entities/gift-template.entity';

export class CreateGiftTemplateDto {
  @ApiProperty({ 
    example: 'Jogo de Panelas Antiaderente',
    description: 'Nome do presente (3-255 caracteres)',
    minLength: 3,
    maxLength: 255
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ 
    example: 'Conjunto completo de panelas antiaderentes com 5 peças, ideal para cozinha moderna',
    description: 'Descrição detalhada do presente',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ 
    example: 'https://example.com/panelas.jpg',
    description: 'URL da imagem do presente',
    required: false
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({ 
    example: 'Cozinha',
    description: 'Categoria do presente',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ 
    example: 299.99,
    description: 'Valor sugerido para o presente',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  defaultValue?: number;

  @ApiProperty({ 
    example: 'wedding',
    description: 'Tipo de evento sugerido para este presente',
    enum: EventType,
    required: false
  })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiProperty({ 
    example: true,
    description: 'Se o presente pode ser reutilizado por outros usuários',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;
}