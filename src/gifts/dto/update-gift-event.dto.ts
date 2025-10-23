import { PartialType } from '@nestjs/swagger';
import { CreateGiftEventDto } from './create-gift-event.dto';

export class UpdateGiftEventDto extends PartialType(CreateGiftEventDto) {}