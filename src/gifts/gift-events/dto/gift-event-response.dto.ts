import { ApiProperty } from '@nestjs/swagger';
import { GiftEvent } from '../../entities/gift-event.entity';

export class GiftEventResponseDto {
  @ApiProperty({ example: 1, description: 'ID único do presente no evento' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID do evento' })
  eventId: number;

  @ApiProperty({ example: 'Festa de Aniversário', description: 'Título do evento' })
  eventTitle: string;

  @ApiProperty({ example: 1, description: 'ID do template base', required: false })
  giftTemplateId?: number;

  @ApiProperty({ example: 1, description: 'ID do template personalizado', required: false })
  giftTemplateChangedId?: number;

  @ApiProperty({ example: 'Smartphone Samsung Galaxy S24', description: 'Título efetivo do presente' })
  title: string;

  @ApiProperty({ example: 'Smartphone top de linha com 256GB', description: 'Descrição efetiva do presente', required: false })
  description?: string;

  @ApiProperty({ example: 'https://example.com/smartphone.jpg', description: 'URL da imagem efetiva', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 'Eletrônicos', description: 'Categoria efetiva do presente', required: false })
  category?: string;

  @ApiProperty({ example: 1200.00, description: 'Valor efetivo do presente' })
  effectiveValue: number;

  @ApiProperty({ example: 1500.00, description: 'Valor personalizado definido no evento', required: false })
  customValue?: number;

  @ApiProperty({ example: 750.00, description: 'Valor arrecadado até o momento' })
  collectedValue: number;

  @ApiProperty({ example: 750.00, description: 'Valor restante para completar' })
  remainingValue: number;

  @ApiProperty({ example: 62.5, description: 'Porcentagem de progresso (0-100)' })
  progressPercentage: number;

  @ApiProperty({ example: 'open', description: 'Status atual do presente', enum: ['open', 'completed'] })
  status: string;

  @ApiProperty({ example: true, description: 'Se o presente pode receber contribuições' })
  canReceiveContributions: boolean;

  @ApiProperty({ example: false, description: 'Se o presente foi completado' })
  isCompleted: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;

  constructor(giftEvent: GiftEvent) {
    this.id = giftEvent.id;
    this.eventId = giftEvent.eventId;
    this.eventTitle = giftEvent.event?.title || '';
    this.giftTemplateId = giftEvent.giftTemplateId;
    this.giftTemplateChangedId = giftEvent.giftTemplateChangedId;
    this.title = giftEvent.getEffectiveTitle();
    this.description = giftEvent.getEffectiveDescription() || undefined;
    this.imageUrl = giftEvent.getEffectiveImageUrl() || undefined;
    this.category = giftEvent.getEffectiveCategory() || undefined;
    this.effectiveValue = giftEvent.getEffectiveValue() || 0;
    this.customValue = giftEvent.customValue;
    this.collectedValue = Number(giftEvent.collectedValue);
    this.remainingValue = giftEvent.getRemainingValue();
    this.progressPercentage = giftEvent.getProgressPercentage();
    this.status = giftEvent.status;
    this.canReceiveContributions = giftEvent.canReceiveContributions();
    this.isCompleted = giftEvent.isCompleted();
    this.createdAt = giftEvent.createdAt;
    this.updatedAt = giftEvent.updatedAt;
  }
}

export class PaginatedGiftEventResponseDto {
  @ApiProperty({ type: [GiftEventResponseDto], description: 'Lista de presentes no evento' })
  data: GiftEventResponseDto[];

  @ApiProperty({ example: 25, description: 'Total de itens' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Itens por página' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Se há próxima página' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Se há página anterior' })
  hasPreviousPage: boolean;
}