import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

/**
 * Notification types for categorizing different kinds of notifications
 */
export enum NotificationType {
  SYSTEM = 'system',
  PAYMENT = 'payment', 
  EVENT = 'event',
  WITHDRAWAL = 'withdrawal',
  CONTRIBUTION = 'contribution',
  CUSTOM = 'custom',
}

/**
 * Delivery methods for notifications
 */
export enum DeliveryMethod {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
}

/**
 * Priority levels for notifications
 */
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Notification status
 */
export enum NotificationStatus {
  CREATED = 'created',
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['type', 'createdAt'])
@Index(['status', 'sentAt'])
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  @Index()
  userId: number;

  @Column({ name: 'event_id', type: 'int', nullable: true })
  eventId?: number;

  @Column({ name: 'contribution_id', type: 'int', nullable: true })
  contributionId?: number;

  @Column({ name: 'withdrawal_id', type: 'int', nullable: true })
  withdrawalId?: number;

  @Column({ name: 'transaction_id', type: 'int', nullable: true })
  transactionId?: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  @Index()
  isRead: boolean;

  @Column({
    name: 'delivery_method',
    type: 'enum',
    enum: DeliveryMethod,
    default: DeliveryMethod.IN_APP,
  })
  deliveryMethod: DeliveryMethod;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.CREATED,
  })
  status: NotificationStatus;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'template_id', type: 'varchar', length: 100, nullable: true })
  templateId?: string;

  @Column({ name: 'template_data', type: 'json', nullable: true })
  templateData?: Record<string, any>;

  @Column({ name: 'retry_count', type: 'int', default: 0 })
  retryCount: number;

  @Column({ name: 'max_retries', type: 'int', default: 3 })
  maxRetries: number;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Virtual relationships (we're not using actual FK constraints to avoid tight coupling)
  // These would be resolved by service layer when needed

  /**
   * Mark notification as read
   */
  markAsRead(): void {
    this.isRead = true;
    this.updatedAt = new Date();
  }

  /**
   * Mark notification as sent
   */
  markAsSent(): void {
    this.status = NotificationStatus.SENT;
    this.sentAt = new Date();
  }

  /**
   * Mark notification as delivered
   */
  markAsDelivered(): void {
    this.status = NotificationStatus.DELIVERED;
    this.deliveredAt = new Date();
  }

  /**
   * Mark notification as failed
   */
  markAsFailed(error: string): void {
    this.status = NotificationStatus.FAILED;
    this.lastError = error;
    this.retryCount += 1;
  }

  /**
   * Check if notification can be retried
   */
  canRetry(): boolean {
    return this.retryCount < this.maxRetries && 
           this.status === NotificationStatus.FAILED;
  }

  /**
   * Check if notification is expired
   */
  isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  /**
   * Check if notification should be sent
   */
  shouldBeSent(): boolean {
    return this.status === NotificationStatus.CREATED && 
           !this.isExpired();
  }

  /**
   * Get display data for frontend
   */
  toDisplayData() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      message: this.message,
      isRead: this.isRead,
      priority: this.priority,
      createdAt: this.createdAt,
      metadata: this.metadata,
    };
  }

  @BeforeInsert()
  setDefaultExpirationDate(): void {
    // Set default expiration to 30 days from now if not specified
    if (!this.expiresAt) {
      this.expiresAt = new Date();
      this.expiresAt.setDate(this.expiresAt.getDate() + 30);
    }
  }
}