import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'João Silva',
    description: 'Full name of the user (2-300 characters)',
    minLength: 2,
    maxLength: 300
  })
  name: string;

  @ApiProperty({ 
    example: 'joao@email.com',
    description: 'Valid email address (max 150 characters)'
  })
  email: string;

  @ApiProperty({ 
    example: 'MinhaSenh@123',
    description: 'Password (8-255 characters) - must contain at least one uppercase, one lowercase, one number and one special character'
  })
  password: string;

  @ApiProperty({ 
    example: 1,
    description: 'ID of the user who indicated this user (optional)',
    required: false
  })
  indicatedById?: number;
}