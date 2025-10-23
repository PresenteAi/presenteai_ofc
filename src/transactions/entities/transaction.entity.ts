import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Contribution } from '../../contributions/entities/contribution.entity';

/**
 * Transaction status lifecycle for payment processing
 */
export enum TransactionStatus {
  INITIATED = 'initiated',
  PROCESSING = 'processing', 
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Payment gateway providers supported by the system
 */
export enum PaymentGateway {
  STRIPE = 'stripe',
  MERCADOPAGO = 'mercadopago',
  PAGARME = 'pagarme',
}

/**
 * Transaction entity representing financial transactions related to contributions
 * Each transaction tracks the payment processing lifecycle through different gateways
 * 
 * @example
 * ```typescript
 * const transaction = new Transaction();
 * transaction.contributionId = 123;
 * transaction.paymentGateway = PaymentGateway.STRIPE;
 * transaction.amount = 50.00;
 * transaction.fee = 2.50;
 * // netAmount will be calculated automatically (47.50)
 * ```
 */
@Entity('transactions')
@Index(['contributionId'])
@Index(['externalTransactionId'], { unique: true, where: 'external_transaction_id IS NOT NULL' })
@Index(['paymentGateway', 'status'])
@Index(['status', 'paymentDate'])
export class Transaction {
  /**
   * Unique identifier for the transaction
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Reference to the contribution that generated this transaction
   */
  @Column({ name: 'contribution_id', type: 'int' })
  contributionId: number;

  /**
   * Payment gateway used for processing this transaction
   * @example 'stripe', 'mercadopago', 'pagarme'
   */
  @Column({
    name: 'payment_gateway',
    type: 'enum',
    enum: PaymentGateway,
  })
  paymentGateway: PaymentGateway;

  /**
   * External transaction ID returned by the payment gateway
   * This ID is used to track the transaction in the gateway's system
   */
  @Column({
    name: 'external_transaction_id',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  externalTransactionId?: string;

  /**
   * Transaction amount in the specified currency
   * @example 50.00 for R$ 50,00
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  /**
   * Fee charged by the gateway or platform
   * @default 0.00
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number;

  /**
   * Net amount received after deducting fees (calculated automatically)
   * Formula: amount - fee
   */
  @Column({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  /**
   * Current status of the transaction
   * @default TransactionStatus.INITIATED
   */
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.INITIATED,
  })
  status: TransactionStatus;

  /**
   * Date when the payment was confirmed by the gateway
   * Null for pending/failed transactions
   */
  @Column({ name: 'payment_date', type: 'datetime', nullable: true })
  paymentDate?: Date;

  /**
   * Date when the transaction was refunded
   * Null for non-refunded transactions
   */
  @Column({ name: 'refund_date', type: 'datetime', nullable: true })
  refundDate?: Date;

  /**
   * Additional metadata from the payment gateway
   * Stores webhooks, IPN data, error details, etc.
   * 
   * @example
   * ```json
   * {
   *   "gateway_response": {...},
   *   "webhook_data": {...},
   *   "error_details": "Card declined"
   * }
   * ```
   */
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  /**
   * Transaction creation timestamp
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Last update timestamp
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  /**
   * Associated contribution
   */
  @ManyToOne(() => Contribution, { eager: false })
  @JoinColumn({ name: 'contribution_id' })
  contribution: Contribution;

  // Hooks

  /**
   * Calculate net amount before inserting
   */
  @BeforeInsert()
  @BeforeUpdate()
  calculateNetAmount(): void {
    if (this.amount && this.fee !== undefined) {
      this.netAmount = Number(this.amount) - Number(this.fee);
    } else if (this.amount) {
      this.netAmount = Number(this.amount);
    }
  }

  // Business logic methods

  /**
   * Check if the transaction can be refunded
   * Only paid transactions can be refunded
   */
  canBeRefunded(): boolean {
    return this.status === TransactionStatus.PAID && !this.refundDate;
  }

  /**
   * Check if the transaction is in a final state (cannot be modified)
   */
  isFinalState(): boolean {
    return [
      TransactionStatus.PAID,
      TransactionStatus.FAILED,
      TransactionStatus.REFUNDED,
    ].includes(this.status);
  }

  /**
   * Mark transaction as paid with payment confirmation
   * 
   * @param paymentDate - Date when payment was confirmed
   * @param externalTransactionId - Gateway transaction ID
   * @param metadata - Additional gateway data
   */
  markAsPaid(
    paymentDate: Date,
    externalTransactionId?: string,
    metadata?: Record<string, any>
  ): void {
    if (this.status !== TransactionStatus.PROCESSING) {
      throw new Error('Only processing transactions can be marked as paid');
    }

    this.status = TransactionStatus.PAID;
    this.paymentDate = paymentDate;
    if (externalTransactionId) {
      this.externalTransactionId = externalTransactionId;
    }
    if (metadata) {
      this.metadata = { ...this.metadata, ...metadata };
    }
  }

  /**
   * Mark transaction as failed with error details
   * 
   * @param errorDetails - Error information from the gateway
   */
  markAsFailed(errorDetails?: Record<string, any>): void {
    if (this.isFinalState()) {
      throw new Error('Cannot mark final state transactions as failed');
    }

    this.status = TransactionStatus.FAILED;
    if (errorDetails) {
      this.metadata = { ...this.metadata, error_details: errorDetails };
    }
  }

  /**
   * Mark transaction as refunded
   * 
   * @param refundDate - Date when the refund was processed
   * @param refundMetadata - Additional refund data from gateway
   */
  markAsRefunded(
    refundDate: Date,
    refundMetadata?: Record<string, any>
  ): void {
    if (!this.canBeRefunded()) {
      throw new Error('Transaction cannot be refunded');
    }

    this.status = TransactionStatus.REFUNDED;
    this.refundDate = refundDate;
    if (refundMetadata) {
      this.metadata = { ...this.metadata, refund_details: refundMetadata };
    }
  }

  /**
   * Start processing the transaction
   */
  startProcessing(): void {
    if (this.status !== TransactionStatus.INITIATED) {
      throw new Error('Only initiated transactions can start processing');
    }

    this.status = TransactionStatus.PROCESSING;
  }

  /**
   * Update transaction metadata
   * 
   * @param newMetadata - New metadata to merge
   */
  updateMetadata(newMetadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...newMetadata };
  }
}