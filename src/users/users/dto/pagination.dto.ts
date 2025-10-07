import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
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
    example: 'name',
    description: 'Field to sort by',
    enum: ['name', 'email', 'createdAt', 'updatedAt'],
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
    example: 'João',
    description: 'Search term for name or email',
    required: false
  })
  search?: string;
}