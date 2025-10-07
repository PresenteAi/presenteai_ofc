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
import { UpdateGiftEventDto } from '../dto/update-gift-event.dto';
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
    summary: 'Criar um novo presente no evento',
    description: 'Associa um template de presente (base ou personalizado) a um evento específico'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Presente criado com sucesso no evento',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  @ApiResponse({ status: 409, description: 'Template de presente já associado ao evento' })
  async create(@Body() createGiftEventDto: CreateGiftEventDto): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.create(createGiftEventDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar presentes de eventos',
    description: 'Lista todos os presentes associados a eventos com filtros e paginação'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de presentes retornada com sucesso',
    type: PaginatedGiftEventResponseDto
  })
  async findAll(@Query() filters: GiftEventFiltersDto): Promise<PaginatedGiftEventResponseDto> {
    return await this.giftEventsService.findAll(filters);
  }

  @Get('event/:eventId')
  @ApiOperation({ 
    summary: 'Listar presentes de um evento específico',
    description: 'Retorna todos os presentes associados a um evento específico'
  })
  @ApiParam({ name: 'eventId', description: 'ID do evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Presentes do evento retornados com sucesso',
    type: [GiftEventResponseDto]
  })
  async findByEventId(@Param('eventId', ParseIntPipe) eventId: number): Promise<GiftEventResponseDto[]> {
    return await this.giftEventsService.findByEventId(eventId);
  }

  @Get('event/:eventId/stats')
  @ApiOperation({ 
    summary: 'Estatísticas dos presentes de um evento',
    description: 'Retorna estatísticas agregadas dos presentes de um evento'
  })
  @ApiParam({ name: 'eventId', description: 'ID do evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas retornadas com sucesso',
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
    summary: 'Buscar presente por ID',
    description: 'Retorna os detalhes de um presente específico no evento'
  })
  @ApiParam({ name: 'id', description: 'ID do presente no evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Presente encontrado com sucesso',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar presente no evento',
    description: 'Atualiza informações de um presente específico no evento'
  })
  @ApiParam({ name: 'id', description: 'ID do presente no evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Presente atualizado com sucesso',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  @ApiResponse({ status: 409, description: 'Conflito com template existente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGiftEventDto: UpdateGiftEventDto,
  ): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.update(id, updateGiftEventDto);
  }

  @Patch(':id/contribution')
  @ApiOperation({ 
    summary: 'Adicionar contribuição ao presente',
    description: 'Adiciona uma contribuição ao valor coletado do presente'
  })
  @ApiParam({ name: 'id', description: 'ID do presente no evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contribuição adicionada com sucesso',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 400, description: 'Valor de contribuição inválido' })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async addContribution(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amount: number },
  ): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.addContribution(id, body.amount);
  }

  @Patch(':id/collected-value')
  @ApiOperation({ 
    summary: 'Atualizar valor coletado',
    description: 'Define diretamente o valor total coletado do presente'
  })
  @ApiParam({ name: 'id', description: 'ID do presente no evento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Valor coletado atualizado com sucesso',
    type: GiftEventResponseDto
  })
  @ApiResponse({ status: 400, description: 'Valor inválido fornecido' })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async updateCollectedValue(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { collectedValue: number },
  ): Promise<GiftEventResponseDto> {
    return await this.giftEventsService.updateCollectedValue(id, body.collectedValue);
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
    summary: 'Remover presente do evento',
    description: 'Remove a associação de um presente com um evento'
  })
  @ApiParam({ name: 'id', description: 'ID do presente no evento', type: 'number' })
  @ApiResponse({ status: 204, description: 'Presente removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.giftEventsService.remove(id);
  }
}