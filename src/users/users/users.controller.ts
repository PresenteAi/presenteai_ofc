import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Put, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { UserOutputDto } from './dto/default.output.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  /**
   * Criar um novo usuário
   */
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user with encrypted password and validation checks'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully', 
    type: UserOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or validation failed' 
  })
  @ApiConflictResponse({ 
    description: 'Email already exists' 
  })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) 
    dto: CreateUserDto
  ): Promise<UserOutputDto> {
    return this.service.create(dto);
  }

  /**
   * Listar todos os usuários com paginação
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all users with pagination',
    description: 'Retrieves a paginated list of users with optional search and sorting'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully', 
    type: PaginatedUsersDto 
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', enum: ['name', 'email', 'createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for name or email' })
  async findAll(
    @Query(new ValidationPipe({ transform: true })) 
    paginationDto: PaginationDto
  ): Promise<PaginatedUsersDto> {
    return this.service.findAll(paginationDto);
  }

  /**
   * Buscar usuário por ID
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier'
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found successfully', 
    type: UserOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid UUID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<UserOutputDto> {
    return this.service.findById(id);
  }

  /**
   * Atualizar usuário
   */
  @Put(':id')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Updates user information. Only provided fields will be updated.'
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully', 
    type: UserOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or UUID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  @ApiConflictResponse({ 
    description: 'Email already exists' 
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) 
    updateDto: UpdateUserDto
  ): Promise<UserOutputDto> {
    return this.service.update(id, updateDto);
  }

  /**
   * Remover usuário (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remove user',
    description: 'Deactivates a user (soft delete). The user will be marked as inactive instead of being permanently deleted.'
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ 
    status: 204, 
    description: 'User deactivated successfully' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid UUID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<void> {
    return this.service.remove(id);
  }

  /**
   * Buscar usuário por email
   */
  @Get('email/:email')
  @ApiOperation({ 
    summary: 'Get user by email',
    description: 'Retrieves a user by their email address'
  })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found successfully', 
    type: UserOutputDto 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  async findByEmail(
    @Param('email') email: string
  ): Promise<UserOutputDto | null> {
    return this.service.findByEmail(email);
  }

  /**
   * Contar usuários ativos
   */
  @Get('stats/count')
  @ApiOperation({ 
    summary: 'Count active users',
    description: 'Returns the total number of active users in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 150 }
      }
    }
  })
  async countActiveUsers(): Promise<{ count: number }> {
    const count = await this.service.countActiveUsers();
    return { count };
  }
}
