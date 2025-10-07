"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContributionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contribution_entity_1 = require("../entities/contribution.entity");
const gift_event_entity_1 = require("../../gifts/entities/gift-event.entity");
const update_contribution_status_dto_1 = require("../dto/update-contribution-status.dto");
let ContributionsService = class ContributionsService {
    contributionRepository;
    giftEventRepository;
    dataSource;
    constructor(contributionRepository, giftEventRepository, dataSource) {
        this.contributionRepository = contributionRepository;
        this.giftEventRepository = giftEventRepository;
        this.dataSource = dataSource;
    }
    async create(createContributionDto) {
        const giftEvent = await this.giftEventRepository.findOne({
            where: { id: createContributionDto.eventGiftId },
        });
        if (!giftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${createContributionDto.eventGiftId} not found`);
        }
        if (!giftEvent.canReceiveContributions()) {
            throw new common_1.BadRequestException('This gift cannot receive contributions (it might be completed or inactive)');
        }
        const contribution = this.contributionRepository.create({
            ...createContributionDto,
            paymentStatus: contribution_entity_1.PaymentStatus.PENDING,
        });
        contribution.calculateNetAmount();
        const savedContribution = await this.contributionRepository.save(contribution);
        return new update_contribution_status_dto_1.ContributionResponseDto(savedContribution);
    }
    async findAll(filters) {
        const queryBuilder = this.contributionRepository
            .createQueryBuilder('contribution')
            .leftJoinAndSelect('contribution.eventGift', 'eventGift');
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
        const total = await queryBuilder.getCount();
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        queryBuilder
            .orderBy('contribution.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        const contributions = await queryBuilder.getMany();
        return {
            contributions: contributions.map(contribution => new update_contribution_status_dto_1.ContributionResponseDto(contribution)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByEventGiftId(eventGiftId) {
        const contributions = await this.contributionRepository.find({
            where: { eventGiftId },
            order: { createdAt: 'DESC' },
        });
        return contributions.map(contribution => new update_contribution_status_dto_1.ContributionResponseDto(contribution));
    }
    async findOne(id) {
        const contribution = await this.contributionRepository.findOne({
            where: { id },
            relations: ['eventGift'],
        });
        if (!contribution) {
            throw new common_1.NotFoundException(`Contribution with ID ${id} not found`);
        }
        return new update_contribution_status_dto_1.ContributionResponseDto(contribution);
    }
    async updateStatus(id, updateDto) {
        return await this.dataSource.transaction(async (manager) => {
            const contributionRepo = manager.getRepository(contribution_entity_1.Contribution);
            const giftEventRepo = manager.getRepository(gift_event_entity_1.GiftEvent);
            const contribution = await contributionRepo.findOne({
                where: { id },
                relations: ['eventGift'],
            });
            if (!contribution) {
                throw new common_1.NotFoundException(`Contribution with ID ${id} not found`);
            }
            if (contribution.isFinalState() && contribution.paymentStatus !== contribution_entity_1.PaymentStatus.APPROVED) {
                throw new common_1.BadRequestException('Cannot update contribution in final state');
            }
            const previousEffectiveAmount = contribution.getEffectiveAmount();
            switch (updateDto.paymentStatus) {
                case contribution_entity_1.PaymentStatus.APPROVED:
                    if (contribution.paymentStatus !== contribution_entity_1.PaymentStatus.PENDING) {
                        throw new common_1.BadRequestException('Only pending contributions can be approved');
                    }
                    if (!updateDto.transactionId) {
                        throw new common_1.BadRequestException('Transaction ID is required for approved contributions');
                    }
                    contribution.approve(updateDto.transactionId, updateDto.feePlatform, updateDto.feeGateway);
                    break;
                case contribution_entity_1.PaymentStatus.REJECTED:
                    if (contribution.paymentStatus !== contribution_entity_1.PaymentStatus.PENDING) {
                        throw new common_1.BadRequestException('Only pending contributions can be rejected');
                    }
                    contribution.reject();
                    break;
                case contribution_entity_1.PaymentStatus.REFUNDED:
                    if (!contribution.canBeRefunded()) {
                        throw new common_1.BadRequestException('Contribution cannot be refunded');
                    }
                    contribution.refund();
                    break;
                default:
                    throw new common_1.BadRequestException(`Invalid payment status: ${updateDto.paymentStatus}`);
            }
            const updatedContribution = await contributionRepo.save(contribution);
            const newEffectiveAmount = updatedContribution.getEffectiveAmount();
            const amountDifference = newEffectiveAmount - previousEffectiveAmount;
            if (amountDifference !== 0) {
                const giftEvent = contribution.eventGift;
                const newCollectedValue = Number(giftEvent.collectedValue || 0) + amountDifference;
                if (newCollectedValue < 0) {
                    throw new common_1.BadRequestException('Refund would result in negative collected value');
                }
                await giftEventRepo.update(giftEvent.id, {
                    collectedValue: newCollectedValue,
                });
                const effectiveValue = giftEvent.getEffectiveValue();
                if (effectiveValue &&
                    newCollectedValue >= effectiveValue &&
                    !giftEvent.isCompleted()) {
                    await giftEventRepo.update(giftEvent.id, {
                        status: gift_event_entity_1.GiftEventStatus.COMPLETED,
                    });
                }
            }
            return new update_contribution_status_dto_1.ContributionResponseDto(updatedContribution);
        });
    }
    async remove(id) {
        const contribution = await this.contributionRepository.findOne({
            where: { id },
        });
        if (!contribution) {
            throw new common_1.NotFoundException(`Contribution with ID ${id} not found`);
        }
        if (contribution.paymentStatus !== contribution_entity_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending contributions can be deleted');
        }
        await this.contributionRepository.softDelete(id);
    }
    async getGiftEventStats(eventGiftId) {
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
            approvedStatus: contribution_entity_1.PaymentStatus.APPROVED,
            pendingStatus: contribution_entity_1.PaymentStatus.PENDING,
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
};
exports.ContributionsService = ContributionsService;
exports.ContributionsService = ContributionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contribution_entity_1.Contribution)),
    __param(1, (0, typeorm_1.InjectRepository)(gift_event_entity_1.GiftEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ContributionsService);
//# sourceMappingURL=contributions.service.js.map