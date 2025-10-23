import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { GiftEvent } from '../../gifts/entities/gift-event.entity';

/**
 * Payment methods available for contributions
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
}

/**
 * Payment status lifecycle for contributions
 */
export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REFUNDED = 'refunded',
}

/**
 * Contribution entity representing a payment made by a guest towards a specific gift
 * Each contribution is linked to an EventGift and can be made by registered users or anonymous guests
 */
@Entity('contributions')
@Index(['eventGiftId', 'paymentStatus'])
@Index(['contributorEmail'])
@Index(['transactionId'], { unique: true, where: 'transaction_id IS NOT NULL' })
export class Contribution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'event_gift_id', type: 'int' })
  eventGiftId: number;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId?: number;

  @Column({ name: 'contributor_name', type: 'varchar', length: 255 })
  contributorName: string;

  @Column({ name: 'contributor_email', type: 'varchar', length: 255, nullable: true })
  contributorEmail?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'transaction_id', type: 'varchar', length: 255, nullable: true })
  transactionId?: string;

  @Column({ name: 'fee_platform', type: 'decimal', precision: 10, scale: 2, nullable: true })
  feePlatform?: number;

  @Column({ name: 'fee_gateway', type: 'decimal', precision: 10, scale: 2, nullable: true })
  feeGateway?: number;

  @Column({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  netAmount?: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ name: 'refunded_at', type: 'timestamp', nullable: true })
  refundedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => GiftEvent, { eager: false })
  @JoinColumn({ name: 'event_gift_id' })
  eventGift: GiftEvent;

  /**
   * All transactions related to this contribution
   * A contribution can have multiple transaction attempts (retries, different payment methods, etc.)
   */
  @OneToMany('Transaction', 'contribution', { cascade: false })
  transactions: any[]; // Using any[] to avoid circular import

  // Business logic methods

  /**
   * Check if the contribution can be refunded
   */
  canBeRefunded(): boolean {
    return this.paymentStatus === PaymentStatus.APPROVED && !this.refundedAt;
  }

  /**
   * Check if the contribution is in a final state (cannot be modified)
   */
  isFinalState(): boolean {
    return [PaymentStatus.APPROVED, PaymentStatus.REJECTED, PaymentStatus.REFUNDED].includes(
      this.paymentStatus,
    );
  }

  /**
   * Get the effective amount that should impact the gift's collected value
   * Returns the net amount if approved, 0 otherwise
   */
  getEffectiveAmount(): number {
    if (this.paymentStatus === PaymentStatus.APPROVED && this.netAmount) {
      return Number(this.netAmount);
    }
    return 0;
  }

  /**
   * Calculate net amount from gross amount and fees
   */
  calculateNetAmount(): void {
    if (this.amount && (this.feePlatform || this.feeGateway)) {
      const totalFees = (this.feePlatform || 0) + (this.feeGateway || 0);
      this.netAmount = Number(this.amount) - totalFees;
    } else if (this.amount) {
      this.netAmount = Number(this.amount);
    }
  }

  /**
   * Mark contribution as approved with transaction details
   */
  approve(transactionId: string, feePlatform?: number, feeGateway?: number): void {
    if (this.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error('Only pending contributions can be approved');
    }

    this.paymentStatus = PaymentStatus.APPROVED;
    this.transactionId = transactionId;
    this.feePlatform = feePlatform;
    this.feeGateway = feeGateway;
    this.calculateNetAmount();
  }

  /**
   * Mark contribution as rejected
   */
  reject(): void {
    if (this.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error('Only pending contributions can be rejected');
    }

    this.paymentStatus = PaymentStatus.REJECTED;
  }

  /**
   * Mark contribution as refunded
   */
  refund(): void {
    if (!this.canBeRefunded()) {
      throw new Error('Contribution cannot be refunded');
    }

    this.paymentStatus = PaymentStatus.REFUNDED;
    this.refundedAt = new Date();
  }
}