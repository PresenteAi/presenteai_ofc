import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { TransactionRepository } from '../repositories/transaction.repository';
import { PaymentGatewayFactory } from '../providers/payment-gateway.factory';
import { Transaction, TransactionStatus, PaymentGateway } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';
import { PaymentGatewayInterface } from '../interfaces/payment-gateway.interface';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: jest.Mocked<TransactionRepository>;
  let gatewayFactory: jest.Mocked<PaymentGatewayFactory>;
  let mockGatewayService: jest.Mocked<PaymentGatewayInterface>;

  beforeEach(async () => {
    // Mock gateway service
    mockGatewayService = {
      createTransaction: jest.fn(),
      checkTransactionStatus: jest.fn(),
      processRefund: jest.fn(),
      validateWebhook: jest.fn(),
      parseWebhookData: jest.fn(),
    };

    // Mock repository
    const mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      findByContributionId: jest.fn(),
      findByExternalTransactionId: jest.fn(),
      getTransactionStats: jest.fn(),
    };

    // Mock gateway factory
    const mockGatewayFactory = {
      getGatewayService: jest.fn().mockReturnValue(mockGatewayService),
      isGatewaySupported: jest.fn(),
      getSupportedGateways: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useValue: mockRepository,
        },
        {
          provide: PaymentGatewayFactory,
          useValue: mockGatewayFactory,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get(TransactionRepository);
    gatewayFactory = module.get(PaymentGatewayFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    const createTransactionDto: CreateTransactionDto = {
      contributionId: 123,
      paymentGateway: PaymentGateway.STRIPE,
      amount: 50.00,
      fee: 2.50,
      paymentMethodData: {
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
      },
      customer: {
        name: 'João Silva',
        email: 'joao@example.com',
      },
    };

    it('should create a transaction successfully', async () => {
      // Arrange
      gatewayFactory.isGatewaySupported.mockReturnValue(true);
      
      const savedTransaction = new Transaction();
      savedTransaction.id = 1;
      savedTransaction.contributionId = createTransactionDto.contributionId;
      savedTransaction.paymentGateway = createTransactionDto.paymentGateway;
      savedTransaction.amount = createTransactionDto.amount;
      savedTransaction.fee = createTransactionDto.fee || 0;
      savedTransaction.netAmount = 47.50;
      savedTransaction.status = TransactionStatus.INITIATED;
      savedTransaction.createdAt = new Date();
      savedTransaction.updatedAt = new Date();

      const updatedTransaction = new Transaction();
      Object.assign(updatedTransaction, savedTransaction);
      updatedTransaction.status = TransactionStatus.PROCESSING;
      updatedTransaction.externalTransactionId = 'stripe_pi_test123';

      repository.save.mockResolvedValueOnce(savedTransaction);
      repository.save.mockResolvedValueOnce(updatedTransaction);

      mockGatewayService.createTransaction.mockResolvedValue({
        id: 'stripe_pi_test123',
        status: 'requires_confirmation',
        paymentUrl: 'https://checkout.stripe.com/pay/cs_test_123',
        data: { client_secret: 'pi_test_secret' },
      });

      // Act
      const result = await service.createTransaction(createTransactionDto);

      // Assert
      expect(gatewayFactory.isGatewaySupported).toHaveBeenCalledWith(PaymentGateway.STRIPE);
      expect(repository.save).toHaveBeenCalledTimes(2);
      expect(mockGatewayService.createTransaction).toHaveBeenCalledWith({
        amount: 50.00,
        paymentMethodData: createTransactionDto.paymentMethodData,
        customer: createTransactionDto.customer,
        metadata: {
          internal_transaction_id: 1,
        },
      });
      expect(result.id).toBe(1);
      expect(result.status).toBe(TransactionStatus.PROCESSING);
      expect(result.externalTransactionId).toBe('stripe_pi_test123');
      expect(result.paymentUrl).toBe('https://checkout.stripe.com/pay/cs_test_123');
    });

    it('should throw BadRequestException for unsupported gateway', async () => {
      // Arrange
      gatewayFactory.isGatewaySupported.mockReturnValue(false);

      // Act & Assert
      await expect(service.createTransaction(createTransactionDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should handle gateway errors gracefully', async () => {
      // Arrange
      gatewayFactory.isGatewaySupported.mockReturnValue(true);
      
      const savedTransaction = new Transaction();
      savedTransaction.id = 1;
      savedTransaction.status = TransactionStatus.INITIATED;
      
      const failedTransaction = new Transaction();
      Object.assign(failedTransaction, savedTransaction);
      failedTransaction.status = TransactionStatus.FAILED;

      repository.save.mockResolvedValueOnce(savedTransaction);
      repository.save.mockResolvedValueOnce(failedTransaction);

      mockGatewayService.createTransaction.mockRejectedValue(
        new Error('Card declined')
      );

      // Act & Assert
      await expect(service.createTransaction(createTransactionDto))
        .rejects
        .toThrow(BadRequestException);
      
      expect(repository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('findById', () => {
    it('should return transaction when found', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.contributionId = 123;
      
      repository.findOne.mockResolvedValue(transaction);

      // Act
      const result = await service.findById(1);

      // Assert
      expect(result).toBe(transaction);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['contribution'],
      });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(999))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('updateTransactionStatus', () => {
    const updateDto: UpdateTransactionStatusDto = {
      status: TransactionStatus.PAID,
      paymentDate: '2023-12-25T10:30:00.000Z',
      externalTransactionId: 'stripe_pi_test123',
      metadata: { gateway_fee: 1.50 },
    };

    it('should update transaction status to PAID successfully', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.status = TransactionStatus.PROCESSING;
      transaction.markAsPaid = jest.fn();

      const updatedTransaction = new Transaction();
      Object.assign(updatedTransaction, transaction);
      updatedTransaction.status = TransactionStatus.PAID;

      repository.findOne.mockResolvedValue(transaction);
      repository.save.mockResolvedValue(updatedTransaction);

      // Act
      const result = await service.updateTransactionStatus(1, updateDto);

      // Assert
      expect(transaction.markAsPaid).toHaveBeenCalledWith(
        new Date('2023-12-25T10:30:00.000Z'),
        'stripe_pi_test123',
        { gateway_fee: 1.50 }
      );
      expect(repository.save).toHaveBeenCalledWith(transaction);
      expect(result).toBe(updatedTransaction);
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.status = TransactionStatus.PAID;
      transaction.isFinalState = jest.fn().mockReturnValue(true);

      repository.findOne.mockResolvedValue(transaction);

      const invalidUpdateDto = { ...updateDto, status: TransactionStatus.FAILED };

      // Act & Assert
      await expect(service.updateTransactionStatus(1, invalidUpdateDto))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('syncTransactionStatus', () => {
    it('should sync transaction status with gateway', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.externalTransactionId = 'stripe_pi_test123';
      transaction.paymentGateway = PaymentGateway.STRIPE;
      transaction.status = TransactionStatus.PROCESSING;

      repository.findOne.mockResolvedValue(transaction);
      mockGatewayService.checkTransactionStatus.mockResolvedValue({
        status: TransactionStatus.PAID,
        paymentDate: new Date(),
        metadata: { stripe_status: 'succeeded' },
      });

      const spyUpdateStatus = jest.spyOn(service, 'updateTransactionStatus');
      spyUpdateStatus.mockResolvedValue(transaction);

      // Act
      const result = await service.syncTransactionStatus(1);

      // Assert
      expect(mockGatewayService.checkTransactionStatus)
        .toHaveBeenCalledWith('stripe_pi_test123');
      expect(spyUpdateStatus).toHaveBeenCalled();
    });

    it('should throw BadRequestException when no external transaction ID', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.externalTransactionId = undefined;

      repository.findOne.mockResolvedValue(transaction);

      // Act & Assert
      await expect(service.syncTransactionStatus(1))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('processRefund', () => {
    it('should process refund successfully', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.externalTransactionId = 'stripe_pi_test123';
      transaction.paymentGateway = PaymentGateway.STRIPE;
      transaction.canBeRefunded = jest.fn().mockReturnValue(true);

      repository.findOne.mockResolvedValue(transaction);
      mockGatewayService.processRefund.mockResolvedValue({
        refundId: 'stripe_re_test123',
        status: 'succeeded',
        processedAt: new Date(),
        metadata: { refund_status: 'succeeded' },
      });

      const spyUpdateStatus = jest.spyOn(service, 'updateTransactionStatus');
      spyUpdateStatus.mockResolvedValue(transaction);

      // Act
      const result = await service.processRefund(1, 25.00, 'Customer request');

      // Assert
      expect(mockGatewayService.processRefund)
        .toHaveBeenCalledWith('stripe_pi_test123', 25.00, 'Customer request');
      expect(spyUpdateStatus).toHaveBeenCalled();
    });

    it('should throw BadRequestException when transaction cannot be refunded', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.canBeRefunded = jest.fn().mockReturnValue(false);

      repository.findOne.mockResolvedValue(transaction);

      // Act & Assert
      await expect(service.processRefund(1))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('handleWebhook', () => {
    const webhookPayload = JSON.stringify({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'stripe_pi_test123',
          created: 1703505000,
        },
      },
    });

    it('should process webhook successfully', async () => {
      // Arrange
      mockGatewayService.validateWebhook.mockReturnValue(true);
      mockGatewayService.parseWebhookData.mockReturnValue({
        externalTransactionId: 'stripe_pi_test123',
        status: TransactionStatus.PAID,
        paymentDate: new Date(),
        metadata: { stripe_event_id: 'evt_test123' },
      });

      const transaction = new Transaction();
      transaction.id = 1;
      transaction.status = TransactionStatus.PROCESSING;

      repository.findByExternalTransactionId.mockResolvedValue(transaction);

      const spyUpdateStatus = jest.spyOn(service, 'updateTransactionStatus');
      spyUpdateStatus.mockResolvedValue(transaction);

      // Act
      const result = await service.handleWebhook('signature', webhookPayload, 'stripe');

      // Assert
      expect(result.processed).toBe(true);
      expect(result.transactionId).toBe(1);
      expect(spyUpdateStatus).toHaveBeenCalled();
    });

    it('should return false for invalid webhook signature', async () => {
      // Arrange
      mockGatewayService.validateWebhook.mockReturnValue(false);

      // Act
      const result = await service.handleWebhook('invalid', webhookPayload, 'stripe');

      // Assert
      expect(result.processed).toBe(false);
    });

    it('should return false when transaction not found', async () => {
      // Arrange
      mockGatewayService.validateWebhook.mockReturnValue(true);
      mockGatewayService.parseWebhookData.mockReturnValue({
        externalTransactionId: 'unknown_transaction',
        status: TransactionStatus.PAID,
      });

      repository.findByExternalTransactionId.mockResolvedValue(null);

      // Act
      const result = await service.handleWebhook('signature', webhookPayload, 'stripe');

      // Assert
      expect(result.processed).toBe(false);
    });
  });

  describe('getTransactionStats', () => {
    it('should return transaction statistics', async () => {
      // Arrange
      const stats = {
        total: 5,
        paid: 3,
        failed: 1,
        totalAmount: 150.00,
        paidAmount: 142.50,
      };

      repository.getTransactionStats.mockResolvedValue(stats);

      // Act
      const result = await service.getTransactionStats(123);

      // Assert
      expect(result).toBe(stats);
      expect(repository.getTransactionStats).toHaveBeenCalledWith(123);
    });
  });
});