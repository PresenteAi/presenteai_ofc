import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';
import { GiftTemplatesService } from './gift-templates.service';
import { CreateGiftTemplateDto } from './create-gift-template.dto';
import { UpdateGiftTemplateDto } from './update-gift-template.dto';
import { GiftTemplatePaginationDto } from '../dto/gift-template-pagination.dto';
import { GiftTemplateOutputDto } from '../dto/gift-output.dto';
import { PaginatedGiftTemplatesDto } from '../dto/paginated-gifts.dto';
import { UserId } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { EventType } from '../entities/gift-template.entity';

@ApiTags('gift-templates')
@ApiBearerAuth()
@Controller('gift-templates')
export class GiftTemplatesController {
  constructor(private readonly giftTemplatesService: GiftTemplatesService) {}

  /**
   * Criar novo template de presente
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new gift template',
    description: 'Creates a new gift template that can be reused in events'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Gift template created successfully', 
    type: GiftTemplateOutputDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or validation failed' 
  })
  async create(
    @Body() dto: CreateGiftTemplateDto,
    @UserId() userId: number
  ): Promise<GiftTemplateOutputDto> {
    return this.giftTemplatesService.create(dto, userId);
  }

  /**
   * Listar templates de presentes com paginação e filtros
   */
  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'List gift templates with pagination and filters',
    description: 'Returns paginated list of gift templates with optional filters'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Gift templates retrieved successfully', 
    type: PaginatedGiftTemplatesDto 
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', enum: ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for title or description' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filter by event type', enum: EventType })
  @ApiQuery({ name: 'isPublic', required: false, description: 'Filter by public templates' })
  @ApiQuery({ name: 'createdByUserId', required: false, description: 'Filter by creator user ID' })
  async findAll(
    @Query() paginationDto: GiftTemplatePaginationDto
  ): Promise<PaginatedGiftTemplatesDto> {
    return this.giftTemplatesService.findAll(paginationDto);
  }

  /**
   * Listar apenas templates públicos
   */
  @Get('public')
  @Public()
  @ApiOperation({ 
    summary: 'List public gift templates',
    description: 'Returns all public gift templates available for reuse'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Public templates retrieved successfully', 
    type: [GiftTemplateOutputDto] 
  })
  async findPublic(): Promise<GiftTemplateOutputDto[]> {
    return this.giftTemplatesService.findPublicTemplates();
  }

  /**
   * Listar templates por categoria
   */
  @Get('category/:category')
  @Public()
  @ApiOperation({ 
    summary: 'List gift templates by category',
    description: 'Returns public gift templates filtered by category'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Templates by category retrieved successfully', 
    type: [GiftTemplateOutputDto] 
  })
  @ApiParam({ name: 'category', description: 'Category name to filter by' })
  @ApiBadRequestResponse({ description: 'Invalid category' })
  async findByCategory(
    @Param('category') category: string
  ): Promise<GiftTemplateOutputDto[]> {
    return this.giftTemplatesService.findByCategory(category);
  }

  /**
   * Listar templates por tipo de evento
   */
  @Get('event-type/:eventType')
  @Public()
  @ApiOperation({ 
    summary: 'List gift templates by event type',
    description: 'Returns public gift templates filtered by event type'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Templates by event type retrieved successfully', 
    type: [GiftTemplateOutputDto] 
  })
  @ApiParam({ name: 'eventType', description: 'Event type to filter by', enum: EventType })
  @ApiBadRequestResponse({ description: 'Invalid event type' })
  async findByEventType(
    @Param('eventType') eventType: EventType
  ): Promise<GiftTemplateOutputDto[]> {
    return this.giftTemplatesService.findByEventType(eventType);
  }

  /**
   * Listar templates do usuário atual
   */
  @Get('my-templates')
  @ApiOperation({ 
    summary: 'List current user gift templates',
    description: 'Returns all gift templates created by the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User templates retrieved successfully', 
    type: [GiftTemplateOutputDto] 
  })
  async findMyTemplates(
    @UserId() userId: number
  ): Promise<GiftTemplateOutputDto[]> {
    return this.giftTemplatesService.findByUserId(userId);
  }

  /**
   * Buscar template por ID
   */
  @Get(':id')
  @Public()
  @ApiOperation({ 
    summary: 'Get gift template by ID',
    description: 'Returns a specific gift template by its ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Gift template retrieved successfully', 
    type: GiftTemplateOutputDto 
  })
  @ApiNotFoundResponse({ description: 'Gift template not found' })
  @ApiParam({ name: 'id', description: 'Gift template ID' })
  async findById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<GiftTemplateOutputDto> {
    return this.giftTemplatesService.findById(id);
  }

  /**
   * Atualizar template de presente
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update gift template',
    description: 'Updates a gift template (only the creator can update)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Gift template updated successfully', 
    type: GiftTemplateOutputDto 
  })
  @ApiNotFoundResponse({ description: 'Gift template not found' })
  @ApiForbiddenResponse({ description: 'You can only update your own templates' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiParam({ name: 'id', description: 'Gift template ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGiftTemplateDto,
    @UserId() userId: number
  ): Promise<GiftTemplateOutputDto> {
    return this.giftTemplatesService.update(id, dto, userId);
  }

  /**
   * Deletar template de presente
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete gift template',
    description: 'Deletes a gift template (only the creator can delete)'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Gift template deleted successfully' 
  })
  @ApiNotFoundResponse({ description: 'Gift template not found' })
  @ApiForbiddenResponse({ description: 'You can only delete your own templates' })
  @ApiParam({ name: 'id', description: 'Gift template ID' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<void> {
    return this.giftTemplatesService.remove(id, userId);
  }
}