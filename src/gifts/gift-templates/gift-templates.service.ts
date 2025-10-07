import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { GiftTemplatesRepository } from './gift-templates.repository';
import { CreateGiftTemplateDto } from './create-gift-template.dto';
import { UpdateGiftTemplateDto } from './update-gift-template.dto';
import { GiftTemplatePaginationDto } from '../dto/gift-template-pagination.dto';
import { GiftTemplateOutputDto } from '../dto/gift-output.dto';
import { PaginatedGiftTemplatesDto } from '../dto/paginated-gifts.dto';
import { EventType } from '../entities/gift-template.entity';

@Injectable()
export class GiftTemplatesService {
  constructor(
    private readonly repository: GiftTemplatesRepository,
  ) {}

  async create(dto: CreateGiftTemplateDto, userId: number): Promise<GiftTemplateOutputDto> {
    this.validateCreateDto(dto);
    
    const giftTemplate = await this.repository.create(dto, userId);
    return this.mapToOutputDto(giftTemplate);
  }

  async findAll(paginationDto: GiftTemplatePaginationDto): Promise<PaginatedGiftTemplatesDto> {
    const sanitizedDto = this.sanitizePaginationDto(paginationDto);
    const result = await this.repository.findAll(sanitizedDto);
    
    return {
      ...result,
      data: result.data.map(template => this.mapToOutputDto(template)),
    };
  }

  async findById(id: number): Promise<GiftTemplateOutputDto> {
    const giftTemplate = await this.repository.findById(id);
    return this.mapToOutputDto(giftTemplate);
  }

  async findByUserId(userId: number): Promise<GiftTemplateOutputDto[]> {
    const templates = await this.repository.findByUserId(userId);
    return templates.map(template => this.mapToOutputDto(template));
  }

  async update(id: number, dto: UpdateGiftTemplateDto, userId: number): Promise<GiftTemplateOutputDto> {
    // Verificar se o template existe e se o usuário é o dono
    const existingTemplate = await this.repository.findById(id);
    
    if (existingTemplate.createdByUserId !== userId) {
      throw new ForbiddenException('You can only update your own gift templates');
    }

    this.validateUpdateDto(dto);
    
    const updatedTemplate = await this.repository.update(id, dto);
    return this.mapToOutputDto(updatedTemplate);
  }

  async remove(id: number, userId: number): Promise<void> {
    // Verificar se o template existe e se o usuário é o dono
    const existingTemplate = await this.repository.findById(id);
    
    if (existingTemplate.createdByUserId !== userId) {
      throw new ForbiddenException('You can only delete your own gift templates');
    }

    await this.repository.remove(id);
  }

  async findPublicTemplates(): Promise<GiftTemplateOutputDto[]> {
    const templates = await this.repository.findPublicTemplates();
    return templates.map(template => this.mapToOutputDto(template));
  }

  async findByCategory(category: string): Promise<GiftTemplateOutputDto[]> {
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      throw new BadRequestException('Category is required');
    }

    const templates = await this.repository.findByCategory(category.trim());
    return templates.map(template => this.mapToOutputDto(template));
  }

  async findByEventType(eventType: EventType): Promise<GiftTemplateOutputDto[]> {
    if (!eventType || !Object.values(EventType).includes(eventType)) {
      throw new BadRequestException('Valid event type is required');
    }

    const templates = await this.repository.findByEventType(eventType);
    return templates.map(template => this.mapToOutputDto(template));
  }

  async getUserTemplatesCount(userId: number): Promise<number> {
    return await this.repository.countByUserId(userId);
  }

  private validateCreateDto(dto: CreateGiftTemplateDto): void {
    const errors: string[] = [];

    if (!dto.title || typeof dto.title !== 'string' || dto.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (dto.title && dto.title.length > 255) {
      errors.push('Title cannot exceed 255 characters');
    }

    if (dto.description && typeof dto.description !== 'string') {
      errors.push('Description must be a string');
    }

    if (dto.description && dto.description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    }

    if (dto.imageUrl && typeof dto.imageUrl !== 'string') {
      errors.push('Image URL must be a string');
    }

    if (dto.defaultValue && (typeof dto.defaultValue !== 'number' || dto.defaultValue < 0)) {
      errors.push('Default value must be a positive number');
    }

    if (dto.eventType && !Object.values(EventType).includes(dto.eventType)) {
      errors.push('Invalid event type');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '));
    }
  }

  private validateUpdateDto(dto: UpdateGiftTemplateDto): void {
    const errors: string[] = [];

    if (dto.title !== undefined) {
      if (!dto.title || typeof dto.title !== 'string' || dto.title.trim().length < 3) {
        errors.push('Title must be at least 3 characters long');
      }
      if (dto.title.length > 255) {
        errors.push('Title cannot exceed 255 characters');
      }
    }

    if (dto.description !== undefined && dto.description !== null) {
      if (typeof dto.description !== 'string') {
        errors.push('Description must be a string');
      }
      if (dto.description.length > 1000) {
        errors.push('Description cannot exceed 1000 characters');
      }
    }

    if (dto.defaultValue !== undefined && dto.defaultValue !== null) {
      if (typeof dto.defaultValue !== 'number' || dto.defaultValue < 0) {
        errors.push('Default value must be a positive number');
      }
    }

    if (dto.eventType !== undefined && dto.eventType !== null) {
      if (!Object.values(EventType).includes(dto.eventType)) {
        errors.push('Invalid event type');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '));
    }
  }

  private sanitizePaginationDto(dto: GiftTemplatePaginationDto): GiftTemplatePaginationDto {
    return {
      page: Math.max(1, dto.page || 1),
      limit: Math.min(100, Math.max(1, dto.limit || 10)),
      sortBy: ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt'].includes(dto.sortBy || '') 
        ? dto.sortBy : 'createdAt',
      sortOrder: dto.sortOrder === 'ASC' ? 'ASC' : 'DESC',
      search: dto.search ? dto.search.trim() : undefined,
      category: dto.category ? dto.category.trim() : undefined,
      eventType: dto.eventType && Object.values(EventType).includes(dto.eventType) 
        ? dto.eventType : undefined,
      isPublic: dto.isPublic,
      createdByUserId: dto.createdByUserId ? dto.createdByUserId : undefined,
    };
  }

  private mapToOutputDto(giftTemplate: any): GiftTemplateOutputDto {
    return {
      id: giftTemplate.id,
      title: giftTemplate.title,
      description: giftTemplate.description,
      imageUrl: giftTemplate.imageUrl,
      category: giftTemplate.category,
      defaultValue: giftTemplate.defaultValue ? parseFloat(giftTemplate.defaultValue) : undefined,
      eventType: giftTemplate.eventType,
      isPublic: giftTemplate.isPublic,
      createdByUserId: giftTemplate.createdByUserId,
      createdAt: giftTemplate.createdAt,
      updatedAt: giftTemplate.updatedAt,
      createdByUser: giftTemplate.createdByUser ? {
        id: giftTemplate.createdByUser.id,
        name: giftTemplate.createdByUser.name,
        email: giftTemplate.createdByUser.email,
      } : undefined,
    };
  }
}