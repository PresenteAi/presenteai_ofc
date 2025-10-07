import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { GiftEventsController } from './controllers/gift-events.controller';
import { GiftEventsService } from './services/gift-events.service';
import { GiftEventStatus } from '../entities/gift-event.entity';
import { GiftEventResponseDto } from './dto/gift-event-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

describe('GiftEventsController (Integration)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let giftEventsService: jest.Mocked<GiftEventsService>;

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
    collectedValue: 0,
    remainingValue: 100.00,
    progressPercentage: 0,
    status: 'open',
    canReceiveContributions: true,
    isCompleted: false,
    createdAt: new Date('2025-10-07T16:53:21.150Z'),
    updatedAt: new Date('2025-10-07T16:53:21.150Z'),
  } as GiftEventResponseDto;

  beforeAll(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByEventId: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      addContribution: jest.fn(),
      updateCollectedValue: jest.fn(),
      markAsCompleted: jest.fn(),
      reopenGift: jest.fn(),
      getEventStats: jest.fn(),
    };

    moduleFixture = await Test.createTestingModule({
      controllers: [GiftEventsController],
      providers: [
        {
          provide: GiftEventsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    giftEventsService = moduleFixture.get<GiftEventsService>(GiftEventsService) as jest.Mocked<GiftEventsService>;
    
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/gift-events (POST)', () => {
    it('should create a gift event with gift template', async () => {
      const createDto = {
        eventId: 1,
        giftTemplateId: 1,
        customValue: 150.00,
        status: GiftEventStatus.OPEN,
      };

      giftEventsService.create.mockResolvedValue(mockGiftEventResponse);

      const response = await request(app.getHttpServer())
        .post('/gift-events')
        .send(createDto)
        .expect(201);

      expect(giftEventsService.create).toHaveBeenCalledWith(createDto);
      expect(response.body).toMatchObject({
        id: 1,
        eventId: 1,
        giftTemplateId: 1,
        title: 'Test Gift',
        status: 'open',
        canReceiveContributions: true,
        isCompleted: false,
      });
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should fail with invalid data', async () => {
      const createDto = {
        eventId: 'invalid', // Should be number
        giftTemplateId: 1,
      };

      await request(app.getHttpServer())
        .post('/gift-events')
        .send(createDto)
        .expect(400);
    });
  });

  describe('/gift-events (GET)', () => {
    it('should return paginated gift events', async () => {
      const mockPaginatedResponse = {
        data: [mockGiftEventResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      giftEventsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const response = await request(app.getHttpServer())
        .get('/gift-events')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(giftEventsService.findAll).toHaveBeenCalled();
      expect(response.body).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            eventId: 1,
            title: 'Test Gift',
            status: 'open',
          })
        ]),
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('/gift-events/event/:eventId (GET)', () => {
    it('should return gift events for specific event', async () => {
      giftEventsService.findByEventId.mockResolvedValue([mockGiftEventResponse]);

      const response = await request(app.getHttpServer())
        .get('/gift-events/event/1')
        .expect(200);

      expect(giftEventsService.findByEventId).toHaveBeenCalledWith(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            eventId: 1,
            title: 'Test Gift',
            status: 'open',
          })
        ])
      );
    });
  });

  describe('/gift-events/event/:eventId/stats (GET)', () => {
    it('should return event statistics', async () => {
      const mockStats = {
        totalGifts: 3,
        completedGifts: 1,
        openGifts: 2,
        totalValue: 500.00,
        collectedValue: 250.00,
        averageProgress: 50,
      };

      giftEventsService.getEventStats.mockResolvedValue(mockStats);

      const response = await request(app.getHttpServer())
        .get('/gift-events/event/1/stats')
        .expect(200);

      expect(giftEventsService.getEventStats).toHaveBeenCalledWith(1);
      expect(response.body).toEqual(mockStats);
    });
  });

  describe('/gift-events/:id (GET)', () => {
    it('should return specific gift event', async () => {
      giftEventsService.findOne.mockResolvedValue(mockGiftEventResponse);

      const response = await request(app.getHttpServer())
        .get('/gift-events/1')
        .expect(200);

      expect(giftEventsService.findOne).toHaveBeenCalledWith(1);
      expect(response.body).toMatchObject({
        id: 1,
        eventId: 1,
        title: 'Test Gift',
        status: 'open',
      });
    });
  });

  describe('/gift-events/:id (PATCH)', () => {
    it('should update gift event', async () => {
      const updateDto = {
        customValue: 250.00,
        status: GiftEventStatus.COMPLETED,
      };

      const updatedResponse = { ...mockGiftEventResponse, customValue: 250.00, status: 'completed' };
      giftEventsService.update.mockResolvedValue(updatedResponse);

      const response = await request(app.getHttpServer())
        .patch('/gift-events/1')
        .send(updateDto)
        .expect(200);

      expect(giftEventsService.update).toHaveBeenCalledWith(1, updateDto);
      expect(response.body).toMatchObject({
        id: 1,
        customValue: 250.00,
        status: 'completed',
      });
    });
  });

  describe('/gift-events/:id/contribution (PATCH)', () => {
    it('should add contribution to gift event', async () => {
      const contributionResponse = { 
        ...mockGiftEventResponse, 
        collectedValue: 25.00,
        progressPercentage: 25,
        remainingValue: 75.00 
      };
      
      giftEventsService.addContribution.mockResolvedValue(contributionResponse);

      const response = await request(app.getHttpServer())
        .patch('/gift-events/1/contribution')
        .send({ amount: 25.00 })
        .expect(200);

      expect(giftEventsService.addContribution).toHaveBeenCalledWith(1, 25.00);
      expect(response.body).toMatchObject({
        id: 1,
        collectedValue: 25,
        progressPercentage: 25,
        remainingValue: 75,
      });
    });
  });

  describe('/gift-events/:id/collected-value (PATCH)', () => {
    it('should update collected value directly', async () => {
      const updatedResponse = { 
        ...mockGiftEventResponse, 
        collectedValue: 150.00,
        progressPercentage: 75,
        remainingValue: 50.00 
      };
      
      giftEventsService.updateCollectedValue.mockResolvedValue(updatedResponse);

      const response = await request(app.getHttpServer())
        .patch('/gift-events/1/collected-value')
        .send({ collectedValue: 150.00 })
        .expect(200);

      expect(giftEventsService.updateCollectedValue).toHaveBeenCalledWith(1, 150.00);
      expect(response.body).toMatchObject({
        id: 1,
        collectedValue: 150,
        progressPercentage: 75,
        remainingValue: 50,
      });
    });
  });

  describe('/gift-events/:id/complete (PATCH)', () => {
    it('should mark gift event as completed', async () => {
      const completedResponse = { 
        ...mockGiftEventResponse, 
        status: 'completed',
        isCompleted: true,
        canReceiveContributions: false 
      };
      
      giftEventsService.markAsCompleted.mockResolvedValue(completedResponse);

      const response = await request(app.getHttpServer())
        .patch('/gift-events/1/complete')
        .expect(200);

      expect(giftEventsService.markAsCompleted).toHaveBeenCalledWith(1);
      expect(response.body).toMatchObject({
        id: 1,
        status: 'completed',
        isCompleted: true,
        canReceiveContributions: false,
      });
    });
  });

  describe('/gift-events/:id/reopen (PATCH)', () => {
    it('should reopen completed gift event', async () => {
      const reopenedResponse = { 
        ...mockGiftEventResponse, 
        status: 'open',
        isCompleted: false,
        canReceiveContributions: true 
      };
      
      giftEventsService.reopenGift.mockResolvedValue(reopenedResponse);

      const response = await request(app.getHttpServer())
        .patch('/gift-events/1/reopen')
        .expect(200);

      expect(giftEventsService.reopenGift).toHaveBeenCalledWith(1);
      expect(response.body).toMatchObject({
        id: 1,
        status: 'open',
        isCompleted: false,
        canReceiveContributions: true,
      });
    });
  });

  describe('/gift-events/:id (DELETE)', () => {
    it('should delete gift event', async () => {
      giftEventsService.remove.mockResolvedValue();

      await request(app.getHttpServer())
        .delete('/gift-events/1')
        .expect(204);

      expect(giftEventsService.remove).toHaveBeenCalledWith(1);
    });
  });
});