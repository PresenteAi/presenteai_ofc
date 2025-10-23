import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users/users.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { JwtPayload } from '../strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Realiza login do usuário
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    await this.validateLoginDto(loginDto);
    
    const user = await this.usersService.validatePassword(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    console.log('Creating JWT with payload:', JSON.stringify(payload, null, 2));
    console.log('User ID type:', typeof user.id);

    const accessToken = this.jwtService.sign(payload);
    
    console.log('JWT created successfully, token length:', accessToken.length);

    return {
      accessToken,
      tokenType: 'bearer',
      expiresIn: 3600, // 1 hour
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Valida e sanitiza dados de login
   */
  private async validateLoginDto(dto: LoginDto): Promise<void> {
    const errors: string[] = [];

    // Validar email
    if (!dto.email || typeof dto.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else {
      const email = dto.email.trim().toLowerCase();
      if (!email) {
        errors.push('Email cannot be empty');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
      }
      dto.email = email;
    }

    // Validar senha
    if (!dto.password || typeof dto.password !== 'string') {
      errors.push('Password is required and must be a string');
    } else if (dto.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}
