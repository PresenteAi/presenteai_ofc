import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto, NotificationFiltersDto, NotificationStatsDto, NotificationResponseDto } from '../dto/notification.dto';
import { NotificationType, DeliveryMethod } from '../entities/notification.entity';
export interface NotificationEvent {
    type: NotificationType;
    userId: number;
    title: string;
    message: string;
    entityId?: number;
    entityType?: string;
    metadata?: Record<string, any>;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    deliveryMethods?: DeliveryMethod[];
}
export declare class NotificationsService {
    private readonly notificationRepository;
    private readonly eventEmitter;
    private readonly logger;
    constructor(notificationRepository: NotificationRepository, eventEmitter: EventEmitter2);
    createNotification(dto: CreateNotificationDto): Promise<NotificationResponseDto>;
    getUserNotifications(userId: number, filters?: NotificationFiltersDto): Promise<{
        notifications: NotificationResponseDto[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
        };
    }>;
    getNotificationById(id: number, userId: number): Promise<NotificationResponseDto>;
    markAsRead(id: number, userId: number, isRead?: boolean): Promise<NotificationResponseDto>;
    markAllAsRead(userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNotification(id: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserNotificationStats(userId: number): Promise<NotificationStatsDto>;
    getUnreadCount(userId: number): Promise<{
        count: number;
    }>;
    performBulkAction(userId: number, notificationIds: number[], action: 'markAsRead' | 'delete'): Promise<{
        success: boolean;
        message: string;
        processed: number;
    }>;
    notifyContributionReceived(params: {
        userId: number;
        contributionId: number;
        eventId: number;
        amount: number;
        contributorName?: string;
    }): Promise<void>;
    notifyWithdrawalStatusChange(params: {
        userId: number;
        withdrawalId: number;
        status: 'completed' | 'failed' | 'processing';
        amount: number;
        reason?: string;
    }): Promise<void>;
    notifyEventMilestone(params: {
        userId: number;
        eventId: number;
        milestone: 'goal_reached' | 'gift_completed' | 'event_starting_soon';
        eventTitle: string;
        metadata?: Record<string, any>;
    }): Promise<void>;
    notifySystem(params: {
        userId: number;
        title: string;
        message: string;
        priority?: 'low' | 'normal' | 'high' | 'urgent';
        metadata?: Record<string, any>;
    }): Promise<void>;
    private getTotalCount;
    private mapToResponseDto;
    cleanupOldNotifications(): Promise<void>;
}
