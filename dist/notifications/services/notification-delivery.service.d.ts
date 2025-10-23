import { EmailNotificationProvider } from '../providers/email-notification.provider';
import { PushNotificationProvider } from '../providers/push-notification.provider';
import { NotificationRepository } from '../repositories/notification.repository';
import { DeliveryMethod } from '../entities/notification.entity';
interface NotificationCreatedEvent {
    notificationId: number;
    userId: number;
    deliveryMethod: DeliveryMethod;
    priority: string;
}
export declare class NotificationDeliveryService {
    private readonly notificationRepository;
    private readonly emailProvider;
    private readonly pushProvider;
    private readonly logger;
    constructor(notificationRepository: NotificationRepository, emailProvider: EmailNotificationProvider, pushProvider: PushNotificationProvider);
    handleNotificationCreated(event: NotificationCreatedEvent): Promise<void>;
    private processDelivery;
    private markDeliveryFailed;
    retryFailedDeliveries(): Promise<void>;
    sendTestNotification(userId: number, deliveryMethod: DeliveryMethod): Promise<boolean>;
    getDeliveryStats(): Promise<{
        totalSent: number;
        totalFailed: number;
        byMethod: Record<string, {
            sent: number;
            failed: number;
        }>;
    }>;
}
export {};
