import { Transaction, TransactionStatus } from '../entities/transaction.entity';

/**
 * Transaction creation parameters for payment gateways
 */
export interface CreateTransactionParams {
  /** Transaction amount */
  amount: number;
  /** Payment method specific data */
  paymentMethodData: Record<string, any>;
  /** Customer information */
  customer?: {
    name: string;
    email?: string;
    document?: string;
  };
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Gateway transaction response
 */
export interface GatewayTransactionResponse {
  /** Gateway internal transaction ID */
  id: string;
  /** Transaction status from gateway */
  status: string;
  /** Payment URL for redirects (if applicable) */
  paymentUrl?: string;
  /** Additional response data */
  data?: Record<string, any>;
}

/**
 * Transaction status check response
 */
export interface TransactionStatusResponse {
  /** Current transaction status */
  status: TransactionStatus;
  /** Payment confirmation date */
  paymentDate?: Date;
  /** Additional gateway data */
  metadata?: Record<string, any>;
}

/**
 * Refund response from gateway
 */
export interface RefundResponse {
  /** Refund ID from gateway */
  refundId: string;
  /** Refund status */
  status: string;
  /** Refund processing date */
  processedAt: Date;
  /** Additional refund data */
  metadata?: Record<string, any>;
}

/**
 * Generic interface for payment gateway providers
 * Implements Strategy Pattern to allow switching between different gateways
 * without changing the core business logic
 * 
 * @example
 * ```typescript
 * class StripeGatewayService implements PaymentGatewayInterface {
 *   async createTransaction(params: CreateTransactionParams): Promise<GatewayTransactionResponse> {
 *     // Stripe-specific implementation
 *   }
 * }
 * ```
 */
export interface PaymentGatewayInterface {
  /**
   * Create a new transaction in the payment gateway
   * 
   * @param params - Transaction creation parameters
   * @returns Promise with gateway transaction response
   * @throws Error if gateway communication fails
   */
  createTransaction(params: CreateTransactionParams): Promise<GatewayTransactionResponse>;

  /**
   * Check the current status of a transaction
   * 
   * @param externalTransactionId - Gateway transaction ID
   * @returns Promise with current transaction status
   * @throws Error if transaction not found or gateway error
   */
  checkTransactionStatus(externalTransactionId: string): Promise<TransactionStatusResponse>;

  /**
   * Process a refund for a paid transaction
   * 
   * @param externalTransactionId - Gateway transaction ID
   * @param amount - Amount to refund (optional, defaults to full amount)
   * @param reason - Refund reason for gateway records
   * @returns Promise with refund response
   * @throws Error if refund cannot be processed
   */
  processRefund(
    externalTransactionId: string,
    amount?: number,
    reason?: string
  ): Promise<RefundResponse>;

  /**
   * Validate webhook/IPN data from the gateway
   * Used to verify that webhook notifications are authentic
   * 
   * @param signature - Webhook signature header
   * @param payload - Raw webhook payload
   * @returns True if webhook is valid, false otherwise
   */
  validateWebhook(signature: string, payload: string): boolean;

  /**
   * Parse webhook data into standardized format
   * 
   * @param payload - Webhook payload from gateway
   * @returns Parsed transaction data or null if not a transaction event
   */
  parseWebhookData(payload: Record<string, any>): {
    externalTransactionId: string;
    status: TransactionStatus;
    paymentDate?: Date;
    metadata?: Record<string, any>;
  } | null;
}

/**
 * Token for dependency injection of payment gateway providers
 */
export const PAYMENT_GATEWAY_TOKEN = 'PaymentGatewayProvider';