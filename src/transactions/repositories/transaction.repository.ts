import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionStatus, PaymentGateway } from '../entities/transaction.entity';

/**
 * Repository for Transaction entity with custom query methods
 */
@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  /**
   * Find transactions by contribution ID
   * 
   * @param contributionId - Contribution identifier
   * @returns Promise with array of transactions
   */
  async findByContributionId(contributionId: number): Promise<Transaction[]> {
    return this.find({
      where: { contributionId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find transaction by external transaction ID
   * 
   * @param externalTransactionId - Gateway transaction ID
   * @returns Promise with transaction or null
   */
  async findByExternalTransactionId(externalTransactionId: string): Promise<Transaction | null> {
    return this.findOne({
      where: { externalTransactionId },
      relations: ['contribution'],
    });
  }

  /**
   * Find transactions by gateway and status
   * 
   * @param gateway - Payment gateway
   * @param status - Transaction status
   * @returns Promise with array of transactions
   */
  async findByGatewayAndStatus(
    gateway: PaymentGateway,
    status: TransactionStatus
  ): Promise<Transaction[]> {
    return this.find({
      where: {
        paymentGateway: gateway,
        status,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find transactions pending for more than specified minutes
   * Useful for identifying stale transactions that need status updates
   * 
   * @param minutes - Minutes threshold
   * @returns Promise with array of pending transactions
   */
  async findStaleTransactions(minutes: number = 30): Promise<Transaction[]> {
    const thresholdDate = new Date();
    thresholdDate.setMinutes(thresholdDate.getMinutes() - minutes);

    return this.createQueryBuilder('transaction')
      .where('transaction.status IN (:...statuses)', {
        statuses: [TransactionStatus.INITIATED, TransactionStatus.PROCESSING],
      })
      .andWhere('transaction.created_at < :threshold', {
        threshold: thresholdDate,
      })
      .getMany();
  }

  /**
   * Get transaction statistics for a contribution
   * 
   * @param contributionId - Contribution identifier
   * @returns Promise with transaction stats
   */
  async getTransactionStats(contributionId: number): Promise<{
    total: number;
    paid: number;
    failed: number;
    totalAmount: number;
    paidAmount: number;
  }> {
    const stats = await this.createQueryBuilder('transaction')
      .select([
        'COUNT(*) as total',
        'SUM(CASE WHEN status = :paidStatus THEN 1 ELSE 0 END) as paid',
        'SUM(CASE WHEN status = :failedStatus THEN 1 ELSE 0 END) as failed',
        'SUM(amount) as totalAmount',
        'SUM(CASE WHEN status = :paidStatus THEN net_amount ELSE 0 END) as paidAmount',
      ])
      .where('contribution_id = :contributionId', { contributionId })
      .setParameters({
        paidStatus: TransactionStatus.PAID,
        failedStatus: TransactionStatus.FAILED,
      })
      .getRawOne();

    return {
      total: parseInt(stats.total) || 0,
      paid: parseInt(stats.paid) || 0,
      failed: parseInt(stats.failed) || 0,
      totalAmount: parseFloat(stats.totalAmount) || 0,
      paidAmount: parseFloat(stats.paidAmount) || 0,
    };
  }

  /**
   * Find transactions that need status synchronization
   * Returns transactions that might be out of sync with gateways
   * 
   * @param gatewayTypes - Optional filter by gateway types
   * @returns Promise with transactions needing sync
   */
  async findTransactionsNeedingSync(
    gatewayTypes?: PaymentGateway[]
  ): Promise<Transaction[]> {
    const queryBuilder = this.createQueryBuilder('transaction')
      .where('transaction.status IN (:...statuses)', {
        statuses: [TransactionStatus.INITIATED, TransactionStatus.PROCESSING],
      })
      .andWhere('transaction.external_transaction_id IS NOT NULL');

    if (gatewayTypes && gatewayTypes.length > 0) {
      queryBuilder.andWhere('transaction.payment_gateway IN (:...gateways)', {
        gateways: gatewayTypes,
      });
    }

    return queryBuilder
      .orderBy('transaction.updated_at', 'ASC')
      .getMany();
  }

  /**
   * Find successful transactions for a date range
   * Useful for financial reporting
   * 
   * @param startDate - Start date
   * @param endDate - End date
   * @param gateway - Optional gateway filter
   * @returns Promise with successful transactions
   */
  async findSuccessfulTransactions(
    startDate: Date,
    endDate: Date,
    gateway?: PaymentGateway
  ): Promise<Transaction[]> {
    const queryBuilder = this.createQueryBuilder('transaction')
      .where('transaction.status = :status', { status: TransactionStatus.PAID })
      .andWhere('transaction.payment_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('transaction.payment_date', 'DESC');

    if (gateway) {
      queryBuilder.andWhere('transaction.payment_gateway = :gateway', { gateway });
    }

    return queryBuilder.getMany();
  }
}