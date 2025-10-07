import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftTemplateChanged } from '../entities/gift-template-changed.entity';
import { GiftTemplate } from '../entities/gift-template.entity';
import { CreateGiftTemplateChangedDto } from './create-gift-template-changed.dto';
import { UpdateGiftTemplateChangedDto } from './update-gift-template-changed.dto';
import { GiftTemplatesChangedRepository } from './gift-templates-changed.repository';

@Injectable()
export class GiftTemplatesChangedService {
  constructor(
    private readonly giftTemplatesChangedRepository: GiftTemplatesChangedRepository,
    @InjectRepository(GiftTemplate)
    private readonly giftTemplateRepository: Repository<GiftTemplate>,
  ) {}

  async create(
    createGiftTemplateChangedDto: CreateGiftTemplateChangedDto,
    userId: number,
  ): Promise<GiftTemplateChanged> {
    // Verificar se o template base existe
    const giftTemplate = await this.giftTemplateRepository.findOne({
      where: { id: createGiftTemplateChangedDto.giftTemplateId },
    });

    if (!giftTemplate) {
      throw new NotFoundException(
        `Gift template with ID ${createGiftTemplateChangedDto.giftTemplateId} not found`,
      );
    }

    // Verificar se o template base é público ou pertence ao usuário
    if (!giftTemplate.isPublic && giftTemplate.createdByUserId !== userId) {
      throw new ForbiddenException(
        'You can only customize public templates or your own templates',
      );
    }

    return this.giftTemplatesChangedRepository.create(createGiftTemplateChangedDto, userId);
  }

  async findAll(): Promise<GiftTemplateChanged[]> {
    return this.giftTemplatesChangedRepository.findAll();
  }

  async findById(id: number, userId?: number): Promise<GiftTemplateChanged> {
    const giftTemplateChanged = await this.giftTemplatesChangedRepository.findById(id);

    // Verificar se o usuário tem permissão para ver este template personalizado
    if (!giftTemplateChanged.isPublic && giftTemplateChanged.createdByUserId !== userId) {
      throw new ForbiddenException('You can only view public customizations or your own');
    }

    return giftTemplateChanged;
  }

  async findByUserId(userId: number): Promise<GiftTemplateChanged[]> {
    return this.giftTemplatesChangedRepository.findByUserId(userId);
  }

  async findByGiftTemplateId(giftTemplateId: number): Promise<GiftTemplateChanged[]> {
    return this.giftTemplatesChangedRepository.findByGiftTemplateId(giftTemplateId);
  }

  async findPublicChanged(): Promise<GiftTemplateChanged[]> {
    return this.giftTemplatesChangedRepository.findPublicChanged();
  }

  async update(
    id: number,
    updateGiftTemplateChangedDto: UpdateGiftTemplateChangedDto,
    userId: number,
  ): Promise<GiftTemplateChanged> {
    const giftTemplateChanged = await this.giftTemplatesChangedRepository.findById(id);

    if (!giftTemplateChanged) {
      throw new NotFoundException(`Gift template changed with ID ${id} not found`);
    }

    // Verificar se o usuário é o criador
    if (giftTemplateChanged.createdByUserId !== userId) {
      throw new ForbiddenException('You can only update your own customizations');
    }

    // Se está mudando o giftTemplateId, verificar se o novo template existe e é acessível
    if (updateGiftTemplateChangedDto.giftTemplateId) {
      const newGiftTemplate = await this.giftTemplateRepository.findOne({
        where: { id: updateGiftTemplateChangedDto.giftTemplateId },
      });

      if (!newGiftTemplate) {
        throw new NotFoundException(
          `Gift template with ID ${updateGiftTemplateChangedDto.giftTemplateId} not found`,
        );
      }

      if (!newGiftTemplate.isPublic && newGiftTemplate.createdByUserId !== userId) {
        throw new ForbiddenException(
          'You can only reference public templates or your own templates',
        );
      }
    }

    return this.giftTemplatesChangedRepository.update(id, updateGiftTemplateChangedDto);
  }

  async remove(id: number, userId: number): Promise<void> {
    const giftTemplateChanged = await this.giftTemplatesChangedRepository.findById(id);

    if (!giftTemplateChanged) {
      throw new NotFoundException(`Gift template changed with ID ${id} not found`);
    }

    // Verificar se o usuário é o criador
    if (giftTemplateChanged.createdByUserId !== userId) {
      throw new ForbiddenException('You can only delete your own customizations');
    }

    await this.giftTemplatesChangedRepository.remove(id);
  }

  async countByUserId(userId: number): Promise<number> {
    return this.giftTemplatesChangedRepository.countByUserId(userId);
  }

  async countByGiftTemplateId(giftTemplateId: number): Promise<number> {
    return this.giftTemplatesChangedRepository.countByGiftTemplateId(giftTemplateId);
  }

  // Método utilitário para obter dados combinados (template base + personalização)
  async getCombinedData(id: number, userId?: number): Promise<{
    id: number;
    giftTemplateId: number;
    baseTemplate: GiftTemplate;
    title: string;
    description: string | null;
    imageUrl: string | null;
    value: number | null;
    category: string | null;
    isPublic: boolean;
    createdByUserId: number;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const giftTemplateChanged = await this.findById(id, userId);
    
    return {
      id: giftTemplateChanged.id,
      giftTemplateId: giftTemplateChanged.giftTemplateId,
      baseTemplate: giftTemplateChanged.giftTemplate,
      title: giftTemplateChanged.title || giftTemplateChanged.giftTemplate.title,
      description: giftTemplateChanged.description || giftTemplateChanged.giftTemplate.description,
      imageUrl: giftTemplateChanged.imageUrl || giftTemplateChanged.giftTemplate.imageUrl,
      value: giftTemplateChanged.value || giftTemplateChanged.giftTemplate.defaultValue,
      category: giftTemplateChanged.category || giftTemplateChanged.giftTemplate.category,
      isPublic: giftTemplateChanged.isPublic,
      createdByUserId: giftTemplateChanged.createdByUserId,
      createdAt: giftTemplateChanged.createdAt,
      updatedAt: giftTemplateChanged.updatedAt,
    };
  }
}