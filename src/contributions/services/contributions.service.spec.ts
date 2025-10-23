import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { Contribution, PaymentStatus, PaymentMethod } from '../entities/contribution.entity';
import { GiftEvent, GiftEventStatus } from '../../gifts/entities/gift-event.entity';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { UpdateContributionStatusDto } from '../dto/update-contribution-status.dto';

describe('ContributionsService', () => {
  let service: ContributionsService;
  let contributionRepository: jest.Mocked<Repository<Contribution>>;
  let giftEventRepository: jest.Mocked<Repository<GiftEvent>>;
  let dataSource: jest.Mocked<DataSource>;

  const mockContribution = {
    id: 1,
    eventGiftId: 1,
    userId: 123,
    contributorName: 'João Silva',
    contributorEmail: 'joao@email.com',
    amount: 100.00,
    currency: 'BRL',
    paymentMethod: PaymentMethod.PIX,
    paymentStatus: PaymentStatus.PENDING,
    transactionId: null,
    feePlatform: null,
    feeGateway: null,
    netAmount: 100.00,
    message: 'Parabéns!',
    refundedAt: null,
    createdAt: new Date('2024-12-20T10:00:00Z'),
    updatedAt: new Date('2024-12-20T10:00:00Z'),
    calculateNetAmount: jest.fn(),
    approve: jest.fn(),
    reject: jest.fn(),
    refund: jest.fn(),
    canBeRefunded: jest.fn(),
    isFinalState: jest.fn(),
    getEffectiveAmount: jest.fn(),
  };

  const mockGiftEvent = {
    id: 1,
    eventId: 1,
    giftTemplateId: 1,
    name: 'Liquidificador',
    description: 'Liquidificador Arno',
    imageUrl: 'http://example.com/image.jpg',
    price: 200.00,
    priority: 1,
    collectedValue: 50.00,
    status: GiftEventStatus.OPEN,
    canReceiveContributions: jest.fn(),
    getEffectiveValue: jest.fn(),
    isCompleted: jest.fn(),
  };

  beforeEach(async () => {
    const mockContributionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockGiftEventRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const mockDataSource = {
      transaction: jest.fn(),
      getRepository: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionsService,
        {
          provide: getRepositoryToken(Contribution),
          useValue: mockContributionRepository,
        },
        {
          provide: getRepositoryToken(GiftEvent),
          useValue: mockGiftEventRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ContributionsService>(ContributionsService);
    contributionRepository = module.get(getRepositoryToken(Contribution));
    giftEventRepository = module.get(getRepositoryToken(GiftEvent));
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateContributionDto = {
      eventGiftId: 1,
      userId: 123,
      contributorName: 'João Silva',
      contributorEmail: 'joao@email.com',
      amount: 100.00,
      currency: 'BRL',
      paymentMethod: PaymentMethod.PIX,
      message: 'Parabéns!',
    };

    it('should create a contribution successfully', async () => {
      const mockGiftEventWithMethods = {
        ...mockGiftEvent,
        canReceiveContributions: jest.fn().mockReturnValue(true),
      };

      giftEventRepository.findOne.mockResolvedValue(mockGiftEventWithMethods as any);
      contributionRepository.create.mockReturnValue(mockContribution as any);
      contributionRepository.save.mockResolvedValue(mockContribution as any);

      const result = await service.create(createDto);

      expect(giftEventRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.eventGiftId },
      });
      expect(contributionRepository.create).toHaveBeenCalledWith({
        ...createDto,
        paymentStatus: PaymentStatus.PENDING,
      });
      expect(contributionRepository.save).toHaveBeenCalledWith(mockContribution);
      expect(result.id).toBe(mockContribution.id);
    });

    it('should throw NotFoundException when gift event not found', async () => {
      giftEventRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      expect(giftEventRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.eventGiftId },
      });
    });

    it('should throw BadRequestException when gift cannot receive contributions', async () => {
      const mockGiftEventWithMethods = {
        ...mockGiftEvent,
        canReceiveContributions: jest.fn().mockReturnValue(false),
      };

      giftEventRepository.findOne.mockResolvedValue(mockGiftEventWithMethods as any);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a contribution when found', async () => {
      contributionRepository.findOne.mockResolvedValue(mockContribution as any);

      const result = await service.findOne(1);

      expect(contributionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['eventGift'],
      });
      expect(result.id).toBe(mockContribution.id);
    });

    it('should throw NotFoundException when contribution not found', async () => {
      contributionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    const updateDto: UpdateContributionStatusDto = {
      paymentStatus: PaymentStatus.APPROVED,
      transactionId: 'txn_123456',
      feePlatform: 5.00,
      feeGateway: 3.00,
    };

    it('should approve contribution and update gift collected value', async () => {
      const mockTransactionManager = {
        getRepository: jest.fn(),
      };

      const mockContributionRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
      };

      const mockGiftEventRepo = {
        update: jest.fn(),
      };

      const contributionWithMethods = {
        ...mockContribution,
        paymentStatus: PaymentStatus.PENDING,
        isFinalState: jest.fn().mockReturnValue(false),
        getEffectiveAmount: jest.fn()
          .mockReturnValueOnce(0) // Before approval
          .mockReturnValueOnce(92), // After approval (100 - 5 - 3)
        approve: jest.fn(),
        eventGift: {
          ...mockGiftEvent,
          collectedValue: 50.00,
          getEffectiveValue: jest.fn().mockReturnValue(200.00),
          isCompleted: jest.fn().mockReturnValue(false),
        },
      };

      mockTransactionManager.getRepository
        .mockReturnValueOnce(mockContributionRepo)
        .mockReturnValueOnce(mockGiftEventRepo);

      mockContributionRepo.findOne.mockResolvedValue(contributionWithMethods as any);
      mockContributionRepo.save.mockResolvedValue({
        ...contributionWithMethods,
        paymentStatus: PaymentStatus.APPROVED,
        transactionId: 'txn_123456',
      } as any);

      dataSource.transaction.mockImplementation((callback: any) => {
        return callback(mockTransactionManager);
      });

      const result = await service.updateStatus(1, updateDto);

      expect(mockContributionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['eventGift'],
      });
      expect(contributionWithMethods.approve).toHaveBeenCalledWith(
        'txn_123456',
        5.00,
        3.00,
      );
      expect(mockContributionRepo.save).toHaveBeenCalled();
      expect(mockGiftEventRepo.update).toHaveBeenCalledWith(1, {
        collectedValue: 142.00, // 50 + 92
      });
    });

    it('should throw BadRequestException when trying to approve without transaction ID', async () => {
      const updateDtoWithoutTxnId = {
        ...updateDto,
        transactionId: undefined,
      };

      const mockTransactionManager = {
        getRepository: jest.fn(),
      };

      const mockContributionRepo = {
        findOne: jest.fn(),
      };

      const contributionWithMethods = {
        ...mockContribution,
        paymentStatus: PaymentStatus.PENDING,
        isFinalState: jest.fn().mockReturnValue(false),
      };

      mockTransactionManager.getRepository.mockReturnValue(mockContributionRepo);
      mockContributionRepo.findOne.mockResolvedValue(contributionWithMethods as any);

      dataSource.transaction.mockImplementation((callback: any) => {
        return callback(mockTransactionManager);
      });

      await expect(service.updateStatus(1, updateDtoWithoutTxnId)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when contribution not found', async () => {
      const mockTransactionManager = {
        getRepository: jest.fn(),
      };

      const mockContributionRepo = {
        findOne: jest.fn(),
      };

      mockTransactionManager.getRepository.mockReturnValue(mockContributionRepo);
      mockContributionRepo.findOne.mockResolvedValue(null);

      dataSource.transaction.mockImplementation((callback: any) => {
        return callback(mockTransactionManager);
      });

      await expect(service.updateStatus(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete pending contribution', async () => {
      const pendingContribution = {
        ...mockContribution,
        paymentStatus: PaymentStatus.PENDING,
      };

      contributionRepository.findOne.mockResolvedValue(pendingContribution as any);
      contributionRepository.softDelete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);

      expect(contributionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(contributionRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when contribution not found', async () => {
      contributionRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when trying to delete non-pending contribution', async () => {
      const approvedContribution = {
        ...mockContribution,
        paymentStatus: PaymentStatus.APPROVED,
      };

      contributionRepository.findOne.mockResolvedValue(approvedContribution as any);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getGiftEventStats', () => {
    it('should return contribution statistics', async () => {
      const mockStats = {
        totalContributions: '5',
        totalAmount: '500.00',
        netAmount: '475.00',
        pendingAmount: '100.00',
        approvedAmount: '400.00',
        contributorCount: '4',
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockStats),
      };

      contributionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getGiftEventStats(1);

      expect(result).toEqual({
        totalContributions: 5,
        totalAmount: 500.00,
        netAmount: 475.00,
        pendingAmount: 100.00,
        approvedAmount: 400.00,
        contributorCount: 4,
      });
    });
  });
});