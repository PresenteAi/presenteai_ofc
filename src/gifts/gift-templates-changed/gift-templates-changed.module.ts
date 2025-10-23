import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftTemplateChanged } from '../entities/gift-template-changed.entity';
import { GiftTemplate } from '../entities/gift-template.entity';
import { GiftTemplatesChangedController } from './gift-templates-changed.controller';
import { GiftTemplatesChangedService } from './gift-templates-changed.service';
import { GiftTemplatesChangedRepository } from './gift-templates-changed.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftTemplateChanged, GiftTemplate]),
  ],
  controllers: [GiftTemplatesChangedController],
  providers: [
    GiftTemplatesChangedService,
    GiftTemplatesChangedRepository,
  ],
  exports: [
    GiftTemplatesChangedService,
    GiftTemplatesChangedRepository,
  ],
})
export class GiftTemplatesChangedModule {}