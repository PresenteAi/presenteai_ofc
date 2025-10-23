import { Repository } from 'typeorm';
import { GiftTemplateChanged } from '../entities/gift-template-changed.entity';
import { GiftTemplate } from '../entities/gift-template.entity';
import { CreateGiftTemplateChangedDto } from './create-gift-template-changed.dto';
import { UpdateGiftTemplateChangedDto } from './update-gift-template-changed.dto';
import { GiftTemplatesChangedRepository } from './gift-templates-changed.repository';
export declare class GiftTemplatesChangedService {
    private readonly giftTemplatesChangedRepository;
    private readonly giftTemplateRepository;
    constructor(giftTemplatesChangedRepository: GiftTemplatesChangedRepository, giftTemplateRepository: Repository<GiftTemplate>);
    create(createGiftTemplateChangedDto: CreateGiftTemplateChangedDto, userId: number): Promise<GiftTemplateChanged>;
    findById(id: number, userId?: number): Promise<GiftTemplateChanged>;
    findByUserId(userId: number): Promise<GiftTemplateChanged[]>;
    findByGiftTemplateId(giftTemplateId: number, userId: number): Promise<GiftTemplateChanged[]>;
    findPublicChanged(): Promise<GiftTemplateChanged[]>;
    update(id: number, updateGiftTemplateChangedDto: UpdateGiftTemplateChangedDto, userId: number): Promise<GiftTemplateChanged>;
    remove(id: number, userId: number): Promise<void>;
    countByUserId(userId: number): Promise<number>;
    countByGiftTemplateId(giftTemplateId: number): Promise<number>;
    getCombinedData(id: number, userId?: number): Promise<{
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
    }>;
}
