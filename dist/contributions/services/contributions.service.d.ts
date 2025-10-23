import { Repository, DataSource } from 'typeorm';
import { Contribution } from '../entities/contribution.entity';
import { GiftEvent } from '../../gifts/entities/gift-event.entity';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { UpdateContributionStatusDto, ContributionResponseDto } from '../dto/update-contribution-status.dto';
import { ContributionFiltersDto } from '../dto/contribution-filters.dto';
export declare class ContributionsService {
    private readonly contributionRepository;
    private readonly giftEventRepository;
    private readonly dataSource;
    constructor(contributionRepository: Repository<Contribution>, giftEventRepository: Repository<GiftEvent>, dataSource: DataSource);
    create(createContributionDto: CreateContributionDto): Promise<ContributionResponseDto>;
    findAll(filters: ContributionFiltersDto): Promise<{
        contributions: ContributionResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEventGiftId(eventGiftId: number): Promise<ContributionResponseDto[]>;
    findOne(id: number): Promise<ContributionResponseDto>;
    updateStatus(id: number, updateDto: UpdateContributionStatusDto): Promise<ContributionResponseDto>;
    remove(id: number): Promise<void>;
    getGiftEventStats(eventGiftId: number): Promise<{
        totalContributions: number;
        totalAmount: number;
        netAmount: number;
        pendingAmount: number;
        approvedAmount: number;
        contributorCount: number;
    }>;
}
