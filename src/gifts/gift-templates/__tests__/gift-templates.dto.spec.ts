import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateGiftTemplateDto } from '../create-gift-template.dto';
import { UpdateGiftTemplateDto } from '../update-gift-template.dto';
import { EventType } from '../../entities/gift-template.entity';

describe('Gift Templates DTOs', () => {
  describe('CreateGiftTemplateDto', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'Test Gift Template',
        description: 'A test description',
        imageUrl: 'https://example.com/image.jpg',
        category: 'Electronics',
        defaultValue: 100.50,
        eventType: EventType.WEDDING,
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation for missing title', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        description: 'A test description',
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation for short title', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'AB', // Too short
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation for long title', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'A'.repeat(256), // Too long
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation for invalid URL', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'Valid Title',
        imageUrl: 'not-a-valid-url',
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const urlError = errors.find(error => error.property === 'imageUrl');
      expect(urlError).toBeDefined();
    });

    it('should fail validation for negative defaultValue', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'Valid Title',
        defaultValue: -10,
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const valueError = errors.find(error => error.property === 'defaultValue');
      expect(valueError).toBeDefined();
    });

    it('should fail validation for invalid eventType', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'Valid Title',
        eventType: 'invalid-event-type' as EventType,
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const eventTypeError = errors.find(error => error.property === 'eventType');
      expect(eventTypeError).toBeDefined();
    });

    it('should allow valid optional fields', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'Minimal Valid Template',
        isPublic: false,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateGiftTemplateDto', () => {
    it('should validate a valid update DTO', async () => {
      const dto = plainToClass(UpdateGiftTemplateDto, {
        title: 'Updated Title',
        description: 'Updated description',
        defaultValue: 200.00,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow partial updates', async () => {
      const dto = plainToClass(UpdateGiftTemplateDto, {
        title: 'Only Title Update',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation for invalid title in update', async () => {
      const dto = plainToClass(UpdateGiftTemplateDto, {
        title: 'AB', // Too short
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation for invalid URL in update', async () => {
      const dto = plainToClass(UpdateGiftTemplateDto, {
        imageUrl: 'not-a-valid-url',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const urlError = errors.find(error => error.property === 'imageUrl');
      expect(urlError).toBeDefined();
    });

    it('should allow empty update DTO', async () => {
      const dto = plainToClass(UpdateGiftTemplateDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle maximum values correctly', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'A'.repeat(255), // Maximum length
        description: 'A'.repeat(1000), // Maximum length
        category: 'A'.repeat(100), // Maximum length
        defaultValue: 99999999.99, // Maximum value
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle decimal precision correctly', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'Price Test',
        defaultValue: 123.456, // More than 2 decimal places
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const valueError = errors.find(error => error.property === 'defaultValue');
      expect(valueError).toBeDefined();
    });

    it('should handle boolean conversion', async () => {
      const dto = plainToClass(CreateGiftTemplateDto, {
        title: 'Boolean Test',
        isPublic: 'true' as any, // String instead of boolean
      });

      // Should transform string to boolean
      expect(dto.isPublic).toBe(true);

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});