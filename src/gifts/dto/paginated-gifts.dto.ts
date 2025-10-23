import { ApiProperty } from '@nestjs/swagger';
import { GiftTemplateOutputDto, GiftTemplateChangedOutputDto, GiftEventOutputDto } from './gift-output.dto';

export class PaginatedGiftTemplatesDto {
  @ApiProperty({ 
    description: 'Lista de templates de presentes',
    type: [GiftTemplateOutputDto]
  })
  data: GiftTemplateOutputDto[];

  @ApiProperty({ example: 25, description: 'Total de itens' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Itens por página' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Tem página anterior' })
  hasPrevious: boolean;

  @ApiProperty({ example: true, description: 'Tem próxima página' })
  hasNext: boolean;
}

export class PaginatedGiftTemplatesChangedDto {
  @ApiProperty({ 
    description: 'Lista de templates personalizados',
    type: [GiftTemplateChangedOutputDto]
  })
  data: GiftTemplateChangedOutputDto[];

  @ApiProperty({ example: 25, description: 'Total de itens' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Itens por página' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Tem página anterior' })
  hasPrevious: boolean;

  @ApiProperty({ example: true, description: 'Tem próxima página' })
  hasNext: boolean;
}

export class PaginatedGiftEventsDto {
  @ApiProperty({ 
    description: 'Lista de presentes do evento',
    type: [GiftEventOutputDto]
  })
  data: GiftEventOutputDto[];

  @ApiProperty({ example: 25, description: 'Total de itens' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Itens por página' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Tem página anterior' })
  hasPrevious: boolean;

  @ApiProperty({ example: true, description: 'Tem próxima página' })
  hasNext: boolean;
}