import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/users/entities/user.entity';
import { GiftTemplate } from './gift-template.entity';

@Entity('gift_templates_changed')
export class GiftTemplateChanged {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  giftTemplateId: number;

  @ManyToOne(() => GiftTemplate)
  @JoinColumn({ name: 'gift_template_id' })
  giftTemplate: GiftTemplate;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'boolean', default: false })
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