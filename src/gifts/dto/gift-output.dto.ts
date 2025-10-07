import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '../entities/gift-template.entity';

export class GiftTemplateOutputDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Jogo de Panelas Antiaderente' })
  title: string;

  @ApiProperty({ example: 'Conjunto completo de panelas antiaderentes com 5 peças' })
  description: string;

  @ApiProperty({ example: 'https://example.com/panelas.jpg' })
  imageUrl: string;

  @ApiProperty({ example: 'Cozinha' })
  category: string;

  @ApiProperty({ example: 299.99 })
  defaultValue?: number;

  @ApiProperty({ example: 'wedding', enum: EventType })
  eventType: EventType;

  @ApiProperty({ example: true })
  isPublic: boolean;

  @ApiProperty({ example: 1 })
  createdByUserId: number;

  @ApiProperty({ example: '2025-10-07T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-07T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'Informações do usuário criador'
  })
  createdByUser?: {
    id: number;
    name: string;
    email: string;
  };
}

export class GiftTemplateChangedOutputDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  giftTemplateId: number;

  @ApiProperty({ example: 'Jogo de Panelas Premium' })
  title: string;

  @ApiProperty({ example: 'Versão premium com tampas de vidro' })
  description: string;

  @ApiProperty({ example: 'https://example.com/panelas-premium.jpg' })
  imageUrl: string;

  @ApiProperty({ example: 399.99 })
  value: number;

  @ApiProperty({ example: 'Cozinha Premium' })
  category: string;

  @ApiProperty({ example: false })
  isPublic: boolean;

  @ApiProperty({ example: 1 })
  createdByUserId: number;

  @ApiProperty({ example: '2025-10-07T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-07T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'Template base de referência',
    type: GiftTemplateOutputDto
  })
  giftTemplate?: GiftTemplateOutputDto;

  @ApiProperty({ 
    description: 'Usuário que criou a personalização'
  })
  createdByUser?: {
    id: number;
    name: string;
    email: string;
  };
}

export class GiftEventOutputDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  eventId: number;

  @ApiProperty({ example: 1 })
  giftTemplateId: number;

  @ApiProperty({ example: 1 })
  giftTemplateChangedId: number;

  @ApiProperty({ example: 350.00 })
  customValue: number;

  @ApiProperty({ example: 125.50 })
  collectedValue: number;

  @ApiProperty({ example: 'open' })
  status: string;

  @ApiProperty({ example: '2025-10-07T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-07T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'Template base (se usado)',
    type: GiftTemplateOutputDto
  })
  giftTemplate?: GiftTemplateOutputDto;

  @ApiProperty({ 
    description: 'Template personalizado (se usado)',
    type: GiftTemplateChangedOutputDto
  })
  giftTemplateChanged?: GiftTemplateChangedOutputDto;
}