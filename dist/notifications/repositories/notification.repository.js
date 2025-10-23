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
var NotificationRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationRepository = NotificationRepository_1 = class NotificationRepository {
    repository;
    logger = new common_1.Logger(NotificationRepository_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async create(notification) {
        const newNotification = this.repository.create(notification);
        return this.repository.save(newNotification);
    }
    async findById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async findByUserId(userId, options = {}) {
        const { isRead, limit = 50, offset = 0, orderBy = 'createdAt', order = 'DESC', } = options;
        const where = { userId };
        if (isRead !== undefined) {
            where.isRead = isRead;
        }
        return this.repository.find({
            where,
            order: { [orderBy]: order },
            take: limit,
            skip: offset,
        });
    }
    async countUnreadByUserId(userId) {
        return this.repository.count({
            where: { userId, isRead: false },
        });
    }
    async markAsRead(id) {
        const notification = await this.findById(id);
        if (!notification) {
            return null;
        }
        notification.markAsRead();
        return this.repository.save(notification);
    }
    async markMultipleAsRead(ids) {
        await this.repository.update({ id: { $in: ids } }, { isRead: true, updatedAt: new Date() });
    }
    async markAllAsReadForUser(userId) {
        await this.repository.update({ userId, isRead: false }, { isRead: true, updatedAt: new Date() });
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async deleteOldNotifications(daysOld = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const result = await this.repository.delete({
            createdAt: { $lt: cutoffDate },
            isRead: true,
        });
        this.logger.log(`Deleted ${result.affected} old notifications`);
        return result.affected || 0;
    }
    async findPendingNotifications(limit = 100) {
        return this.repository.find({
            where: {
                status: { $in: ['created', 'failed'] },
                retryCount: { $lt: 3 },
            },
            order: { createdAt: 'ASC' },
            take: limit,
        });
    }
    async findByRelatedEntity(params) {
        const where = {};
        if (params.eventId)
            where.eventId = params.eventId;
        if (params.contributionId)
            where.contributionId = params.contributionId;
        if (params.withdrawalId)
            where.withdrawalId = params.withdrawalId;
        if (params.transactionId)
            where.transactionId = params.transactionId;
        return this.repository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async getNotificationStats(userId) {
        const [total, unread] = await Promise.all([
            this.repository.count({ where: { userId } }),
            this.repository.count({ where: { userId, isRead: false } }),
        ]);
        const typeStats = await this.repository
            .createQueryBuilder('notification')
            .select('notification.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .where('notification.userId = :userId', { userId })
            .groupBy('notification.type')
            .getRawMany();
        const byType = typeStats.reduce((acc, stat) => {
            acc[stat.type] = parseInt(stat.count);
            return acc;
        }, {});
        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 7);
        const recent = await this.repository.count({
            where: {
                userId,
                createdAt: { $gte: recentDate },
            },
        });
        return { total, unread, byType, recent };
    }
    async save(notification) {
        return this.repository.save(notification);
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = NotificationRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationRepository);
//# sourceMappingURL=notification.repository.js.map