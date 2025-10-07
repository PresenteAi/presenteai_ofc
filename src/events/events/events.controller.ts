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
  ParseUUIDPipe,
  ValidationPipe,
  Patch,
  ForbiddenException
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
  ApiQuery
} from '@nestjs/swagger';

@ApiTags('events')
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
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) 
    dto: CreateEventDto,
    @UserId() userId: string
  ): Promise<EventOutputDto> {
    // Set the userId from the authenticated user
    dto.userId = userId;
    return this.service.create(dto);
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
    @Query(new ValidationPipe({ transform: true })) 
    paginationDto: EventPaginationDto,
    @UserId() userId: string
  ): Promise<PaginatedEventsDto> {
    // Force the userId filter to show only user's own events
    paginationDto.userId = userId;
    return this.service.findAll(paginationDto);
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
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) 
    updateDto: UpdateEventDto,
    @UserId() userId: string
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
    summary: 'Remove event',
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
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string
  ): Promise<void> {
    // Check if event belongs to user before deleting
    const event = await this.service.findById(id);
    if (event.userId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }
    return this.service.remove(id);
  }

  /**
   * Publicar/despublicar evento
   */
  @Patch(':id/publish')
  @ApiOperation({ 
    summary: 'Toggle event publish status',
    description: 'Publishes or unpublishes an event. Users can only modify their own events.'
  })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Event publish status updated successfully', 
    type: EventOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid UUID format or request body' 
  })
  @ApiNotFoundResponse({ 
    description: 'Event not found' 
  })
  @ApiForbiddenResponse({ 
    description: 'You can only modify your own events' 
  })
  async togglePublish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { isPublished: boolean },
    @UserId() userId: string
  ): Promise<EventOutputDto> {
    if (typeof body.isPublished !== 'boolean') {
      throw new Error('isPublished must be a boolean');
    }
    // Check if event belongs to user before updating
    const event = await this.service.findById(id);
    if (event.userId !== userId) {
      throw new ForbiddenException('You can only modify your own events');
    }
    return this.service.togglePublish(id, body.isPublished);
  }

  /**
   * Contar eventos ativos
   */
  @Public()
  @Get('stats/count')
  @ApiOperation({ 
    summary: 'Count active events',
    description: 'Returns the total number of active events in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Event count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 75 }
      }
    }
  })
  async countActiveEvents(): Promise<{ count: number }> {
    const count = await this.service.countActiveEvents();
    return { count };
  }

  // Removed countByUserId method - users can get their count via findAll pagination

  /**
   * Buscar eventos próximos do vencimento
   */
  @Public()
  @Get('stats/upcoming')
  @ApiOperation({ 
    summary: 'Get upcoming events',
    description: 'Returns events that are ending soon (within specified number of days)'
  })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to look ahead (default: 7)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Upcoming events retrieved successfully',
    type: [EventOutputDto]
  })
  async findUpcomingEvents(
    @Query('days') days?: number
  ): Promise<EventOutputDto[]> {
    const daysToCheck = days && days > 0 && days <= 30 ? days : 7;
    return this.service.findUpcomingEvents(daysToCheck);
  }
}
