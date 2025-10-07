import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({ 
    example: 'uuid-string',
    description: 'Reference to the event organizer (User ID)'
  })
  userId: string;

  @ApiProperty({ 
    example: 'Casamento Ana & João',
    description: 'Event title (3-200 characters)',
    minLength: 3,
    maxLength: 200
  })
  title: string;

  @ApiProperty({ 
    example: 'Venham celebrar conosco este momento especial!',
    description: 'Event description or host message (max 2000 characters)',
    required: false,
    maxLength: 2000
  })
  description?: string;

  @ApiProperty({ 
    example: 'wedding',
    description: 'Type of event',
    enum: EventType
  })
  eventType: EventType;

  @ApiProperty({ 
    example: 'https://example.com/cover.jpg',
    description: 'Cover image URL (must be valid URL)',
    required: false
  })
  coverImageUrl?: string;

  @ApiProperty({ 
    example: '#FF6B6B',
    description: 'Primary theme color (hex format)',
    required: false
  })
  primaryColor?: string;

  @ApiProperty({ 
    example: '#4ECDC4',
    description: 'Secondary theme color (hex format)',
    required: false
  })
  secondaryColor?: string;

  @ApiProperty({ 
    example: '#45B7D1',
    description: 'Tertiary theme color (hex format)',
    required: false
  })
  tertiaryColor?: string;

  @ApiProperty({ 
    example: 'Roboto',
    description: 'Font family name (max 100 characters)',
    required: false
  })
  fontFamily?: string;

  @ApiProperty({ 
    example: '2025-12-25',
    description: 'Event start date (YYYY-MM-DD format)',
    required: false
  })
  startDate?: string;

  @ApiProperty({ 
    example: '2025-12-20',
    description: 'Contribution end date (YYYY-MM-DD format)',
    required: false
  })
  endDate?: string;

  @ApiProperty({ 
    example: 'casamento-ana-joao-2025',
    description: 'Unique public URL slug (3-100 characters, alphanumeric and hyphens only)',
    minLength: 3,
    maxLength: 100
  })
  publicUrl: string;

  @ApiProperty({ 
    example: false,
    description: 'Whether the event should be published immediately',
    required: false,
    default: false
  })
  isPublished?: boolean;
}