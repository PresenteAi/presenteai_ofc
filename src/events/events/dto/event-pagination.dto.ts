import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '../entities/event.entity';

export class EventPaginationDto {
  @ApiProperty({ 
    example: 1,
    description: 'Page number (minimum 1)',
    minimum: 1,
    default: 1,
    required: false
  })
  page?: number = 1;

  @ApiProperty({ 
    example: 10,
    description: 'Number of items per page (1-100)',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false
  })
  limit?: number = 10;

  @ApiProperty({ 
    example: 'title',
    description: 'Field to sort by',
    enum: ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'],
    required: false
  })
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    example: 'DESC',
    description: 'Sort direction',
    enum: ['ASC', 'DESC'],
    required: false
  })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ 
    example: 'Casamento',
    description: 'Search term for title or description',
    required: false
  })
  search?: string;

  @ApiProperty({ 
    example: 'wedding',
    description: 'Filter by event type',
    enum: EventType,
    required: false
  })
  eventType?: EventType;

  @ApiProperty({ 
    example: 'uuid-string',
    description: 'Filter by user/organizer ID',
    required: false
  })
  userId?: string;

  @ApiProperty({ 
    example: true,
    description: 'Filter by published status',
    required: false
  })
  isPublished?: boolean;

  @ApiProperty({ 
    example: true,
    description: 'Filter by active status',
    required: false
  })
  isActive?: boolean;
}