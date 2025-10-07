import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { GiftTemplate, EventType } from '../entities/gift-template.entity';
import { CreateGiftTemplateDto } from './create-gift-template.dto';
import { UpdateGiftTemplateDto } from './update-gift-template.dto';
import { GiftTemplatePaginationDto } from '../dto/gift-template-pagination.dto';

@Injectable()
export class GiftTemplatesRepository {
  constructor(
    @InjectRepository(GiftTemplate)
    private readonly repository: Repository<GiftTemplate>,
  ) {}

  async create(dto: CreateGiftTemplateDto, createdByUserId: number): Promise<GiftTemplate> {
    const giftTemplate = this.repository.create({
      ...dto,
      createdByUserId,
    });

    return await this.repository.save(giftTemplate);
  }

  async findAll(paginationDto: GiftTemplatePaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      category,
      eventType,
      isPublic,
      createdByUserId,
    } = paginationDto;

    const queryBuilder = this.repository.createQueryBuilder('giftTemplate')
      .leftJoinAndSelect('giftTemplate.createdByUser', 'user');

    // Aplicar filtros
    if (search) {
      queryBuilder.andWhere(
        '(giftTemplate.title LIKE :search OR giftTemplate.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (category) {
      queryBuilder.andWhere('giftTemplate.category = :category', { category });
    }

    if (eventType) {
      queryBuilder.andWhere('giftTemplate.eventType = :eventType', { eventType });
    }

    if (isPublic !== undefined) {
      queryBuilder.andWhere('giftTemplate.isPublic = :isPublic', { isPublic });
    }

    if (createdByUserId) {
      queryBuilder.andWhere('giftTemplate.createdByUserId = :createdByUserId', { createdByUserId });
    }

    // Ordenação
    const validSortFields = ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`giftTemplate.${sortField}`, sortOrder);

    // Paginação
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasPrevious: page > 1,
      hasNext: page < Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<GiftTemplate> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new BadRequestException('Invalid gift template ID');
    }

    const giftTemplate = await this.repository.findOne({
      where: { id },
      relations: ['createdByUser'],
    });

    if (!giftTemplate) {
      throw new NotFoundException('Gift template not found');
    }

    return giftTemplate;
  }

  async findByUserId(userId: number): Promise<GiftTemplate[]> {
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      return [];
    }

    return await this.repository.find({
      where: { createdByUserId: userId },
      relations: ['createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateData: UpdateGiftTemplateDto): Promise<GiftTemplate> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new BadRequestException('Invalid gift template ID');
    }

    const existingTemplate = await this.findById(id);

    await this.repository.update(id, {
      ...updateData,
      updatedAt: new Date(),
    });

    return await this.findById(id);
  }

  async remove(id: number): Promise<void> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new BadRequestException('Invalid gift template ID');
    }

    const template = await this.findById(id);
    await this.repository.remove(template);
  }

  async countByUserId(userId: number): Promise<number> {
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      return 0;
    }

    return await this.repository.count({
      where: { createdByUserId: userId },
    });
  }

  async findPublicTemplates(): Promise<GiftTemplate[]> {
    return await this.repository.find({
      where: { isPublic: true },
      relations: ['createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<GiftTemplate[]> {
    if (!category) {
      return [];
    }

    return await this.repository.find({
      where: { 
        category,
        isPublic: true 
      },
      relations: ['createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEventType(eventType: EventType): Promise<GiftTemplate[]> {
    return await this.repository.find({
      where: { 
        eventType,
        isPublic: true 
      },
      relations: ['createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }
}