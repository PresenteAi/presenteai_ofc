import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDeliveryService } from '../services/notification-delivery.service';
import { EmailNotificationProvider } from '../providers/email-notification.provider';
import { PushNotificationProvider } from '../providers/push-notification.provider';
import { NotificationRepository } from '../repositories/notification.repository';
import { DeliveryMethod, NotificationStatus, Notification } from '../entities/notification.entity';

describe('NotificationDeliveryService', () => {
  let service: NotificationDeliveryService;
  let notificationRepository: jest.Mocked<NotificationRepository>;
  let emailProvider: jest.Mocked<EmailNotificationProvider>;
  let pushProvider: jest.Mocked<PushNotificationProvider>;

  beforeEach(async () => {
    const mockNotificationRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findPendingNotifications: jest.fn(),
    };

    const mockEmailProvider = {
      sendNotification: jest.fn(),
    };

    const mockPushProvider = {
      sendNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationDeliveryService,
        {
          provide: NotificationRepository,
          useValue: mockNotificationRepository,
        },
        {
          provide: EmailNotificationProvider,
          useValue: mockEmailProvider,
        },
        {
          provide: PushNotificationProvider,
          useValue: mockPushProvider,
        },
      ],
    })
    .setLogger({
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    })
    .compile();

    service = module.get<NotificationDeliveryService>(NotificationDeliveryService);
    notificationRepository = module.get(NotificationRepository);
    emailProvider = module.get(EmailNotificationProvider);
    pushProvider = module.get(PushNotificationProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleNotificationCreated', () => {
    it('should handle in-app notification delivery', async () => {
      // Arrange
      const event = {
        notificationId: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: 'normal',
      };

      const mockNotification = Object.assign(new Notification(), {
        id: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.IN_APP,
        markAsDelivered: jest.fn(),
      });

      notificationRepository.findById.mockResolvedValue(mockNotification);

      // Act
      await service.handleNotificationCreated(event);

      // Assert
      expect(notificationRepository.findById).toHaveBeenCalledWith(1);
      expect(mockNotification.markAsDelivered).toHaveBeenCalled();
      expect(notificationRepository.save).toHaveBeenCalledWith(mockNotification);
    });

    it('should handle email notification delivery', async () => {
      // Arrange
      const event = {
        notificationId: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.EMAIL,
        priority: 'high',
      };

      const mockNotification = Object.assign(new Notification(), {
        id: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.EMAIL,
        title: 'Test Email',
        message: 'Test message',
        markAsSent: jest.fn(),
        markAsDelivered: jest.fn(),
      });

      notificationRepository.findById.mockResolvedValue(mockNotification);
      emailProvider.sendNotification.mockResolvedValue();

      // Act
      await service.handleNotificationCreated(event);

      // Assert
      expect(emailProvider.sendNotification).toHaveBeenCalledWith(mockNotification);
      expect(mockNotification.markAsSent).toHaveBeenCalled();
      expect(mockNotification.markAsDelivered).toHaveBeenCalled();
      expect(notificationRepository.save).toHaveBeenCalledWith(mockNotification);
    });

    it('should handle push notification delivery', async () => {
      // Arrange
      const event = {
        notificationId: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.PUSH,
        priority: 'normal',
      };

      const mockNotification = Object.assign(new Notification(), {
        id: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.PUSH,
        title: 'Test Push',
        message: 'Test message',
        markAsSent: jest.fn(),
        markAsDelivered: jest.fn(),
      });

      notificationRepository.findById.mockResolvedValue(mockNotification);
      pushProvider.sendNotification.mockResolvedValue();

      // Act
      await service.handleNotificationCreated(event);

      // Assert
      expect(pushProvider.sendNotification).toHaveBeenCalledWith(mockNotification);
      expect(mockNotification.markAsSent).toHaveBeenCalled();
      expect(mockNotification.markAsDelivered).toHaveBeenCalled();
    });

    it('should handle notification not found', async () => {
      // Arrange
      const event = {
        notificationId: 999,
        userId: 1,
        deliveryMethod: DeliveryMethod.EMAIL,
        priority: 'normal',
      };

      notificationRepository.findById.mockResolvedValue(null);

      // Act
      await service.handleNotificationCreated(event);

      // Assert
      expect(notificationRepository.findById).toHaveBeenCalledWith(999);
      expect(emailProvider.sendNotification).not.toHaveBeenCalled();
    });

    it('should handle delivery failure', async () => {
      // Arrange
      const event = {
        notificationId: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.EMAIL,
        priority: 'normal',
      };

      const mockNotification = Object.assign(new Notification(), {
        id: 1,
        deliveryMethod: DeliveryMethod.EMAIL,
        markAsFailed: jest.fn(),
      });

      notificationRepository.findById.mockResolvedValue(mockNotification);
      emailProvider.sendNotification.mockRejectedValue(new Error('SMTP server error'));

      // Act
      await service.handleNotificationCreated(event);

      // Assert
      expect(mockNotification.markAsFailed).toHaveBeenCalledWith('SMTP server error');
      expect(notificationRepository.save).toHaveBeenCalledWith(mockNotification);
    });
  });

  describe('retryFailedDeliveries', () => {
    it('should retry failed notifications that can be retried', async () => {
      // Arrange
      const failedNotification1 = Object.assign(new Notification(), {
        id: 1,
        deliveryMethod: DeliveryMethod.EMAIL,
        status: NotificationStatus.FAILED,
        retryCount: 1,
        maxRetries: 3,
        canRetry: jest.fn().mockReturnValue(true),
        isExpired: jest.fn().mockReturnValue(false),
        markAsSent: jest.fn(),
        markAsDelivered: jest.fn(),
      });

      const failedNotification2 = Object.assign(new Notification(), {
        id: 2,
        deliveryMethod: DeliveryMethod.PUSH,
        status: NotificationStatus.FAILED,
        retryCount: 3,
        maxRetries: 3,
        canRetry: jest.fn().mockReturnValue(false), // Max retries reached
        isExpired: jest.fn().mockReturnValue(false),
      });

      notificationRepository.findPendingNotifications.mockResolvedValue([
        failedNotification1,
        failedNotification2,
      ]);

      emailProvider.sendNotification.mockResolvedValue();

      // Act
      await service.retryFailedDeliveries();

      // Assert
      expect(notificationRepository.findPendingNotifications).toHaveBeenCalledWith(50);
      expect(emailProvider.sendNotification).toHaveBeenCalledWith(failedNotification1);
      expect(pushProvider.sendNotification).not.toHaveBeenCalled(); // Should not retry notification2
    });

    it('should not retry expired notifications', async () => {
      // Arrange
      const expiredNotification = Object.assign(new Notification(), {
        id: 1,
        deliveryMethod: DeliveryMethod.EMAIL,
        canRetry: jest.fn().mockReturnValue(true),
        isExpired: jest.fn().mockReturnValue(true), // Expired
      });

      notificationRepository.findPendingNotifications.mockResolvedValue([expiredNotification]);

      // Act
      await service.retryFailedDeliveries();

      // Assert
      expect(emailProvider.sendNotification).not.toHaveBeenCalled();
    });
  });

  describe('sendTestNotification', () => {
    it('should send test email notification successfully', async () => {
      // Arrange
      emailProvider.sendNotification.mockResolvedValue();

      // Act
      const result = await service.sendTestNotification(1, DeliveryMethod.EMAIL);

      // Assert
      expect(emailProvider.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          title: 'Test Notification',
          message: 'This is a test notification from Presente Aí!',
        })
      );
      expect(result).toBe(true);
    });

    it('should send test push notification successfully', async () => {
      // Arrange
      pushProvider.sendNotification.mockResolvedValue();

      // Act
      const result = await service.sendTestNotification(1, DeliveryMethod.PUSH);

      // Assert
      expect(pushProvider.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          title: 'Test Notification',
          message: 'This is a test notification from Presente Aí!',
        })
      );
      expect(result).toBe(true);
    });

    it('should handle test notification failure', async () => {
      // Arrange
      emailProvider.sendNotification.mockRejectedValue(new Error('Test error'));

      // Act
      const result = await service.sendTestNotification(1, DeliveryMethod.EMAIL);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle unsupported delivery method', async () => {
      // Act
      const result = await service.sendTestNotification(1, 'unsupported' as DeliveryMethod);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getDeliveryStats', () => {
    it('should return delivery statistics', async () => {
      // Act
      const result = await service.getDeliveryStats();

      // Assert
      expect(result).toEqual({
        totalSent: 0,
        totalFailed: 0,
        byMethod: {
          email: { sent: 0, failed: 0 },
          push: { sent: 0, failed: 0 },
          sms: { sent: 0, failed: 0 },
        },
      });
    });
  });
});