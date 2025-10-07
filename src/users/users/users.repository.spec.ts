import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockRepository: Partial<Repository<User>>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    isActive: true,
    isIndicated: false,
    indicatedById: 1,
    lastLoginAt: new Date(),
    updatedAt: new Date(),
    createdAt: new Date(),
  } as User;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockReturnValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
      findOne: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
      count: jest.fn().mockResolvedValue(1),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await repository.create({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      await expect(
        repository.create({
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashedpassword',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await repository.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        repository.findById('123e4567-e89b-12d3-a456-426614174000')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(repository.findById('')).rejects.toThrow(BadRequestException);
      await expect(repository.findById(null as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('should deactivate user successfully', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      await repository.softDelete('123e4567-e89b-12d3-a456-426614174000');

      expect(mockRepository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          isActive: false,
        })
      );
    });
  });
});