import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalsService } from '../services/withdrawals.service';
import { WithdrawalRepository } from '../repositories/withdrawal.repository';
import { TransactionRepository } from '../../transactions/repositories/transaction.repository';
import { Withdrawal, WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';
import { UpdateWithdrawalStatusDto } from '../dto/update-withdrawal-status.dto';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('WithdrawalsService', () => {
  let service: WithdrawalsService;
  let withdrawalRepository: jest.Mocked<WithdrawalRepository>;
  let transactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(async () => {
    const mockWithdrawalRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      findByUserId: jest.fn(),
      getPendingWithdrawalsAmount: jest.fn(),
      getUserWithdrawalStats: jest.fn(),
      findOverdueWithdrawals: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockTransactionRepository = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalsService,
        {
          provide: WithdrawalRepository,
          useValue: mockWithdrawalRepository,
        },
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<WithdrawalsService>(WithdrawalsService);
    withdrawalRepository = module.get(WithdrawalRepository);
    transactionRepository = module.get(TransactionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWithdrawal', () => {
    const userId = 1;
    const createWithdrawalDto: CreateWithdrawalDto = {
      totalAmount: 500.00,
      paymentGateway: WithdrawalGateway.STRIPE,
      bankAccount: {
        bankCode: '001',
        bankName: 'Banco do Brasil',
        accountType: 'checking',
        accountNumber: '12345-6',
        agency: '1234',
        accountHolderName: 'João Silva',
        accountHolderDocument: '12345678901',
      },
    };

    it('should create a withdrawal successfully', async () => {
      // Arrange
      const mockBalance = {
        availableBalance: 1000.00,
        pendingWithdrawals: 0,
        totalBalance: 1000.00,
        minimumWithdrawal: 10.00,
        maximumWithdrawal: 5000.00,
        currency: 'BRL',
      };

      jest.spyOn(service, 'getUserBalance').mockResolvedValue(mockBalance);

      const savedWithdrawal = new Withdrawal();
      savedWithdrawal.id = 1;
      savedWithdrawal.userId = userId;
      savedWithdrawal.totalAmount = 500.00;
      savedWithdrawal.feeAmount = 15.00;
      savedWithdrawal.netAmount = 485.00;
      savedWithdrawal.status = WithdrawalStatus.PENDING;
      savedWithdrawal.requestedAt = new Date();
      savedWithdrawal.createdAt = new Date();
      savedWithdrawal.updatedAt = new Date();

      withdrawalRepository.save.mockResolvedValue(savedWithdrawal);

      // Act
      const result = await service.createWithdrawal(userId, createWithdrawalDto);

      // Assert
      expect(result.id).toBe(1);
      expect(result.userId).toBe(userId);
      expect(result.totalAmount).toBe(500.00);
      expect(result.status).toBe(WithdrawalStatus.PENDING);
      expect(withdrawalRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for insufficient balance', async () => {
      // Arrange
      const mockBalance = {
        availableBalance: 100.00,
        pendingWithdrawals: 0,
        totalBalance: 100.00,
        minimumWithdrawal: 10.00,
        maximumWithdrawal: 5000.00,
        currency: 'BRL',
      };

      jest.spyOn(service, 'getUserBalance').mockResolvedValue(mockBalance);

      // Act & Assert
      await expect(service.createWithdrawal(userId, createWithdrawalDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for amount below minimum', async () => {
      // Arrange
      const lowAmountDto = { 
        ...createWithdrawalDto, 
        totalAmount: 5.00 
      };

      const mockBalance = {
        availableBalance: 1000.00,
        pendingWithdrawals: 0,
        totalBalance: 1000.00,
        minimumWithdrawal: 10.00,
        maximumWithdrawal: 5000.00,
        currency: 'BRL',
      };

      jest.spyOn(service, 'getUserBalance').mockResolvedValue(mockBalance);

      // Act & Assert
      await expect(service.createWithdrawal(userId, lowAmountDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return withdrawal when found and user authorized', async () => {
      // Arrange
      const withdrawalId = 1;
      const userId = 1;
      const withdrawal = new Withdrawal();
      withdrawal.id = withdrawalId;
      withdrawal.userId = userId;

      withdrawalRepository.findOne.mockResolvedValue(withdrawal);

      // Act
      const result = await service.findById(withdrawalId, userId);

      // Assert
      expect(result).toBe(withdrawal);
      expect(withdrawalRepository.findOne).toHaveBeenCalledWith({
        where: { id: withdrawalId },
      });
    });

    it('should throw NotFoundException when withdrawal not found', async () => {
      // Arrange
      const withdrawalId = 999;
      withdrawalRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(withdrawalId))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user not authorized', async () => {
      // Arrange
      const withdrawalId = 1;
      const userId = 1;
      const unauthorizedUserId = 2;
      
      const withdrawal = new Withdrawal();
      withdrawal.id = withdrawalId;
      withdrawal.userId = userId;

      withdrawalRepository.findOne.mockResolvedValue(withdrawal);

      // Act & Assert
      await expect(service.findById(withdrawalId, unauthorizedUserId))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateWithdrawalStatus', () => {
    it('should update status to completed successfully', async () => {
      // Arrange
      const withdrawalId = 1;
      const withdrawal = new Withdrawal();
      withdrawal.id = withdrawalId;
      withdrawal.status = WithdrawalStatus.PROCESSING;

      const updateDto: UpdateWithdrawalStatusDto = {
        status: WithdrawalStatus.COMPLETED,
        transactionReference: 'stripe_payout_123',
        processedAt: '2023-12-25T10:30:00.000Z',
        fees: 15.00,
      };

      withdrawalRepository.findOne.mockResolvedValue(withdrawal);
      withdrawalRepository.save.mockResolvedValue(withdrawal);

      // Act
      const result = await service.updateWithdrawalStatus(withdrawalId, updateDto);

      // Assert
      expect(result.status).toBe(WithdrawalStatus.COMPLETED);
      expect(withdrawalRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent withdrawal', async () => {
      // Arrange
      const withdrawalId = 999;
      const updateDto: UpdateWithdrawalStatusDto = {
        status: WithdrawalStatus.COMPLETED,
      };

      withdrawalRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateWithdrawalStatus(withdrawalId, updateDto))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      // Arrange
      const withdrawalId = 1;
      const withdrawal = new Withdrawal();
      withdrawal.id = withdrawalId;
      withdrawal.status = WithdrawalStatus.COMPLETED; // Final state

      const updateDto: UpdateWithdrawalStatusDto = {
        status: WithdrawalStatus.PROCESSING,
      };

      withdrawalRepository.findOne.mockResolvedValue(withdrawal);

      // Act & Assert
      await expect(service.updateWithdrawalStatus(withdrawalId, updateDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelWithdrawal', () => {
    it('should cancel pending withdrawal successfully', async () => {
      // Arrange
      const withdrawalId = 1;
      const userId = 1;
      const withdrawal = new Withdrawal();
      withdrawal.id = withdrawalId;
      withdrawal.userId = userId;
      withdrawal.status = WithdrawalStatus.PENDING;

      jest.spyOn(service, 'findById').mockResolvedValue(withdrawal);
      withdrawalRepository.save.mockResolvedValue(withdrawal);

      // Act
      const result = await service.cancelWithdrawal(withdrawalId, userId);

      // Assert
      expect(result.status).toBe(WithdrawalStatus.FAILED);
      expect(withdrawalRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for non-cancellable withdrawal', async () => {
      // Arrange
      const withdrawalId = 1;
      const userId = 1;
      const withdrawal = new Withdrawal();
      withdrawal.id = withdrawalId;
      withdrawal.userId = userId;
      withdrawal.status = WithdrawalStatus.COMPLETED; // Cannot be cancelled

      jest.spyOn(service, 'findById').mockResolvedValue(withdrawal);

      // Act & Assert
      await expect(service.cancelWithdrawal(withdrawalId, userId))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserBalance', () => {
    it('should calculate user balance correctly', async () => {
      // Arrange
      const userId = 1;

      // Mock transaction repository query
      const mockTransactionQuery = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          totalEarned: '1000.00'
        }),
      } as any;

      transactionRepository.createQueryBuilder.mockReturnValue(mockTransactionQuery);

      // Mock withdrawal repository queries
      withdrawalRepository.getPendingWithdrawalsAmount.mockResolvedValue(100.00);
      
      const mockWithdrawalQuery = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          sum: '200.00'
        }),
      } as any;

      withdrawalRepository.createQueryBuilder.mockReturnValue(mockWithdrawalQuery);

      // Act
      const result = await service.getUserBalance(userId);

      // Assert
      expect(result.availableBalance).toBe(700.00); // 1000 - 200 - 100
      expect(result.pendingWithdrawals).toBe(100.00);
      expect(result.currency).toBe('BRL');
    });
  });

  describe('validateBankAccount', () => {
    it('should validate correct bank account', async () => {
      // Arrange
      const bankAccount = {
        bankCode: '001',
        bankName: 'Banco do Brasil',
        accountType: 'checking' as const,
        accountNumber: '12345-6',
        agency: '1234',
        accountHolderName: 'João Silva',
        accountHolderDocument: '12345678901',
      };

      // Act
      const result = await service.validateBankAccount(bankAccount);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid bank account', async () => {
      // Arrange
      const bankAccount = {
        bankCode: '1', // Invalid format
        bankName: 'Banco do Brasil',
        accountType: 'checking' as const,
        accountNumber: '12', // Too short
        agency: '12', // Too short
        accountHolderName: 'João Silva',
        accountHolderDocument: '123', // Invalid document
      };

      // Act
      const result = await service.validateBankAccount(bankAccount);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors).toContain('Invalid bank code format');
      expect(result.errors).toContain('Invalid account number');
      expect(result.errors).toContain('Invalid agency number');
      expect(result.errors).toContain('Invalid document format (must be CPF or CNPJ)');
    });
  });

  describe('findOverdueWithdrawals', () => {
    it('should return overdue withdrawals', async () => {
      // Arrange
      const hours = 48;
      const overdueWithdrawals = [
        { id: 1, status: WithdrawalStatus.PENDING },
        { id: 2, status: WithdrawalStatus.PENDING },
      ] as Withdrawal[];

      withdrawalRepository.findOverdueWithdrawals.mockResolvedValue(overdueWithdrawals);

      // Act
      const result = await service.findOverdueWithdrawals(hours);

      // Assert
      expect(result).toBe(overdueWithdrawals);
      expect(withdrawalRepository.findOverdueWithdrawals).toHaveBeenCalledWith(hours);
    });
  });
});