import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUrl, IsBoolean, IsDateString, IsNumber, MinLength, MaxLength, Matches } from 'class-validator';
import { EventType } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({ 
    example: 1,
    description: 'Reference to the event organizer (User ID)'
  })
  @IsNumber()
  userId: number;

  @ApiProperty({ 
    example: 'Casamento Ana & João',
    description: 'Event title (3-200 characters)',
    minLength: 3,
    maxLength: 200
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ 
    example: 'Venham celebrar conosco este momento especial!',
    description: 'Event description or host message (max 2000 characters)',
    required: false,
    maxLength: 2000
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ 
    example: 'wedding',
    description: 'Type of event',
    enum: EventType
  })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({ 
    example: 'https://example.com/cover.jpg',
    description: 'Cover image URL (must be valid URL)',
    required: false
  })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiProperty({ 
    example: '#FF6B6B',
    description: 'Primary theme color (hex format)',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Primary color must be a valid hex color' })
  primaryColor?: string;

  @ApiProperty({ 
    example: '#4ECDC4',
    description: 'Secondary theme color (hex format)',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Secondary color must be a valid hex color' })
  secondaryColor?: string;

  @ApiProperty({ 
    example: '#45B7D1',
    description: 'Tertiary theme color (hex format)',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Tertiary color must be a valid hex color' })
  tertiaryColor?: string;

  @ApiProperty({ 
    example: 'Roboto',
    description: 'Font family name (max 100 characters)',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fontFamily?: string;

  @ApiProperty({ 
    example: '2025-12-25',
    description: 'Event start date (YYYY-MM-DD format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    example: '2025-12-20',
    description: 'Contribution end date (YYYY-MM-DD format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    example: 'casamento-ana-joao-2025',
    description: 'Unique public URL slug (3-100 characters, alphanumeric and hyphens only)',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, { message: 'Public URL must contain only lowercase letters, numbers, and hyphens' })
  publicUrl: string;

  @ApiProperty({ 
    example: false,
    description: 'Whether the event should be published immediately',
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}