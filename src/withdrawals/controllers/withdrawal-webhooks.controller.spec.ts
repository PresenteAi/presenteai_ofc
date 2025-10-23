import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalWebhooksController } from '../controllers/withdrawal-webhooks.controller';
import { WithdrawalWebhookService } from '../services/withdrawal-webhook.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { WithdrawalGateway } from '../entities/withdrawal.entity';
import { 
  StripeWithdrawalWebhookDto, 
  MercadoPagoWithdrawalWebhookDto, 
  PagarMeWithdrawalWebhookDto 
} from '../dto/withdrawal-webhook.dto';

describe('WithdrawalWebhooksController', () => {
  let controller: WithdrawalWebhooksController;
  let webhookService: jest.Mocked<WithdrawalWebhookService>;

  beforeEach(async () => {
    const mockWebhookService = {
      handleStripeWebhook: jest.fn(),
      handleMercadoPagoWebhook: jest.fn(),
      handlePagarMeWebhook: jest.fn(),
      verifyWebhookSignature: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawalWebhooksController],
      providers: [
        {
          provide: WithdrawalWebhookService,
          useValue: mockWebhookService,
        },
      ],
    }).compile();

    controller = module.get<WithdrawalWebhooksController>(WithdrawalWebhooksController);
    webhookService = module.get(WithdrawalWebhookService);

    // Mock environment variables
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_stripe';
    process.env.MERCADOPAGO_WEBHOOK_SECRET = 'mp_test_secret';
    process.env.PAGARME_WEBHOOK_SECRET = 'pm_test_secret';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
    delete process.env.PAGARME_WEBHOOK_SECRET;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleStripeWebhook', () => {
    const mockStripePayload: StripeWithdrawalWebhookDto = {
      gateway: WithdrawalGateway.STRIPE,
      externalId: 'po_1234567890',
      status: undefined as any,
      type: 'payout.paid',
      data: {
        object: {
          id: 'po_1234567890',
          status: 'paid',
          amount: 50000,
          currency: 'usd',
        },
      },
    };

    it('should process valid Stripe webhook successfully', async () => {
      // Arrange
      const signature = 'valid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(true);
      webhookService.handleStripeWebhook.mockResolvedValue();

      // Act
      const result = await controller.handleStripeWebhook(mockStripePayload, signature);

      // Assert
      expect(result).toEqual({ success: true });
      expect(webhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        WithdrawalGateway.STRIPE,
        JSON.stringify(mockStripePayload),
        signature,
        'whsec_test_stripe'
      );
      expect(webhookService.handleStripeWebhook).toHaveBeenCalledWith(mockStripePayload);
    });

    it('should throw UnauthorizedException when signature is missing', async () => {
      // Act & Assert
      await expect(controller.handleStripeWebhook(mockStripePayload, '')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException when signature is invalid', async () => {
      // Arrange
      const signature = 'invalid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(false);

      // Act & Assert
      await expect(controller.handleStripeWebhook(mockStripePayload, signature)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should ignore non-payout events', async () => {
      // Arrange
      const nonPayoutPayload = {
        ...mockStripePayload,
        type: 'charge.succeeded',
      };
      const signature = 'valid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(true);

      // Act
      const result = await controller.handleStripeWebhook(nonPayoutPayload, signature);

      // Assert
      expect(result).toEqual({ success: true });
      expect(webhookService.handleStripeWebhook).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on processing error', async () => {
      // Arrange
      const signature = 'valid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(true);
      webhookService.handleStripeWebhook.mockRejectedValue(new Error('Processing failed'));

      // Act & Assert
      await expect(controller.handleStripeWebhook(mockStripePayload, signature)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('handleMercadoPagoWebhook', () => {
    const mockMercadoPagoPayload: MercadoPagoWithdrawalWebhookDto = {
      gateway: WithdrawalGateway.MERCADOPAGO,
      externalId: 'transfer_123',
      status: undefined as any,
      action: 'transfer.created',
      api_version: 'v1',
      data: {
        id: 'transfer_123',
      },
    };

    it('should process valid MercadoPago webhook successfully', async () => {
      // Arrange
      const signature = 'valid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(true);
      webhookService.handleMercadoPagoWebhook.mockResolvedValue();

      // Act
      const result = await controller.handleMercadoPagoWebhook(mockMercadoPagoPayload, signature);

      // Assert
      expect(result).toEqual({ success: true });
      expect(webhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        WithdrawalGateway.MERCADOPAGO,
        JSON.stringify(mockMercadoPagoPayload),
        signature,
        'mp_test_secret'
      );
      expect(webhookService.handleMercadoPagoWebhook).toHaveBeenCalledWith(mockMercadoPagoPayload);
    });

    it('should throw UnauthorizedException when signature is missing', async () => {
      // Act & Assert
      await expect(controller.handleMercadoPagoWebhook(mockMercadoPagoPayload, '')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should ignore non-transfer actions', async () => {
      // Arrange
      const nonTransferPayload = {
        ...mockMercadoPagoPayload,
        action: 'payment.created',
      };
      const signature = 'valid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(true);

      // Act
      const result = await controller.handleMercadoPagoWebhook(nonTransferPayload, signature);

      // Assert
      expect(result).toEqual({ success: true });
      expect(webhookService.handleMercadoPagoWebhook).not.toHaveBeenCalled();
    });
  });

  describe('handlePagarMeWebhook', () => {
    const mockPagarMePayload: PagarMeWithdrawalWebhookDto = {
      gateway: WithdrawalGateway.PAGARME,
      externalId: 'trf_123456789',
      status: undefined as any,
      event: 'transfer_status_changed',
      current_status: {
        id: 'trf_123456789',
        status: 'transferred',
        amount: 50000,
        fee: 1500,
        date_created: '2023-12-25T10:30:00.000Z',
        date_updated: '2023-12-25T11:30:00.000Z',
      },
    };

    it('should process valid Pagar.me webhook successfully', async () => {
      // Arrange
      const signature = 'sha1=valid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(true);
      webhookService.handlePagarMeWebhook.mockResolvedValue();

      // Act
      const result = await controller.handlePagarMeWebhook(mockPagarMePayload, signature);

      // Assert
      expect(result).toEqual({ success: true });
      expect(webhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        WithdrawalGateway.PAGARME,
        JSON.stringify(mockPagarMePayload),
        signature,
        'pm_test_secret'
      );
      expect(webhookService.handlePagarMeWebhook).toHaveBeenCalledWith(mockPagarMePayload);
    });

    it('should throw UnauthorizedException when signature is missing', async () => {
      // Act & Assert
      await expect(controller.handlePagarMeWebhook(mockPagarMePayload, '')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should ignore non-transfer events', async () => {
      // Arrange
      const nonTransferPayload = {
        ...mockPagarMePayload,
        event: 'payment_status_changed',
      };
      const signature = 'valid_signature';
      webhookService.verifyWebhookSignature.mockResolvedValue(true);

      // Act
      const result = await controller.handlePagarMeWebhook(nonTransferPayload, signature);

      // Assert
      expect(result).toEqual({ success: true });
      expect(webhookService.handlePagarMeWebhook).not.toHaveBeenCalled();
    });
  });

  describe('handleTestWebhook', () => {
    it('should handle test webhook successfully', async () => {
      // Arrange
      const testPayload = { test: 'data', message: 'Hello webhook' };

      // Act
      const result = await controller.handleTestWebhook(testPayload);

      // Assert
      expect(result).toEqual({
        success: true,
        received: testPayload,
      });
    });
  });
});