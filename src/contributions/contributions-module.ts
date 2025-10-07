import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './entities/contribution.entity';
import { GiftEvent } from '../gifts/entities/gift-event.entity';
import { ContributionsService } from './services/contributions.service';
import { ContributionsController } from './controllers/contributions.controller';

/**
 * Module for managing contributions to gift events
 * Provides services for contribution creation, payment processing, and statistics
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, GiftEvent]),
  ],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService], // Export service for use in other modules
})
export class ContributionsModule {}