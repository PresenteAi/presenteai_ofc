import { NotificationType, DeliveryMethod, NotificationPriority } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    userId: number;
    eventId?: number;
    contributionId?: number;
    withdrawalId?: number;
    transactionId?: number;
    type: NotificationType;
    title: string;
    message: string;
    deliveryMethod?: DeliveryMethod;
    priority?: NotificationPriority;
    expiresAt?: string;
    metadata?: Record<string, any>;
    templateId?: string;
    templateData?: Record<string, any>;
}
export declare class NotificationFiltersDto {
    isRead?: boolean;
    type?: NotificationType;
    priority?: NotificationPriority;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'priority';
    sortOrder?: 'ASC' | 'DESC';
}
export declare class MarkAsReadDto {
    isRead: boolean;
}
export declare class BulkActionDto {
    notificationIds: number[];
    action: 'markAsRead' | 'delete';
}
export declare class NotificationResponseDto {
    id: number;
    userId: number;
    eventId?: number;
    contributionId?: number;
    withdrawalId?: number;
    transactionId?: number;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    deliveryMethod: DeliveryMethod;
    priority: NotificationPriority;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class NotificationStatsDto {
    total: number;
    unread: number;
    byType: Record<string, number>;
    recent: number;
}
