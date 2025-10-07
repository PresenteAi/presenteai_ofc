import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { Event, EventType } from './entities/event.entity';

describe('EventsRepository', () => {
  let repository: EventsRepository;
  let mockRepository: Partial<Repository<Event>>;

  const mockEvent = {
    id: 1,
    userId: 1,
    title: 'Test Event',
    description: 'Test Description',
    eventType: EventType.WEDDING,
    coverImageUrl: 'https://example.com/cover.jpg',
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    tertiaryColor: '#45B7D1',
    fontFamily: 'Roboto',
    startDate: new Date('2025-12-25'),
    endDate: new Date('2025-12-20'),
    publicUrl: 'test-event-2025',
    isPublished: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hash',
      isActive: true,
      isIndicated: false,
      indicatedById: 1,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  } as Event;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockReturnValue(mockEvent),
      save: jest.fn().mockResolvedValue(mockEvent),
      findOne: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[mockEvent], 1]),
      find: jest.fn().mockResolvedValue([mockEvent]),
      count: jest.fn().mockResolvedValue(1),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsRepository,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<EventsRepository>(EventsRepository);
  });

  describe('create', () => {
    it('should create an event successfully', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await repository.create({
        userId: 1,
        title: 'Test Event',
        eventType: EventType.WEDDING,
        publicUrl: 'test-event',
      });

      expect(result).toEqual(mockEvent);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when public URL already exists', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      await expect(
        repository.create({
          userId: 1,
          title: 'Test Event',
          eventType: EventType.WEDDING,
          publicUrl: 'test-event',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return event when found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      const result = await repository.findById(1);

      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException when event not found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        repository.findById(999)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(repository.findById(0)).rejects.toThrow(BadRequestException);
      await expect(repository.findById(null as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByPublicUrl', () => {
    it('should return event when found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      const result = await repository.findByPublicUrl('test-event-2025');

      expect(result).toEqual(mockEvent);
    });

    it('should return null when event not found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await repository.findByPublicUrl('nonexistent-event');

      expect(result).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('should deactivate event successfully', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      await repository.softDelete(1);

      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          isActive: false,
        })
      );
    });
  });

  describe('togglePublish', () => {
    it('should toggle publish status successfully', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      await repository.togglePublish(1, false);

      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          isPublished: false,
        })
      );
    });
  });

  describe('countActiveEvents', () => {
    it('should return count of active events', async () => {
      const result = await repository.countActiveEvents();

      expect(result).toBe(1);
      expect(mockRepository.count).toHaveBeenCalledWith({ where: { isActive: true } });
    });
  });
});