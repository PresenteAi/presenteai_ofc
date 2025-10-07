import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Contribution, PaymentStatus } from '../entities/contribution.entity';
import { GiftEvent, GiftEventStatus } from '../../gifts/entities/gift-event.entity';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { UpdateContributionStatusDto, ContributionResponseDto } from '../dto/update-contribution-status.dto';
import { ContributionFiltersDto } from '../dto/contribution-filters.dto';

/**
 * Service responsible for managing contributions
 * Handles contribution creation, status updates, and gift collected value synchronization
 */
@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
    @InjectRepository(GiftEvent)
    private readonly giftEventRepository: Repository<GiftEvent>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a new contribution
   */
  async create(createContributionDto: CreateContributionDto): Promise<ContributionResponseDto> {
    // Verify that the gift event exists and can receive contributions
    const giftEvent = await this.giftEventRepository.findOne({
      where: { id: createContributionDto.eventGiftId },
    });

    if (!giftEvent) {
      throw new NotFoundException(`Gift event with ID ${createContributionDto.eventGiftId} not found`);
    }

    if (!giftEvent.canReceiveContributions()) {
      throw new BadRequestException('This gift cannot receive contributions (it might be completed or inactive)');
    }

    // Create contribution
    const contribution = this.contributionRepository.create({
      ...createContributionDto,
      paymentStatus: PaymentStatus.PENDING,
    });

    // Calculate initial net amount (will be recalculated when approved with fees)
    contribution.calculateNetAmount();

    const savedContribution = await this.contributionRepository.save(contribution);

    return new ContributionResponseDto(savedContribution);
  }

  /**
   * Find contributions with optional filters and pagination
   */
  async findAll(filters: ContributionFiltersDto): Promise<{
    contributions: ContributionResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.contributionRepository
      .createQueryBuilder('contribution')
      .leftJoinAndSelect('contribution.eventGift', 'eventGift');

    // Apply filters
    if (filters.eventGiftId) {
      queryBuilder.andWhere('contribution.eventGiftId = :eventGiftId', {
        eventGiftId: filters.eventGiftId,
      });
    }

    if (filters.userId) {
      queryBuilder.andWhere('contribution.userId = :userId', {
        userId: filters.userId,
      });
    }

    if (filters.paymentStatus) {
      queryBuilder.andWhere('contribution.paymentStatus = :paymentStatus', {
        paymentStatus: filters.paymentStatus,
      });
    }

    if (filters.paymentMethod) {
      queryBuilder.andWhere('contribution.paymentMethod = :paymentMethod', {
        paymentMethod: filters.paymentMethod,
      });
    }

    if (filters.fromDate) {
      queryBuilder.andWhere('contribution.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters.toDate) {
      queryBuilder.andWhere('contribution.createdAt <= :toDate', {
        toDate: filters.toDate,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('contribution.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const contributions = await queryBuilder.getMany();

    return {
      contributions: contributions.map(contribution => new ContributionResponseDto(contribution)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find contributions by gift event ID
   */
  async findByEventGiftId(eventGiftId: number): Promise<ContributionResponseDto[]> {
    const contributions = await this.contributionRepository.find({
      where: { eventGiftId },
      order: { createdAt: 'DESC' },
    });

    return contributions.map(contribution => new ContributionResponseDto(contribution));
  }

  /**
   * Find a single contribution by ID
   */
  async findOne(id: number): Promise<ContributionResponseDto> {
    const contribution = await this.contributionRepository.findOne({
      where: { id },
      relations: ['eventGift'],
    });

    if (!contribution) {
      throw new NotFoundException(`Contribution with ID ${id} not found`);
    }

    return new ContributionResponseDto(contribution);
  }

  /**
   * Update contribution payment status
   * This method handles the transaction to update both contribution and gift collected value
   */
  async updateStatus(id: number, updateDto: UpdateContributionStatusDto): Promise<ContributionResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const contributionRepo = manager.getRepository(Contribution);
      const giftEventRepo = manager.getRepository(GiftEvent);

      // Find contribution with gift event
      const contribution = await contributionRepo.findOne({
        where: { id },
        relations: ['eventGift'],
      });

      if (!contribution) {
        throw new NotFoundException(`Contribution with ID ${id} not found`);
      }

      if (contribution.isFinalState() && contribution.paymentStatus !== PaymentStatus.APPROVED) {
        throw new BadRequestException('Cannot update contribution in final state');
      }

      // Store previous effective amount for adjustment calculation
      const previousEffectiveAmount = contribution.getEffectiveAmount();

      // Validate status transition and apply business logic
      switch (updateDto.paymentStatus) {
        case PaymentStatus.APPROVED:
          if (contribution.paymentStatus !== PaymentStatus.PENDING) {
            throw new BadRequestException('Only pending contributions can be approved');
          }

          if (!updateDto.transactionId) {
            throw new BadRequestException('Transaction ID is required for approved contributions');
          }

          contribution.approve(
            updateDto.transactionId,
            updateDto.feePlatform,
            updateDto.feeGateway,
          );
          break;

        case PaymentStatus.REJECTED:
          if (contribution.paymentStatus !== PaymentStatus.PENDING) {
            throw new BadRequestException('Only pending contributions can be rejected');
          }

          contribution.reject();
          break;

        case PaymentStatus.REFUNDED:
          if (!contribution.canBeRefunded()) {
            throw new BadRequestException('Contribution cannot be refunded');
          }

          contribution.refund();
          break;

        default:
          throw new BadRequestException(`Invalid payment status: ${updateDto.paymentStatus}`);
      }

      // Save updated contribution
      const updatedContribution = await contributionRepo.save(contribution);

      // Update gift event collected value
      const newEffectiveAmount = updatedContribution.getEffectiveAmount();
      const amountDifference = newEffectiveAmount - previousEffectiveAmount;

      if (amountDifference !== 0) {
        const giftEvent = contribution.eventGift;
        const newCollectedValue = Number(giftEvent.collectedValue || 0) + amountDifference;

        // Ensure collected value doesn't go negative
        if (newCollectedValue < 0) {
          throw new BadRequestException('Refund would result in negative collected value');
        }

        await giftEventRepo.update(giftEvent.id, {
          collectedValue: newCollectedValue,
        });

        // Check if gift should be auto-completed
        const effectiveValue = giftEvent.getEffectiveValue();
        if (
          effectiveValue && 
          newCollectedValue >= effectiveValue && 
          !giftEvent.isCompleted()
        ) {
          await giftEventRepo.update(giftEvent.id, {
            status: GiftEventStatus.COMPLETED,
          });
        }
      }

      return new ContributionResponseDto(updatedContribution);
    });
  }

  /**
   * Soft delete a contribution
   * Only pending contributions can be deleted
   */
  async remove(id: number): Promise<void> {
    const contribution = await this.contributionRepository.findOne({
      where: { id },
    });

    if (!contribution) {
      throw new NotFoundException(`Contribution with ID ${id} not found`);
    }

    if (contribution.paymentStatus !== PaymentStatus.PENDING) {
      throw new BadRequestException('Only pending contributions can be deleted');
    }

    await this.contributionRepository.softDelete(id);
  }

  /**
   * Get contribution statistics for a gift event
   */
  async getGiftEventStats(eventGiftId: number): Promise<{
    totalContributions: number;
    totalAmount: number;
    netAmount: number;
    pendingAmount: number;
    approvedAmount: number;
    contributorCount: number;
  }> {
    const result = await this.contributionRepository
      .createQueryBuilder('contribution')
      .select([
        'COUNT(contribution.id) as totalContributions',
        'SUM(contribution.amount) as totalAmount',
        'SUM(CASE WHEN contribution.paymentStatus = :approvedStatus THEN contribution.netAmount ELSE 0 END) as netAmount',
        'SUM(CASE WHEN contribution.paymentStatus = :pendingStatus THEN contribution.amount ELSE 0 END) as pendingAmount',
        'SUM(CASE WHEN contribution.paymentStatus = :approvedStatus THEN contribution.amount ELSE 0 END) as approvedAmount',
        'COUNT(DISTINCT COALESCE(contribution.userId, contribution.contributorEmail)) as contributorCount',
      ])
      .where('contribution.eventGiftId = :eventGiftId', { eventGiftId })
      .setParameters({
        approvedStatus: PaymentStatus.APPROVED,
        pendingStatus: PaymentStatus.PENDING,
      })
      .getRawOne();

    return {
      totalContributions: parseInt(result.totalContributions) || 0,
      totalAmount: parseFloat(result.totalAmount) || 0,
      netAmount: parseFloat(result.netAmount) || 0,
      pendingAmount: parseFloat(result.pendingAmount) || 0,
      approvedAmount: parseFloat(result.approvedAmount) || 0,
      contributorCount: parseInt(result.contributorCount) || 0,
    };
  }
}