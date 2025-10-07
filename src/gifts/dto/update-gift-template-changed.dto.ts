import { PartialType } from '@nestjs/swagger';
import { CreateGiftTemplateChangedDto } from './create-gift-template-changed.dto';

export class UpdateGiftTemplateChangedDto extends PartialType(CreateGiftTemplateChangedDto) {}