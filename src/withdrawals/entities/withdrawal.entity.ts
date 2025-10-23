import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

/**
 * Withdrawal status lifecycle for payout processing
 */
export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Payment gateways supported for withdrawals/payouts
 */
export enum WithdrawalGateway {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  PAGARME = 'pagarme',
  MERCADOPAGO = 'mercadopago',
  BANK_TRANSFER = 'bank_transfer',
}

/**
 * Withdrawal entity representing payout requests for event organizers
 * Each withdrawal represents a request to transfer accumulated funds to the user's account
 * 
 * @example
 * ```typescript
 * const withdrawal = new Withdrawal();
 * withdrawal.userId = 123;
 * withdrawal.totalAmount = 500.00;
 * withdrawal.feeAmount = 15.00;
 * // netAmount will be calculated automatically (485.00)
 * ```
 */
@Entity('withdrawals')
@Index(['userId'])
@Index(['status'])
@Index(['paymentGateway', 'status'])
@Index(['requestedAt'])
@Index(['transactionReference'], { unique: true, where: 'transaction_reference IS NOT NULL' })
export class Withdrawal {
  /**
   * Unique identifier for the withdrawal request
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID of the user requesting the withdrawal (event organizer)
   */
  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  /**
   * Total amount requested for withdrawal
   * @example 500.00 for R$ 500,00
   */
  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  /**
   * Fee charged by the platform or gateway for the withdrawal
   * @default 0.00
   */
  @Column({ name: 'fee_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  feeAmount: number;

  /**
   * Net amount that will be transferred to the user's account (calculated automatically)
   * Formula: totalAmount - feeAmount
   */
  @Column({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  /**
   * Current status of the withdrawal request
   * @default WithdrawalStatus.PENDING
   */
  @Column({
    type: 'enum',
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;

  /**
   * Payment gateway used for processing the withdrawal
   * Can be null if no gateway is assigned yet
   */
  @Column({
    name: 'payment_gateway',
    type: 'enum',
    enum: WithdrawalGateway,
    nullable: true,
  })
  paymentGateway?: WithdrawalGateway;

  /**
   * External transaction reference from the payment gateway
   * Used to track the withdrawal in the gateway's system
   */
  @Column({
    name: 'transaction_reference',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  transactionReference?: string;

  /**
   * Bank account information for the withdrawal
   * Stores account details in JSON format for flexibility
   * 
   * @example
   * ```json
   * {
   *   "bank_code": "001",
   *   "bank_name": "Banco do Brasil",
   *   "account_type": "checking",
   *   "account_number": "12345-6",
   *   "agency": "1234",
   *   "account_holder_name": "João Silva",
   *   "account_holder_document": "12345678901"
   * }
   * ```
   */
  @Column({ name: 'bank_account', type: 'json', nullable: true })
  bankAccount?: Record<string, any>;

  /**
   * Date when the withdrawal was requested
   */
  @Column({ name: 'requested_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestedAt: Date;

  /**
   * Date when the withdrawal was processed (completed or failed)
   * Null for pending/processing withdrawals
   */
  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;

  /**
   * Additional metadata from the payment gateway or system
   * Stores processing details, error messages, etc.
   * 
   * @example
   * ```json
   * {
   *   "gateway_response": {...},
   *   "error_details": "Insufficient funds",
   *   "retry_count": 2,
   *   "processing_notes": "Manual review required"
   * }
   * ```
   */
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  /**
   * Withdrawal creation timestamp
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Last update timestamp
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Hooks

  /**
   * Calculate net amount before inserting or updating
   */
  @BeforeInsert()
  @BeforeUpdate()
  calculateNetAmount(): void {
    if (this.totalAmount && this.feeAmount !== undefined) {
      this.netAmount = Number(this.totalAmount) - Number(this.feeAmount);
    } else if (this.totalAmount) {
      this.netAmount = Number(this.totalAmount);
    }
  }

  // Business logic methods

  /**
   * Check if the withdrawal can be cancelled
   * Only pending withdrawals can be cancelled
   */
  canBeCancelled(): boolean {
    return this.status === WithdrawalStatus.PENDING;
  }

  /**
   * Check if the withdrawal is in a final state (cannot be modified)
   */
  isFinalState(): boolean {
    return [
      WithdrawalStatus.COMPLETED,
      WithdrawalStatus.FAILED,
    ].includes(this.status);
  }

  /**
   * Start processing the withdrawal
   * 
   * @param gateway - Payment gateway to use
   * @param transactionReference - Gateway transaction reference
   */
  startProcessing(gateway: WithdrawalGateway, transactionReference?: string): void {
    if (this.status !== WithdrawalStatus.PENDING) {
      throw new Error('Only pending withdrawals can start processing');
    }

    this.status = WithdrawalStatus.PROCESSING;
    this.paymentGateway = gateway;
    if (transactionReference) {
      this.transactionReference = transactionReference;
    }
  }

  /**
   * Mark withdrawal as completed
   * 
   * @param processedAt - Date when withdrawal was completed
   * @param transactionReference - Gateway transaction reference
   * @param metadata - Additional completion data
   */
  markAsCompleted(
    processedAt: Date,
    transactionReference?: string,
    metadata?: Record<string, any>
  ): void {
    if (this.status !== WithdrawalStatus.PROCESSING) {
      throw new Error('Only processing withdrawals can be marked as completed');
    }

    this.status = WithdrawalStatus.COMPLETED;
    this.processedAt = processedAt;
    if (transactionReference) {
      this.transactionReference = transactionReference;
    }
    if (metadata) {
      this.metadata = { ...this.metadata, ...metadata };
    }
  }

  /**
   * Mark withdrawal as failed with error details
   * 
   * @param errorDetails - Error information from the gateway
   * @param processedAt - Date when failure was detected
   */
  markAsFailed(errorDetails?: Record<string, any>, processedAt?: Date): void {
    if (this.isFinalState()) {
      throw new Error('Cannot mark final state withdrawals as failed');
    }

    this.status = WithdrawalStatus.FAILED;
    this.processedAt = processedAt || new Date();
    if (errorDetails) {
      this.metadata = { 
        ...this.metadata, 
        error_details: errorDetails,
        failed_at: new Date().toISOString()
      };
    }
  }

  /**
   * Update withdrawal metadata
   * 
   * @param newMetadata - New metadata to merge
   */
  updateMetadata(newMetadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...newMetadata };
  }

  /**
   * Set bank account information
   * 
   * @param bankAccount - Bank account details
   */
  setBankAccount(bankAccount: Record<string, any>): void {
    this.bankAccount = bankAccount;
  }

  /**
   * Get processing time in seconds (if processed)
   * 
   * @returns Processing time in seconds or null if not processed
   */
  getProcessingTimeInSeconds(): number | null {
    if (!this.processedAt) {
      return null;
    }
    
    return Math.floor((this.processedAt.getTime() - this.requestedAt.getTime()) / 1000);
  }

  /**
   * Check if withdrawal is overdue (pending for more than specified hours)
   * 
   * @param hours - Hours threshold for considering overdue
   * @returns True if withdrawal is overdue
   */
  isOverdue(hours: number = 24): boolean {
    if (this.status !== WithdrawalStatus.PENDING) {
      return false;
    }

    const thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - hours);
    
    return this.requestedAt < thresholdTime;
  }
}