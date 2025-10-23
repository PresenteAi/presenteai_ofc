import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUrl, IsBoolean, IsDateString, MinLength, MaxLength, Matches } from 'class-validator';
import { EventType } from '../entities/event.entity';

export class UpdateEventDto {
  @ApiProperty({ 
    example: 'Casamento Ana & João - Atualizado',
    description: 'Event title (3-200 characters)',
    minLength: 3,
    maxLength: 200,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiProperty({ 
    example: 'Nova descrição do evento!',
    description: 'Event description or host message (max 2000 characters)',
    required: false,
    maxLength: 2000
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ 
    example: 'baby_shower',
    description: 'Type of event',
    enum: EventType,
    required: false
  })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiProperty({ 
    example: 'https://example.com/new-cover.jpg',
    description: 'Cover image URL (must be valid URL)',
    required: false
  })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiProperty({ 
    example: '#FF0000',
    description: 'Primary theme color (hex format)',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Primary color must be a valid hex color' })
  primaryColor?: string;

  @ApiProperty({ 
    example: '#00FF00',
    description: 'Secondary theme color (hex format)',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Secondary color must be a valid hex color' })
  secondaryColor?: string;

  @ApiProperty({ 
    example: '#0000FF',
    description: 'Tertiary theme color (hex format)',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Tertiary color must be a valid hex color' })
  tertiaryColor?: string;

  @ApiProperty({ 
    example: 'Arial',
    description: 'Font family name (max 100 characters)',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fontFamily?: string;

  @ApiProperty({ 
    example: '2025-12-30',
    description: 'Event start date (YYYY-MM-DD format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    example: '2025-12-25',
    description: 'Contribution end date (YYYY-MM-DD format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    example: 'novo-casamento-ana-joao-2025',
    description: 'Unique public URL slug (3-100 characters, alphanumeric and hyphens only)',
    minLength: 3,
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, { message: 'Public URL must contain only lowercase letters, numbers, and hyphens' })
  publicUrl?: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event is published',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}