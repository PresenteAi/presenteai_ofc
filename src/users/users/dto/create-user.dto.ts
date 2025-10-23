import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsInt, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'João Silva',
    description: 'Full name of the user (2-300 characters)',
    minLength: 2,
    maxLength: 300
  })
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  name: string;

  @ApiProperty({ 
    example: 'joao@email.com',
    description: 'Valid email address (max 150 characters)'
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ 
    example: 'MinhaSenh@123',
    description: 'Password (8-255 characters) - must contain at least one uppercase, one lowercase, one number and one special character'
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  @ApiProperty({ 
    example: 1,
    description: 'ID of the user who indicated this user (optional)',
    required: false
  })
  @IsOptional()
  @IsInt()
  indicatedById?: number;
}