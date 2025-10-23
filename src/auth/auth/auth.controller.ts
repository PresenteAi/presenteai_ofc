import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser, UserId } from '../decorators/current-user.decorator';

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
    @Body() dto: LoginDto
  ): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  /**
   * Teste de autenticação - verifica se o JWT está funcionando
   */
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current user info',
    description: 'Returns the authenticated user information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User information retrieved successfully'
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or missing JWT token' 
  })
  async getMe(@UserId() userId: number, @CurrentUser() user: any): Promise<any> {
    return {
      success: true,
      userId: userId,
      userIdType: typeof userId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      message: 'Authentication working correctly!'
    };
  }
}
