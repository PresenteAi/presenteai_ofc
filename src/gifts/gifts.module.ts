import { Module } from '@nestjs/common';
import { GiftsController } from './gifts/gifts.controller';
import { GiftsService } from './gifts/gifts.service';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService]
})
export class GiftsModule {}
