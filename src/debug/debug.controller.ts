import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { UsersService } from '../users/users/users.service';

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Public()
  @ApiOperation({ summary: 'Lista todos os usuários (debug)' })
  async getAllUsers() {
    try {
      const users = await this.usersService.findAll({ page: 1, limit: 100 });
      return {
        success: true,
        count: users.data.length,
        users: users.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  @Get('test-find-user')
  @Public()
  @ApiOperation({ summary: 'Testa buscar usuário por ID' })
  async testFindUser() {
    try {
      // Tenta buscar usuário com ID 1
      const user = await this.usersService.findById(1);
      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  @Post('create-test-user')
  @Public()
  @ApiOperation({ summary: 'Cria um usuário de teste' })
  async createTestUser() {
    try {
      const user = await this.usersService.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!'
      });
      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }
}