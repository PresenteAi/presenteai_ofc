import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GiftEventsRepository } from '../repositories/gift-events.repository';
import { GiftEvent, GiftEventStatus } from '../../entities/gift-event.entity';
import { CreateGiftEventDto } from '../dto/create-gift-event.dto';
import { UpdateGiftEventDto } from '../dto/update-gift-event.dto';
import { GiftEventFiltersDto } from '../dto/gift-event-filters.dto';

describe('GiftEventsRepository', () => {
  let repository: GiftEventsRepository;
  let mockRepository: jest.Mocked<Repository<GiftEvent>>;
  let mockQueryBuilder: jest.Mocked<SelectQueryBuilder<GiftEvent>>;

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
    getEffectiveValue: jest.fn().mockReturnValue(100.00),
    getEffectiveTitle: jest.fn().mockReturnValue('Test Gift'),
    isCompleted: jest.fn().mockReturnValue(false),
    canReceiveContributions: jest.fn().mockReturnValue(true),
    getProgressPercentage: jest.fn().mockReturnValue(50),
    getRemainingValue: jest.fn().mockReturnValue(50.00),
  };

  beforeEach(async () => {
    // Mock do QueryBuilder
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockGiftEvent], 1]),
    } as any;

    // Mock do Repository
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftEventsRepository,
        {
          provide: getRepositoryToken(GiftEvent),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<GiftEventsRepository>(GiftEventsRepository);
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

      mockRepository.create.mockReturnValue(mockGiftEvent as GiftEvent);
      mockRepository.save.mockResolvedValue(mockGiftEvent as GiftEvent);

      const result = await repository.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockGiftEvent);
      expect(result).toEqual(mockGiftEvent);
    });
  });

  describe('findAll', () => {
    it('should find all gift events with filters', async () => {
      const filters: GiftEventFiltersDto = {
        eventId: 1,
        status: GiftEventStatus.OPEN,
        page: 1,
        limit: 10,
      };

      const result = await repository.findAll(filters);

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('giftEvent.event', 'event');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('giftEvent.giftTemplate', 'giftTemplate');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('giftEvent.giftTemplateChanged', 'giftTemplateChanged');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('giftEvent.eventId = :eventId', { eventId: 1 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('giftEvent.status = :status', { status: GiftEventStatus.OPEN });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual([[mockGiftEvent], 1]);
    });

    it('should find all gift events without filters', async () => {
      const result = await repository.findAll();

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalled();
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual([[mockGiftEvent], 1]);
    });

    it('should apply value range filters', async () => {
      const filters: GiftEventFiltersDto = {
        minValue: 50.00,
        maxValue: 150.00,
      };

      await repository.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('minValue', 50.00);
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('maxValue', 150.00);
    });
  });

  describe('findByEventId', () => {
    it('should find gift events by event ID', async () => {
      mockRepository.find.mockResolvedValue([mockGiftEvent as GiftEvent]);

      const result = await repository.findByEventId(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { eventId: 1 },
        relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockGiftEvent]);
    });
  });

  describe('findOne', () => {
    it('should find a gift event by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockGiftEvent as GiftEvent);

      const result = await repository.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
      });
      expect(result).toEqual(mockGiftEvent);
    });

    it('should return null when gift event not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findOneByEventAndTemplate', () => {
    it('should find gift event by event and gift template ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockGiftEvent as GiftEvent);

      const result = await repository.findOneByEventAndTemplate(1, 1, undefined);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { eventId: 1, giftTemplateId: 1, giftTemplateChangedId: null },
        relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
      });
      expect(result).toEqual(mockGiftEvent);
    });

    it('should find gift event by event and gift template changed ID', async () => {
      const mockChangedGiftEvent = { ...mockGiftEvent, giftTemplateId: undefined, giftTemplateChangedId: 2 };
      mockRepository.findOne.mockResolvedValue(mockChangedGiftEvent as unknown as GiftEvent);

      const result = await repository.findOneByEventAndTemplate(1, undefined, 2);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { eventId: 1, giftTemplateChangedId: 2, giftTemplateId: null },
        relations: ['event', 'giftTemplate', 'giftTemplateChanged', 'giftTemplateChanged.giftTemplate'],
      });
      expect(result).toEqual(mockChangedGiftEvent);
    });
  });

  describe('update', () => {
    it('should update a gift event', async () => {
      const updateDto: UpdateGiftEventDto = {
        customValue: 150.00,
        status: GiftEventStatus.COMPLETED,
      };
      
      const updatedGiftEvent = { ...mockGiftEvent, ...updateDto };
      mockRepository.findOne.mockResolvedValue(updatedGiftEvent as GiftEvent);

      const result = await repository.update(1, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedGiftEvent);
    });

    it('should return null when gift event not found for update', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.update(999, {});

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a gift event', async () => {
      await repository.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });



  describe('markAsCompleted', () => {
    it('should mark gift as completed when collected value >= effective value', async () => {
      const giftEventWithFullValue = { 
        ...mockGiftEvent, 
        collectedValue: 100.00,
        getEffectiveValue: jest.fn().mockReturnValue(100.00)
      };
      
      const completedGiftEvent = { 
        ...giftEventWithFullValue, 
        status: GiftEventStatus.COMPLETED 
      };
      
      // First call returns gift with full collected value, second returns updated
      mockRepository.findOne
        .mockResolvedValueOnce(giftEventWithFullValue as GiftEvent)
        .mockResolvedValueOnce(completedGiftEvent as GiftEvent);

      const result = await repository.markAsCompleted(1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { status: GiftEventStatus.COMPLETED });
      expect(result).toEqual(completedGiftEvent);
    });

    it('should not mark as completed when collected value < effective value', async () => {
      mockRepository.findOne.mockResolvedValue(mockGiftEvent as GiftEvent);

      const result = await repository.markAsCompleted(1);

      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(result).toEqual(mockGiftEvent);
    });
  });

  describe('getStatsByEvent', () => {
    it('should return event statistics', async () => {
      const giftEvents = [
        {
          ...mockGiftEvent,
          getEffectiveValue: jest.fn().mockReturnValue(100.00),
          isCompleted: jest.fn().mockReturnValue(false),
        },
        {
          ...mockGiftEvent,
          id: 2,
          getEffectiveValue: jest.fn().mockReturnValue(200.00),
          collectedValue: 200.00,
          isCompleted: jest.fn().mockReturnValue(true),
        }
      ];

      mockRepository.find.mockResolvedValue(giftEvents as GiftEvent[]);

      const result = await repository.getStatsByEvent(1);

      expect(result).toEqual({
        totalGifts: 2,
        completedGifts: 1,
        openGifts: 1,
        totalValue: 300.00,
        collectedValue: 250.00,
        averageProgress: 83, // (250/300)*100 rounded
      });
    });
  });
});