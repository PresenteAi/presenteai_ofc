import { ApiProperty } from '@nestjs/swagger';

export class UserOutputDto {
  @ApiProperty({ 
    example: 1,
    description: 'Unique identifier of the user'
  })
  id: number;

  @ApiProperty({ 
    example: 'João Silva',
    description: 'Full name of the user'
  })
  name: string;

  @ApiProperty({ 
    example: 'joao@email.com',
    description: 'Email address of the user'
  })
  email: string;

  @ApiProperty({ 
    example: true,
    description: 'Indicates if the user is active'
  })
  isActive: boolean;

  @ApiProperty({ 
    example: false,
    description: 'Indicates if the user was indicated by another user'
  })
  isIndicated: boolean;

  @ApiProperty({ 
    example: 1,
    description: 'ID of the user who indicated this user',
    required: false
  })
  indicatedById?: number;

  @ApiProperty({ 
    example: '2025-10-06T12:00:00Z',
    description: 'Date when the user was created'
  })
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-10-06T12:00:00Z',
    description: 'Date when the user was last updated'
  })
  updatedAt: Date;

  @ApiProperty({ 
    example: '2025-10-06T12:00:00Z',
    description: 'Date of the last login',
    required: false
  })
  lastLoginAt?: Date;
}
