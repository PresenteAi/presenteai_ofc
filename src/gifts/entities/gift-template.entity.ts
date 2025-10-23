import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/users/entities/user.entity';

export enum EventType {
  WEDDING = 'wedding',
  BABY_SHOWER = 'baby_shower',
  HOUSEWARMING = 'housewarming',
  BIRTHDAY = 'birthday',
  GRADUATION = 'graduation',
  OTHER = 'other'
}

@Entity('gift_templates')
export class GiftTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  defaultValue: number;

  @Column({
    type: 'enum',
    enum: EventType,
    nullable: true
  })
  eventType: EventType;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ type: 'int' })
  createdByUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}