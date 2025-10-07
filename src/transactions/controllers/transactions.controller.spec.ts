import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../controllers/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { Transaction, TransactionStatus, PaymentGateway } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: jest.Mocked<TransactionsService>;

  beforeEach(async () => {
    const mockService = {
      createTransaction: jest.fn(),
      findById: jest.fn(),
      findByContributionId: jest.fn(),
      updateTransactionStatus: jest.fn(),
      syncTransactionStatus: jest.fn(),
      processRefund: jest.fn(),
      handleWebhook: jest.fn(),
      getTransactionStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      // Arrange
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

      const expectedResponse = {
        id: 1,
        contributionId: 123,
        paymentGateway: PaymentGateway.STRIPE,
        externalTransactionId: 'stripe_pi_test123',
        amount: 50.00,
        fee: 2.50,
        netAmount: 47.50,
        status: TransactionStatus.PROCESSING,
        paymentDate: undefined,
        refundDate: undefined,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentUrl: 'https://checkout.stripe.com/pay/cs_test_123',
      };

      service.createTransaction.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.createTransaction(createTransactionDto);

      // Assert
      expect(service.createTransaction).toHaveBeenCalledWith(createTransactionDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getTransaction', () => {
    it('should return a transaction by ID', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.contributionId = 123;
      transaction.paymentGateway = PaymentGateway.STRIPE;
      transaction.amount = 50.00;
      transaction.fee = 2.50;
      transaction.netAmount = 47.50;
      transaction.status = TransactionStatus.PAID;
      transaction.createdAt = new Date();
      transaction.updatedAt = new Date();

      service.findById.mockResolvedValue(transaction);

      // Act
      const result = await controller.getTransaction(1);

      // Assert
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.contributionId).toBe(123);
      expect(result.amount).toBe(50.00);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update transaction status', async () => {
      // Arrange
      const updateDto: UpdateTransactionStatusDto = {
        status: TransactionStatus.PAID,
        paymentDate: '2023-12-25T10:30:00.000Z',
        externalTransactionId: 'stripe_pi_test123',
        metadata: { gateway_fee: 1.50 },
      };

      const transaction = new Transaction();
      transaction.id = 1;
      transaction.status = TransactionStatus.PAID;
      transaction.paymentDate = new Date('2023-12-25T10:30:00.000Z');

      service.updateTransactionStatus.mockResolvedValue(transaction);

      // Act
      const result = await controller.updateTransactionStatus(1, updateDto);

      // Assert
      expect(service.updateTransactionStatus).toHaveBeenCalledWith(1, updateDto);
      expect(result.status).toBe(TransactionStatus.PAID);
    });
  });

  describe('getTransactionsByContribution', () => {
    it('should return transactions for a contribution', async () => {
      // Arrange
      const transactions = [
        {
          id: 1,
          contributionId: 123,
          paymentGateway: PaymentGateway.STRIPE,
          amount: 50.00,
          status: TransactionStatus.PAID,
        },
        {
          id: 2,
          contributionId: 123,
          paymentGateway: PaymentGateway.STRIPE,
          amount: 25.00,
          status: TransactionStatus.FAILED,
        },
      ] as Transaction[];

      service.findByContributionId.mockResolvedValue(transactions);

      // Act
      const result = await controller.getTransactionsByContribution(123);

      // Assert
      expect(service.findByContributionId).toHaveBeenCalledWith(123);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe('syncTransaction', () => {
    it('should sync transaction status', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.status = TransactionStatus.PAID;

      service.syncTransactionStatus.mockResolvedValue(transaction);

      // Act
      const result = await controller.syncTransaction(1);

      // Assert
      expect(service.syncTransactionStatus).toHaveBeenCalledWith(1);
      expect(result.status).toBe(TransactionStatus.PAID);
    });
  });

  describe('processRefund', () => {
    it('should process transaction refund', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.status = TransactionStatus.REFUNDED;
      transaction.refundDate = new Date();

      service.processRefund.mockResolvedValue(transaction);

      // Act
      const result = await controller.processRefund(1, 25.00, 'Customer request');

      // Assert
      expect(service.processRefund).toHaveBeenCalledWith(1, 25.00, 'Customer request');
      expect(result.status).toBe(TransactionStatus.REFUNDED);
    });

    it('should process refund without optional parameters', async () => {
      // Arrange
      const transaction = new Transaction();
      transaction.id = 1;
      transaction.status = TransactionStatus.REFUNDED;

      service.processRefund.mockResolvedValue(transaction);

      // Act
      const result = await controller.processRefund(1);

      // Assert
      expect(service.processRefund).toHaveBeenCalledWith(1, undefined, undefined);
      expect(result.status).toBe(TransactionStatus.REFUNDED);
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook successfully', async () => {
      // Arrange
      const payload = Buffer.from(JSON.stringify({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'stripe_pi_test123' } },
      }));

      const webhookResult = {
        processed: true,
        transactionId: 1,
      };

      service.handleWebhook.mockResolvedValue(webhookResult);

      // Act
      const result = await controller.handleWebhook(
        'stripe',
        'stripe_signature_123',
        payload
      );

      // Assert
      expect(service.handleWebhook).toHaveBeenCalledWith(
        'stripe_signature_123',
        payload.toString(),
        'stripe'
      );
      expect(result.processed).toBe(true);
      expect(result.transactionId).toBe(1);
    });

    it('should handle webhook when not processed', async () => {
      // Arrange
      const payload = Buffer.from('invalid payload');
      const webhookResult = { processed: false };

      service.handleWebhook.mockResolvedValue(webhookResult);

      // Act
      const result = await controller.handleWebhook(
        'stripe',
        'invalid_signature',
        payload
      );

      // Assert
      expect(result.processed).toBe(false);
      expect(result.transactionId).toBeUndefined();
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

      service.getTransactionStats.mockResolvedValue(stats);

      // Act
      const result = await controller.getTransactionStats(123);

      // Assert
      expect(service.getTransactionStats).toHaveBeenCalledWith(123);
      expect(result).toEqual(stats);
    });
  });
});