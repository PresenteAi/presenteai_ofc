import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../events/events/entities/event.entity';
import { GiftTemplate } from './gift-template.entity';
import { GiftTemplateChanged } from './gift-template-changed.entity';

export enum GiftEventStatus {
  OPEN = 'open',
  COMPLETED = 'completed'
}

@Entity('gift_events')
@Check(`(gift_template_id IS NOT NULL AND gift_template_changed_id IS NULL) OR (gift_template_id IS NULL AND gift_template_changed_id IS NOT NULL)`)
export class GiftEvent {
  @ApiProperty({ example: 1, description: 'Unique identifier of the gift event' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID of the event this gift belongs to' })
  @Column({ type: 'int' })
  eventId: number;

  @ManyToOne(() => Event, { eager: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ApiProperty({ 
    example: 1, 
    required: false,
    description: 'ID of the base gift template (mutually exclusive with giftTemplateChangedId)'
  })
  @Column({ type: 'int', nullable: true })
  giftTemplateId: number;

  @ManyToOne(() => GiftTemplate, { eager: true, nullable: true })
  @JoinColumn({ name: 'gift_template_id' })
  giftTemplate: GiftTemplate;

  @ApiProperty({ 
    example: 1, 
    required: false,
    description: 'ID of the customized gift template (mutually exclusive with giftTemplateId)'
  })
  @Column({ type: 'int', nullable: true })
  giftTemplateChangedId: number;

  @ManyToOne(() => GiftTemplateChanged, { eager: true, nullable: true })
  @JoinColumn({ name: 'gift_template_changed_id' })
  giftTemplateChanged: GiftTemplateChanged;

  @ApiProperty({ 
    example: 299.99, 
    required: false,
    description: 'Custom value for this specific gift instance (overrides template values)'
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  customValue: number;

  @ApiProperty({ 
    example: 150.00,
    description: 'Amount collected so far for this gift'
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  collectedValue: number;

  @ApiProperty({ 
    example: 'open', 
    enum: GiftEventStatus,
    description: 'Current status of the gift collection'
  })
  @Column({
    type: 'enum',
    enum: GiftEventStatus,
    default: GiftEventStatus.OPEN
  })
  status: GiftEventStatus;

  @ApiProperty({ description: 'Timestamp when the gift was added to the event' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the gift was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos utilitários
  getEffectiveValue(): number | null {
    if (this.customValue) return this.customValue;
    if (this.giftTemplateChanged?.value) return this.giftTemplateChanged.value;
    if (this.giftTemplate?.defaultValue) return this.giftTemplate.defaultValue;
    return null;
  }

  getEffectiveTitle(): string {
    if (this.giftTemplateChanged) {
      return this.giftTemplateChanged.title || this.giftTemplateChanged.giftTemplate?.title || 'Untitled Gift';
    }
    return this.giftTemplate?.title || 'Untitled Gift';
  }

  getEffectiveDescription(): string | null {
    if (this.giftTemplateChanged) {
      return this.giftTemplateChanged.description || this.giftTemplateChanged.giftTemplate?.description || null;
    }
    return this.giftTemplate?.description || null;
  }

  getEffectiveImageUrl(): string | null {
    if (this.giftTemplateChanged) {
      return this.giftTemplateChanged.imageUrl || this.giftTemplateChanged.giftTemplate?.imageUrl || null;
    }
    return this.giftTemplate?.imageUrl || null;
  }

  getEffectiveCategory(): string | null {
    if (this.giftTemplateChanged) {
      return this.giftTemplateChanged.category || this.giftTemplateChanged.giftTemplate?.category || null;
    }
    return this.giftTemplate?.category || null;
  }

  getProgressPercentage(): number {
    const effectiveValue = this.getEffectiveValue();
    if (!effectiveValue || effectiveValue <= 0) return 0;
    return Math.min(100, Math.round((Number(this.collectedValue) / effectiveValue) * 100));
  }

  getRemainingValue(): number {
    const effectiveValue = this.getEffectiveValue();
    if (!effectiveValue) return 0;
    return Math.max(0, effectiveValue - Number(this.collectedValue));
  }

  isCompleted(): boolean {
    return this.status === GiftEventStatus.COMPLETED;
  }

  canReceiveContributions(): boolean {
    return this.status === GiftEventStatus.OPEN;
  }
}