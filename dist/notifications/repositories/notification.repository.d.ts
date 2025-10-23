import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
export declare class NotificationRepository {
    private readonly repository;
    private readonly logger;
    constructor(repository: Repository<Notification>);
    create(notification: Partial<Notification>): Promise<Notification>;
    findById(id: number): Promise<Notification | null>;
    findByUserId(userId: number, options?: {
        isRead?: boolean;
        limit?: number;
        offset?: number;
        orderBy?: 'createdAt' | 'updatedAt' | 'priority';
        order?: 'ASC' | 'DESC';
    }): Promise<Notification[]>;
    countUnreadByUserId(userId: number): Promise<number>;
    markAsRead(id: number): Promise<Notification | null>;
    markMultipleAsRead(ids: number[]): Promise<void>;
    markAllAsReadForUser(userId: number): Promise<void>;
    delete(id: number): Promise<boolean>;
    deleteOldNotifications(daysOld?: number): Promise<number>;
    findPendingNotifications(limit?: number): Promise<Notification[]>;
    findByRelatedEntity(params: {
        eventId?: number;
        contributionId?: number;
        withdrawalId?: number;
        transactionId?: number;
    }): Promise<Notification[]>;
    getNotificationStats(userId: number): Promise<{
        total: number;
        unread: number;
        byType: Record<string, number>;
        recent: number;
    }>;
    save(notification: Notification): Promise<Notification>;
}
