import { GiftTemplatesChangedService } from './gift-templates-changed.service';
import { CreateGiftTemplateChangedDto } from './create-gift-template-changed.dto';
import { UpdateGiftTemplateChangedDto } from './update-gift-template-changed.dto';
export declare class GiftTemplatesChangedController {
    private readonly giftTemplatesChangedService;
    constructor(giftTemplatesChangedService: GiftTemplatesChangedService);
    create(createGiftTemplateChangedDto: CreateGiftTemplateChangedDto, userId: number): Promise<import("../entities/gift-template-changed.entity").GiftTemplateChanged>;
    findPublicChanged(): Promise<import("../entities/gift-template-changed.entity").GiftTemplateChanged[]>;
    findMyCustomizations(userId: number): Promise<import("../entities/gift-template-changed.entity").GiftTemplateChanged[]>;
    findByGiftTemplateId(giftTemplateId: number, userId: number): Promise<import("../entities/gift-template-changed.entity").GiftTemplateChanged[]>;
    findOne(id: number, userId?: number): Promise<import("../entities/gift-template-changed.entity").GiftTemplateChanged>;
    getCombinedData(id: number, userId?: number): Promise<{
        id: number;
        giftTemplateId: number;
        baseTemplate: import("../entities/gift-template.entity").GiftTemplate;
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
    update(id: number, updateGiftTemplateChangedDto: UpdateGiftTemplateChangedDto, userId: number): Promise<import("../entities/gift-template-changed.entity").GiftTemplateChanged>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
    countByUser(userId: number): Promise<{
        userId: number;
        count: number;
    }>;
    countByGiftTemplate(giftTemplateId: number): Promise<{
        giftTemplateId: number;
        count: number;
    }>;
}
