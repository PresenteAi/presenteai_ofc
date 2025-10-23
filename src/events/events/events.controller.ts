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
  ParseIntPipe,
  Patch,
  ForbiddenException,
  Req
} from '@nestjs/common';
import { UsersService } from '../../users/users/users.service';
import { EventsService } from './events.service';
import { Public } from '../../auth/decorators/public.decorator';
import { CurrentUser, UserId } from '../../auth/decorators/current-user.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventPaginationDto } from './dto/event-pagination.dto';
import { PaginatedEventsDto } from './dto/paginated-events.dto';
import { EventOutputDto } from './dto/event-output.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  /**
   * Criar um novo evento
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new event',
    description: 'Creates a new event with validation checks and generates a unique public URL'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Event created successfully', 
    type: EventOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or validation failed' 
  })
  @ApiConflictResponse({ 
    description: 'Public URL already exists' 
  })
  async create(
    @Body() dto: CreateEventDto,
    @UserId() userId: number
  ): Promise<EventOutputDto> {
    try {
      console.log('Creating event for userId:', userId, "userId type:", typeof userId);
      console.log('DTO received:', JSON.stringify(dto, null, 2));
      
      // Set the userId from the authenticated user
      dto.userId = userId;
      
      console.log('DTO after userId set:', JSON.stringify(dto, null, 2));
      
      return this.service.create(dto);
    } catch (error) {
      console.error('Error creating event:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error:', error);
      throw error;
    }
  }

  /**
   * Listar todos os eventos com paginação e filtros
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all events with pagination and filters',
    description: 'Retrieves a paginated list of events with optional search, filters and sorting'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Events retrieved successfully', 
    type: PaginatedEventsDto 
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', enum: ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for title or description' })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filter by event type' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by organizer user ID' })
  @ApiQuery({ name: 'isPublished', required: false, description: 'Filter by published status' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  async findAll(
    @Query() paginationDto: EventPaginationDto,
    @UserId() currentUserId: number,
    @Req() req: any
  ): Promise<PaginatedEventsDto> {
    console.log('=== RAW QUERY DEBUG ===');
    console.log('Raw query string:', req.url);
    console.log('Raw query object:', req.query);
    console.log('Parsed DTO:', JSON.stringify(paginationDto, null, 2));
    
    // FORÇA A CONVERSÃO MANUAL DOS PARÂMETROS
    const rawQuery = req.query;
    
    // Reconstruir DTO manualmente com conversões corretas
    const fixedDto: any = {
      page: parseInt(rawQuery.page) || 1,
      limit: parseInt(rawQuery.limit) || 10,
      sortBy: rawQuery.sortBy || 'createdAt',
      sortOrder: rawQuery.sortOrder || 'DESC',
      search: rawQuery.search,
      eventType: rawQuery.eventType,
      userId: rawQuery.userId ? parseInt(rawQuery.userId) : currentUserId,
    };
    
    // Conversão FORÇADA dos booleans
    if (rawQuery.isPublished !== undefined) {
      fixedDto.isPublished = rawQuery.isPublished === 'true';
      console.log('isPublished FORCED conversion:', rawQuery.isPublished, '->', fixedDto.isPublished);
    }
    
    if (rawQuery.isActive !== undefined) {
      fixedDto.isActive = rawQuery.isActive === 'true';
      console.log('isActive FORCED conversion:', rawQuery.isActive, '->', fixedDto.isActive);
    }
    
    console.log('FINAL DTO after manual conversion:', JSON.stringify(fixedDto, null, 2));
    
    return this.service.findAll(fixedDto as EventPaginationDto);
  }

  /**
   * Buscar evento por ID
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get event by ID',
    description: 'Retrieves a specific event by their unique identifier'
  })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Event found successfully', 
    type: EventOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid UUID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'Event not found' 
  })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<EventOutputDto> {
    // Check if event belongs to user
    const event = await this.service.findById(id);
    if (event.userId !== userId) {
      throw new ForbiddenException('You can only access your own events');
    }
    return event;
  }

    /**
   * Buscar evento por URL pública (público)
   */
  @Public()
  @Get('public/:publicUrl')
  @ApiOperation({ 
    summary: 'Get event by public URL',
    description: 'Retrieves a published event by its public URL slug'
  })
  @ApiParam({ name: 'publicUrl', description: 'Event public URL slug' })
  @ApiResponse({ 
    status: 200, 
    description: 'Event found successfully', 
    type: EventOutputDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Event not found or not published' 
  })
  async findByPublicUrl(
    @Param('publicUrl') publicUrl: string
  ): Promise<EventOutputDto | null> {
    return this.service.findByPublicUrl(publicUrl);
  }

  // Removed findByUserId method - users can only see their own events via findAll

  /**
   * Atualizar evento
   */
  @Put(':id')
  @ApiOperation({ 
    summary: 'Update event',
    description: 'Updates event information. Only provided fields will be updated. Users can only update their own events.'
  })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Event updated successfully', 
    type: EventOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or UUID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'Event not found' 
  })
  @ApiConflictResponse({ 
    description: 'Public URL already exists' 
  })
  @ApiForbiddenResponse({ 
    description: 'You can only update your own events' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEventDto,
    @UserId() userId: number
  ): Promise<EventOutputDto> {
    // Check if event belongs to user before updating
    const event = await this.service.findById(id);
    if (event.userId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }
    return this.service.update(id, updateDto);
  }

  /**
   * Remover evento (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Unpublish (deactivate) event',
    description: 'Deactivates an event (soft delete). The event will be marked as inactive instead of being permanently deleted. Users can only delete their own events.'
  })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ 
    status: 204, 
    description: 'Event deactivated successfully' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid UUID format' 
  })
  @ApiNotFoundResponse({ 
    description: 'Event not found' 
  })
  @ApiForbiddenResponse({ 
    description: 'You can only delete your own events' 
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<void> {
    // Check if event belongs to user before deleting
    const event = await this.service.findById(id);
    if (event.userId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }
    return this.service.remove(id);
  }
}
