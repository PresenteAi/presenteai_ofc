import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto, NotificationFiltersDto, MarkAsReadDto, BulkActionDto, NotificationResponseDto, NotificationStatsDto } from '../dto/notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto>;
    getUserNotifications(userId: number, filters: NotificationFiltersDto, currentUser: any): Promise<{
        notifications: NotificationResponseDto[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
        };
    }>;
    getUserNotificationStats(userId: number, currentUser: any): Promise<NotificationStatsDto>;
    getUnreadCount(userId: number, currentUser: any): Promise<{
        count: number;
    }>;
    getNotification(id: number, currentUser: any): Promise<NotificationResponseDto>;
    markAsRead(id: number, markAsReadDto: MarkAsReadDto, currentUser: any): Promise<NotificationResponseDto>;
    markAllAsRead(userId: number, currentUser: any): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNotification(id: number, currentUser: any): Promise<{
        success: boolean;
        message: string;
    }>;
    performBulkAction(userId: number, bulkActionDto: BulkActionDto, currentUser: any): Promise<{
        success: boolean;
        message: string;
        processed: number;
    }>;
    getLiveNotifications(userId: number, currentUser: any): Promise<{
        message: string;
    }>;
    broadcastNotification(broadcastDto: {
        userIds: number[];
        title: string;
        message: string;
        type: string;
        priority?: string;
    }): Promise<{
        message: string;
    }>;
    getNotificationAnalytics(): Promise<{
        message: string;
    }>;
}
