import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftEvent } from '../entities/gift-event.entity';
import { GiftTemplate } from '../entities/gift-template.entity';
import { GiftTemplateChanged } from '../entities/gift-template-changed.entity';
import { Event } from '../../events/events/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftEvent, GiftTemplate, GiftTemplateChanged, Event]),
  ],
  controllers: [
    // GiftEventsController - A ser implementado
  ],
  providers: [
    // GiftEventsService - A ser implementado
    // GiftEventsRepository - A ser implementado
  ],
  exports: [
    // GiftEventsService - A ser implementado
    // GiftEventsRepository - A ser implementado
  ],
})
export class GiftEventsModule {}