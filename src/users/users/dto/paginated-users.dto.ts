import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from './default.output.dto';

export class PaginatedUsersDto {
  @ApiProperty({ 
    type: [UserOutputDto],
    description: 'Array of users'
  })
  data: UserOutputDto[];

  @ApiProperty({ 
    example: 100,
    description: 'Total number of users'
  })
  total: number;

  @ApiProperty({ 
    example: 1,
    description: 'Current page number'
  })
  page: number;

  @ApiProperty({ 
    example: 10,
    description: 'Number of items per page'
  })
  limit: number;

  @ApiProperty({ 
    example: 10,
    description: 'Total number of pages'
  })
  totalPages: number;

  @ApiProperty({ 
    example: true,
    description: 'Whether there is a next page'
  })
  hasNext: boolean;

  @ApiProperty({ 
    example: false,
    description: 'Whether there is a previous page'
  })
  hasPrev: boolean;
}