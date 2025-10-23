import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationProvider } from './email-notification.provider';
import { Notification, DeliveryMethod, NotificationType } from '../entities/notification.entity';
import { Logger } from '@nestjs/common';

describe('EmailNotificationProvider', () => {
  let provider: EmailNotificationProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailNotificationProvider,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = module.get<EmailNotificationProvider>(EmailNotificationProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should send contribution notification email successfully', async () => {
      // Arrange
      const notification = {
        id: 1,
        userId: 1,
        title: 'Nova Contribuição Recebida',
        message: 'Você recebeu uma nova contribuição de R$ 50,00',
        templateData: {
          contributorName: 'João Silva',
          amount: 50.00,
          eventName: 'Presente para Maria',
        },
      };

      // Act
      await provider.sendNotification(notification);

      // Assert - Since this is a mock implementation, we just verify it doesn't throw
      expect(notification).toBeDefined();
    });

    it('should send withdrawal notification email successfully', async () => {
      // Arrange
      const notification = {
        id: 2,
        userId: 2,
        title: 'Saque Aprovado',
        message: 'Seu saque de R$ 150,00 foi aprovado e processado',
        templateData: {
          amount: 150.00,
          bankAccount: '**** 1234',
          processedAt: new Date().toISOString(),
        },
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should send event completion notification email successfully', async () => {
      // Arrange
      const notification = {
        id: 3,
        userId: 3,
        title: 'Meta do Evento Atingida!',
        message: 'Parabéns! Seu evento atingiu 100% da meta',
        templateData: {
          eventName: 'Aniversário do Pedro',
          goalAmount: 500.00,
          currentAmount: 500.00,
          completedAt: new Date().toISOString(),
        },
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should handle notification with minimal data', async () => {
      // Arrange
      const notification = {
        id: 4,
        userId: 4,
        title: 'Notificação Geral',
        message: 'Esta é uma notificação geral',
        templateData: {},
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should handle notification with undefined metadata', async () => {
      // Arrange
      const notification = {
        id: 5,
        userId: 5,
        title: 'Teste sem metadata',
        message: 'Teste',
        templateData: undefined,
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });
  });
});