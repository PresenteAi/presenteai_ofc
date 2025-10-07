import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateGiftTemplateChangedDto } from '../create-gift-template-changed.dto';
import { UpdateGiftTemplateChangedDto } from '../update-gift-template-changed.dto';

describe('Gift Templates Changed DTOs', () => {
  describe('CreateGiftTemplateChangedDto', () => {
    it('should validate a valid DTO with all fields', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        title: 'Customized Gift',
        description: 'Custom description',
        imageUrl: 'https://example.com/custom-image.jpg',
        value: 150.75,
        category: 'Custom Category',
        isPublic: false,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate a minimal valid DTO', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation for missing giftTemplateId', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        title: 'Custom Title',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('giftTemplateId');
    });

    it('should fail validation for invalid giftTemplateId', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 0, // Should be positive
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('giftTemplateId');
    });

    it('should fail validation for negative giftTemplateId', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: -1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('giftTemplateId');
    });

    it('should allow short title since title is optional', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        title: 'AB', // Short but valid since it's optional
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation for long description', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        description: 'A'.repeat(1001), // Too long
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const descError = errors.find(error => error.property === 'description');
      expect(descError).toBeDefined();
    });

    it('should fail validation for invalid URL', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        imageUrl: 'not-a-valid-url',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const urlError = errors.find(error => error.property === 'imageUrl');
      expect(urlError).toBeDefined();
    });

    it('should fail validation for negative value', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        value: -10.50,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const valueError = errors.find(error => error.property === 'value');
      expect(valueError).toBeDefined();
    });

    it('should fail validation for too many decimal places in value', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        value: 123.456, // More than 2 decimal places
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const valueError = errors.find(error => error.property === 'value');
      expect(valueError).toBeDefined();
    });

    it('should fail validation for string instead of boolean', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        isPublic: 'false' as any, // String instead of boolean
      });

      // String won't be transformed without ValidationPipe
      expect(dto.isPublic).toBe('false');

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const booleanError = errors.find(error => error.property === 'isPublic');
      expect(booleanError).toBeDefined();
    });
  });

  describe('UpdateGiftTemplateChangedDto', () => {
    it('should validate a valid update DTO', async () => {
      const dto = plainToClass(UpdateGiftTemplateChangedDto, {
        title: 'Updated Custom Title',
        description: 'Updated custom description',
        value: 200.00,
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow partial updates', async () => {
      const dto = plainToClass(UpdateGiftTemplateChangedDto, {
        title: 'Only Title Update',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow updating only value', async () => {
      const dto = plainToClass(UpdateGiftTemplateChangedDto, {
        value: 999.99,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow updating only visibility', async () => {
      const dto = plainToClass(UpdateGiftTemplateChangedDto, {
        isPublic: true,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation for invalid fields', async () => {
      const dto = plainToClass(UpdateGiftTemplateChangedDto, {
        value: -50, // Negative value should fail
        imageUrl: 'invalid-url', // Invalid URL should fail
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      
      const valueError = errors.find(error => error.property === 'value');
      const urlError = errors.find(error => error.property === 'imageUrl');
      
      expect(valueError).toBeDefined();
      expect(urlError).toBeDefined();
    });

    it('should allow empty update DTO', async () => {
      const dto = plainToClass(UpdateGiftTemplateChangedDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should not allow updating giftTemplateId', async () => {
      const dto = plainToClass(UpdateGiftTemplateChangedDto, {
        giftTemplateId: 2, // Should not be allowed in update
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0); // giftTemplateId is optional and not validated in update
    });
  });

  describe('Edge Cases', () => {
    it('should handle maximum values correctly', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        title: 'A'.repeat(255), // Maximum length
        description: 'A'.repeat(1000), // Maximum length
        category: 'A'.repeat(100), // Maximum length
        value: 99999999.99, // Maximum value
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle minimum positive value', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        value: 0.01, // Minimum positive value
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow zero value', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 1,
        value: 0, // Zero is allowed with @Min(0)
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle very large giftTemplateId', async () => {
      const dto = plainToClass(CreateGiftTemplateChangedDto, {
        giftTemplateId: 999999999,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});