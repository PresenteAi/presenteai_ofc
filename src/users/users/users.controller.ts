import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param,
  Put, 
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Req,
  BadRequestException
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
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // TODO: Implementar endpoints específicos para segurança:
  // PUT /users/:id/email - Alterar email (com confirmação)
  // PUT /users/:id/password - Alterar senha (com senha atual)
  // PUT /users/:id/status - Ativar/desativar usuário (admin only)
  // DELETE e /stats/count endpoints foram removidos por questões de segurança

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
    @Body() dto: CreateUserDto
  ): Promise<UserOutputDto> {
    return this.service.create(dto);
  }

  /**
   * Listar todos os usuários com paginação
   */
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all users with pagination',
    description: 'Retrieves a paginated list of users with optional search and sorting. Requires authentication.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully', 
    type: PaginatedUsersDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Authentication required' 
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', enum: ['name', 'email', 'createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for name or email' })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<PaginatedUsersDto> {
    return this.service.findAll(paginationDto);
  }

  /**
   * Buscar usuário por ID
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found successfully', 
    type: UserOutputDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Authentication required' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid UUID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  async findById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<UserOutputDto> {
    return this.service.findById(id);
  }

  /**
   * Atualizar usuário (apenas nome)
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update user name',
    description: 'Updates only the user name. Email, password and other sensitive fields have separate endpoints for security. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User name updated successfully', 
    type: UserOutputDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Authentication required' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or user ID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
    @Req() request: any
  ): Promise<UserOutputDto> {
    // Debug e fix para problema de Content-Type
    if (!updateDto || Object.keys(updateDto).length === 0) {
      // Tentar fazer parse manual do raw body se disponível
      if (request.rawBody || request.body) {
        try {
          const bodyText = request.rawBody || JSON.stringify(request.body);
          const parsedBody = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText;
          updateDto = parsedBody;
        } catch (error) {
          throw new BadRequestException('Invalid JSON in request body');
        }
      } else {
        throw new BadRequestException('Request body is required');
      }
    }
    
    return this.service.update(id, updateDto);
  }

  /**
   * Buscar usuário por email
   */
  @Get('email/:email')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user by email',
    description: 'Retrieves a user by their email address. Requires authentication.'
  })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found successfully', 
    type: UserOutputDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Authentication required' 
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  async findByEmail(
    @Param('email') email: string
  ): Promise<UserOutputDto | null> {
    return this.service.findByEmail(email);
  }

}
