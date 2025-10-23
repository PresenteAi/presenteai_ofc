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
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GiftEventsService } from '../services/gift-events.service';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';
import { GiftEventResponseDto, PaginatedGiftEventResponseDto } from '../dto/gift-event-response.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Gift Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gift-events')
export class GiftEventsController {
  constructor(private readonly giftEventsService: GiftEventsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new gift event',
    description: 'Associates a gift template (base or customized) with a specific event'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Gift event created successfully',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @ApiResponse({ status: 409, description: 'Gift template already associated with this event' })
  async create(@Body() createGiftEventDto: CreateGiftEventDto): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.create(createGiftEventDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'List gift events',
    description: 'Lists all gift events with filters and pagination'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Gift events list returned successfully',
    type: PaginatedGiftEventResponseDto
  })
  async findAll(@Query() filters: GiftEventFiltersDto): Promise<PaginatedGiftEventResponseDto> {
    return await this.giftEventsService.findAll(filters);
  }

  @Get('event/:eventId')
  @ApiOperation({ 
    summary: 'List gifts for a specific event',
    description: 'Returns all gifts associated with a specific event'
  })
  @ApiParam({ name: 'eventId', description: 'Event ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Event gifts returned successfully',
    type: [GiftEventResponseDto]
  })
  async findByEventId(@Param('eventId', ParseIntPipe) eventId: number): Promise<GiftEventResponseDto[]> {
    return await this.giftEventsService.findByEventId(eventId);
  }

  @Get('event/:eventId/stats')
  @ApiOperation({ 
    summary: 'Event gift statistics',
    description: 'Returns aggregated statistics for gifts in an event'
  })
  @ApiParam({ name: 'eventId', description: 'Event ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics returned successfully',
    schema: {
      type: 'object',
      properties: {
        totalGifts: { type: 'number', example: 5 },
        completedGifts: { type: 'number', example: 2 },
        openGifts: { type: 'number', example: 3 },
        totalValue: { type: 'number', example: 2500.00 },
        collectedValue: { type: 'number', example: 1200.00 },
        averageProgress: { type: 'number', example: 48 },
      }
    }
  })
  async getEventStats(@Param('eventId', ParseIntPipe) eventId: number) {
    return await this.giftEventsService.getEventStats(eventId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Find gift event by ID',
    description: 'Returns details of a specific gift event'
  })
  @ApiParam({ name: 'id', description: 'Gift event ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Gift event found successfully',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 404, description: 'Gift event not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.findOne(id);
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Marcar presente como completo',
    description: 'Marca um presente como completado manualmente'
  })
  @ApiParam({ name: 'id', description: 'ID do presente no evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Presente marcado como completo',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async markAsCompleted(@Param('id', ParseIntPipe) id: number): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.markAsCompleted(id);
  }

  @Patch(':id/reopen')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Reabrir presente para contribuições',
    description: 'Reabre um presente completado para receber mais contribuições'
  })
  @ApiParam({ name: 'id', description: 'ID do presente no evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Presente reaberto com sucesso',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async reopenGift(@Param('id', ParseIntPipe) id: number): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.reopenGift(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remove gift event',
    description: 'Removes the association of a gift with an event'
  })
  @ApiParam({ name: 'id', description: 'Gift event ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Gift event removed successfully' })
  @ApiResponse({ status: 404, description: 'Gift event not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.giftEventsService.remove(id);
  }
}