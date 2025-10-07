import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities (para compatibilidade)
import { GiftTemplate } from './entities/gift-template.entity';
import { GiftTemplateChanged } from './entities/gift-template-changed.entity';
import { GiftEvent } from './entities/gift-event.entity';

// Submódulos
import { GiftTemplatesModule } from './gift-templates/gift-templates.module';
import { GiftTemplatesChangedModule } from './gift-templates-changed/gift-templates-changed.module';
import { GiftEventsModule } from './gift-events/gift-events.module';

// Legacy (manter temporariamente)
import { GiftsService } from './gifts/gifts.service';
import { GiftsController } from './gifts/gifts.controller';

@Module({
  imports: [
    // Entidades principais (para outros módulos que precisem)
    TypeOrmModule.forFeature([
      GiftTemplate,
      GiftTemplateChanged, 
      GiftEvent,
    ]),
    // Submódulos especializados
    GiftTemplatesModule,
    GiftTemplatesChangedModule,
    GiftEventsModule,
  ],
  controllers: [
    GiftsController, // Legacy controller - manter temporariamente
  ],
  providers: [
    GiftsService, // Legacy service - manter temporariamente
  ],
  exports: [
    // Exportar submódulos para outros módulos usarem
    GiftTemplatesModule,
    GiftTemplatesChangedModule,
    GiftEventsModule,
    // Legacy exports - manter temporariamente
    GiftsService,
  ],
})
export class GiftsModule {}
