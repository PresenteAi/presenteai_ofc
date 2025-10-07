import { UserOutputDto } from './default.output.dto';
export declare class PaginatedUsersDto {
    data: UserOutputDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
