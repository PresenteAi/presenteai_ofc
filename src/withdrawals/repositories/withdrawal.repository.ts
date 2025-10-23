import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Withdrawal, WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';

/**
 * Repository for Withdrawal entity with custom query methods
 */
@Injectable()
export class WithdrawalRepository extends Repository<Withdrawal> {
  constructor(private dataSource: DataSource) {
    super(Withdrawal, dataSource.createEntityManager());
  }

  /**
   * Find withdrawals by user ID
   * 
   * @param userId - User identifier
   * @param status - Optional status filter
   * @returns Promise with array of withdrawals
   */
  async findByUserId(userId: number, status?: WithdrawalStatus): Promise<Withdrawal[]> {
    const queryBuilder = this.createQueryBuilder('withdrawal')
      .where('withdrawal.user_id = :userId', { userId })
      .orderBy('withdrawal.requested_at', 'DESC');

    if (status) {
      queryBuilder.andWhere('withdrawal.status = :status', { status });
    }

    return queryBuilder.getMany();
  }

  /**
   * Find withdrawal by external transaction reference
   * 
   * @param transactionReference - Gateway transaction reference
   * @returns Promise with withdrawal or null
   */
  async findByTransactionReference(transactionReference: string): Promise<Withdrawal | null> {
    return this.findOne({
      where: { transactionReference },
    });
  }

  /**
   * Find withdrawals by gateway and status
   * 
   * @param gateway - Payment gateway
   * @param status - Withdrawal status
   * @returns Promise with array of withdrawals
   */
  async findByGatewayAndStatus(
    gateway: WithdrawalGateway,
    status: WithdrawalStatus
  ): Promise<Withdrawal[]> {
    return this.find({
      where: {
        paymentGateway: gateway,
        status,
      },
      order: { requestedAt: 'DESC' },
    });
  }

  /**
   * Find pending withdrawals older than specified hours
   * Useful for identifying stale withdrawals that need attention
   * 
   * @param hours - Hours threshold
   * @returns Promise with array of overdue withdrawals
   */
  async findOverdueWithdrawals(hours: number = 24): Promise<Withdrawal[]> {
    const thresholdDate = new Date();
    thresholdDate.setHours(thresholdDate.getHours() - hours);

    return this.createQueryBuilder('withdrawal')
      .where('withdrawal.status = :status', { status: WithdrawalStatus.PENDING })
      .andWhere('withdrawal.requested_at < :threshold', { threshold: thresholdDate })
      .orderBy('withdrawal.requested_at', 'ASC')
      .getMany();
  }

  /**
   * Get withdrawal statistics for a user
   * 
   * @param userId - User identifier
   * @returns Promise with withdrawal statistics
   */
  async getUserWithdrawalStats(userId: number): Promise<{
    total: number;
    completed: number;
    pending: number;
    failed: number;
    totalAmount: number;
    completedAmount: number;
    pendingAmount: number;
  }> {
    const stats = await this.createQueryBuilder('withdrawal')
      .select([
        'COUNT(*) as total',
        'SUM(CASE WHEN status = :completedStatus THEN 1 ELSE 0 END) as completed',
        'SUM(CASE WHEN status = :pendingStatus THEN 1 ELSE 0 END) as pending',
        'SUM(CASE WHEN status = :failedStatus THEN 1 ELSE 0 END) as failed',
        'SUM(total_amount) as totalAmount',
        'SUM(CASE WHEN status = :completedStatus THEN net_amount ELSE 0 END) as completedAmount',
        'SUM(CASE WHEN status IN (:...pendingStatuses) THEN total_amount ELSE 0 END) as pendingAmount',
      ])
      .where('user_id = :userId', { userId })
      .setParameters({
        completedStatus: WithdrawalStatus.COMPLETED,
        pendingStatus: WithdrawalStatus.PENDING,
        failedStatus: WithdrawalStatus.FAILED,
        pendingStatuses: [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING],
      })
      .getRawOne();

    return {
      total: parseInt(stats.total) || 0,
      completed: parseInt(stats.completed) || 0,
      pending: parseInt(stats.pending) || 0,
      failed: parseInt(stats.failed) || 0,
      totalAmount: parseFloat(stats.totalAmount) || 0,
      completedAmount: parseFloat(stats.completedAmount) || 0,
      pendingAmount: parseFloat(stats.pendingAmount) || 0,
    };
  }

  /**
   * Get total pending withdrawals amount for a user
   * 
   * @param userId - User identifier
   * @returns Promise with pending amount
   */
  async getPendingWithdrawalsAmount(userId: number): Promise<number> {
    const result = await this.createQueryBuilder('withdrawal')
      .select('SUM(withdrawal.total_amount)', 'sum')
      .where('withdrawal.user_id = :userId', { userId })
      .andWhere('withdrawal.status IN (:...statuses)', {
        statuses: [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING],
      })
      .getRawOne();

    return parseFloat(result.sum) || 0;
  }

  /**
   * Find withdrawals that need status synchronization
   * Returns withdrawals that might be out of sync with gateways
   * 
   * @param gatewayTypes - Optional filter by gateway types
   * @returns Promise with withdrawals needing sync
   */
  async findWithdrawalsNeedingSync(
    gatewayTypes?: WithdrawalGateway[]
  ): Promise<Withdrawal[]> {
    const queryBuilder = this.createQueryBuilder('withdrawal')
      .where('withdrawal.status IN (:...statuses)', {
        statuses: [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING],
      })
      .andWhere('withdrawal.transaction_reference IS NOT NULL');

    if (gatewayTypes && gatewayTypes.length > 0) {
      queryBuilder.andWhere('withdrawal.payment_gateway IN (:...gateways)', {
        gateways: gatewayTypes,
      });
    }

    return queryBuilder
      .orderBy('withdrawal.updated_at', 'ASC')
      .getMany();
  }

  /**
   * Find successful withdrawals for a date range
   * Useful for financial reporting and reconciliation
   * 
   * @param startDate - Start date
   * @param endDate - End date
   * @param gateway - Optional gateway filter
   * @returns Promise with successful withdrawals
   */
  async findCompletedWithdrawals(
    startDate: Date,
    endDate: Date,
    gateway?: WithdrawalGateway
  ): Promise<Withdrawal[]> {
    const queryBuilder = this.createQueryBuilder('withdrawal')
      .where('withdrawal.status = :status', { status: WithdrawalStatus.COMPLETED })
      .andWhere('withdrawal.processed_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('withdrawal.processed_at', 'DESC');

    if (gateway) {
      queryBuilder.andWhere('withdrawal.payment_gateway = :gateway', { gateway });
    }

    return queryBuilder.getMany();
  }

  /**
   * Get withdrawal processing time statistics
   * 
   * @param gateway - Optional gateway filter
   * @param days - Number of days to look back
   * @returns Promise with processing time stats
   */
  async getProcessingTimeStats(gateway?: WithdrawalGateway, days: number = 30): Promise<{
    averageProcessingTime: number;
    medianProcessingTime: number;
    minProcessingTime: number;
    maxProcessingTime: number;
    totalWithdrawals: number;
  }> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const queryBuilder = this.createQueryBuilder('withdrawal')
      .select([
        'TIMESTAMPDIFF(SECOND, withdrawal.requested_at, withdrawal.processed_at) as processingTime'
      ])
      .where('withdrawal.status = :status', { status: WithdrawalStatus.COMPLETED })
      .andWhere('withdrawal.processed_at >= :dateLimit', { dateLimit })
      .andWhere('withdrawal.processed_at IS NOT NULL');

    if (gateway) {
      queryBuilder.andWhere('withdrawal.payment_gateway = :gateway', { gateway });
    }

    const results = await queryBuilder.getRawMany();
    
    if (results.length === 0) {
      return {
        averageProcessingTime: 0,
        medianProcessingTime: 0,
        minProcessingTime: 0,
        maxProcessingTime: 0,
        totalWithdrawals: 0,
      };
    }

    const processingTimes = results
      .map(r => parseInt(r.processingTime))
      .filter(time => time > 0)
      .sort((a, b) => a - b);

    const sum = processingTimes.reduce((acc, time) => acc + time, 0);
    const average = sum / processingTimes.length;
    const median = processingTimes.length % 2 === 0
      ? (processingTimes[processingTimes.length / 2 - 1] + processingTimes[processingTimes.length / 2]) / 2
      : processingTimes[Math.floor(processingTimes.length / 2)];

    return {
      averageProcessingTime: Math.round(average),
      medianProcessingTime: Math.round(median),
      minProcessingTime: processingTimes[0],
      maxProcessingTime: processingTimes[processingTimes.length - 1],
      totalWithdrawals: processingTimes.length,
    };
  }
}