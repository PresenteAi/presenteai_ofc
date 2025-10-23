import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../services/notifications.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { 
  NotificationType, 
  DeliveryMethod, 
  NotificationPriority,
  Notification 
} from '../entities/notification.entity';
import { 
  CreateNotificationDto,
  NotificationFiltersDto 
} from '../dto/notification.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Helper function to create complete mock notifications
function createMockNotification(overrides: Partial<Notification> = {}): Notification {
  return Object.assign(new Notification(), {
    id: 1,
    userId: 1,
    eventId: null,
    contributionId: null,
    withdrawalId: null,
    transactionId: null,
    type: NotificationType.SYSTEM,
    title: 'Test Notification',
    message: 'Test message',
    deliveryMethod: DeliveryMethod.IN_APP,
    priority: NotificationPriority.NORMAL,
    status: 'created',
    isRead: false,
    sentAt: null,
    deliveredAt: null,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    metadata: {},
    templateId: null,
    templateData: {},
    retryCount: 0,
    maxRetries: 3,
    lastError: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    // Mock methods
    markAsRead: jest.fn(),
    markAsSent: jest.fn(),
    markAsDelivered: jest.fn(),
    markAsFailed: jest.fn(),
    canRetry: jest.fn().mockReturnValue(true),
    isExpired: jest.fn().mockReturnValue(false),
    shouldBeSent: jest.fn().mockReturnValue(true),
    toDisplayData: jest.fn().mockReturnValue({
      id: 1,
      type: NotificationType.SYSTEM,
      title: 'Test Notification',
      message: 'Test message',
      isRead: false,
      priority: NotificationPriority.NORMAL,
      createdAt: new Date(),
      metadata: {},
    }),
    setDefaultExpirationDate: jest.fn(),
    ...overrides
  });
}

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: jest.Mocked<NotificationRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      countUnreadByUserId: jest.fn(),
      markAllAsReadForUser: jest.fn(),
      markMultipleAsRead: jest.fn(),
      getNotificationStats: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationRepository,
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repository = module.get(NotificationRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create notification successfully', async () => {
      // Arrange
      const createDto: CreateNotificationDto = {
        userId: 1,
        type: NotificationType.CONTRIBUTION,
        title: 'New Contribution',
        message: 'You received a new contribution',
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: NotificationPriority.HIGH,
      };

      const mockNotification = new Notification();
      mockNotification.id = 1;
      mockNotification.userId = 1;
      mockNotification.type = NotificationType.CONTRIBUTION;
      mockNotification.title = 'New Contribution';
      mockNotification.message = 'You received a new contribution';

      repository.create.mockResolvedValue(mockNotification);

      // Act
      const result = await service.createNotification(createDto);

      // Assert
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        expiresAt: undefined,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('notification.created', {
        notificationId: 1,
        userId: 1,
        deliveryMethod: DeliveryMethod.IN_APP,
        priority: NotificationPriority.HIGH,
      });
      expect(result.id).toBe(1);
      expect(result.title).toBe('New Contribution');
    });

    it('should handle creation errors', async () => {
      // Arrange
      const createDto: CreateNotificationDto = {
        userId: 1,
        type: NotificationType.SYSTEM,
        title: 'System Message',
        message: 'System maintenance',
      };

      repository.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.createNotification(createDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications with pagination', async () => {
      // Arrange
      const userId = 1;
      const filters: NotificationFiltersDto = {
        limit: 10,
        offset: 0,
        isRead: false,
      };

      const mockNotifications = [
        createMockNotification({
          id: 1,
          userId: 1,
          type: NotificationType.CONTRIBUTION,
          title: 'Notification 1',
          message: 'Message 1',
          isRead: false,
        }),
        createMockNotification({
          id: 2,
          userId: 1,
          type: NotificationType.EVENT,
          title: 'Notification 2',
          message: 'Message 2',
          isRead: false,
        }),
      ];

      repository.findByUserId.mockResolvedValue(mockNotifications);
      
      // Mock total count method
      jest.spyOn(service as any, 'getTotalCount').mockResolvedValue(25);

      // Act
      const result = await service.getUserNotifications(userId, filters);

      // Assert
      expect(repository.findByUserId).toHaveBeenCalledWith(userId, {
        isRead: false,
        limit: 11, // +1 to check for more
        offset: 0,
        orderBy: 'createdAt',
        order: 'DESC',
      });
      expect(result.notifications).toHaveLength(2);
      expect(result.pagination.hasMore).toBe(false);
      expect(result.pagination.total).toBe(25);
    });
  });

  describe('getNotificationById', () => {
    it('should return notification when found and user matches', async () => {
      // Arrange
      const notificationId = 1;
      const userId = 1;
      
      const mockNotification = createMockNotification({
        id: 1,
        userId: 1,
        type: NotificationType.CONTRIBUTION,
        title: 'Test Notification',
        message: 'Test Message',
      });

      repository.findById.mockResolvedValue(mockNotification);

      // Act
      const result = await service.getNotificationById(notificationId, userId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(notificationId);
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Notification');
    });

    it('should throw NotFoundException when notification not found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getNotificationById(1, 1))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user does not match', async () => {
      // Arrange
      const mockNotification = createMockNotification({
        id: 1,
        userId: 2, // Different user
        title: 'Test Notification',
      });

      repository.findById.mockResolvedValue(mockNotification);

      // Act & Assert
      await expect(service.getNotificationById(1, 1))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      // Arrange
      const notificationId = 1;
      const userId = 1;
      
      const mockNotification = createMockNotification({
        id: 1,
        userId: 1,
        isRead: false,
      });

      const updatedNotification = createMockNotification({
        ...mockNotification,
        isRead: true,
      });

      repository.findById.mockResolvedValue(mockNotification);
      repository.save.mockResolvedValue(updatedNotification);

      // Act
      const result = await service.markAsRead(notificationId, userId, true);

      // Assert
      expect(mockNotification.markAsRead).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(mockNotification);
      expect(result.isRead).toBe(true);
    });

    it('should mark notification as unread when isRead is false', async () => {
      // Arrange
      const mockNotification = createMockNotification({
        id: 1,
        userId: 1,
        isRead: true,
      });

      const updatedNotification = createMockNotification({
        ...mockNotification,
        isRead: false,
      });

      repository.findById.mockResolvedValue(mockNotification);
      repository.save.mockResolvedValue(updatedNotification);

      // Act
      const result = await service.markAsRead(1, 1, false);

      // Assert
      expect(mockNotification.isRead).toBe(false);
      expect(repository.save).toHaveBeenCalledWith(mockNotification);
      expect(result.isRead).toBe(false);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for user', async () => {
      // Arrange
      const userId = 1;

      // Act
      const result = await service.markAllAsRead(userId);

      // Assert
      expect(repository.markAllAsReadForUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
      expect(result.message).toBe('All notifications marked as read');
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      // Arrange
      const notificationId = 1;
      const userId = 1;
      
      const mockNotification = createMockNotification({
        id: 1,
        userId: 1,
      });

      repository.findById.mockResolvedValue(mockNotification);
      repository.delete.mockResolvedValue(true);

      // Act
      const result = await service.deleteNotification(notificationId, userId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith(notificationId);
      expect(result.success).toBe(true);
    });

    it('should throw BadRequestException when delete fails', async () => {
      // Arrange
      const mockNotification = createMockNotification({
        id: 1,
        userId: 1,
      });

      repository.findById.mockResolvedValue(mockNotification);
      repository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(service.deleteNotification(1, 1))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserNotificationStats', () => {
    it('should return user notification statistics', async () => {
      // Arrange
      const userId = 1;
      const mockStats = {
        total: 50,
        unread: 5,
        byType: {
          contribution: 20,
          event: 15,
          system: 15,
        },
        recent: 10,
      };

      repository.getNotificationStats.mockResolvedValue(mockStats);

      // Act
      const result = await service.getUserNotificationStats(userId);

      // Assert
      expect(repository.getNotificationStats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockStats);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      // Arrange
      const userId = 1;
      repository.countUnreadByUserId.mockResolvedValue(7);

      // Act
      const result = await service.getUnreadCount(userId);

      // Assert
      expect(repository.countUnreadByUserId).toHaveBeenCalledWith(userId);
      expect(result.count).toBe(7);
    });
  });

  describe('performBulkAction', () => {
    it('should mark multiple notifications as read', async () => {
      // Arrange
      const userId = 1;
      const notificationIds = [1, 2, 3];
      
      const mockNotifications = notificationIds.map(id => 
        Object.assign(new Notification(), { id, userId: 1 })
      );

      repository.findById
        .mockResolvedValueOnce(mockNotifications[0])
        .mockResolvedValueOnce(mockNotifications[1])
        .mockResolvedValueOnce(mockNotifications[2]);

      // Act
      const result = await service.performBulkAction(userId, notificationIds, 'markAsRead');

      // Assert
      expect(repository.markMultipleAsRead).toHaveBeenCalledWith(notificationIds);
      expect(result.processed).toBe(3);
      expect(result.success).toBe(true);
    });

    it('should delete multiple notifications', async () => {
      // Arrange
      const userId = 1;
      const notificationIds = [1, 2];
      
      const mockNotifications = notificationIds.map(id => 
        Object.assign(new Notification(), { id, userId: 1 })
      );

      repository.findById
        .mockResolvedValueOnce(mockNotifications[0])
        .mockResolvedValueOnce(mockNotifications[1]);
        
      repository.delete.mockResolvedValue(true);

      // Act
      const result = await service.performBulkAction(userId, notificationIds, 'delete');

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(2);
      expect(result.processed).toBe(2);
    });

    it('should throw BadRequestException when some notifications not found', async () => {
      // Arrange
      const userId = 1;
      const notificationIds = [1, 2, 3];
      
      repository.findById
        .mockResolvedValueOnce(Object.assign(new Notification(), { id: 1, userId: 1 }))
        .mockResolvedValueOnce(null) // Not found
        .mockResolvedValueOnce(Object.assign(new Notification(), { id: 3, userId: 1 }));

      // Act & Assert
      await expect(service.performBulkAction(userId, notificationIds, 'markAsRead'))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('Event-based notifications', () => {
    describe('notifyContributionReceived', () => {
      it('should create contribution notification', async () => {
        // Arrange
        const params = {
          userId: 1,
          contributionId: 5,
          eventId: 10,
          amount: 100.50,
          contributorName: 'João Silva',
        };

        const mockNotification = new Notification();
        repository.create.mockResolvedValue(mockNotification);

        // Act
        await service.notifyContributionReceived(params);

        // Assert
        expect(repository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 1,
            contributionId: 5,
            eventId: 10,
            type: NotificationType.CONTRIBUTION,
            title: 'Nova Contribuição Recebida! 🎉',
            message: 'João Silva contribuiu com R$ 100.50 para o seu evento!',
          })
        );
      });
    });

    describe('notifyWithdrawalStatusChange', () => {
      it('should create withdrawal completed notification', async () => {
        // Arrange
        const params = {
          userId: 1,
          withdrawalId: 3,
          status: 'completed' as const,
          amount: 250.00,
        };

        const mockNotification = new Notification();
        repository.create.mockResolvedValue(mockNotification);

        // Act
        await service.notifyWithdrawalStatusChange(params);

        // Assert
        expect(repository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 1,
            withdrawalId: 3,
            type: NotificationType.WITHDRAWAL,
            title: 'Saque Aprovado! ✅',
            message: 'Seu saque de R$ 250.00 foi aprovado e será creditado em sua conta em breve.',
          })
        );
      });

      it('should create withdrawal failed notification', async () => {
        // Arrange
        const params = {
          userId: 1,
          withdrawalId: 3,
          status: 'failed' as const,
          amount: 250.00,
          reason: 'Invalid bank account',
        };

        const mockNotification = new Notification();
        repository.create.mockResolvedValue(mockNotification);

        // Act
        await service.notifyWithdrawalStatusChange(params);

        // Assert
        expect(repository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Saque Rejeitado ❌',
            message: 'Seu saque de R$ 250.00 foi rejeitado. Invalid bank account',
          })
        );
      });
    });

    describe('notifyEventMilestone', () => {
      it('should create goal reached notification', async () => {
        // Arrange
        const params = {
          userId: 1,
          eventId: 5,
          milestone: 'goal_reached' as const,
          eventTitle: 'Aniversário da Maria',
        };

        const mockNotification = new Notification();
        repository.create.mockResolvedValue(mockNotification);

        // Act
        await service.notifyEventMilestone(params);

        // Assert
        expect(repository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            type: NotificationType.EVENT,
            title: 'Meta Atingida! 🎯',
            message: 'Parabéns! Seu evento "Aniversário da Maria" atingiu a meta de arrecadação!',
          })
        );
      });
    });

    describe('notifySystem', () => {
      it('should create system notification', async () => {
        // Arrange
        const params = {
          userId: 1,
          title: 'Maintenance Notice',
          message: 'System will be under maintenance',
          priority: 'high' as const,
        };

        const mockNotification = new Notification();
        repository.create.mockResolvedValue(mockNotification);

        // Act
        await service.notifySystem(params);

        // Assert
        expect(repository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            type: NotificationType.SYSTEM,
            title: 'Maintenance Notice',
            message: 'System will be under maintenance',
          })
        );
      });
    });
  });
});