import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { Public } from '../decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login de usuário
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful', 
    type: LoginResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid credentials' 
  })
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) 
    loginDto: LoginDto
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
}
