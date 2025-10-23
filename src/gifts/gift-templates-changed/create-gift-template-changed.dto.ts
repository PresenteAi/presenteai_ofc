import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsBoolean, IsNumber, MaxLength, Min, IsInt, IsPositive } from 'class-validator';

export class CreateGiftTemplateChangedDto {
  @ApiProperty({ 
    example: 1,
    description: 'ID do template base que será personalizado'
  })
  @IsInt()
  @IsPositive()
  giftTemplateId: number;

  @ApiProperty({ 
    example: 'Jogo de Panelas Antiaderente Premium',
    description: 'Nome personalizado do presente',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({ 
    example: 'Conjunto premium com 7 peças, incluindo tampa de vidro',
    description: 'Descrição personalizada',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ 
    example: 'https://example.com/panelas-premium.jpg',
    description: 'URL da imagem personalizada',
    required: false
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({ 
    example: 399.99,
    description: 'Valor ajustado para o presente',
    required: false,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value?: number;

  @ApiProperty({ 
    example: 'Cozinha Premium',
    description: 'Categoria personalizada',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ 
    example: false,
    description: 'Se deseja tornar esta variação pública para outros usuários',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;
}