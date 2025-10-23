"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PushNotificationProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationProvider = void 0;
const common_1 = require("@nestjs/common");
let PushNotificationProvider = PushNotificationProvider_1 = class PushNotificationProvider {
    logger = new common_1.Logger(PushNotificationProvider_1.name);
    async sendNotification(notification) {
        this.logger.log(`Sending push notification ${notification.id} to user ${notification.userId}`);
        try {
            await this.mockPushSend(notification);
            this.logger.log(`Push notification ${notification.id} sent successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to send push notification ${notification.id}: ${error.message}`);
            throw error;
        }
    }
    async mockPushSend(notification) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const userDeviceTokens = await this.getUserDeviceTokens(notification.userId);
        if (userDeviceTokens.length === 0) {
            this.logger.warn(`No device tokens found for user ${notification.userId}`);
            return;
        }
        const pushPayload = {
            notification: {
                title: notification.title,
                body: notification.message,
                icon: '/assets/icons/presente-ai-icon.png',
                badge: '/assets/icons/badge.png',
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
            data: {
                notificationId: notification.id.toString(),
                userId: notification.userId.toString(),
                type: 'notification',
                ...notification.templateData,
            },
            tokens: userDeviceTokens,
        };
        this.logger.debug('Mock push sent:', JSON.stringify(pushPayload, null, 2));
    }
    async getUserDeviceTokens(userId) {
        const mockTokens = [
            `mock_token_${userId}_android`,
            `mock_token_${userId}_ios`,
        ];
        return mockTokens;
    }
    async registerDeviceToken(userId, token, platform) {
        this.logger.log(`Registering device token for user ${userId} (${platform})`);
        try {
            this.logger.log(`Device token registered successfully for user ${userId}`);
        }
        catch (error) {
            this.logger.error(`Failed to register device token: ${error.message}`);
            throw error;
        }
    }
    async unregisterDeviceToken(token) {
        this.logger.log(`Unregistering device token: ${token.substring(0, 10)}...`);
        try {
            this.logger.log(`Device token unregistered successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to unregister device token: ${error.message}`);
            throw error;
        }
    }
    async sendToTokens(tokens, payload) {
        this.logger.log(`Sending push notification to ${tokens.length} devices`);
        try {
            const pushPayload = {
                notification: {
                    title: payload.title,
                    body: payload.message,
                    icon: '/assets/icons/presente-ai-icon.png',
                },
                data: payload.data || {},
                tokens: tokens,
            };
            this.logger.debug('Mock push to tokens:', JSON.stringify(pushPayload, null, 2));
            this.logger.log(`Push notification sent to ${tokens.length} devices`);
        }
        catch (error) {
            this.logger.error(`Failed to send push to tokens: ${error.message}`);
            throw error;
        }
    }
    async sendBroadcast(payload) {
        this.logger.log(`Sending broadcast notification: ${payload.title}`);
        try {
            const broadcastPayload = {
                notification: {
                    title: payload.title,
                    body: payload.message,
                    icon: '/assets/icons/presente-ai-icon.png',
                },
                data: payload.data || {},
                topic: payload.topic || 'all_users',
            };
            this.logger.debug('Mock broadcast:', JSON.stringify(broadcastPayload, null, 2));
            this.logger.log(`Broadcast notification sent successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to send broadcast: ${error.message}`);
            throw error;
        }
    }
    async validateConfiguration() {
        try {
            this.logger.log('Push notification configuration validated (mock)');
            return true;
        }
        catch (error) {
            this.logger.error(`Push configuration invalid: ${error.message}`);
            return false;
        }
    }
    async sendTestPush(userId) {
        try {
            const testNotification = {
                id: 0,
                userId,
                title: 'Test Push from Presente Aí',
                message: 'This is a test push notification to verify delivery is working correctly.',
                templateData: {
                    testMode: true,
                },
            };
            await this.sendNotification(testNotification);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send test push: ${error.message}`);
            return false;
        }
    }
    async getPushStats() {
        return {
            totalSent: 0,
            totalFailed: 0,
            activeDevices: 0,
            byPlatform: {
                android: 0,
                ios: 0,
                web: 0,
            },
        };
    }
    async subscribeToTopic(userId, topic) {
        this.logger.log(`Subscribing user ${userId} to topic: ${topic}`);
        try {
            const tokens = await this.getUserDeviceTokens(userId);
            this.logger.log(`User ${userId} subscribed to topic ${topic}`);
        }
        catch (error) {
            this.logger.error(`Failed to subscribe to topic: ${error.message}`);
            throw error;
        }
    }
    async unsubscribeFromTopic(userId, topic) {
        this.logger.log(`Unsubscribing user ${userId} from topic: ${topic}`);
        try {
            const tokens = await this.getUserDeviceTokens(userId);
            this.logger.log(`User ${userId} unsubscribed from topic ${topic}`);
        }
        catch (error) {
            this.logger.error(`Failed to unsubscribe from topic: ${error.message}`);
            throw error;
        }
    }
};
exports.PushNotificationProvider = PushNotificationProvider;
exports.PushNotificationProvider = PushNotificationProvider = PushNotificationProvider_1 = __decorate([
    (0, common_1.Injectable)()
], PushNotificationProvider);
//# sourceMappingURL=push-notification.provider.js.map