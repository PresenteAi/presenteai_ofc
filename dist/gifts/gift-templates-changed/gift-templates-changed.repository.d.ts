import { Repository } from 'typeorm';
import { GiftTemplateChanged } from '../entities/gift-template-changed.entity';
import { CreateGiftTemplateChangedDto } from './create-gift-template-changed.dto';
import { UpdateGiftTemplateChangedDto } from './update-gift-template-changed.dto';
export declare class GiftTemplatesChangedRepository {
    private readonly repository;
    constructor(repository: Repository<GiftTemplateChanged>);
    create(dto: CreateGiftTemplateChangedDto, createdByUserId: number): Promise<GiftTemplateChanged>;
    findById(id: number): Promise<GiftTemplateChanged>;
    findByUserId(userId: number): Promise<GiftTemplateChanged[]>;
    findByGiftTemplateId(giftTemplateId: number, userId: number): Promise<GiftTemplateChanged[]>;
    findPublicChanged(): Promise<GiftTemplateChanged[]>;
    update(id: number, updateData: UpdateGiftTemplateChangedDto): Promise<GiftTemplateChanged>;
    remove(id: number): Promise<void>;
    countByUserId(userId: number): Promise<number>;
    countByGiftTemplateId(giftTemplateId: number): Promise<number>;
}
