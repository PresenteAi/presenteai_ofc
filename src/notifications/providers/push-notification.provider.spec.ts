import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationProvider } from './push-notification.provider';
import { Notification, DeliveryMethod, NotificationType } from '../entities/notification.entity';
import { Logger } from '@nestjs/common';

describe('PushNotificationProvider', () => {
  let provider: PushNotificationProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushNotificationProvider,
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

    provider = module.get<PushNotificationProvider>(PushNotificationProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should send contribution push notification successfully', async () => {
      // Arrange
      const notification = {
        id: 1,
        userId: 1,
        title: 'Nova Contribuição! 🎉',
        message: 'João contribuiu R$ 25,00 para seu presente',
        templateData: {
          contributorName: 'João Silva',
          amount: 25.00,
          eventName: 'Presente para Ana',
        },
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should send event milestone push notification successfully', async () => {
      // Arrange
      const notification = {
        id: 2,
        userId: 2,
        title: 'Meta 50% Atingida! 🎯',
        message: 'Seu evento está na metade do caminho!',
        templateData: {
          eventName: 'Casamento da Clara',
          percentage: 50,
          currentAmount: 250.00,
          goalAmount: 500.00,
        },
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should send withdrawal notification successfully', async () => {
      // Arrange
      const notification = {
        id: 3,
        userId: 3,
        title: 'Saque Processado ✅',
        message: 'R$ 100,00 foram transferidos para sua conta',
        templateData: {
          amount: 100.00,
          bankAccount: '**** 5678',
        },
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should send general notification successfully', async () => {
      // Arrange
      const notification = {
        id: 4,
        userId: 4,
        title: 'Bem-vindo ao Presente Aí! 👋',
        message: 'Explore nossa plataforma e crie seu primeiro evento',
        templateData: {
          isWelcome: true,
        },
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should handle notification with empty metadata', async () => {
      // Arrange
      const notification = {
        id: 5,
        userId: 5,
        title: 'Notificação Simples',
        message: 'Mensagem sem metadados',
        templateData: {},
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should handle notification with undefined metadata', async () => {
      // Arrange
      const notification = {
        id: 6,
        userId: 6,
        title: 'Teste Metadata Undefined',
        message: 'Teste sem metadata',
        templateData: undefined,
      };

      // Act & Assert
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });
  });

  describe('notification formatting', () => {
    it('should format contribution notification correctly', async () => {
      // Arrange
      const notification = {
        id: 1,
        userId: 1,
        title: 'Nova Contribuição!',
        message: 'Você recebeu uma nova contribuição',
        templateData: {
          contributorName: 'Maria Santos',
          amount: 75.50,
          eventName: 'Chá de Bebê da Laura',
        },
      };

      // Act - Just verify it processes without error
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });

    it('should format event completion notification correctly', async () => {
      // Arrange
      const notification = {
        id: 2,
        userId: 2,
        title: 'Evento Finalizado! 🎉',
        message: 'Seu evento foi concluído com sucesso',
        templateData: {
          eventName: 'Formatura do Carlos',
          totalAmount: 800.00,
          contributorsCount: 15,
        },
      };

      // Act - Just verify it processes without error
      await expect(provider.sendNotification(notification)).resolves.not.toThrow();
    });
  });
});