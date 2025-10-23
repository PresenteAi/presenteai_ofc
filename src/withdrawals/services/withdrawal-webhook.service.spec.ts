import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalWebhookService } from '../services/withdrawal-webhook.service';
import { WithdrawalsService } from '../services/withdrawals.service';
import { BadRequestException } from '@nestjs/common';
import { WithdrawalStatus, WithdrawalGateway, Withdrawal } from '../entities/withdrawal.entity';
import { 
  StripeWithdrawalWebhookDto, 
  MercadoPagoWithdrawalWebhookDto, 
  PagarMeWithdrawalWebhookDto 
} from '../dto/withdrawal-webhook.dto';

describe('WithdrawalWebhookService', () => {
  let service: WithdrawalWebhookService;
  let withdrawalsService: jest.Mocked<WithdrawalsService>;

  beforeEach(async () => {
    const mockWithdrawalsService = {
      findByExternalReference: jest.fn(),
      updateWithdrawalStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalWebhookService,
        {
          provide: WithdrawalsService,
          useValue: mockWithdrawalsService,
        },
      ],
    }).compile();

    service = module.get<WithdrawalWebhookService>(WithdrawalWebhookService);
    withdrawalsService = module.get(WithdrawalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleStripeWebhook', () => {
    it('should process successful payout webhook', async () => {
      // Arrange
      const stripePayload: StripeWithdrawalWebhookDto = {
        gateway: WithdrawalGateway.STRIPE,
        externalId: 'po_1234567890',
        status: WithdrawalStatus.COMPLETED,
        type: 'payout.paid',
        data: {
          object: {
            id: 'po_1234567890',
            status: 'paid',
            amount: 50000, // 500.00 in cents
            currency: 'usd',
            arrival_date: 1703516400, // Dec 25, 2023
          },
        },
      };

      const mockWithdrawal = new Withdrawal();
      mockWithdrawal.id = 1;
      mockWithdrawal.userId = 1;
      mockWithdrawal.status = WithdrawalStatus.PROCESSING;

      withdrawalsService.findByExternalReference.mockResolvedValue(mockWithdrawal);
      withdrawalsService.updateWithdrawalStatus.mockResolvedValue(mockWithdrawal);

      // Act
      await service.handleStripeWebhook(stripePayload);

      // Assert
      expect(withdrawalsService.findByExternalReference).toHaveBeenCalledWith(
        'po_1234567890',
        WithdrawalGateway.STRIPE
      );
      expect(withdrawalsService.updateWithdrawalStatus).toHaveBeenCalledWith(1, {
        status: WithdrawalStatus.COMPLETED,
        transactionReference: 'po_1234567890',
        processedAt: '2023-12-25T15:00:00.000Z', // Updated to match actual timezone calculation
        fees: 1250, // 2.5% of 50000 cents
        failureReason: undefined,
        metadata: undefined,
      });
    });

    it('should handle failed payout webhook', async () => {
      // Arrange
      const stripePayload: StripeWithdrawalWebhookDto = {
        gateway: WithdrawalGateway.STRIPE,
        externalId: 'po_1234567890',
        status: WithdrawalStatus.FAILED,
        type: 'payout.failed',
        data: {
          object: {
            id: 'po_1234567890',
            status: 'failed',
            amount: 50000,
            currency: 'usd',
            failure_message: 'Insufficient funds',
          },
        },
      };

      const mockWithdrawal = new Withdrawal();
      mockWithdrawal.id = 1;
      mockWithdrawal.userId = 1;

      withdrawalsService.findByExternalReference.mockResolvedValue(mockWithdrawal);
      withdrawalsService.updateWithdrawalStatus.mockResolvedValue(mockWithdrawal);

      // Act
      await service.handleStripeWebhook(stripePayload);

      // Assert
      expect(withdrawalsService.updateWithdrawalStatus).toHaveBeenCalledWith(1, {
        status: WithdrawalStatus.FAILED,
        transactionReference: 'po_1234567890',
        processedAt: undefined,
        fees: 1250,
        failureReason: 'Insufficient funds',
        metadata: undefined,
      });
    });

    it('should log warning when withdrawal not found', async () => {
      // Arrange
      const stripePayload: StripeWithdrawalWebhookDto = {
        gateway: WithdrawalGateway.STRIPE,
        externalId: 'po_not_found',
        status: WithdrawalStatus.COMPLETED,
        type: 'payout.paid',
        data: {
          object: {
            id: 'po_not_found',
            status: 'paid',
            amount: 50000,
            currency: 'usd',
          },
        },
      };

      withdrawalsService.findByExternalReference.mockResolvedValue(null);

      const loggerSpy = jest.spyOn(service['logger'], 'warn');

      // Act
      await service.handleStripeWebhook(stripePayload);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith('Withdrawal not found for external ID: po_not_found');
      expect(withdrawalsService.updateWithdrawalStatus).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on processing error', async () => {
      // Arrange
      const stripePayload: StripeWithdrawalWebhookDto = {
        gateway: WithdrawalGateway.STRIPE,
        externalId: 'po_1234567890',
        status: WithdrawalStatus.COMPLETED,
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

      withdrawalsService.findByExternalReference.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.handleStripeWebhook(stripePayload)).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleMercadoPagoWebhook', () => {
    it('should process transfer created webhook', async () => {
      // Arrange
      const mpPayload: MercadoPagoWithdrawalWebhookDto = {
        gateway: WithdrawalGateway.MERCADOPAGO,
        externalId: 'transfer_123',
        status: WithdrawalStatus.PROCESSING,
        action: 'transfer.created',
        api_version: 'v1',
        data: {
          id: 'transfer_123',
        },
        date_created: '2023-12-25T10:30:00.000Z',
      };

      const mockWithdrawal = new Withdrawal();
      mockWithdrawal.id = 1;
      mockWithdrawal.userId = 1;

      withdrawalsService.findByExternalReference.mockResolvedValue(mockWithdrawal);
      withdrawalsService.updateWithdrawalStatus.mockResolvedValue(mockWithdrawal);

      // Act
      await service.handleMercadoPagoWebhook(mpPayload);

      // Assert
      expect(withdrawalsService.findByExternalReference).toHaveBeenCalledWith(
        'transfer_123',
        WithdrawalGateway.MERCADOPAGO
      );
      expect(withdrawalsService.updateWithdrawalStatus).toHaveBeenCalledWith(1, {
        status: WithdrawalStatus.PROCESSING,
        transactionReference: 'transfer_123',
        processedAt: '2023-12-25T10:30:00.000Z',
        metadata: { action: 'transfer.created', api_version: 'v1' },
      });
    });

    it('should process transfer paid webhook', async () => {
      // Arrange
      const mpPayload: MercadoPagoWithdrawalWebhookDto = {
        gateway: WithdrawalGateway.MERCADOPAGO,
        externalId: 'transfer_123',
        status: WithdrawalStatus.COMPLETED,
        action: 'transfer.paid',
        api_version: 'v1',
        data: {
          id: 'transfer_123',
        },
      };

      const mockWithdrawal = new Withdrawal();
      mockWithdrawal.id = 1;

      withdrawalsService.findByExternalReference.mockResolvedValue(mockWithdrawal);
      withdrawalsService.updateWithdrawalStatus.mockResolvedValue(mockWithdrawal);

      // Act
      await service.handleMercadoPagoWebhook(mpPayload);

      // Assert
      expect(withdrawalsService.updateWithdrawalStatus).toHaveBeenCalledWith(1, {
        status: WithdrawalStatus.COMPLETED,
        transactionReference: 'transfer_123',
        processedAt: undefined,
        metadata: { action: 'transfer.paid', api_version: 'v1' },
      });
    });
  });

  describe('handlePagarMeWebhook', () => {
    it('should process transfer completed webhook', async () => {
      // Arrange
      const pmPayload: PagarMeWithdrawalWebhookDto = {
        gateway: WithdrawalGateway.PAGARME,
        externalId: 'trf_123456789',
        status: WithdrawalStatus.COMPLETED,
        event: 'transfer_status_changed',
        current_status: {
          id: 'trf_123456789',
          status: 'transferred',
          amount: 50000, // 500.00 in cents
          fee: 1500, // 15.00 in cents
          date_created: '2023-12-25T10:30:00.000Z',
          date_updated: '2023-12-25T11:30:00.000Z',
        },
      };

      const mockWithdrawal = new Withdrawal();
      mockWithdrawal.id = 1;

      withdrawalsService.findByExternalReference.mockResolvedValue(mockWithdrawal);
      withdrawalsService.updateWithdrawalStatus.mockResolvedValue(mockWithdrawal);

      // Act
      await service.handlePagarMeWebhook(pmPayload);

      // Assert
      expect(withdrawalsService.findByExternalReference).toHaveBeenCalledWith(
        'trf_123456789',
        WithdrawalGateway.PAGARME
      );
      expect(withdrawalsService.updateWithdrawalStatus).toHaveBeenCalledWith(1, {
        status: WithdrawalStatus.COMPLETED,
        transactionReference: 'trf_123456789',
        fees: 15.00, // Converted from cents - changed from feeAmount to fees
        processedAt: '2023-12-25T11:30:00.000Z',
        failureReason: undefined,
        metadata: { event: 'transfer_status_changed' },
      });
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify Stripe signature correctly', async () => {
      // Arrange
      const payload = '{"test": "data"}';
      const secret = 'whsec_test_secret';
      const crypto = require('crypto');
      
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');
      
      const signature = `sha256=${expectedSignature}`;

      // Act
      const isValid = await service.verifyWebhookSignature(
        WithdrawalGateway.STRIPE,
        payload,
        signature,
        secret
      );

      // Assert
      expect(isValid).toBe(true);
    });

    it('should reject invalid Stripe signature', async () => {
      // Arrange
      const payload = '{"test": "data"}';
      const secret = 'whsec_test_secret';
      const invalidSignature = 'sha256=invalid_signature';

      // Act
      const isValid = await service.verifyWebhookSignature(
        WithdrawalGateway.STRIPE,
        payload,
        invalidSignature,
        secret
      );

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false for unknown gateway', async () => {
      // Act
      const isValid = await service.verifyWebhookSignature(
        'UNKNOWN_GATEWAY' as WithdrawalGateway,
        'payload',
        'signature',
        'secret'
      );

      // Assert
      expect(isValid).toBe(false);
    });
  });
});