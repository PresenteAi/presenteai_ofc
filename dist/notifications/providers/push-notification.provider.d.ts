export interface NotificationPushData {
    id: number;
    userId: number;
    title: string;
    message: string;
    templateData?: Record<string, any>;
}
export declare class PushNotificationProvider {
    private readonly logger;
    sendNotification(notification: NotificationPushData): Promise<void>;
    private mockPushSend;
    private getUserDeviceTokens;
    registerDeviceToken(userId: number, token: string, platform: 'android' | 'ios' | 'web'): Promise<void>;
    unregisterDeviceToken(token: string): Promise<void>;
    sendToTokens(tokens: string[], payload: {
        title: string;
        message: string;
        data?: Record<string, any>;
    }): Promise<void>;
    sendBroadcast(payload: {
        title: string;
        message: string;
        data?: Record<string, any>;
        topic?: string;
    }): Promise<void>;
    validateConfiguration(): Promise<boolean>;
    sendTestPush(userId: number): Promise<boolean>;
    getPushStats(): Promise<{
        totalSent: number;
        totalFailed: number;
        activeDevices: number;
        byPlatform: Record<string, number>;
    }>;
    subscribeToTopic(userId: number, topic: string): Promise<void>;
    unsubscribeFromTopic(userId: number, topic: string): Promise<void>;
}
