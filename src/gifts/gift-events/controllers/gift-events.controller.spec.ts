import { Test, TestingModule } from '@nestjs/testing';
import { GiftEventsController } from './gift-events.controller';
import { GiftEventsService } from '../services/gift-events.service';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';
import { GiftEventResponseDto, PaginatedGiftEventResponseDto } from '../dto/gift-event-response.dto';
import { GiftEventStatus } from '../../entities/gift-event.entity';

describe('GiftEventsController', () => {
  let controller: GiftEventsController;
  let service: jest.Mocked<GiftEventsService>;

  const mockGiftEventResponse: GiftEventResponseDto = {
    id: 1,
    eventId: 1,
    eventTitle: 'Test Event',
    giftTemplateId: 1,
    giftTemplateChangedId: undefined,
    title: 'Test Gift',
    description: 'Test Description',
    imageUrl: 'http://test.com/image.jpg',
    category: 'Electronics',
    effectiveValue: 100.00,
    customValue: 100.00,
    collectedValue: 50.00,
    remainingValue: 50.00,
    progressPercentage: 50,
    status: 'open',
    canReceiveContributions: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as GiftEventResponseDto;

  const mockPaginatedResponse: PaginatedGiftEventResponseDto = {
    data: [mockGiftEventResponse],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByEventId: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),

      markAsCompleted: jest.fn(),
      reopenGift: jest.fn(),
      getEventStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftEventsController],
      providers: [
        {
          provide: GiftEventsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<GiftEventsController>(GiftEventsController);
    service = module.get<GiftEventsService>(GiftEventsService) as jest.Mocked<GiftEventsService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new gift event', async () => {
      const createDto: CreateGiftEventDto = {
        eventId: 1,
        giftTemplateId: 1,
        customValue: 100.00,
        status: GiftEventStatus.OPEN,
      };

      service.create.mockResolvedValue(mockGiftEventResponse);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockGiftEventResponse);
    });
  });

  describe('findAll', () => {
    it('should return paginated gift events', async () => {
      const filters: GiftEventFiltersDto = {
        page: 1,
        limit: 10,
        eventId: 1,
      };

      service.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findByEventId', () => {
    it('should return gift events for a specific event', async () => {
      service.findByEventId.mockResolvedValue([mockGiftEventResponse]);

      const result = await controller.findByEventId(1);

      expect(service.findByEventId).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockGiftEventResponse]);
    });
  });

  describe('getEventStats', () => {
    it('should return event statistics', async () => {
      const mockStats = {
        totalGifts: 3,
        completedGifts: 1,
        openGifts: 2,
        totalValue: 500.00,
        collectedValue: 250.00,
        averageProgress: 50,
      };

      service.getEventStats.mockResolvedValue(mockStats);

      const result = await controller.getEventStats(1);

      expect(service.getEventStats).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStats);
    });
  });

  describe('findOne', () => {
    it('should return a specific gift event', async () => {
      service.findOne.mockResolvedValue(mockGiftEventResponse);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGiftEventResponse);
    });
  });

  describe('markAsCompleted', () => {
    it('should mark gift event as completed', async () => {
      const completedResponse = { 
        ...mockGiftEventResponse, 
        status: 'completed',
        isCompleted: true,
        canReceiveContributions: false,
      };

      service.markAsCompleted.mockResolvedValue(completedResponse);

      const result = await controller.markAsCompleted(1);

      expect(service.markAsCompleted).toHaveBeenCalledWith(1);
      expect(result).toEqual(completedResponse);
    });
  });

  describe('reopenGift', () => {
    it('should reopen a completed gift event', async () => {
      const reopenedResponse = { 
        ...mockGiftEventResponse, 
        status: 'open',
        isCompleted: false,
        canReceiveContributions: true,
      };

      service.reopenGift.mockResolvedValue(reopenedResponse);

      const result = await controller.reopenGift(1);

      expect(service.reopenGift).toHaveBeenCalledWith(1);
      expect(result).toEqual(reopenedResponse);
    });
  });

  describe('remove', () => {
    it('should remove a gift event', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});