import { Module } from '@nestjs/common';
import { ContributionsController } from './controllers/contributions.controller';
import { ContributionsService } from './services/contributions.service';

@Module({
  controllers: [ContributionsController],
  providers: [ContributionsService]
})
export class ContributionsModule {}
