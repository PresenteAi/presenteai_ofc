import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftTemplate } from '../entities/gift-template.entity';
import { GiftTemplatesController } from './gift-templates.controller';
import { GiftTemplatesService } from './gift-templates.service';
import { GiftTemplatesRepository } from './gift-templates.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftTemplate]),
  ],
  controllers: [GiftTemplatesController],
  providers: [
    GiftTemplatesService,
    GiftTemplatesRepository,
  ],
  exports: [
    GiftTemplatesService,
    GiftTemplatesRepository,
  ],
})
export class GiftTemplatesModule {}