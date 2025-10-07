import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString, IsIn, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../entities/event.entity';

export class EventPaginationDto {
  @ApiProperty({ 
    example: 1,
    description: 'Page number (minimum 1)',
    minimum: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    example: 10,
    description: 'Number of items per page (1-100)',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ 
    example: 'title',
    description: 'Field to sort by',
    enum: ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsIn(['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'])
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    example: 'DESC',
    description: 'Sort direction',
    enum: ['ASC', 'DESC'],
    required: false
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ 
    example: 'Casamento',
    description: 'Search term for title or description',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: 'wedding',
    description: 'Filter by event type',
    enum: EventType,
    required: false
  })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiProperty({ 
    example: 1,
    description: 'Filter by user/organizer ID',
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @ApiProperty({ 
    example: true,
    description: 'Filter by published status',
    required: false
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ 
    example: true,
    description: 'Filter by active status',
    required: false
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}