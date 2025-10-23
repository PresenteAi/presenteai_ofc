import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { GiftEvent, GiftEventStatus } from '../../entities/gift-event.entity';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { UpdateGiftEventDto } from '../dto/update-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';

@Injectable()
export class GiftEventsRepository {
  constructor(
    @InjectRepository(GiftEvent)
    private readonly giftEventRepository: Repository<GiftEvent>,
  ) {}

  async create(createGiftEventDto: CreateGiftEventDto): Promise<GiftEvent> {
    const giftEvent = this.giftEventRepository.create(createGiftEventDto);
    return await this.giftEventRepository.save(giftEvent);
  }

  async findAll(filters?: GiftEventFiltersDto): Promise<[GiftEvent[], number]> {
    const {
      eventId,
      giftTemplateId,
      giftTemplateChangedId,
      status,
      minValue,
      maxValue,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters || {};

    const where: FindOptionsWhere<GiftEvent> = {};

    if (eventId) {
      where.eventId = eventId;
    }

    if (giftTemplateId) {
      where.giftTemplateId = giftTemplateId;
    }

    if (giftTemplateChangedId) {
      where.giftTemplateChangedId = giftTemplateChangedId;
    }

    if (status) {
      where.status = status;
    }

    const queryBuilder = this.giftEventRepository.createQueryBuilder('giftEvent')
      .leftJoinAndSelect('giftEvent.event', 'event')
      .leftJoinAndSelect('giftEvent.giftTemplate', 'giftTemplate')
      .leftJoinAndSelect('giftEvent.giftTemplateChanged', 'giftTemplateChanged')
      .leftJoinAndSelect('giftTemplateChanged.giftTemplate', 'changedGiftTemplate');

    // Aplicar filtros WHERE
    if (eventId) {
      queryBuilder.andWhere('giftEvent.eventId = :eventId', { eventId });
    }

    if (giftTemplateId) {
      queryBuilder.andWhere('giftEvent.giftTemplateId = :giftTemplateId', { giftTemplateId });
    }

    if (giftTemplateChangedId) {
      queryBuilder.andWhere('giftEvent.giftTemplateChangedId = :giftTemplateChangedId', { giftTemplateChangedId });
    }

    if (status) {
      queryBuilder.andWhere('giftEvent.status = :status', { status });
    }

    // Filtros de valor efetivo (mais complexos)
    if (minValue !== undefined || maxValue !== undefined) {
      // Subconsulta para calcular o valor efetivo
      queryBuilder.andWhere((qb) => {
        let valueCondition = `
          CASE 
            WHEN giftEvent.customValue IS NOT NULL THEN giftEvent.customValue
            WHEN giftTemplateChanged.value IS NOT NULL THEN giftTemplateChanged.value
            WHEN giftTemplate.defaultValue IS NOT NULL THEN giftTemplate.defaultValue
            ELSE 0
          END
        `;

        if (minValue !== undefined && maxValue !== undefined) {
          return `${valueCondition} BETWEEN :minValue AND :maxValue`;
        } else if (minValue !== undefined) {
          return `${valueCondition} >= :minValue`;
        } else if (maxValue !== undefined) {
          return `${valueCondition} <= :maxValue`;
        }
      });

      if (minValue !== undefined) {
        queryBuilder.setParameter('minValue', minValue);
      }
      if (maxValue !== undefined) {
        queryBuilder.setParameter('maxValue', maxValue);
      }
    }

    // Ordenação
    const validSortFields = ['id', 'createdAt', 'updatedAt', 'collectedValue'];
    if (validSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`giftEvent.${sortBy}`, sortOrder);
    } else if (sortBy === 'title') {
      // Ordenação especial para título efetivo
      queryBuilder.orderBy(`
        CASE 
          WHEN giftTemplateChanged.title IS NOT NULL THEN giftTemplateChanged.title
          WHEN changedGiftTemplate.title IS NOT NULL THEN changedGiftTemplate.title
          WHEN giftTemplate.title IS NOT NULL THEN giftTemplate.title
          ELSE 'Untitled Gift'
        END
      `, sortOrder);
    } else {
      queryBuilder.orderBy('giftEvent.createdAt', 'DESC');
    }

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    return await queryBuilder.getManyAndCount();
  }

  async findByEventId(eventId: number): Promise<GiftEvent[]> {
    return await this.giftEventRepository.find({
      where: { eventId },
      relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<GiftEvent | null> {
    return await this.giftEventRepository.findOne({
      where: { id },
      relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
    });
  }

  async findOneByEventAndTemplate(eventId: number, giftTemplateId?: number, giftTemplateChangedId?: number): Promise<GiftEvent | null> {
    const where: FindOptionsWhere<GiftEvent> = { eventId };

    if (giftTemplateId) {
      where.giftTemplateId = giftTemplateId;
      where.giftTemplateChangedId = null as any; // Garantir que não tenha o outro
    } else if (giftTemplateChangedId) {
      where.giftTemplateChangedId = giftTemplateChangedId;
      where.giftTemplateId = null as any; // Garantir que não tenha o outro
    }

    return await this.giftEventRepository.findOne({
      where,
      relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
    });
  }

  async update(id: number, updateGiftEventDto: UpdateGiftEventDto): Promise<GiftEvent | null> {
    await this.giftEventRepository.update(id, updateGiftEventDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.giftEventRepository.delete(id);
  }



  async markAsCompleted(id: number): Promise<GiftEvent | null> {
    const giftEvent = await this.findOne(id);
    if (!giftEvent) {
      return null;
    }

    // Auto-completar se o valor coletado >= valor efetivo
    const effectiveValue = giftEvent.getEffectiveValue();
    if (effectiveValue && Number(giftEvent.collectedValue) >= effectiveValue) {
      await this.giftEventRepository.update(id, { status: GiftEventStatus.COMPLETED });
      return await this.findOne(id);
    }

    return giftEvent;
  }

  async getStatsByEvent(eventId: number): Promise<{
    totalGifts: number;
    completedGifts: number;
    openGifts: number;
    totalValue: number;
    collectedValue: number;
    averageProgress: number;
  }> {
    const gifts = await this.findByEventId(eventId);
    
    const stats = gifts.reduce((acc, gift) => {
      const effectiveValue = gift.getEffectiveValue() || 0;
      const collected = Number(gift.collectedValue);
      
      acc.totalValue += effectiveValue;
      acc.collectedValue += collected;
      
      if (gift.isCompleted()) {
        acc.completedGifts++;
      } else {
        acc.openGifts++;
      }
      
      acc.totalGifts++;
      
      return acc;
    }, {
      totalGifts: 0,
      completedGifts: 0,
      openGifts: 0,
      totalValue: 0,
      collectedValue: 0,
      averageProgress: 0,
    });

    // Calcular progresso médio
    if (stats.totalValue > 0) {
      stats.averageProgress = Math.round((stats.collectedValue / stats.totalValue) * 100);
    }

    return stats;
  }
}