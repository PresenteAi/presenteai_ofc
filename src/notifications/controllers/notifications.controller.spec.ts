import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../controllers/notifications.controller';
import { NotificationsService } from '../services/notifications.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { 
  CreateNotificationDto,
  NotificationFiltersDto,
  MarkAsReadDto,
  BulkActionDto,
  NotificationResponseDto 
} from '../dto/notification.dto';
import { 
  NotificationType, 
  DeliveryMethod, 
  NotificationPriority 
} from '../entities/notification.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: jest.Mocked<NotificationsService>;

  const mockUser = { userId: 1 };

  beforeEach(async () => {
    const mockNotificationsService = {
      createNotification: jest.fn(),
      getUserNotifications: jest.fn(),
      getNotificationById: jest.fn(),
      getUserNotificationStats: jest.fn(),
      getUnreadCount: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      deleteNotification: jest.fn(),
      performBulkAction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create notification successfully', async () => {
      // Arrange
      const createDto: CreateNotificationDto = {
        userId: 1,
        type: NotificationType.SYSTEM,
        title: 'System Notification',
        message: 'This is a system notification',
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: NotificationPriority.NORMAL,
      };

      const expectedNotification: NotificationResponseDto = {
        id: 1,
        userId: 1,
        type: NotificationType.SYSTEM,
        title: 'System Notification',
        message: 'This is a system notification',
        isRead: false,
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: NotificationPriority.NORMAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.createNotification.mockResolvedValue(expectedNotification);

      // Act
      const result = await controller.createNotification(createDto);

      // Assert
      expect(service.createNotification).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedNotification);
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications with pagination', async () => {
      // Arrange
      const userId = 1;
      const filters: NotificationFiltersDto = {
        limit: 20,
        offset: 0,
        isRead: false,
      };

      const expectedResponse = {
        notifications: [
          {
            id: 1,
            userId: 1,
            type: NotificationType.CONTRIBUTION,
            title: 'New Contribution',
            message: 'You received a contribution',
            isRead: false,
            deliveryMethod: DeliveryMethod.IN_APP,
            priority: NotificationPriority.HIGH,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as NotificationResponseDto,
        ],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      };

      service.getUserNotifications.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getUserNotifications(userId, filters, mockUser);

      // Assert
      expect(service.getUserNotifications).toHaveBeenCalledWith(userId, filters);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when user tries to access other user notifications', async () => {
      // Arrange
      const userId = 2; // Different user
      const filters: NotificationFiltersDto = {};

      // Act & Assert
      await expect(controller.getUserNotifications(userId, filters, mockUser))
        .rejects.toThrow('Access denied');
    });
  });

  describe('getUserNotificationStats', () => {
    it('should return notification statistics for user', async () => {
      // Arrange
      const userId = 1;
      const expectedStats = {
        total: 50,
        unread: 5,
        byType: {
          contribution: 20,
          event: 15,
          system: 15,
        },
        recent: 10,
      };

      service.getUserNotificationStats.mockResolvedValue(expectedStats);

      // Act
      const result = await controller.getUserNotificationStats(userId, mockUser);

      // Assert
      expect(service.getUserNotificationStats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedStats);
    });

    it('should throw error when accessing other user stats', async () => {
      // Act & Assert
      await expect(controller.getUserNotificationStats(2, mockUser))
        .rejects.toThrow('Access denied');
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      // Arrange
      const userId = 1;
      const expectedCount = { count: 7 };

      service.getUnreadCount.mockResolvedValue(expectedCount);

      // Act
      const result = await controller.getUnreadCount(userId, mockUser);

      // Assert
      expect(service.getUnreadCount).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedCount);
    });
  });

  describe('getNotification', () => {
    it('should return specific notification', async () => {
      // Arrange
      const notificationId = 1;
      const expectedNotification: NotificationResponseDto = {
        id: 1,
        userId: 1,
        type: NotificationType.CONTRIBUTION,
        title: 'Test Notification',
        message: 'Test Message',
        isRead: false,
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: NotificationPriority.NORMAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.getNotificationById.mockResolvedValue(expectedNotification);

      // Act
      const result = await controller.getNotification(notificationId, mockUser);

      // Assert
      expect(service.getNotificationById).toHaveBeenCalledWith(notificationId, mockUser.userId);
      expect(result).toEqual(expectedNotification);
    });

    it('should handle not found error', async () => {
      // Arrange
      service.getNotificationById.mockRejectedValue(new NotFoundException('Notification not found'));

      // Act & Assert
      await expect(controller.getNotification(999, mockUser))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      // Arrange
      const notificationId = 1;
      const markAsReadDto: MarkAsReadDto = { isRead: true };
      const expectedNotification: NotificationResponseDto = {
        id: 1,
        userId: 1,
        type: NotificationType.CONTRIBUTION,
        title: 'Test Notification',
        message: 'Test Message',
        isRead: true,
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: NotificationPriority.NORMAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.markAsRead.mockResolvedValue(expectedNotification);

      // Act
      const result = await controller.markAsRead(notificationId, markAsReadDto, mockUser);

      // Assert
      expect(service.markAsRead).toHaveBeenCalledWith(notificationId, mockUser.userId, true);
      expect(result.isRead).toBe(true);
    });

    it('should mark notification as unread', async () => {
      // Arrange
      const notificationId = 1;
      const markAsReadDto: MarkAsReadDto = { isRead: false };
      const expectedNotification: NotificationResponseDto = {
        id: 1,
        userId: 1,
        type: NotificationType.CONTRIBUTION,
        title: 'Test Notification',
        message: 'Test Message',
        isRead: false,
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: NotificationPriority.NORMAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.markAsRead.mockResolvedValue(expectedNotification);

      // Act
      const result = await controller.markAsRead(notificationId, markAsReadDto, mockUser);

      // Assert
      expect(service.markAsRead).toHaveBeenCalledWith(notificationId, mockUser.userId, false);
      expect(result.isRead).toBe(false);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for user', async () => {
      // Arrange
      const userId = 1;
      const expectedResponse = {
        success: true,
        message: 'All notifications marked as read',
      };

      service.markAllAsRead.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.markAllAsRead(userId, mockUser);

      // Assert
      expect(service.markAllAsRead).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when accessing other user', async () => {
      // Act & Assert
      await expect(controller.markAllAsRead(2, mockUser))
        .rejects.toThrow('Access denied');
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      // Arrange
      const notificationId = 1;
      const expectedResponse = {
        success: true,
        message: 'Notification deleted successfully',
      };

      service.deleteNotification.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.deleteNotification(notificationId, mockUser);

      // Assert
      expect(service.deleteNotification).toHaveBeenCalledWith(notificationId, mockUser.userId);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle not found error', async () => {
      // Arrange
      service.deleteNotification.mockRejectedValue(new NotFoundException('Notification not found'));

      // Act & Assert
      await expect(controller.deleteNotification(999, mockUser))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('performBulkAction', () => {
    it('should perform bulk mark as read action', async () => {
      // Arrange
      const userId = 1;
      const bulkActionDto: BulkActionDto = {
        notificationIds: [1, 2, 3],
        action: 'markAsRead',
      };
      const expectedResponse = {
        success: true,
        message: '3 notifications processed',
        processed: 3,
      };

      service.performBulkAction.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.performBulkAction(userId, bulkActionDto, mockUser);

      // Assert
      expect(service.performBulkAction).toHaveBeenCalledWith(userId, [1, 2, 3], 'markAsRead');
      expect(result).toEqual(expectedResponse);
    });

    it('should perform bulk delete action', async () => {
      // Arrange
      const userId = 1;
      const bulkActionDto: BulkActionDto = {
        notificationIds: [1, 2],
        action: 'delete',
      };
      const expectedResponse = {
        success: true,
        message: '2 notifications processed',
        processed: 2,
      };

      service.performBulkAction.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.performBulkAction(userId, bulkActionDto, mockUser);

      // Assert
      expect(service.performBulkAction).toHaveBeenCalledWith(userId, [1, 2], 'delete');
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when accessing other user', async () => {
      // Arrange
      const bulkActionDto: BulkActionDto = {
        notificationIds: [1, 2],
        action: 'markAsRead',
      };

      // Act & Assert
      await expect(controller.performBulkAction(2, bulkActionDto, mockUser))
        .rejects.toThrow('Access denied');
    });

    it('should handle service errors', async () => {
      // Arrange
      const userId = 1;
      const bulkActionDto: BulkActionDto = {
        notificationIds: [1, 999], // One invalid ID
        action: 'markAsRead',
      };

      service.performBulkAction.mockRejectedValue(
        new BadRequestException('Some notifications not found or access denied')
      );

      // Act & Assert
      await expect(controller.performBulkAction(userId, bulkActionDto, mockUser))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getLiveNotifications', () => {
    it('should return SSE endpoint message', async () => {
      // Arrange
      const userId = 1;

      // Act
      const result = await controller.getLiveNotifications(userId, mockUser);

      // Assert
      expect(result.message).toBe('SSE endpoint - implementation pending');
    });

    it('should throw error when accessing other user', async () => {
      // Act & Assert
      await expect(controller.getLiveNotifications(2, mockUser))
        .rejects.toThrow('Access denied');
    });
  });

  describe('Admin endpoints', () => {
    describe('broadcastNotification', () => {
      it('should return broadcast message', async () => {
        // Arrange
        const broadcastDto = {
          userIds: [1, 2, 3],
          title: 'System Announcement',
          message: 'System maintenance scheduled',
          type: 'system',
        };

        // Act
        const result = await controller.broadcastNotification(broadcastDto);

        // Assert
        expect(result.message).toBe('Broadcast functionality - implementation pending');
      });
    });

    describe('getNotificationAnalytics', () => {
      it('should return analytics message', async () => {
        // Act
        const result = await controller.getNotificationAnalytics();

        // Assert
        expect(result.message).toBe('Analytics endpoint - implementation pending');
      });
    });
  });
});