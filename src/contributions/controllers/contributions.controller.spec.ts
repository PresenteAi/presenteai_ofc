import { Test, TestingModule } from '@nestjs/testing';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from '../services/contributions.service';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { UpdateContributionStatusDto, ContributionResponseDto } from '../dto/update-contribution-status.dto';
import { ContributionFiltersDto } from '../dto/contribution-filters.dto';
import { PaymentStatus, PaymentMethod } from '../entities/contribution.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

describe('ContributionsController', () => {
  let controller: ContributionsController;
  let service: jest.Mocked<ContributionsService>;

  const mockContributionResponse: ContributionResponseDto = {
    id: 1,
    eventGiftId: 1,
    userId: 123,
    contributorName: 'João Silva',
    contributorEmail: 'joao@email.com',
    amount: 100.00,
    currency: 'BRL',
    paymentMethod: PaymentMethod.PIX,
    paymentStatus: PaymentStatus.PENDING,
    transactionId: undefined,
    feePlatform: undefined,
    feeGateway: undefined,
    netAmount: 100.00,
    message: 'Parabéns!',
    refundedAt: undefined,
    createdAt: new Date('2024-12-20T10:00:00Z'),
    updatedAt: new Date('2024-12-20T10:00:00Z'),
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByEventGiftId: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
      remove: jest.fn(),
      getGiftEventStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributionsController],
      providers: [
        {
          provide: ContributionsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ContributionsController>(ContributionsController);
    service = module.get(ContributionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a contribution', async () => {
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

      service.create.mockResolvedValue(mockContributionResponse);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockContributionResponse);
    });
  });

  describe('findAll', () => {
    it('should return paginated contributions', async () => {
      const filters: ContributionFiltersDto = {
        eventGiftId: 1,
        page: 1,
        limit: 20,
      };

      const mockResponse = {
        contributions: [mockContributionResponse],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findByEventGiftId', () => {
    it('should return contributions for a gift event', async () => {
      const eventGiftId = 1;
      const mockContributions = [mockContributionResponse];

      service.findByEventGiftId.mockResolvedValue(mockContributions);

      const result = await controller.findByEventGiftId(eventGiftId);

      expect(service.findByEventGiftId).toHaveBeenCalledWith(eventGiftId);
      expect(result).toEqual(mockContributions);
    });
  });

  describe('getGiftEventStats', () => {
    it('should return contribution statistics', async () => {
      const eventGiftId = 1;
      const mockStats = {
        totalContributions: 5,
        totalAmount: 500.00,
        netAmount: 475.00,
        pendingAmount: 100.00,
        approvedAmount: 400.00,
        contributorCount: 4,
      };

      service.getGiftEventStats.mockResolvedValue(mockStats);

      const result = await controller.getGiftEventStats(eventGiftId);

      expect(service.getGiftEventStats).toHaveBeenCalledWith(eventGiftId);
      expect(result).toEqual(mockStats);
    });
  });

  describe('findOne', () => {
    it('should return a contribution by ID', async () => {
      const contributionId = 1;

      service.findOne.mockResolvedValue(mockContributionResponse);

      const result = await controller.findOne(contributionId);

      expect(service.findOne).toHaveBeenCalledWith(contributionId);
      expect(result).toEqual(mockContributionResponse);
    });
  });

  describe('updateStatus', () => {
    it('should update contribution status', async () => {
      const contributionId = 1;
      const updateDto: UpdateContributionStatusDto = {
        paymentStatus: PaymentStatus.APPROVED,
        transactionId: 'txn_123456',
        feePlatform: 5.00,
        feeGateway: 3.00,
      };

      const updatedResponse = {
        ...mockContributionResponse,
        paymentStatus: PaymentStatus.APPROVED,
        transactionId: 'txn_123456',
        feePlatform: 5.00,
        feeGateway: 3.00,
        netAmount: 92.00,
      };

      service.updateStatus.mockResolvedValue(updatedResponse);

      const result = await controller.updateStatus(contributionId, updateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(contributionId, updateDto);
      expect(result).toEqual(updatedResponse);
    });
  });

  describe('remove', () => {
    it('should remove a contribution', async () => {
      const contributionId = 1;

      service.remove.mockResolvedValue();

      await controller.remove(contributionId);

      expect(service.remove).toHaveBeenCalledWith(contributionId);
    });
  });
});