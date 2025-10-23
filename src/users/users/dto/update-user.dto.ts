import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ 
    example: 'João Silva Santos',
    description: 'Full name of the user (2-300 characters)',
    minLength: 2,
    maxLength: 300,
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(300, { message: 'Name must not exceed 300 characters' })
  name?: string;

  // Email, password e indicatedById foram removidos por questões de segurança
  // Estes campos devem ter endpoints específicos para alteração com validações extras
}