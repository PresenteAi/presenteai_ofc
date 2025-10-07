import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '../entities/event.entity';

export class UpdateEventDto {
  @ApiProperty({ 
    example: 'Casamento Ana & João - Atualizado',
    description: 'Event title (3-200 characters)',
    minLength: 3,
    maxLength: 200,
    required: false
  })
  title?: string;

  @ApiProperty({ 
    example: 'Nova descrição do evento!',
    description: 'Event description or host message (max 2000 characters)',
    required: false,
    maxLength: 2000
  })
  description?: string;

  @ApiProperty({ 
    example: 'baby_shower',
    description: 'Type of event',
    enum: EventType,
    required: false
  })
  eventType?: EventType;

  @ApiProperty({ 
    example: 'https://example.com/new-cover.jpg',
    description: 'Cover image URL (must be valid URL)',
    required: false
  })
  coverImageUrl?: string;

  @ApiProperty({ 
    example: '#FF0000',
    description: 'Primary theme color (hex format)',
    required: false
  })
  primaryColor?: string;

  @ApiProperty({ 
    example: '#00FF00',
    description: 'Secondary theme color (hex format)',
    required: false
  })
  secondaryColor?: string;

  @ApiProperty({ 
    example: '#0000FF',
    description: 'Tertiary theme color (hex format)',
    required: false
  })
  tertiaryColor?: string;

  @ApiProperty({ 
    example: 'Arial',
    description: 'Font family name (max 100 characters)',
    required: false
  })
  fontFamily?: string;

  @ApiProperty({ 
    example: '2025-12-30',
    description: 'Event start date (YYYY-MM-DD format)',
    required: false
  })
  startDate?: string;

  @ApiProperty({ 
    example: '2025-12-25',
    description: 'Contribution end date (YYYY-MM-DD format)',
    required: false
  })
  endDate?: string;

  @ApiProperty({ 
    example: 'novo-casamento-ana-joao-2025',
    description: 'Unique public URL slug (3-100 characters, alphanumeric and hyphens only)',
    minLength: 3,
    maxLength: 100,
    required: false
  })
  publicUrl?: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event is published',
    required: false
  })
  isPublished?: boolean;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event is active',
    required: false
  })
  isActive?: boolean;
}