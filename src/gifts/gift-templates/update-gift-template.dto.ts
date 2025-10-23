import { PartialType } from '@nestjs/swagger';
import { CreateGiftTemplateDto } from './create-gift-template.dto';

export class UpdateGiftTemplateDto extends PartialType(CreateGiftTemplateDto) {}