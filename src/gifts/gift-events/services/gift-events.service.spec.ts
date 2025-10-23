import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { GiftEventsService } from '../services/gift-events.service';
import { GiftEventsRepository } from '../repositories/gift-events.repository';
import { GiftEvent, GiftEventStatus } from '../../entities/gift-event.entity';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';
import { GiftEventResponseDto } from '../dto/gift-event-response.dto';

describe('GiftEventsService', () => {
  let service: GiftEventsService;
  let repository: jest.Mocked<GiftEventsRepository>;

  const mockGiftEvent: Partial<GiftEvent> = {
    id: 1,
    eventId: 1,
    giftTemplateId: 1,
    giftTemplateChangedId: undefined,
    customValue: 100.00,
    collectedValue: 50.00,
    status: GiftEventStatus.OPEN,
    createdAt: new Date(),
    updatedAt: new Date(),
    event: { id: 1, title: 'Test Event' } as any,
    getEffectiveValue: jest.fn().mockReturnValue(100.00),
    getEffectiveTitle: jest.fn().mockReturnValue('Test Gift'),
    getEffectiveDescription: jest.fn().mockReturnValue('Test Description'),
    getEffectiveImageUrl: jest.fn().mockReturnValue('http://test.com/image.jpg'),
    getEffectiveCategory: jest.fn().mockReturnValue('Electronics'),
    isCompleted: jest.fn().mockReturnValue(false),
    canReceiveContributions: jest.fn().mockReturnValue(true),
    getProgressPercentage: jest.fn().mockReturnValue(50),
    getRemainingValue: jest.fn().mockReturnValue(50.00),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByEventId: jest.fn(),
      findOne: jest.fn(),
      findOneByEventAndTemplate: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),

      getStatsByEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftEventsService,
        {
          provide: GiftEventsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GiftEventsService>(GiftEventsService);
    repository = module.get<GiftEventsRepository>(GiftEventsRepository) as jest.Mocked<GiftEventsRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateGiftEventDto = {
      eventId: 1,
      giftTemplateId: 1,
      customValue: 100.00,
      status: GiftEventStatus.OPEN,
    };

    it('should create a gift event successfully', async () => {
      repository.findOneByEventAndTemplate.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockGiftEvent as GiftEvent);

      const result = await service.create(createDto);

      expect(repository.findOneByEventAndTemplate).toHaveBeenCalledWith(1, 1, undefined);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toBeInstanceOf(GiftEventResponseDto);
    });

    it('should throw BadRequestException if neither template ID is provided', async () => {
      const invalidDto = { ...createDto };
      delete invalidDto.giftTemplateId;

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if both template IDs are provided', async () => {
      const invalidDto = { ...createDto, giftTemplateChangedId: 2 };

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if gift template already exists in event', async () => {
      repository.findOneByEventAndTemplate.mockResolvedValue(mockGiftEvent as GiftEvent);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should handle foreign key constraint errors', async () => {
      repository.findOneByEventAndTemplate.mockResolvedValue(null);
      repository.create.mockRejectedValue({ code: '23503' });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated gift events', async () => {
      const filters: GiftEventFiltersDto = { page: 1, limit: 10 };
      repository.findAll.mockResolvedValue([[mockGiftEvent as GiftEvent], 1]);

      const result = await service.findAll(filters);

      expect(repository.findAll).toHaveBeenCalledWith(filters);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should handle pagination correctly for multiple pages', async () => {
      const filters: GiftEventFiltersDto = { page: 2, limit: 5 };
      repository.findAll.mockResolvedValue([[], 12]); // 12 total items, page 2 with limit 5

      const result = await service.findAll(filters);

      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
    });
  });

  describe('findByEventId', () => {
    it('should return gift events for a specific event', async () => {
      repository.findByEventId.mockResolvedValue([mockGiftEvent as GiftEvent]);

      const result = await service.findByEventId(1);

      expect(repository.findByEventId).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(GiftEventResponseDto);
    });
  });

  describe('findOne', () => {
    it('should return a gift event by ID', async () => {
      repository.findOne.mockResolvedValue(mockGiftEvent as GiftEvent);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(GiftEventResponseDto);
    });

    it('should throw NotFoundException when gift event not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a gift event successfully', async () => {
      repository.findOne.mockResolvedValue(mockGiftEvent as GiftEvent);

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when gift event not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });



  describe('markAsCompleted', () => {
    it('should mark gift as completed', async () => {
      const completedGiftEvent = { 
        ...mockGiftEvent, 
        status: GiftEventStatus.COMPLETED,
        isCompleted: jest.fn().mockReturnValue(true),
      };
      repository.findOne.mockResolvedValue(mockGiftEvent as GiftEvent);
      repository.update.mockResolvedValue(completedGiftEvent as GiftEvent);

      const result = await service.markAsCompleted(1);

      expect(repository.update).toHaveBeenCalledWith(1, { status: GiftEventStatus.COMPLETED });
      expect(result).toBeInstanceOf(GiftEventResponseDto);
    });

    it('should return same gift if already completed', async () => {
      const completedGiftEvent = { 
        ...mockGiftEvent, 
        status: GiftEventStatus.COMPLETED,
        isCompleted: jest.fn().mockReturnValue(true),
      };
      repository.findOne.mockResolvedValue(completedGiftEvent as GiftEvent);

      const result = await service.markAsCompleted(1);

      expect(repository.update).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(GiftEventResponseDto);
    });
  });

  describe('reopenGift', () => {
    it('should reopen a completed gift', async () => {
      const completedGiftEvent = { 
        ...mockGiftEvent, 
        status: GiftEventStatus.COMPLETED,
        isCompleted: jest.fn().mockReturnValue(true),
      };
      const reopenedGiftEvent = { 
        ...completedGiftEvent, 
        status: GiftEventStatus.OPEN,
        isCompleted: jest.fn().mockReturnValue(false),
      };
      
      repository.findOne.mockResolvedValue(completedGiftEvent as GiftEvent);
      repository.update.mockResolvedValue(reopenedGiftEvent as GiftEvent);

      const result = await service.reopenGift(1);

      expect(repository.update).toHaveBeenCalledWith(1, { status: GiftEventStatus.OPEN });
      expect(result).toBeInstanceOf(GiftEventResponseDto);
    });

    it('should return same gift if already open', async () => {
      repository.findOne.mockResolvedValue(mockGiftEvent as GiftEvent);

      const result = await service.reopenGift(1);

      expect(repository.update).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(GiftEventResponseDto);
    });
  });

  describe('getEventStats', () => {
    it('should return event statistics', async () => {
      const stats = {
        totalGifts: 3,
        completedGifts: 1,
        openGifts: 2,
        totalValue: 500.00,
        collectedValue: 250.00,
        averageProgress: 50,
      };
      repository.getStatsByEvent.mockResolvedValue(stats);

      const result = await service.getEventStats(1);

      expect(repository.getStatsByEvent).toHaveBeenCalledWith(1);
      expect(result).toEqual(stats);
    });
  });
});