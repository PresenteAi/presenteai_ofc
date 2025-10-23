import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '../entities/event.entity';

export class EventOutputDto {
  @ApiProperty({ 
    example: 1,
    description: 'Unique identifier of the event'
  })
  id: number;

  @ApiProperty({ 
    example: 1,
    description: 'Reference to the event organizer'
  })
  userId: number;

  @ApiProperty({ 
    example: 'Casamento Ana & João',
    description: 'Event title'
  })
  title: string;

  @ApiProperty({ 
    example: 'Venham celebrar conosco este momento especial!',
    description: 'Event description or host message',
    required: false
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
    description: 'Cover image URL',
    required: false
  })
  coverImageUrl?: string;

  @ApiProperty({ 
    example: '#FF6B6B',
    description: 'Primary theme color',
    required: false
  })
  primaryColor?: string;

  @ApiProperty({ 
    example: '#4ECDC4',
    description: 'Secondary theme color',
    required: false
  })
  secondaryColor?: string;

  @ApiProperty({ 
    example: '#45B7D1',
    description: 'Tertiary theme color',
    required: false
  })
  tertiaryColor?: string;

  @ApiProperty({ 
    example: 'Roboto',
    description: 'Font family used in the event page',
    required: false
  })
  fontFamily?: string;

  @ApiProperty({ 
    example: '2025-12-25',
    description: 'Event start date',
    required: false
  })
  startDate?: string;

  @ApiProperty({ 
    example: '2025-12-20',
    description: 'Contribution end date',
    required: false
  })
  endDate?: string;

  @ApiProperty({ 
    example: 'casamento-ana-joao-2025',
    description: 'Unique public URL slug for guests'
  })
  publicUrl: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event is publicly visible'
  })
  isPublished: boolean;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event is active'
  })
  isActive: boolean;

  @ApiProperty({ 
    example: '2025-10-06T12:00:00Z',
    description: 'Date when the event was created'
  })
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-10-06T12:00:00Z',
    description: 'Date when the event was last updated'
  })
  updatedAt: Date;

  @ApiProperty({ 
    example: {
      id: 'user-uuid',
      name: 'João Silva',
      email: 'joao@email.com'
    },
    description: 'Event organizer information',
    required: false
  })
  user?: {
    id: string;
    name: string;
    email: string;
  };
}