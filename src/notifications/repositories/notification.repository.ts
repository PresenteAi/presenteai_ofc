import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository {
  private readonly logger = new Logger(NotificationRepository.name);

  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  /**
   * Create a new notification
   */
  async create(notification: Partial<Notification>): Promise<Notification> {
    const newNotification = this.repository.create(notification);
    return this.repository.save(newNotification);
  }

  /**
   * Find notification by ID
   */
  async findById(id: number): Promise<Notification | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Find notifications by user ID
   */
  async findByUserId(
    userId: number,
    options: {
      isRead?: boolean;
      limit?: number;
      offset?: number;
      orderBy?: 'createdAt' | 'updatedAt' | 'priority';
      order?: 'ASC' | 'DESC';
    } = {}
  ): Promise<Notification[]> {
    const {
      isRead,
      limit = 50,
      offset = 0,
      orderBy = 'createdAt',
      order = 'DESC',
    } = options;

    const where: FindOptionsWhere<Notification> = { userId };
    
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    return this.repository.find({
      where,
      order: { [orderBy]: order },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Count unread notifications for user
   */
  async countUnreadByUserId(userId: number): Promise<number> {
    return this.repository.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: number): Promise<Notification | null> {
    const notification = await this.findById(id);
    if (!notification) {
      return null;
    }

    notification.markAsRead();
    return this.repository.save(notification);
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(ids: number[]): Promise<void> {
    await this.repository.update(
      { id: { $in: ids } } as any,
      { isRead: true, updatedAt: new Date() }
    );
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsReadForUser(userId: number): Promise<void> {
    await this.repository.update(
      { userId, isRead: false },
      { isRead: true, updatedAt: new Date() }
    );
  }

  /**
   * Delete notification
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Delete old notifications (cleanup)
   */
  async deleteOldNotifications(daysOld: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.repository.delete({
      createdAt: { $lt: cutoffDate } as any,
      isRead: true,
    });

    this.logger.log(`Deleted ${result.affected} old notifications`);
    return result.affected || 0;
  }

  /**
   * Find notifications pending to be sent
   */
  async findPendingNotifications(limit: number = 100): Promise<Notification[]> {
    return this.repository.find({
      where: {
        status: { $in: ['created', 'failed'] } as any,
        retryCount: { $lt: 3 } as any,
      },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }

  /**
   * Find notifications by related entity
   */
  async findByRelatedEntity(params: {
    eventId?: number;
    contributionId?: number;
    withdrawalId?: number;
    transactionId?: number;
  }): Promise<Notification[]> {
    const where: FindOptionsWhere<Notification> = {};

    if (params.eventId) where.eventId = params.eventId;
    if (params.contributionId) where.contributionId = params.contributionId;
    if (params.withdrawalId) where.withdrawalId = params.withdrawalId;
    if (params.transactionId) where.transactionId = params.transactionId;

    return this.repository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get notification statistics for user
   */
  async getNotificationStats(userId: number): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    recent: number;
  }> {
    const [total, unread] = await Promise.all([
      this.repository.count({ where: { userId } }),
      this.repository.count({ where: { userId, isRead: false } }),
    ]);

    // Get count by type
    const typeStats = await this.repository
      .createQueryBuilder('notification')
      .select('notification.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('notification.userId = :userId', { userId })
      .groupBy('notification.type')
      .getRawMany();

    const byType = typeStats.reduce((acc, stat) => {
      acc[stat.type] = parseInt(stat.count);
      return acc;
    }, {});

    // Get recent notifications (last 7 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);

    const recent = await this.repository.count({
      where: {
        userId,
        createdAt: { $gte: recentDate } as any,
      },
    });

    return { total, unread, byType, recent };
  }

  /**
   * Save notification (update existing)
   */
  async save(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }
}