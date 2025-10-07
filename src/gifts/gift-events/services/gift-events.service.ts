import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { GiftEventsRepository } from '../repositories/gift-events.repository';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { UpdateGiftEventDto } from '../dto/update-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';
import { GiftEventResponseDto, PaginatedGiftEventResponseDto } from '../dto/gift-event-response.dto';
import { GiftEvent, GiftEventStatus } from '../../entities/gift-event.entity';

@Injectable()
export class GiftEventsService {
  constructor(
    private readonly giftEventsRepository: GiftEventsRepository,
  ) {}

  async create(createGiftEventDto: CreateGiftEventDto): Promise<GiftEventResponseDto> {
    // Validar que pelo menos um dos templates foi fornecido
    if (!createGiftEventDto.giftTemplateId && !createGiftEventDto.giftTemplateChangedId) {
      throw new BadRequestException('Either giftTemplateId or giftTemplateChangedId must be provided');
    }

    // Validar que apenas um dos templates foi fornecido
    if (createGiftEventDto.giftTemplateId && createGiftEventDto.giftTemplateChangedId) {
      throw new BadRequestException('Cannot provide both giftTemplateId and giftTemplateChangedId');
    }

    // Verificar se já existe um presente com o mesmo template no evento
    const existingGiftEvent = await this.giftEventsRepository.findOneByEventAndTemplate(
      createGiftEventDto.eventId,
      createGiftEventDto.giftTemplateId,
      createGiftEventDto.giftTemplateChangedId,
    );

    if (existingGiftEvent) {
      throw new ConflictException('Gift template is already associated with this event');
    }

    try {
      const giftEvent = await this.giftEventsRepository.create(createGiftEventDto);
      return new GiftEventResponseDto(giftEvent);
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint error
        throw new BadRequestException('Referenced event, gift template, or gift template changed does not exist');
      }
      throw error;
    }
  }

  async findAll(filters?: GiftEventFiltersDto): Promise<PaginatedGiftEventResponseDto> {
    const [giftEvents, total] = await this.giftEventsRepository.findAll(filters);

    const data = giftEvents.map(giftEvent => new GiftEventResponseDto(giftEvent));

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findByEventId(eventId: number): Promise<GiftEventResponseDto[]> {
    const giftEvents = await this.giftEventsRepository.findByEventId(eventId);
    return giftEvents.map(giftEvent => new GiftEventResponseDto(giftEvent));
  }

  async findOne(id: number): Promise<GiftEventResponseDto> {
    const giftEvent = await this.giftEventsRepository.findOne(id);

    if (!giftEvent) {
      throw new NotFoundException(`Gift event with ID ${id} not found`);
    }

    return new GiftEventResponseDto(giftEvent);
  }

  async update(id: number, updateGiftEventDto: UpdateGiftEventDto): Promise<GiftEventResponseDto> {
    const existingGiftEvent = await this.giftEventsRepository.findOne(id);

    if (!existingGiftEvent) {
      throw new NotFoundException(`Gift event with ID ${id} not found`);
    }

    // Validar mudanças de template se aplicável
    if (updateGiftEventDto.giftTemplateId || updateGiftEventDto.giftTemplateChangedId) {
      // Verificar se não está tentando definir ambos
      const newGiftTemplateId = updateGiftEventDto.giftTemplateId ?? existingGiftEvent.giftTemplateId;
      const newGiftTemplateChangedId = updateGiftEventDto.giftTemplateChangedId ?? existingGiftEvent.giftTemplateChangedId;

      if (newGiftTemplateId && newGiftTemplateChangedId) {
        throw new BadRequestException('Cannot have both giftTemplateId and giftTemplateChangedId');
      }

      if (!newGiftTemplateId && !newGiftTemplateChangedId) {
        throw new BadRequestException('Must have either giftTemplateId or giftTemplateChangedId');
      }

      // Verificar se não existe outro gift event no mesmo evento com o mesmo template
      if (newGiftTemplateId !== existingGiftEvent.giftTemplateId || 
          newGiftTemplateChangedId !== existingGiftEvent.giftTemplateChangedId) {
        
        const conflictingGiftEvent = await this.giftEventsRepository.findOneByEventAndTemplate(
          existingGiftEvent.eventId,
          newGiftTemplateId || undefined,
          newGiftTemplateChangedId || undefined,
        );

        if (conflictingGiftEvent && conflictingGiftEvent.id !== id) {
          throw new ConflictException('Gift template is already associated with this event');
        }
      }
    }

    try {
      const updatedGiftEvent = await this.giftEventsRepository.update(id, updateGiftEventDto);

      if (!updatedGiftEvent) {
        throw new NotFoundException(`Gift event with ID ${id} not found`);
      }

      // Auto-completar se necessário
      await this.checkAndMarkAsCompleted(updatedGiftEvent);

      // Recarregar para ter os dados atualizados
      const refreshedGiftEvent = await this.giftEventsRepository.findOne(id);
      return new GiftEventResponseDto(refreshedGiftEvent!);
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint error
        throw new BadRequestException('Referenced event, gift template, or gift template changed does not exist');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const giftEvent = await this.giftEventsRepository.findOne(id);

    if (!giftEvent) {
      throw new NotFoundException(`Gift event with ID ${id} not found`);
    }

    await this.giftEventsRepository.remove(id);
  }



  async markAsCompleted(id: number): Promise<GiftEventResponseDto> {
    const giftEvent = await this.giftEventsRepository.findOne(id);

    if (!giftEvent) {
      throw new NotFoundException(`Gift event with ID ${id} not found`);
    }

    if (giftEvent.isCompleted()) {
      return new GiftEventResponseDto(giftEvent);
    }

    const updatedGiftEvent = await this.giftEventsRepository.update(id, { 
      status: GiftEventStatus.COMPLETED 
    });

    if (!updatedGiftEvent) {
      throw new NotFoundException(`Gift event with ID ${id} not found after update`);
    }

    return new GiftEventResponseDto(updatedGiftEvent);
  }

  async reopenGift(id: number): Promise<GiftEventResponseDto> {
    const giftEvent = await this.giftEventsRepository.findOne(id);

    if (!giftEvent) {
      throw new NotFoundException(`Gift event with ID ${id} not found`);
    }

    if (!giftEvent.isCompleted()) {
      return new GiftEventResponseDto(giftEvent);
    }

    const updatedGiftEvent = await this.giftEventsRepository.update(id, { 
      status: GiftEventStatus.OPEN 
    });

    if (!updatedGiftEvent) {
      throw new NotFoundException(`Gift event with ID ${id} not found after update`);
    }

    return new GiftEventResponseDto(updatedGiftEvent);
  }

  async getEventStats(eventId: number): Promise<{
    totalGifts: number;
    completedGifts: number;
    openGifts: number;
    totalValue: number;
    collectedValue: number;
    averageProgress: number;
  }> {
    return await this.giftEventsRepository.getStatsByEvent(eventId);
  }

  private async checkAndMarkAsCompleted(giftEvent: GiftEvent): Promise<void> {
    if (giftEvent.status === GiftEventStatus.OPEN) {
      const effectiveValue = giftEvent.getEffectiveValue();
      if (effectiveValue && Number(giftEvent.collectedValue) >= effectiveValue) {
        await this.giftEventsRepository.update(giftEvent.id, { 
          status: GiftEventStatus.COMPLETED 
        });
      }
    }
  }
}