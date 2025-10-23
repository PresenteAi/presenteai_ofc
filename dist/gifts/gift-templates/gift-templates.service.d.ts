import { GiftTemplatesRepository } from './gift-templates.repository';
import { CreateGiftTemplateDto } from './create-gift-template.dto';
import { UpdateGiftTemplateDto } from './update-gift-template.dto';
import { GiftTemplatePaginationDto } from '../dto/gift-template-pagination.dto';
import { GiftTemplateOutputDto } from '../dto/gift-output.dto';
import { PaginatedGiftTemplatesDto } from '../dto/paginated-gifts.dto';
import { EventType } from '../entities/gift-template.entity';
export declare class GiftTemplatesService {
    private readonly repository;
    constructor(repository: GiftTemplatesRepository);
    create(dto: CreateGiftTemplateDto, userId: number): Promise<GiftTemplateOutputDto>;
    findAll(paginationDto: GiftTemplatePaginationDto): Promise<PaginatedGiftTemplatesDto>;
    findById(id: number, userId?: number): Promise<GiftTemplateOutputDto>;
    findByUserId(userId: number): Promise<GiftTemplateOutputDto[]>;
    update(id: number, dto: UpdateGiftTemplateDto, userId: number): Promise<GiftTemplateOutputDto>;
    remove(id: number, userId: number): Promise<void>;
    findPublicTemplates(): Promise<GiftTemplateOutputDto[]>;
    findByCategory(category: string): Promise<GiftTemplateOutputDto[]>;
    findByEventType(eventType: EventType): Promise<GiftTemplateOutputDto[]>;
    getUserTemplatesCount(userId: number): Promise<number>;
    private validateCreateDto;
    private validateUpdateDto;
    private sanitizePaginationDto;
    private mapToOutputDto;
}
