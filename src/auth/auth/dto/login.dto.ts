import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'joao@email.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'MinhaSenh@123',
    description: 'User password'
  })
  @IsString()
  @MinLength(1)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token'
  })
  accessToken: string;

  @ApiProperty({ 
    example: 'bearer',
    description: 'Token type'
  })
  tokenType: string;

  @ApiProperty({ 
    example: 3600,
    description: 'Token expiration time in seconds'
  })
  expiresIn: number;

  @ApiProperty({ 
    example: {
      id: 'uuid-string',
      name: 'João Silva',
      email: 'joao@email.com'
    },
    description: 'User information'
  })
  user: {
    id: number;
    name: string;
    email: string;
  };
}