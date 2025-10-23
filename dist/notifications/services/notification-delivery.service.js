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
var NotificationDeliveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const email_notification_provider_1 = require("../providers/email-notification.provider");
const push_notification_provider_1 = require("../providers/push-notification.provider");
const notification_repository_1 = require("../repositories/notification.repository");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationDeliveryService = NotificationDeliveryService_1 = class NotificationDeliveryService {
    notificationRepository;
    emailProvider;
    pushProvider;
    logger = new common_1.Logger(NotificationDeliveryService_1.name);
    constructor(notificationRepository, emailProvider, pushProvider) {
        this.notificationRepository = notificationRepository;
        this.emailProvider = emailProvider;
        this.pushProvider = pushProvider;
    }
    async handleNotificationCreated(event) {
        const { notificationId, deliveryMethod } = event;
        try {
            const notification = await this.notificationRepository.findById(notificationId);
            if (!notification) {
                this.logger.warn(`Notification ${notificationId} not found for delivery`);
                return;
            }
            if (deliveryMethod === notification_entity_1.DeliveryMethod.IN_APP) {
                notification.markAsDelivered();
                await this.notificationRepository.save(notification);
                return;
            }
            await this.processDelivery(notification, deliveryMethod);
        }
        catch (error) {
            this.logger.error(`Failed to process notification ${notificationId}: ${error.message}`);
            await this.markDeliveryFailed(notificationId, error.message);
        }
    }
    async processDelivery(notification, deliveryMethod) {
        this.logger.log(`Processing ${deliveryMethod} delivery for notification ${notification.id}`);
        try {
            switch (deliveryMethod) {
                case notification_entity_1.DeliveryMethod.EMAIL:
                    await this.emailProvider.sendNotification(notification);
                    break;
                case notification_entity_1.DeliveryMethod.PUSH:
                    await this.pushProvider.sendNotification(notification);
                    break;
                case notification_entity_1.DeliveryMethod.SMS:
                    this.logger.warn('SMS delivery not yet implemented');
                    break;
                default:
                    this.logger.warn(`Unknown delivery method: ${deliveryMethod}`);
                    return;
            }
            notification.markAsSent();
            notification.markAsDelivered();
            await this.notificationRepository.save(notification);
            this.logger.log(`Successfully delivered notification ${notification.id} via ${deliveryMethod}`);
        }
        catch (error) {
            this.logger.error(`Failed to deliver notification ${notification.id}: ${error.message}`);
            notification.markAsFailed(error.message);
            await this.notificationRepository.save(notification);
        }
    }
    async markDeliveryFailed(notificationId, error) {
        const notification = await this.notificationRepository.findById(notificationId);
        if (notification) {
            notification.markAsFailed(error);
            await this.notificationRepository.save(notification);
        }
    }
    async retryFailedDeliveries() {
        this.logger.log('Starting retry process for failed deliveries');
        const failedNotifications = await this.notificationRepository.findPendingNotifications(50);
        for (const notification of failedNotifications) {
            if (notification.canRetry() && !notification.isExpired()) {
                this.logger.log(`Retrying delivery for notification ${notification.id}`);
                try {
                    await this.processDelivery(notification, notification.deliveryMethod);
                }
                catch (error) {
                    this.logger.error(`Retry failed for notification ${notification.id}: ${error.message}`);
                }
            }
        }
        this.logger.log(`Retry process completed for ${failedNotifications.length} notifications`);
    }
    async sendTestNotification(userId, deliveryMethod) {
        try {
            const testNotification = {
                id: 0,
                userId,
                title: 'Test Notification',
                message: 'This is a test notification from Presente Aí!',
                deliveryMethod,
                templateId: 'test_notification',
                templateData: { userName: 'Test User' },
            };
            switch (deliveryMethod) {
                case notification_entity_1.DeliveryMethod.EMAIL:
                    await this.emailProvider.sendNotification(testNotification);
                    break;
                case notification_entity_1.DeliveryMethod.PUSH:
                    await this.pushProvider.sendNotification(testNotification);
                    break;
                default:
                    throw new Error(`Unsupported delivery method: ${deliveryMethod}`);
            }
            this.logger.log(`Test notification sent successfully to user ${userId} via ${deliveryMethod}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send test notification: ${error.message}`);
            return false;
        }
    }
    async getDeliveryStats() {
        return {
            totalSent: 0,
            totalFailed: 0,
            byMethod: {
                email: { sent: 0, failed: 0 },
                push: { sent: 0, failed: 0 },
                sms: { sent: 0, failed: 0 },
            },
        };
    }
};
exports.NotificationDeliveryService = NotificationDeliveryService;
exports.NotificationDeliveryService = NotificationDeliveryService = NotificationDeliveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        email_notification_provider_1.EmailNotificationProvider,
        push_notification_provider_1.PushNotificationProvider])
], NotificationDeliveryService);
//# sourceMappingURL=notification-delivery.service.js.map