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
exports.TransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("../entities/transaction.entity");
let TransactionRepository = class TransactionRepository extends typeorm_1.Repository {
    dataSource;
    constructor(dataSource) {
        super(transaction_entity_1.Transaction, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findByContributionId(contributionId) {
        return this.find({
            where: { contributionId },
            order: { createdAt: 'DESC' },
        });
    }
    async findByExternalTransactionId(externalTransactionId) {
        return this.findOne({
            where: { externalTransactionId },
            relations: ['contribution'],
        });
    }
    async findByGatewayAndStatus(gateway, status) {
        return this.find({
            where: {
                paymentGateway: gateway,
                status,
            },
            order: { createdAt: 'DESC' },
        });
    }
    async findStaleTransactions(minutes = 30) {
        const thresholdDate = new Date();
        thresholdDate.setMinutes(thresholdDate.getMinutes() - minutes);
        return this.createQueryBuilder('transaction')
            .where('transaction.status IN (:...statuses)', {
            statuses: [transaction_entity_1.TransactionStatus.INITIATED, transaction_entity_1.TransactionStatus.PROCESSING],
        })
            .andWhere('transaction.created_at < :threshold', {
            threshold: thresholdDate,
        })
            .getMany();
    }
    async getTransactionStats(contributionId) {
        const stats = await this.createQueryBuilder('transaction')
            .select([
            'COUNT(*) as total',
            'SUM(CASE WHEN status = :paidStatus THEN 1 ELSE 0 END) as paid',
            'SUM(CASE WHEN status = :failedStatus THEN 1 ELSE 0 END) as failed',
            'SUM(amount) as totalAmount',
            'SUM(CASE WHEN status = :paidStatus THEN net_amount ELSE 0 END) as paidAmount',
        ])
            .where('contribution_id = :contributionId', { contributionId })
            .setParameters({
            paidStatus: transaction_entity_1.TransactionStatus.PAID,
            failedStatus: transaction_entity_1.TransactionStatus.FAILED,
        })
            .getRawOne();
        return {
            total: parseInt(stats.total) || 0,
            paid: parseInt(stats.paid) || 0,
            failed: parseInt(stats.failed) || 0,
            totalAmount: parseFloat(stats.totalAmount) || 0,
            paidAmount: parseFloat(stats.paidAmount) || 0,
        };
    }
    async findTransactionsNeedingSync(gatewayTypes) {
        const queryBuilder = this.createQueryBuilder('transaction')
            .where('transaction.status IN (:...statuses)', {
            statuses: [transaction_entity_1.TransactionStatus.INITIATED, transaction_entity_1.TransactionStatus.PROCESSING],
        })
            .andWhere('transaction.external_transaction_id IS NOT NULL');
        if (gatewayTypes && gatewayTypes.length > 0) {
            queryBuilder.andWhere('transaction.payment_gateway IN (:...gateways)', {
                gateways: gatewayTypes,
            });
        }
        return queryBuilder
            .orderBy('transaction.updated_at', 'ASC')
            .getMany();
    }
    async findSuccessfulTransactions(startDate, endDate, gateway) {
        const queryBuilder = this.createQueryBuilder('transaction')
            .where('transaction.status = :status', { status: transaction_entity_1.TransactionStatus.PAID })
            .andWhere('transaction.payment_date BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orderBy('transaction.payment_date', 'DESC');
        if (gateway) {
            queryBuilder.andWhere('transaction.payment_gateway = :gateway', { gateway });
        }
        return queryBuilder.getMany();
    }
};
exports.TransactionRepository = TransactionRepository;
exports.TransactionRepository = TransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TransactionRepository);
//# sourceMappingURL=transaction.repository.js.map