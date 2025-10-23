import { GiftTemplateOutputDto, GiftTemplateChangedOutputDto, GiftEventOutputDto } from './gift-output.dto';
export declare class PaginatedGiftTemplatesDto {
    data: GiftTemplateOutputDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}
export declare class PaginatedGiftTemplatesChangedDto {
    data: GiftTemplateChangedOutputDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}
export declare class PaginatedGiftEventsDto {
    data: GiftEventOutputDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}
