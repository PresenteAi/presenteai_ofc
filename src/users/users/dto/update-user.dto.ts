import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ 
    example: 'João Silva Santos',
    description: 'Full name of the user (2-300 characters)',
    minLength: 2,
    maxLength: 300,
    required: false
  })
  name?: string;

  @ApiProperty({ 
    example: 'novoemail@email.com',
    description: 'Valid email address (max 150 characters)',
    required: false
  })
  email?: string;

  @ApiProperty({ 
    example: 'NovaSenh@456',
    description: 'Password (8-255 characters) - must contain at least one uppercase, one lowercase, one number and one special character',
    required: false
  })
  password?: string;

  @ApiProperty({ 
    example: true,
    description: 'Indicates if the user is active',
    required: false
  })
  isActive?: boolean;

  @ApiProperty({ 
    example: 2,
    description: 'ID of the user who indicated this user (optional)',
    required: false
  })
  indicatedById?: number;
}