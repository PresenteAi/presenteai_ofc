import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GiftTemplatesRepository } from '../gift-templates.repository';
import { GiftTemplate, EventType } from '../../entities/gift-template.entity';
import { CreateGiftTemplateDto } from '../create-gift-template.dto';
import { UpdateGiftTemplateDto } from '../update-gift-template.dto';
import { GiftTemplatePaginationDto } from '../../dto/gift-template-pagination.dto';

describe('GiftTemplatesRepository', () => {
  let repository: GiftTemplatesRepository;
  let mockRepository: jest.Mocked<Repository<GiftTemplate>>;
  let mockQueryBuilder: any;

  const mockGiftTemplate: Partial<GiftTemplate> = {
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
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getCount: jest.fn(),
      getManyAndCount: jest.fn(),
    };

    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftTemplatesRepository,
        {
          provide: getRepositoryToken(GiftTemplate),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<GiftTemplatesRepository>(GiftTemplatesRepository);
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

      (mockRepository.create as jest.Mock).mockReturnValue(mockGiftTemplate);
      (mockRepository.save as jest.Mock).mockResolvedValue(mockGiftTemplate);

      const result = await repository.create(createDto, userId);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        createdByUserId: userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockGiftTemplate);
      expect(result).toEqual(mockGiftTemplate);
    });
  });

  describe('findById', () => {
    it('should find a gift template by id', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockGiftTemplate);

      const result = await repository.findById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['createdByUser'],
      });
      expect(result).toEqual(mockGiftTemplate);
    });

    it('should throw NotFoundException when template not found', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(repository.findById(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(repository.findById(0)).rejects.toThrow(BadRequestException);
      await expect(repository.findById(-1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated gift templates', async () => {
      const paginationDto = { page: 1, limit: 10 };
      
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockGiftTemplate], 1]);

      const result = await repository.findAll(paginationDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('giftTemplate');
      expect(result.data).toEqual([mockGiftTemplate]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasPrevious).toBe(false);
      expect(result.hasNext).toBe(false);
    });
  });

  describe('findByUserId', () => {
    it('should return templates by user id', async () => {
      const templates = [mockGiftTemplate];
      (mockRepository.find as jest.Mock).mockResolvedValue(templates);

      const result = await repository.findByUserId(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { createdByUserId: 1 },
        relations: ['createdByUser'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(templates);
    });

    it('should return empty array for invalid user id', async () => {
      const result = await repository.findByUserId(0);
      expect(result).toEqual([]);
    });
  });

  describe('findPublicTemplates', () => {
    it('should return public templates', async () => {
      const templates = [mockGiftTemplate];
      (mockRepository.find as jest.Mock).mockResolvedValue(templates);

      const result = await repository.findPublicTemplates();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isPublic: true },
        relations: ['createdByUser'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(templates);
    });
  });

  describe('findByCategory', () => {
    it('should return templates by category', async () => {
      const templates = [mockGiftTemplate];
      (mockRepository.find as jest.Mock).mockResolvedValue(templates);

      const result = await repository.findByCategory('Electronics');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { category: 'Electronics', isPublic: true },
        relations: ['createdByUser'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(templates);
    });

    it('should return empty array for empty category', async () => {
      const result = await repository.findByCategory('');
      expect(result).toEqual([]);
    });
  });

  describe('findByEventType', () => {
    it('should return templates by event type', async () => {
      const templates = [mockGiftTemplate];
      (mockRepository.find as jest.Mock).mockResolvedValue(templates);

      const result = await repository.findByEventType(EventType.WEDDING);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { eventType: EventType.WEDDING, isPublic: true },
        relations: ['createdByUser'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(templates);
    });
  });

  // searchByTitle method doesn't exist in the actual repository
  // Search functionality is handled through findAll with search parameter

  describe('update', () => {
    it('should update a gift template', async () => {
      const updateDto: UpdateGiftTemplateDto = {
        title: 'Updated Title',
      };

      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockGiftTemplate);
      (mockRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (mockRepository.findOne as jest.Mock).mockResolvedValueOnce(mockGiftTemplate)
        .mockResolvedValueOnce({ ...mockGiftTemplate, title: 'Updated Title' });

      const result = await repository.update(1, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        ...updateDto,
        updatedAt: expect.any(Date),
      });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException for non-existent template', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(repository.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a gift template', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockGiftTemplate);
      (mockRepository.remove as jest.Mock).mockResolvedValue(mockGiftTemplate);

      await repository.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockGiftTemplate);
    });

    it('should throw NotFoundException for non-existent template', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(repository.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('countByUserId', () => {
    it('should count templates by user id', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.countByUserId(1);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { createdByUserId: 1 },
      });
      expect(result).toBe(5);
    });

    it('should return 0 for invalid user id', async () => {
      const result = await repository.countByUserId(0);
      expect(result).toBe(0);
    });
  });
});