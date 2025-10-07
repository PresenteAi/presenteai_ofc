import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftEvent } from '../entities/gift-event.entity';
import { GiftTemplate } from '../entities/gift-template.entity';
import { GiftTemplateChanged } from '../entities/gift-template-changed.entity';
import { Event } from '../../events/events/entities/event.entity';
import { GiftEventsController } from './controllers/gift-events.controller';
import { GiftEventsService } from './services/gift-events.service';
import { GiftEventsRepository } from './repositories/gift-events.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftEvent, GiftTemplate, GiftTemplateChanged, Event]),
  ],
  controllers: [
    GiftEventsController,
  ],
  providers: [
    GiftEventsService,
    GiftEventsRepository,
  ],
  exports: [
    GiftEventsService,
    GiftEventsRepository,
  ],
})
export class GiftEventsModule {}