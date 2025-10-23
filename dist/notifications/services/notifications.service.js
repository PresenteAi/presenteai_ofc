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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_repository_1 = require("../repositories/notification.repository");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    notificationRepository;
    eventEmitter;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(notificationRepository, eventEmitter) {
        this.notificationRepository = notificationRepository;
        this.eventEmitter = eventEmitter;
    }
    async createNotification(dto) {
        this.logger.log(`Creating notification for user ${dto.userId}: ${dto.title}`);
        try {
            const notification = await this.notificationRepository.create({
                ...dto,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
            });
            this.eventEmitter.emit('notification.created', {
                notificationId: notification.id,
                userId: notification.userId,
                deliveryMethod: dto.deliveryMethod,
                priority: dto.priority,
            });
            return this.mapToResponseDto(notification);
        }
        catch (error) {
            this.logger.error(`Failed to create notification: ${error.message}`);
            throw new common_1.BadRequestException('Failed to create notification');
        }
    }
    async getUserNotifications(userId, filters = {}) {
        const { limit = 20, offset = 0, isRead, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
        const notifications = await this.notificationRepository.findByUserId(userId, {
            isRead,
            limit: limit + 1,
            offset,
            orderBy: sortBy,
            order: sortOrder,
        });
        const hasMore = notifications.length > limit;
        const finalNotifications = hasMore ? notifications.slice(0, limit) : notifications;
        const total = await this.getTotalCount(userId, filters);
        return {
            notifications: finalNotifications.map(n => this.mapToResponseDto(n)),
            pagination: {
                total,
                limit,
                offset,
                hasMore,
            },
        };
    }
    async getNotificationById(id, userId) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return this.mapToResponseDto(notification);
    }
    async markAsRead(id, userId, isRead = true) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (isRead) {
            notification.markAsRead();
        }
        else {
            notification.isRead = false;
        }
        const updatedNotification = await this.notificationRepository.save(notification);
        this.logger.log(`Notification ${id} marked as ${isRead ? 'read' : 'unread'}`);
        return this.mapToResponseDto(updatedNotification);
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.markAllAsReadForUser(userId);
        this.logger.log(`All notifications marked as read for user ${userId}`);
        return {
            success: true,
            message: 'All notifications marked as read',
        };
    }
    async deleteNotification(id, userId) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.NotFoundException('Notification not found');
        }
        const deleted = await this.notificationRepository.delete(id);
        if (!deleted) {
            throw new common_1.BadRequestException('Failed to delete notification');
        }
        this.logger.log(`Notification ${id} deleted by user ${userId}`);
        return {
            success: true,
            message: 'Notification deleted successfully',
        };
    }
    async getUserNotificationStats(userId) {
        return this.notificationRepository.getNotificationStats(userId);
    }
    async getUnreadCount(userId) {
        const count = await this.notificationRepository.countUnreadByUserId(userId);
        return { count };
    }
    async performBulkAction(userId, notificationIds, action) {
        const notifications = await Promise.all(notificationIds.map(id => this.notificationRepository.findById(id)));
        const validNotifications = notifications.filter((n) => n !== null && n.userId === userId);
        if (validNotifications.length !== notificationIds.length) {
            throw new common_1.BadRequestException('Some notifications not found or access denied');
        }
        const validIds = validNotifications.map(n => n.id);
        if (action === 'markAsRead') {
            await this.notificationRepository.markMultipleAsRead(validIds);
        }
        else if (action === 'delete') {
            await Promise.all(validIds.map(id => this.notificationRepository.delete(id)));
        }
        this.logger.log(`Bulk ${action} performed on ${validIds.length} notifications for user ${userId}`);
        return {
            success: true,
            message: `${validIds.length} notifications processed`,
            processed: validIds.length,
        };
    }
    async notifyContributionReceived(params) {
        const { userId, contributionId, eventId, amount, contributorName } = params;
        await this.createNotification({
            userId,
            contributionId,
            eventId,
            type: notification_entity_1.NotificationType.CONTRIBUTION,
            title: 'Nova Contribuição Recebida! 🎉',
            message: contributorName
                ? `${contributorName} contribuiu com R$ ${amount.toFixed(2)} para o seu evento!`
                : `Você recebeu uma nova contribuição de R$ ${amount.toFixed(2)}!`,
            deliveryMethod: notification_entity_1.DeliveryMethod.IN_APP,
            priority: 'high',
            metadata: {
                amount,
                contributorName,
                eventId,
                contributionId,
            },
        });
        this.logger.log(`Contribution notification sent to user ${userId}`);
    }
    async notifyWithdrawalStatusChange(params) {
        const { userId, withdrawalId, status, amount, reason } = params;
        const titles = {
            completed: 'Saque Aprovado! ✅',
            failed: 'Saque Rejeitado ❌',
            processing: 'Saque em Processamento ⏳',
        };
        const messages = {
            completed: `Seu saque de R$ ${amount.toFixed(2)} foi aprovado e será creditado em sua conta em breve.`,
            failed: `Seu saque de R$ ${amount.toFixed(2)} foi rejeitado. ${reason || 'Entre em contato com o suporte.'}`,
            processing: `Seu saque de R$ ${amount.toFixed(2)} está sendo processado.`,
        };
        await this.createNotification({
            userId,
            withdrawalId,
            type: notification_entity_1.NotificationType.WITHDRAWAL,
            title: titles[status],
            message: messages[status],
            deliveryMethod: notification_entity_1.DeliveryMethod.IN_APP,
            priority: status === 'failed' ? 'high' : 'normal',
            metadata: {
                amount,
                status,
                reason,
                withdrawalId,
            },
        });
        this.logger.log(`Withdrawal ${status} notification sent to user ${userId}`);
    }
    async notifyEventMilestone(params) {
        const { userId, eventId, milestone, eventTitle, metadata } = params;
        const titles = {
            goal_reached: 'Meta Atingida! 🎯',
            gift_completed: 'Presente Concluído! 🎁',
            event_starting_soon: 'Evento se Aproxima! ⏰',
        };
        const messages = {
            goal_reached: `Parabéns! Seu evento "${eventTitle}" atingiu a meta de arrecadação!`,
            gift_completed: `O presente do seu evento "${eventTitle}" está pronto para ser entregue!`,
            event_starting_soon: `Seu evento "${eventTitle}" acontecerá em breve. Tudo está pronto!`,
        };
        await this.createNotification({
            userId,
            eventId,
            type: notification_entity_1.NotificationType.EVENT,
            title: titles[milestone],
            message: messages[milestone],
            deliveryMethod: notification_entity_1.DeliveryMethod.IN_APP,
            priority: 'normal',
            metadata: {
                milestone,
                eventTitle,
                eventId,
                ...metadata,
            },
        });
        this.logger.log(`Event milestone notification (${milestone}) sent to user ${userId}`);
    }
    async notifySystem(params) {
        const { userId, title, message, priority = 'normal', metadata } = params;
        await this.createNotification({
            userId,
            type: notification_entity_1.NotificationType.SYSTEM,
            title,
            message,
            deliveryMethod: notification_entity_1.DeliveryMethod.IN_APP,
            priority: priority,
            metadata,
        });
        this.logger.log(`System notification sent to user ${userId}: ${title}`);
    }
    async getTotalCount(userId, filters) {
        if (filters.isRead !== undefined) {
            return filters.isRead
                ? await this.notificationRepository.countUnreadByUserId(userId)
                : (await this.notificationRepository.getNotificationStats(userId)).total -
                    await this.notificationRepository.countUnreadByUserId(userId);
        }
        return (await this.notificationRepository.getNotificationStats(userId)).total;
    }
    mapToResponseDto(notification) {
        return {
            id: notification.id,
            userId: notification.userId,
            eventId: notification.eventId,
            contributionId: notification.contributionId,
            withdrawalId: notification.withdrawalId,
            transactionId: notification.transactionId,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            deliveryMethod: notification.deliveryMethod,
            priority: notification.priority,
            metadata: notification.metadata,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        };
    }
    async cleanupOldNotifications() {
        const deleted = await this.notificationRepository.deleteOldNotifications(90);
        this.logger.log(`Cleanup completed: ${deleted} old notifications removed`);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        event_emitter_1.EventEmitter2])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map