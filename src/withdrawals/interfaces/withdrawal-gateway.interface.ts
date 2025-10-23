import { WithdrawalGateway, WithdrawalStatus } from '../entities/withdrawal.entity';

/**
 * Bank account information for withdrawal processing
 */
export interface BankAccountInfo {
  /** Bank code (e.g., "001" for Banco do Brasil) */
  bankCode: string;
  /** Bank name */
  bankName: string;
  /** Account type: checking, savings */
  accountType: 'checking' | 'savings';
  /** Account number */
  accountNumber: string;
  /** Agency/branch number */
  agency: string;
  /** Account holder's full name */
  accountHolderName: string;
  /** Account holder's document (CPF/CNPJ) */
  accountHolderDocument: string;
  /** Account holder's email */
  accountHolderEmail?: string;
  /** Account holder's phone */
  accountHolderPhone?: string;
}

/**
 * Withdrawal creation parameters for payment gateways
 */
export interface CreateWithdrawalParams {
  /** Withdrawal amount */
  amount: number;
  /** Bank account information */
  bankAccount: BankAccountInfo;
  /** User information */
  user: {
    id: number;
    name: string;
    email: string;
    document?: string;
  };
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Gateway withdrawal response
 */
export interface GatewayWithdrawalResponse {
  /** Gateway internal withdrawal ID */
  id: string;
  /** Withdrawal status from gateway */
  status: string;
  /** Estimated processing time in hours */
  estimatedProcessingTime?: number;
  /** Gateway-specific fees */
  fees?: number;
  /** Additional response data */
  data?: Record<string, any>;
}

/**
 * Withdrawal status check response
 */
export interface WithdrawalStatusResponse {
  /** Current withdrawal status */
  status: WithdrawalStatus;
  /** Processing completion date */
  processedAt?: Date;
  /** Gateway fees applied */
  fees?: number;
  /** Additional gateway data */
  metadata?: Record<string, any>;
}

/**
 * Balance check response
 */
export interface BalanceResponse {
  /** Available balance for withdrawal */
  availableBalance: number;
  /** Pending withdrawals amount */
  pendingWithdrawals: number;
  /** Total balance (available + pending) */
  totalBalance: number;
  /** Minimum withdrawal amount */
  minimumWithdrawal: number;
  /** Maximum withdrawal amount */
  maximumWithdrawal: number;
}

/**
 * Generic interface for withdrawal gateway providers
 * Implements Strategy Pattern to allow switching between different gateways
 * without changing the core business logic
 * 
 * @example
 * ```typescript
 * class StripeWithdrawalService implements WithdrawalGatewayInterface {
 *   async createWithdrawal(params: CreateWithdrawalParams): Promise<GatewayWithdrawalResponse> {
 *     // Stripe-specific implementation for payouts
 *   }
 * }
 * ```
 */
export interface WithdrawalGatewayInterface {
  /**
   * Create a new withdrawal/payout in the payment gateway
   * 
   * @param params - Withdrawal creation parameters
   * @returns Promise with gateway withdrawal response
   * @throws Error if gateway communication fails
   */
  createWithdrawal(params: CreateWithdrawalParams): Promise<GatewayWithdrawalResponse>;

  /**
   * Check the current status of a withdrawal
   * 
   * @param externalWithdrawalId - Gateway withdrawal ID
   * @returns Promise with current withdrawal status
   * @throws Error if withdrawal not found or gateway error
   */
  checkWithdrawalStatus(externalWithdrawalId: string): Promise<WithdrawalStatusResponse>;

  /**
   * Get available balance for withdrawals
   * 
   * @param userId - User identifier
   * @returns Promise with balance information
   * @throws Error if balance check fails
   */
  getAvailableBalance(userId: number): Promise<BalanceResponse>;

  /**
   * Validate bank account information
   * 
   * @param bankAccount - Bank account details to validate
   * @returns Promise with validation result
   */
  validateBankAccount(bankAccount: BankAccountInfo): Promise<{
    isValid: boolean;
    errors?: string[];
  }>;

  /**
   * Cancel a pending withdrawal
   * 
   * @param externalWithdrawalId - Gateway withdrawal ID
   * @returns Promise with cancellation result
   * @throws Error if withdrawal cannot be cancelled
   */
  cancelWithdrawal(externalWithdrawalId: string): Promise<{
    success: boolean;
    message: string;
  }>;

  /**
   * Validate webhook/notification data from the gateway
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
   * @returns Parsed withdrawal data or null if not a withdrawal event
   */
  parseWebhookData(payload: Record<string, any>): {
    externalWithdrawalId: string;
    status: WithdrawalStatus;
    processedAt?: Date;
    fees?: number;
    metadata?: Record<string, any>;
  } | null;

  /**
   * Get gateway-specific configuration and limits
   * 
   * @returns Gateway configuration
   */
  getGatewayConfig(): {
    name: string;
    minimumAmount: number;
    maximumAmount: number;
    processingTime: string;
    supportedCountries: string[];
    fees: {
      percentage?: number;
      fixed?: number;
      minimum?: number;
      maximum?: number;
    };
  };
}

/**
 * Token for dependency injection of withdrawal gateway providers
 */
export const WITHDRAWAL_GATEWAY_TOKEN = 'WithdrawalGatewayProvider';