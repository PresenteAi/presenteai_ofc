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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
let WithdrawalRepository = class WithdrawalRepository extends typeorm_1.Repository {
    dataSource;
    constructor(dataSource) {
        super(withdrawal_entity_1.Withdrawal, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findByUserId(userId, status) {
        const queryBuilder = this.createQueryBuilder('withdrawal')
            .where('withdrawal.user_id = :userId', { userId })
            .orderBy('withdrawal.requested_at', 'DESC');
        if (status) {
            queryBuilder.andWhere('withdrawal.status = :status', { status });
        }
        return queryBuilder.getMany();
    }
    async findByTransactionReference(transactionReference) {
        return this.findOne({
            where: { transactionReference },
        });
    }
    async findByGatewayAndStatus(gateway, status) {
        return this.find({
            where: {
                paymentGateway: gateway,
                status,
            },
            order: { requestedAt: 'DESC' },
        });
    }
    async findOverdueWithdrawals(hours = 24) {
        const thresholdDate = new Date();
        thresholdDate.setHours(thresholdDate.getHours() - hours);
        return this.createQueryBuilder('withdrawal')
            .where('withdrawal.status = :status', { status: withdrawal_entity_1.WithdrawalStatus.PENDING })
            .andWhere('withdrawal.requested_at < :threshold', { threshold: thresholdDate })
            .orderBy('withdrawal.requested_at', 'ASC')
            .getMany();
    }
    async getUserWithdrawalStats(userId) {
        const stats = await this.createQueryBuilder('withdrawal')
            .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN status = :completedStatus THEN 1 ELSE 0 END) as completed',
            'SUM(CASE WHEN status = :pendingStatus THEN 1 ELSE 0 END) as pending',
            'SUM(CASE WHEN status = :failedStatus THEN 1 ELSE 0 END) as failed',
            'SUM(total_amount) as totalAmount',
            'SUM(CASE WHEN status = :completedStatus THEN net_amount ELSE 0 END) as completedAmount',
            'SUM(CASE WHEN status IN (:...pendingStatuses) THEN total_amount ELSE 0 END) as pendingAmount',
        ])
            .where('user_id = :userId', { userId })
            .setParameters({
            completedStatus: withdrawal_entity_1.WithdrawalStatus.COMPLETED,
            pendingStatus: withdrawal_entity_1.WithdrawalStatus.PENDING,
            failedStatus: withdrawal_entity_1.WithdrawalStatus.FAILED,
            pendingStatuses: [withdrawal_entity_1.WithdrawalStatus.PENDING, withdrawal_entity_1.WithdrawalStatus.PROCESSING],
        })
            .getRawOne();
        return {
            total: parseInt(stats.total) || 0,
            completed: parseInt(stats.completed) || 0,
            pending: parseInt(stats.pending) || 0,
            failed: parseInt(stats.failed) || 0,
            totalAmount: parseFloat(stats.totalAmount) || 0,
            completedAmount: parseFloat(stats.completedAmount) || 0,
            pendingAmount: parseFloat(stats.pendingAmount) || 0,
        };
    }
    async getPendingWithdrawalsAmount(userId) {
        const result = await this.createQueryBuilder('withdrawal')
            .select('SUM(withdrawal.total_amount)', 'sum')
            .where('withdrawal.user_id = :userId', { userId })
            .andWhere('withdrawal.status IN (:...statuses)', {
            statuses: [withdrawal_entity_1.WithdrawalStatus.PENDING, withdrawal_entity_1.WithdrawalStatus.PROCESSING],
        })
            .getRawOne();
        return parseFloat(result.sum) || 0;
    }
    async findWithdrawalsNeedingSync(gatewayTypes) {
        const queryBuilder = this.createQueryBuilder('withdrawal')
            .where('withdrawal.status IN (:...statuses)', {
            statuses: [withdrawal_entity_1.WithdrawalStatus.PENDING, withdrawal_entity_1.WithdrawalStatus.PROCESSING],
        })
            .andWhere('withdrawal.transaction_reference IS NOT NULL');
        if (gatewayTypes && gatewayTypes.length > 0) {
            queryBuilder.andWhere('withdrawal.payment_gateway IN (:...gateways)', {
                gateways: gatewayTypes,
            });
        }
        return queryBuilder
            .orderBy('withdrawal.updated_at', 'ASC')
            .getMany();
    }
    async findCompletedWithdrawals(startDate, endDate, gateway) {
        const queryBuilder = this.createQueryBuilder('withdrawal')
            .where('withdrawal.status = :status', { status: withdrawal_entity_1.WithdrawalStatus.COMPLETED })
            .andWhere('withdrawal.processed_at BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orderBy('withdrawal.processed_at', 'DESC');
        if (gateway) {
            queryBuilder.andWhere('withdrawal.payment_gateway = :gateway', { gateway });
        }
        return queryBuilder.getMany();
    }
    async getProcessingTimeStats(gateway, days = 30) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        const queryBuilder = this.createQueryBuilder('withdrawal')
            .select([
            'TIMESTAMPDIFF(SECOND, withdrawal.requested_at, withdrawal.processed_at) as processingTime'
        ])
            .where('withdrawal.status = :status', { status: withdrawal_entity_1.WithdrawalStatus.COMPLETED })
            .andWhere('withdrawal.processed_at >= :dateLimit', { dateLimit })
            .andWhere('withdrawal.processed_at IS NOT NULL');
        if (gateway) {
            queryBuilder.andWhere('withdrawal.payment_gateway = :gateway', { gateway });
        }
        const results = await queryBuilder.getRawMany();
        if (results.length === 0) {
            return {
                averageProcessingTime: 0,
                medianProcessingTime: 0,
                minProcessingTime: 0,
                maxProcessingTime: 0,
                totalWithdrawals: 0,
            };
        }
        const processingTimes = results
            .map(r => parseInt(r.processingTime))
            .filter(time => time > 0)
            .sort((a, b) => a - b);
        const sum = processingTimes.reduce((acc, time) => acc + time, 0);
        const average = sum / processingTimes.length;
        const median = processingTimes.length % 2 === 0
            ? (processingTimes[processingTimes.length / 2 - 1] + processingTimes[processingTimes.length / 2]) / 2
            : processingTimes[Math.floor(processingTimes.length / 2)];
        return {
            averageProcessingTime: Math.round(average),
            medianProcessingTime: Math.round(median),
            minProcessingTime: processingTimes[0],
            maxProcessingTime: processingTimes[processingTimes.length - 1],
            totalWithdrawals: processingTimes.length,
        };
    }
};
exports.WithdrawalRepository = WithdrawalRepository;
exports.WithdrawalRepository = WithdrawalRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], WithdrawalRepository);
//# sourceMappingURL=withdrawal.repository.js.map