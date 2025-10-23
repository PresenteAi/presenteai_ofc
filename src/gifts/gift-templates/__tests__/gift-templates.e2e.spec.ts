import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { GiftTemplatesController } from '../gift-templates.controller';
import { GiftTemplatesService } from '../gift-templates.service';
import { GiftTemplatesRepository } from '../gift-templates.repository';
import { EventType } from '../../entities/gift-template.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('GiftTemplatesModule (E2E) - Mock Tests', () => {
  let app: INestApplication;
  let service: jest.Mocked<GiftTemplatesService>;

  const mockDate = new Date('2025-10-07T14:32:11.179Z');
  
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
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const expectedSerializedTemplate = {
    id: 1,
    title: 'Test Gift',
    description: 'Test Description',
    imageUrl: 'https://test.com/image.jpg',
    category: 'Electronics',
    defaultValue: 100.00,
    eventType: EventType.WEDDING,
    isPublic: true,
    createdByUserId: 1,
    createdAt: '2025-10-07T14:32:11.179Z',
    updatedAt: '2025-10-07T14:32:11.179Z',
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

  const expectedPaginatedResult = {
    data: [expectedSerializedTemplate],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  };

  beforeAll(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      findByEventType: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [GiftTemplatesController],
      providers: [
        {
          provide: GiftTemplatesService,
          useValue: mockService,
        },
        {
          provide: GiftTemplatesRepository,
          useValue: {},
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ 
      canActivate: (context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { id: 1, userId: 1 }; // Adding both for compatibility
        return true;
      }
    })
    .compile();

    service = moduleRef.get<GiftTemplatesService>(GiftTemplatesService) as jest.Mocked<GiftTemplatesService>;
    
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    // Add middleware to set user context for all requests
    app.use((req, res, next) => {
      req.user = { id: 1, userId: 1 };
      next();
    });

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/gift-templates (POST)', () => {
    it('should create a new gift template with valid data', async () => {
      const createDto = {
        title: 'Test Gift Template',
        description: 'A test description',
        imageUrl: 'https://example.com/image.jpg',
        category: 'Electronics',
        defaultValue: 100.50,
        eventType: EventType.WEDDING,
        isPublic: true,
      };

      service.create.mockResolvedValue(mockGiftTemplate);

      const response = await request(app.getHttpServer())
        .post('/gift-templates')
        .send(createDto)
        .expect(201);

      expect(service.create).toHaveBeenCalledWith(createDto, expect.any(Number));
      expect(response.body).toEqual(expectedSerializedTemplate);
    });

    it('should fail to create gift template with invalid data', async () => {
      const invalidDto = {
        title: 'AB', // Too short
        defaultValue: -10, // Negative value
        imageUrl: 'not-a-valid-url',
      };

      return request(app.getHttpServer())
        .post('/gift-templates')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/gift-templates (GET)', () => {
    it('should return paginated gift templates', async () => {
      service.findAll.mockResolvedValue(mockPaginatedResult);

      const response = await request(app.getHttpServer())
        .get('/gift-templates')
        .expect(200);

      expect(service.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expectedPaginatedResult);
    });

    it('should return paginated gift templates with query params', async () => {
      service.findAll.mockResolvedValue(mockPaginatedResult);

      const response = await request(app.getHttpServer())
        .get('/gift-templates?page=1&limit=10')
        .expect(200);

      expect(service.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expectedPaginatedResult);
    });
  });

  describe('/gift-templates/category/:category (GET)', () => {
    it('should filter by category', async () => {
      service.findByCategory.mockResolvedValue([mockGiftTemplate]);

      return request(app.getHttpServer())
        .get('/gift-templates/category/Electronics')
        .expect(200)
        .then(response => {
          expect(service.findByCategory).toHaveBeenCalledWith('Electronics');
          expect(response.body).toEqual([expectedSerializedTemplate]);
        });
    });
  });

  describe('/gift-templates/event-type/:eventType (GET)', () => {
    it('should filter by event type', async () => {
      service.findByEventType.mockResolvedValue([mockGiftTemplate]);

      return request(app.getHttpServer())
        .get('/gift-templates/event-type/wedding')
        .expect(200)
        .then(response => {
          expect(service.findByEventType).toHaveBeenCalledWith(EventType.WEDDING);
          expect(response.body).toEqual([expectedSerializedTemplate]);
        });
    });
  });

  describe('/gift-templates/:id (GET)', () => {
    it('should return gift template by id', async () => {
      service.findById.mockResolvedValue(mockGiftTemplate);

      return request(app.getHttpServer())
        .get('/gift-templates/1')
        .expect(200)
        .then(response => {
          expect(service.findById).toHaveBeenCalledWith(1, 1); // Now expects userId parameter
          expect(response.body).toEqual(expectedSerializedTemplate);
        });
    });

    it('should return 404 for non-existent template', async () => {
      service.findById.mockRejectedValue(new NotFoundException('Gift template not found'));

      return request(app.getHttpServer())
        .get('/gift-templates/999999')
        .expect(404);
    });
  });
});