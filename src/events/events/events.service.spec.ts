import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';

describe('EventsService', () => {
  let service: EventsService;
  let repository: EventsRepository;

  const mockEventsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByPublicUrl: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    togglePublish: jest.fn(),
    countActiveEvents: jest.fn(),
    findUpcomingEvents: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: EventsRepository,
          useValue: mockEventsRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<EventsRepository>(EventsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have EventsRepository injected', () => {
    expect(repository).toBeDefined();
  });
});
