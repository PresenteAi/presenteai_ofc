import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationRepository } from '../repositories/notification.repository';
import { 
  CreateNotificationDto, 
  NotificationFiltersDto, 
  NotificationStatsDto,
  NotificationResponseDto 
} from '../dto/notification.dto';
import { 
  Notification, 
  NotificationType, 
  DeliveryMethod, 
  NotificationStatus 
} from '../entities/notification.entity';

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

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new notification
   */
  async createNotification(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    this.logger.log(`Creating notification for user ${dto.userId}: ${dto.title}`);

    try {
      const notification = await this.notificationRepository.create({
        ...dto,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      });

      // Emit event for delivery services
      this.eventEmitter.emit('notification.created', {
        notificationId: notification.id,
        userId: notification.userId,
        deliveryMethod: dto.deliveryMethod,
        priority: dto.priority,
      });

      return this.mapToResponseDto(notification);
    } catch (error) {
      this.logger.error(`Failed to create notification: ${error.message}`);
      throw new BadRequestException('Failed to create notification');
    }
  }

  /**
   * Get notifications for a user with filters
   */
  async getUserNotifications(
    userId: number, 
    filters: NotificationFiltersDto = {}
  ): Promise<{
    notifications: NotificationResponseDto[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    const { limit = 20, offset = 0, isRead, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;

    const notifications = await this.notificationRepository.findByUserId(userId, {
      isRead,
      limit: limit + 1, // Get one extra to check if there are more
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

  /**
   * Get a specific notification by ID
   */
  async getNotificationById(id: number, userId: number): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.mapToResponseDto(notification);
  }

  /**
   * Mark notification as read/unread
   */
  async markAsRead(id: number, userId: number, isRead: boolean = true): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    if (isRead) {
      notification.markAsRead();
    } else {
      notification.isRead = false;
    }

    const updatedNotification = await this.notificationRepository.save(notification);
    
    this.logger.log(`Notification ${id} marked as ${isRead ? 'read' : 'unread'}`);

    return this.mapToResponseDto(updatedNotification);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: number): Promise<{ success: boolean; message: string }> {
    await this.notificationRepository.markAllAsReadForUser(userId);
    
    this.logger.log(`All notifications marked as read for user ${userId}`);

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: number, userId: number): Promise<{ success: boolean; message: string }> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    const deleted = await this.notificationRepository.delete(id);

    if (!deleted) {
      throw new BadRequestException('Failed to delete notification');
    }

    this.logger.log(`Notification ${id} deleted by user ${userId}`);

    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  }

  /**
   * Get notification statistics for a user
   */
  async getUserNotificationStats(userId: number): Promise<NotificationStatsDto> {
    return this.notificationRepository.getNotificationStats(userId);
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: number): Promise<{ count: number }> {
    const count = await this.notificationRepository.countUnreadByUserId(userId);
    return { count };
  }

  /**
   * Perform bulk actions on notifications
   */
  async performBulkAction(
    userId: number,
    notificationIds: number[],
    action: 'markAsRead' | 'delete'
  ): Promise<{ success: boolean; message: string; processed: number }> {
    // Verify all notifications belong to the user
    const notifications = await Promise.all(
      notificationIds.map(id => this.notificationRepository.findById(id))
    );

    const validNotifications = notifications.filter(
      (n): n is Notification => n !== null && n.userId === userId
    );

    if (validNotifications.length !== notificationIds.length) {
      throw new BadRequestException('Some notifications not found or access denied');
    }

    const validIds = validNotifications.map(n => n.id);

    if (action === 'markAsRead') {
      await this.notificationRepository.markMultipleAsRead(validIds);
    } else if (action === 'delete') {
      await Promise.all(validIds.map(id => this.notificationRepository.delete(id)));
    }

    this.logger.log(`Bulk ${action} performed on ${validIds.length} notifications for user ${userId}`);

    return {
      success: true,
      message: `${validIds.length} notifications processed`,
      processed: validIds.length,
    };
  }

  // ============ Event-based notification creators ============

  /**
   * Create contribution received notification
   */
  async notifyContributionReceived(params: {
    userId: number;
    contributionId: number;
    eventId: number;
    amount: number;
    contributorName?: string;
  }): Promise<void> {
    const { userId, contributionId, eventId, amount, contributorName } = params;

    await this.createNotification({
      userId,
      contributionId,
      eventId,
      type: NotificationType.CONTRIBUTION,
      title: 'Nova Contribuição Recebida! 🎉',
      message: contributorName 
        ? `${contributorName} contribuiu com R$ ${amount.toFixed(2)} para o seu evento!`
        : `Você recebeu uma nova contribuição de R$ ${amount.toFixed(2)}!`,
      deliveryMethod: DeliveryMethod.IN_APP,
      priority: 'high' as any,
      metadata: {
        amount,
        contributorName,
        eventId,
        contributionId,
      },
    });

    this.logger.log(`Contribution notification sent to user ${userId}`);
  }

  /**
   * Create withdrawal status notification
   */
  async notifyWithdrawalStatusChange(params: {
    userId: number;
    withdrawalId: number;
    status: 'completed' | 'failed' | 'processing';
    amount: number;
    reason?: string;
  }): Promise<void> {
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
      type: NotificationType.WITHDRAWAL,
      title: titles[status],
      message: messages[status],
      deliveryMethod: DeliveryMethod.IN_APP,
      priority: status === 'failed' ? 'high' as any : 'normal' as any,
      metadata: {
        amount,
        status,
        reason,
        withdrawalId,
      },
    });

    this.logger.log(`Withdrawal ${status} notification sent to user ${userId}`);
  }

  /**
   * Create event milestone notification
   */
  async notifyEventMilestone(params: {
    userId: number;
    eventId: number;
    milestone: 'goal_reached' | 'gift_completed' | 'event_starting_soon';
    eventTitle: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
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
      type: NotificationType.EVENT,
      title: titles[milestone],
      message: messages[milestone],
      deliveryMethod: DeliveryMethod.IN_APP,
      priority: 'normal' as any,
      metadata: {
        milestone,
        eventTitle,
        eventId,
        ...metadata,
      },
    });

    this.logger.log(`Event milestone notification (${milestone}) sent to user ${userId}`);
  }

  /**
   * Create system notification
   */
  async notifySystem(params: {
    userId: number;
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { userId, title, message, priority = 'normal', metadata } = params;

    await this.createNotification({
      userId,
      type: NotificationType.SYSTEM,
      title,
      message,
      deliveryMethod: DeliveryMethod.IN_APP,
      priority: priority as any,
      metadata,
    });

    this.logger.log(`System notification sent to user ${userId}: ${title}`);
  }

  // ============ Private methods ============

  private async getTotalCount(userId: number, filters: NotificationFiltersDto): Promise<number> {
    // This is a simplified count - in a real implementation, you'd apply all filters
    if (filters.isRead !== undefined) {
      return filters.isRead 
        ? await this.notificationRepository.countUnreadByUserId(userId)
        : (await this.notificationRepository.getNotificationStats(userId)).total - 
          await this.notificationRepository.countUnreadByUserId(userId);
    }
    
    return (await this.notificationRepository.getNotificationStats(userId)).total;
  }

  private mapToResponseDto(notification: Notification): NotificationResponseDto {
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

  /**
   * Cleanup old notifications (called by scheduled task)
   */
  async cleanupOldNotifications(): Promise<void> {
    const deleted = await this.notificationRepository.deleteOldNotifications(90);
    this.logger.log(`Cleanup completed: ${deleted} old notifications removed`);
  }
}