import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GiftTemplatesController } from '../gift-templates.controller';
import { GiftTemplatesService } from '../gift-templates.service';
import { CreateGiftTemplateDto } from '../create-gift-template.dto';
import { UpdateGiftTemplateDto } from '../update-gift-template.dto';
import { EventType } from '../../entities/gift-template.entity';

describe('GiftTemplatesController', () => {
  let controller: GiftTemplatesController;
  let service: jest.Mocked<GiftTemplatesService>;

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
  };

  const mockPaginatedResult = {
    data: [mockGiftTemplate],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByCategory: jest.fn(),
      findByEventType: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftTemplatesController],
      providers: [
        {
          provide: GiftTemplatesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<GiftTemplatesController>(GiftTemplatesController);
    service = module.get(GiftTemplatesService);
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

      service.create.mockResolvedValue(mockGiftTemplate as any);

      const result = await controller.create(createDto, userId);

      expect(service.create).toHaveBeenCalledWith(createDto, userId);
      expect(result).toEqual(mockGiftTemplate);
    });

    it('should handle service errors', async () => {
      const createDto: CreateGiftTemplateDto = {
        title: 'Test Gift',
        isPublic: true,
      };
      const userId = 1;

      service.create.mockRejectedValue(new BadRequestException('Invalid data'));

      await expect(controller.create(createDto, userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated gift templates', async () => {
      const paginationDto = { page: 1, limit: 10 };

      service.findAll.mockResolvedValue(mockPaginatedResult as any);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('findById', () => {
    it('should return a gift template by id', async () => {
      service.findById.mockResolvedValue(mockGiftTemplate as any);

      const result = await controller.findById(1, 1); // Added userId parameter

      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockGiftTemplate);
    });

    it('should throw BadRequestException for invalid id', async () => {
      service.findById.mockRejectedValue(new BadRequestException('Invalid gift template ID'));
      
      await expect(controller.findById(0, 1)).rejects.toThrow(BadRequestException);
      await expect(controller.findById(-1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should handle NotFoundException', async () => {
      service.findById.mockRejectedValue(new NotFoundException());

      await expect(controller.findById(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMyTemplates', () => {
    it('should return user templates', async () => {
      const userId = 1;

      service.findByUserId.mockResolvedValue([mockGiftTemplate] as any);

      const result = await controller.findMyTemplates(userId);

      expect(service.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockGiftTemplate]);
    });
  });

  describe('findByCategory', () => {
    it('should return templates by category', async () => {
      const category = 'Electronics';

      service.findByCategory.mockResolvedValue([mockGiftTemplate] as any);

      const result = await controller.findByCategory(category);

      expect(service.findByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual([mockGiftTemplate]);
    });

    it('should handle empty category', async () => {
      service.findByCategory.mockResolvedValue([]);
      const result = await controller.findByCategory('');
      expect(service.findByCategory).toHaveBeenCalledWith('');
      expect(result).toEqual([]);
    });
  });

  describe('findByEventType', () => {
    it('should return templates by event type', async () => {
      const eventType = EventType.WEDDING;

      service.findByEventType.mockResolvedValue([mockGiftTemplate] as any);

      const result = await controller.findByEventType(eventType);

      expect(service.findByEventType).toHaveBeenCalledWith(eventType);
      expect(result).toEqual([mockGiftTemplate]);
    });
  });

  describe('update', () => {
    it('should update a gift template', async () => {
      const updateDto: UpdateGiftTemplateDto = {
        title: 'Updated Title',
      };
      const userId = 1;
      const updatedTemplate = { ...mockGiftTemplate, title: 'Updated Title' };

      service.update.mockResolvedValue(updatedTemplate as any);

      const result = await controller.update(1, updateDto, userId);

      expect(service.update).toHaveBeenCalledWith(1, updateDto, userId);
      expect(result).toEqual(updatedTemplate);
    });

    it('should handle service BadRequestException', async () => {
      const updateDto: UpdateGiftTemplateDto = { title: 'Updated' };
      const userId = 1;
      
      service.update.mockRejectedValue(new BadRequestException());
      await expect(controller.update(1, updateDto, userId)).rejects.toThrow(BadRequestException);
    });

    it('should handle ForbiddenException', async () => {
      const updateDto: UpdateGiftTemplateDto = { title: 'Updated' };
      const userId = 2;

      service.update.mockRejectedValue(new ForbiddenException());

      await expect(controller.update(1, updateDto, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a gift template', async () => {
      const userId = 1;

      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1, userId);

      expect(service.remove).toHaveBeenCalledWith(1, userId);
      expect(result).toBeUndefined();
    });

    it('should handle service exceptions', async () => {
      const userId = 1;
      
      service.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove(1, userId)).rejects.toThrow(NotFoundException);
    });

    it('should handle ForbiddenException', async () => {
      const userId = 2;

      service.remove.mockRejectedValue(new ForbiddenException());

      await expect(controller.remove(1, userId)).rejects.toThrow(ForbiddenException);
    });
  });
});