import { Repository } from 'typeorm';
import { GiftTemplate, EventType } from '../entities/gift-template.entity';
import { CreateGiftTemplateDto } from './create-gift-template.dto';
import { UpdateGiftTemplateDto } from './update-gift-template.dto';
import { GiftTemplatePaginationDto } from '../dto/gift-template-pagination.dto';
export declare class GiftTemplatesRepository {
    private readonly repository;
    constructor(repository: Repository<GiftTemplate>);
    create(dto: CreateGiftTemplateDto, createdByUserId: number): Promise<GiftTemplate>;
    findAll(paginationDto: GiftTemplatePaginationDto): Promise<{
        data: GiftTemplate[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
    }>;
    findById(id: number): Promise<GiftTemplate>;
    findByUserId(userId: number): Promise<GiftTemplate[]>;
    update(id: number, updateData: UpdateGiftTemplateDto): Promise<GiftTemplate>;
    remove(id: number): Promise<void>;
    countByUserId(userId: number): Promise<number>;
    findPublicTemplates(): Promise<GiftTemplate[]>;
    findByCategory(category: string): Promise<GiftTemplate[]>;
    findByEventType(eventType: EventType): Promise<GiftTemplate[]>;
}
