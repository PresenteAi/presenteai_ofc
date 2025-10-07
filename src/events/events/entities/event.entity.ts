import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../users/users/entities/user.entity';

export enum EventType {
  WEDDING = 'wedding',
  BABY_SHOWER = 'baby_shower',
  HOUSEWARMING = 'housewarming',
  BIRTHDAY = 'birthday',
  GRADUATION = 'graduation',
  ANNIVERSARY = 'anniversary',
  OTHER = 'other'
}

@Entity('events')
export class Event {
  @ApiProperty({ example: 1, description: 'Unique identifier of the event' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'Reference to the event organizer' })
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({ example: 'Casamento Ana & João', description: 'Event title' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ 
    example: 'Venham celebrar conosco este momento especial!', 
    description: 'Event description or host message',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ 
    example: 'wedding', 
    description: 'Type of event',
    enum: EventType
  })
  @Column({ 
    type: 'enum', 
    enum: EventType,
    name: 'event_type'
  })
  eventType: EventType;

  @ApiProperty({ 
    example: 'https://example.com/cover.jpg', 
    description: 'Cover image URL',
    required: false
  })
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'cover_image_url' })
  coverImageUrl?: string;

  @ApiProperty({ 
    example: '#FF6B6B', 
    description: 'Primary theme color',
    required: false
  })
  @Column({ type: 'varchar', length: 7, nullable: true, name: 'primary_color' })
  primaryColor?: string;

  @ApiProperty({ 
    example: '#4ECDC4', 
    description: 'Secondary theme color',
    required: false
  })
  @Column({ type: 'varchar', length: 7, nullable: true, name: 'secondary_color' })
  secondaryColor?: string;

  @ApiProperty({ 
    example: '#45B7D1', 
    description: 'Tertiary theme color',
    required: false
  })
  @Column({ type: 'varchar', length: 7, nullable: true, name: 'tertiary_color' })
  tertiaryColor?: string;

  @ApiProperty({ 
    example: 'Roboto', 
    description: 'Font family used in the event page',
    required: false
  })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'font_family' })
  fontFamily?: string;

  @ApiProperty({ 
    example: '2025-12-25', 
    description: 'Event start date',
    required: false
  })
  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate?: Date;

  @ApiProperty({ 
    example: '2025-12-20', 
    description: 'Contribution end date',
    required: false
  })
  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate?: Date;

  @ApiProperty({ 
    example: 'casamento-ana-joao-2025', 
    description: 'Unique public URL slug for guests'
  })
  @Column({ type: 'varchar', length: 100, unique: true, name: 'public_url' })
  publicUrl: string;

  @ApiProperty({ 
    example: true, 
    description: 'Whether the event is publicly visible'
  })
  @Column({ type: 'boolean', default: false, name: 'is_published' })
  isPublished: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Whether the event is active'
  })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({ 
    example: '2025-10-06T12:00:00Z', 
    description: 'Date when the event was created'
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-10-06T12:00:00Z', 
    description: 'Date when the event was last updated'
  })
  @Column({ 
    type: 'timestamp', 
    name: 'updated_at', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}