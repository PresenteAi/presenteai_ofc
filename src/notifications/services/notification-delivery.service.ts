import { Injectable, Logger } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter'; // TODO: Install @nestjs/event-emitter
import { EmailNotificationProvider } from '../providers/email-notification.provider';
import { PushNotificationProvider } from '../providers/push-notification.provider';
import { NotificationRepository } from '../repositories/notification.repository';
import { DeliveryMethod, NotificationStatus } from '../entities/notification.entity';

interface NotificationCreatedEvent {
  notificationId: number;
  userId: number;
  deliveryMethod: DeliveryMethod;
  priority: string;
}

@Injectable()
export class NotificationDeliveryService {
  private readonly logger = new Logger(NotificationDeliveryService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly emailProvider: EmailNotificationProvider,
    private readonly pushProvider: PushNotificationProvider,
  ) {}

  /**
   * Handle notification creation event
   * TODO: Uncomment @OnEvent when @nestjs/event-emitter is installed
   */
  // @OnEvent('notification.created')
  async handleNotificationCreated(event: NotificationCreatedEvent): Promise<void> {
    const { notificationId, deliveryMethod } = event;
    
    try {
      const notification = await this.notificationRepository.findById(notificationId);
      
      if (!notification) {
        this.logger.warn(`Notification ${notificationId} not found for delivery`);
        return;
      }

      // In-app notifications are already "delivered" when created
      if (deliveryMethod === DeliveryMethod.IN_APP) {
        notification.markAsDelivered();
        await this.notificationRepository.save(notification);
        return;
      }

      // Process external deliveries
      await this.processDelivery(notification, deliveryMethod);

    } catch (error) {
      this.logger.error(`Failed to process notification ${notificationId}: ${error.message}`);
      await this.markDeliveryFailed(notificationId, error.message);
    }
  }

  /**
   * Process notification delivery based on method
   */
  private async processDelivery(notification: any, deliveryMethod: DeliveryMethod): Promise<void> {
    this.logger.log(`Processing ${deliveryMethod} delivery for notification ${notification.id}`);

    try {
      switch (deliveryMethod) {
        case DeliveryMethod.EMAIL:
          await this.emailProvider.sendNotification(notification);
          break;
          
        case DeliveryMethod.PUSH:
          await this.pushProvider.sendNotification(notification);
          break;
          
        case DeliveryMethod.SMS:
          // TODO: Implement SMS provider
          this.logger.warn('SMS delivery not yet implemented');
          break;
          
        default:
          this.logger.warn(`Unknown delivery method: ${deliveryMethod}`);
          return;
      }

      // Mark as sent and delivered
      notification.markAsSent();
      notification.markAsDelivered();
      await this.notificationRepository.save(notification);

      this.logger.log(`Successfully delivered notification ${notification.id} via ${deliveryMethod}`);

    } catch (error) {
      this.logger.error(`Failed to deliver notification ${notification.id}: ${error.message}`);
      notification.markAsFailed(error.message);
      await this.notificationRepository.save(notification);
    }
  }

  /**
   * Mark delivery as failed
   */
  private async markDeliveryFailed(notificationId: number, error: string): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    
    if (notification) {
      notification.markAsFailed(error);
      await this.notificationRepository.save(notification);
    }
  }

  /**
   * Retry failed deliveries
   */
  async retryFailedDeliveries(): Promise<void> {
    this.logger.log('Starting retry process for failed deliveries');

    const failedNotifications = await this.notificationRepository.findPendingNotifications(50);
    
    for (const notification of failedNotifications) {
      if (notification.canRetry() && !notification.isExpired()) {
        this.logger.log(`Retrying delivery for notification ${notification.id}`);
        
        try {
          await this.processDelivery(notification, notification.deliveryMethod);
        } catch (error) {
          this.logger.error(`Retry failed for notification ${notification.id}: ${error.message}`);
        }
      }
    }

    this.logger.log(`Retry process completed for ${failedNotifications.length} notifications`);
  }

  /**
   * Send test notification
   */
  async sendTestNotification(userId: number, deliveryMethod: DeliveryMethod): Promise<boolean> {
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
        case DeliveryMethod.EMAIL:
          await this.emailProvider.sendNotification(testNotification);
          break;
          
        case DeliveryMethod.PUSH:
          await this.pushProvider.sendNotification(testNotification);
          break;
          
        default:
          throw new Error(`Unsupported delivery method: ${deliveryMethod}`);
      }

      this.logger.log(`Test notification sent successfully to user ${userId} via ${deliveryMethod}`);
      return true;

    } catch (error) {
      this.logger.error(`Failed to send test notification: ${error.message}`);
      return false;
    }
  }

  /**
   * Get delivery statistics
   */
  async getDeliveryStats(): Promise<{
    totalSent: number;
    totalFailed: number;
    byMethod: Record<string, { sent: number; failed: number }>;
  }> {
    // TODO: Implement proper statistics query
    // This would typically involve aggregation queries on the notification table
    
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
}