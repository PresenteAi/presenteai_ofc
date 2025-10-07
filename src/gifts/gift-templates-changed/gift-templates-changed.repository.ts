import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftTemplateChanged } from '../entities/gift-template-changed.entity';
import { CreateGiftTemplateChangedDto } from './create-gift-template-changed.dto';
import { UpdateGiftTemplateChangedDto } from './update-gift-template-changed.dto';

@Injectable()
export class GiftTemplatesChangedRepository {
  constructor(
    @InjectRepository(GiftTemplateChanged)
    private readonly repository: Repository<GiftTemplateChanged>,
  ) {}

  async create(dto: CreateGiftTemplateChangedDto, createdByUserId: number): Promise<GiftTemplateChanged> {
    const giftTemplateChanged = this.repository.create({
      ...dto,
      createdByUserId,
    });

    return await this.repository.save(giftTemplateChanged);
  }

  async findAll(): Promise<GiftTemplateChanged[]> {
    return await this.repository.find({
      relations: ['giftTemplate', 'createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<GiftTemplateChanged> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new BadRequestException('Invalid gift template changed ID');
    }

    const giftTemplateChanged = await this.repository.findOne({
      where: { id },
      relations: ['giftTemplate', 'createdByUser'],
    });

    if (!giftTemplateChanged) {
      throw new NotFoundException('Gift template changed not found');
    }

    return giftTemplateChanged;
  }

  async findByUserId(userId: number): Promise<GiftTemplateChanged[]> {
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      return [];
    }

    return await this.repository.find({
      where: { createdByUserId: userId },
      relations: ['giftTemplate', 'createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByGiftTemplateId(giftTemplateId: number): Promise<GiftTemplateChanged[]> {
    if (!giftTemplateId || typeof giftTemplateId !== 'number' || giftTemplateId <= 0) {
      return [];
    }

    return await this.repository.find({
      where: { giftTemplateId },
      relations: ['giftTemplate', 'createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPublicChanged(): Promise<GiftTemplateChanged[]> {
    return await this.repository.find({
      where: { isPublic: true },
      relations: ['giftTemplate', 'createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateData: UpdateGiftTemplateChangedDto): Promise<GiftTemplateChanged> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new BadRequestException('Invalid gift template changed ID');
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
      throw new BadRequestException('Invalid gift template changed ID');
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

  async countByGiftTemplateId(giftTemplateId: number): Promise<number> {
    if (!giftTemplateId || typeof giftTemplateId !== 'number' || giftTemplateId <= 0) {
      return 0;
    }

    return await this.repository.count({
      where: { giftTemplateId },
    });
  }
}