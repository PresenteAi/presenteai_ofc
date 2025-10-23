import { ContributionsService } from '../services/contributions.service';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { UpdateContributionStatusDto, ContributionResponseDto } from '../dto/update-contribution-status.dto';
import { ContributionFiltersDto } from '../dto/contribution-filters.dto';
export declare class ContributionsController {
    private readonly contributionsService;
    constructor(contributionsService: ContributionsService);
    create(createContributionDto: CreateContributionDto): Promise<ContributionResponseDto>;
    findAll(filters: ContributionFiltersDto): Promise<{
        contributions: ContributionResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEventGiftId(eventGiftId: number): Promise<ContributionResponseDto[]>;
    getGiftEventStats(eventGiftId: number): Promise<{
        totalContributions: number;
        totalAmount: number;
        netAmount: number;
        pendingAmount: number;
        approvedAmount: number;
        contributorCount: number;
    }>;
    findOne(id: number): Promise<ContributionResponseDto>;
    updateStatus(id: number, updateContributionStatusDto: UpdateContributionStatusDto): Promise<ContributionResponseDto>;
    remove(id: number): Promise<void>;
}
