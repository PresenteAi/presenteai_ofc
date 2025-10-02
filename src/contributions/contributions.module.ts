import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions/contributions.controller';
import { ContributionsService } from './contributions/contributions.service';

@Module({
  controllers: [ContributionsController],
  providers: [ContributionsService]
})
export class ContributionsModule {}
