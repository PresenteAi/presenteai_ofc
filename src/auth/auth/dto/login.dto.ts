import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'joao@email.com',
    description: 'User email address'
  })
  email: string;

  @ApiProperty({ 
    example: 'Senha123!',
    description: 'User password'
  })
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
    id: string;
    name: string;
    email: string;
  };
}