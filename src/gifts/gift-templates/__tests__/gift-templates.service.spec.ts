import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GiftTemplatesService } from '../gift-templates.service';
import { GiftTemplatesRepository } from '../gift-templates.repository';
import { GiftTemplate, EventType } from '../../entities/gift-template.entity';
import { CreateGiftTemplateDto } from '../create-gift-template.dto';
import { UpdateGiftTemplateDto } from '../update-gift-template.dto';

describe('GiftTemplatesService', () => {
  let service: GiftTemplatesService;
  let repository: jest.Mocked<GiftTemplatesRepository>;

  const mockGiftTemplate = {
    id: 1,
    title: 'Test Gift',
    description: 'Test Description',
    imageUrl: 'https://test.com/image.jpg',
    category: 'Electronics',
    defaultValue: 100.00,
    eventType: EventType.WEDDING,
    isPublic: true,
    createdByUserId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as GiftTemplate;

  beforeEach(async () => {
    const mockRepositoryMethods = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findByCategory: jest.fn(),
      findByEventType: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      countByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftTemplatesService,
        {
          provide: GiftTemplatesRepository,
          useValue: mockRepositoryMethods,
        },
      ],
    }).compile();

    service = module.get<GiftTemplatesService>(GiftTemplatesService);
    repository = module.get(GiftTemplatesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new gift template', async () => {
      const createDto: CreateGiftTemplateDto = {
        title: 'Test Gift',
        description: 'Test Description',
        imageUrl: 'https://test.com/image.jpg',
        category: 'Electronics',
        defaultValue: 100.00,
        eventType: EventType.WEDDING,
        isPublic: true,
      };
      const userId = 1;

      repository.create.mockResolvedValue(mockGiftTemplate as GiftTemplate);

      const result = await service.create(createDto, userId);

      expect(repository.create).toHaveBeenCalledWith(createDto, userId);
      expect(result).toEqual(mockGiftTemplate);
    });
  });

  describe('findById', () => {
    it('should find a gift template by id', async () => {
      repository.findById.mockResolvedValue(mockGiftTemplate as GiftTemplate);

      const result = await service.findById(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGiftTemplate);
    });

    it('should throw NotFoundException when template not found', async () => {
      repository.findById.mockRejectedValue(new NotFoundException());

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated gift templates', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const expectedCallDto = {
        page: 1,
        limit: 10,
        category: undefined,
        eventType: undefined,
        isPublic: undefined,
        createdByUserId: undefined,
        search: undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };
      const expectedResult = {
        data: [mockGiftTemplate],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      };

      repository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll(paginationDto);

      expect(repository.findAll).toHaveBeenCalledWith(expectedCallDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByUserId', () => {
    it('should return templates by user id', async () => {
      const userId = 1;
      const repositoryResult = [mockGiftTemplate as GiftTemplate];
      
      repository.findByUserId.mockResolvedValue(repositoryResult);

      const result = await service.findByUserId(userId);

      expect(repository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockGiftTemplate.id);
      expect(result[0].title).toBe(mockGiftTemplate.title);
    });
  });

  describe('findByCategory', () => {
    it('should return templates by category', async () => {
      const category = 'Electronics';
      const repositoryResult = [mockGiftTemplate as GiftTemplate];
      
      repository.findByCategory.mockResolvedValue(repositoryResult);

      const result = await service.findByCategory(category);

      expect(repository.findByCategory).toHaveBeenCalledWith(category);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe(mockGiftTemplate.category);
    });
  });

  describe('findByEventType', () => {
    it('should return templates by event type', async () => {
      const eventType = EventType.WEDDING;
      const repositoryResult = [mockGiftTemplate as GiftTemplate];
      
      repository.findByEventType.mockResolvedValue(repositoryResult);

      const result = await service.findByEventType(eventType);

      expect(repository.findByEventType).toHaveBeenCalledWith(eventType);
      expect(result).toHaveLength(1);
      expect(result[0].eventType).toBe(mockGiftTemplate.eventType);
    });
  });

  describe('update', () => {
    it('should update a gift template when user is owner', async () => {
      const updateDto: UpdateGiftTemplateDto = {
        title: 'Updated Title',
      };
      const updatedTemplate = { ...mockGiftTemplate, title: 'Updated Title' };

      repository.findById.mockResolvedValue(mockGiftTemplate as GiftTemplate);
      repository.update.mockResolvedValue(updatedTemplate as GiftTemplate);

      const result = await service.update(1, updateDto, 1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedTemplate);
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      const updateDto: UpdateGiftTemplateDto = {
        title: 'Updated Title',
      };

      repository.findById.mockResolvedValue(mockGiftTemplate as GiftTemplate);

      await expect(service.update(1, updateDto, 2)).rejects.toThrow('You can only update your own gift templates');
    });
  });

  describe('remove', () => {
    it('should remove a gift template when user is owner', async () => {
      repository.findById.mockResolvedValue(mockGiftTemplate as GiftTemplate);
      repository.remove.mockResolvedValue(undefined);

      await service.remove(1, 1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      repository.findById.mockResolvedValue(mockGiftTemplate as GiftTemplate);

      await expect(service.remove(1, 2)).rejects.toThrow('You can only delete your own gift templates');
    });
  });

  // Duplicate test methods removed - already covered above with correct signatures
});