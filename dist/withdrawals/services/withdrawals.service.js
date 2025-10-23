"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WithdrawalsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const withdrawal_repository_1 = require("../repositories/withdrawal.repository");
const transaction_repository_1 = require("../../transactions/repositories/transaction.repository");
const withdrawal_entity_1 = require("../entities/withdrawal.entity");
const transaction_entity_1 = require("../../transactions/entities/transaction.entity");
let WithdrawalsService = WithdrawalsService_1 = class WithdrawalsService {
    withdrawalRepository;
    transactionRepository;
    logger = new common_1.Logger(WithdrawalsService_1.name);
    constructor(withdrawalRepository, transactionRepository) {
        this.withdrawalRepository = withdrawalRepository;
        this.transactionRepository = transactionRepository;
    }
    async createWithdrawal(userId, createWithdrawalDto) {
        this.logger.log(`Creating withdrawal request for user ${userId}, amount: ${createWithdrawalDto.totalAmount}`);
        const balance = await this.getUserBalance(userId);
        if (createWithdrawalDto.totalAmount > balance.availableBalance) {
            throw new common_1.BadRequestException(`Insufficient balance. Available: R$ ${balance.availableBalance.toFixed(2)}, Requested: R$ ${createWithdrawalDto.totalAmount.toFixed(2)}`);
        }
        const minAmount = 10.00;
        if (createWithdrawalDto.totalAmount < minAmount) {
            throw new common_1.BadRequestException(`Minimum withdrawal amount is R$ ${minAmount.toFixed(2)}`);
        }
        const feeAmount = this.calculatePlatformFees(createWithdrawalDto.totalAmount);
        const withdrawal = new withdrawal_entity_1.Withdrawal();
        withdrawal.userId = userId;
        withdrawal.totalAmount = createWithdrawalDto.totalAmount;
        withdrawal.feeAmount = feeAmount;
        withdrawal.status = withdrawal_entity_1.WithdrawalStatus.PENDING;
        withdrawal.paymentGateway = createWithdrawalDto.paymentGateway;
        withdrawal.setBankAccount(createWithdrawalDto.bankAccount);
        withdrawal.metadata = {
            ...createWithdrawalDto.metadata,
            requested_by: userId,
            balance_at_request: balance.availableBalance,
        };
        const savedWithdrawal = await this.withdrawalRepository.save(withdrawal);
        this.logger.log(`Withdrawal ${savedWithdrawal.id} created with status PENDING`);
        let gatewayInfo;
        let estimatedProcessingTime;
        if (createWithdrawalDto.paymentGateway) {
            try {
                this.logger.log(`Gateway processing would be initiated for withdrawal ${savedWithdrawal.id}`);
                estimatedProcessingTime = 24;
            }
            catch (error) {
                this.logger.error(`Gateway processing failed for withdrawal ${savedWithdrawal.id}`, error);
            }
        }
        const response = {
            id: savedWithdrawal.id,
            userId: savedWithdrawal.userId,
            totalAmount: savedWithdrawal.totalAmount,
            feeAmount: savedWithdrawal.feeAmount,
            netAmount: savedWithdrawal.netAmount,
            status: savedWithdrawal.status,
            paymentGateway: savedWithdrawal.paymentGateway,
            transactionReference: savedWithdrawal.transactionReference,
            bankAccount: this.maskBankAccount(savedWithdrawal.bankAccount),
            requestedAt: savedWithdrawal.requestedAt,
            processedAt: savedWithdrawal.processedAt,
            metadata: savedWithdrawal.metadata,
            createdAt: savedWithdrawal.createdAt,
            updatedAt: savedWithdrawal.updatedAt,
            estimatedProcessingTime,
            ...(gatewayInfo && { gatewayInfo }),
        };
        return response;
    }
    async findById(id, userId) {
        const withdrawal = await this.withdrawalRepository.findOne({
            where: { id },
        });
        if (!withdrawal) {
            throw new common_1.NotFoundException(`Withdrawal with ID ${id} not found`);
        }
        if (userId && withdrawal.userId !== userId) {
            throw new common_1.ForbiddenException('You can only access your own withdrawals');
        }
        return withdrawal;
    }
    async findByUserId(userId, status) {
        return this.withdrawalRepository.findByUserId(userId, status);
    }
    async updateWithdrawalStatus(id, updateDto) {
        this.logger.log(`Updating withdrawal ${id} status to ${updateDto.status}`);
        const withdrawal = await this.withdrawalRepository.findOne({ where: { id } });
        if (!withdrawal) {
            throw new common_1.NotFoundException(`Withdrawal with ID ${id} not found`);
        }
        if (withdrawal.isFinalState() && withdrawal.status !== updateDto.status) {
            throw new common_1.BadRequestException(`Withdrawal ${id} is in final state and cannot be modified`);
        }
        switch (updateDto.status) {
            case withdrawal_entity_1.WithdrawalStatus.PROCESSING:
                if (withdrawal.status === withdrawal_entity_1.WithdrawalStatus.PENDING) {
                    if (updateDto.transactionReference) {
                        withdrawal.transactionReference = updateDto.transactionReference;
                    }
                    withdrawal.status = withdrawal_entity_1.WithdrawalStatus.PROCESSING;
                    if (updateDto.metadata) {
                        withdrawal.updateMetadata(updateDto.metadata);
                    }
                }
                break;
            case withdrawal_entity_1.WithdrawalStatus.COMPLETED:
                const processedAt = updateDto.processedAt ? new Date(updateDto.processedAt) : new Date();
                withdrawal.markAsCompleted(processedAt, updateDto.transactionReference, updateDto.metadata);
                if (updateDto.fees !== undefined) {
                    withdrawal.feeAmount = updateDto.fees;
                    withdrawal.calculateNetAmount();
                }
                break;
            case withdrawal_entity_1.WithdrawalStatus.FAILED:
                const failureDate = updateDto.processedAt ? new Date(updateDto.processedAt) : new Date();
                withdrawal.markAsFailed(updateDto.metadata, failureDate);
                break;
            default:
                throw new common_1.BadRequestException(`Invalid status transition to ${updateDto.status}`);
        }
        const updatedWithdrawal = await this.withdrawalRepository.save(withdrawal);
        this.logger.log(`Withdrawal ${id} status updated to ${updatedWithdrawal.status}`);
        return updatedWithdrawal;
    }
    async cancelWithdrawal(id, userId) {
        this.logger.log(`Cancelling withdrawal ${id} for user ${userId}`);
        const withdrawal = await this.findById(id, userId);
        if (!withdrawal.canBeCancelled()) {
            throw new common_1.BadRequestException(`Withdrawal ${id} cannot be cancelled. Current status: ${withdrawal.status}`);
        }
        if (withdrawal.transactionReference) {
            this.logger.log(`Would cancel gateway withdrawal ${withdrawal.transactionReference}`);
        }
        withdrawal.markAsFailed({
            cancellation_reason: 'Cancelled by user',
            cancelled_by: userId,
            cancelled_at: new Date().toISOString()
        });
        return this.withdrawalRepository.save(withdrawal);
    }
    async findByExternalReference(externalId, gateway) {
        this.logger.log(`Finding withdrawal by external reference: ${externalId} (${gateway})`);
        return this.withdrawalRepository.findOne({
            where: {
                transactionReference: externalId,
                paymentGateway: gateway,
            },
            relations: ['user'],
        });
    }
    async getUserBalance(userId) {
        const completedTransactionsStats = await this.transactionRepository.createQueryBuilder('transaction')
            .leftJoin('contributions', 'contribution', 'transaction.contribution_id = contribution.id')
            .select([
            'SUM(CASE WHEN transaction.status = :paidStatus THEN transaction.net_amount ELSE 0 END) as totalEarned'
        ])
            .where('contribution.user_id = :userId', { userId })
            .setParameter('paidStatus', transaction_entity_1.TransactionStatus.PAID)
            .getRawOne();
        const totalEarned = parseFloat(completedTransactionsStats?.totalEarned) || 0;
        const pendingWithdrawals = await this.withdrawalRepository.getPendingWithdrawalsAmount(userId);
        const completedWithdrawals = await this.withdrawalRepository.createQueryBuilder('withdrawal')
            .select('SUM(withdrawal.net_amount)', 'sum')
            .where('withdrawal.user_id = :userId', { userId })
            .andWhere('withdrawal.status = :status', { status: withdrawal_entity_1.WithdrawalStatus.COMPLETED })
            .getRawOne();
        const totalWithdrawn = parseFloat(completedWithdrawals?.sum) || 0;
        const availableBalance = Math.max(0, totalEarned - totalWithdrawn - pendingWithdrawals);
        return {
            availableBalance,
            pendingWithdrawals,
            totalBalance: totalEarned - totalWithdrawn,
            minimumWithdrawal: 10.00,
            maximumWithdrawal: Math.min(availableBalance, 5000.00),
            currency: 'BRL',
        };
    }
    async getUserWithdrawalStats(userId) {
        return this.withdrawalRepository.getUserWithdrawalStats(userId);
    }
    calculatePlatformFees(amount) {
        const percentageFee = amount * 0.03;
        const minFee = 2.00;
        const maxFee = 50.00;
        return Math.min(Math.max(percentageFee, minFee), maxFee);
    }
    maskBankAccount(bankAccount) {
        if (!bankAccount) {
            return undefined;
        }
        return {
            ...bankAccount,
            accountNumber: bankAccount.accountNumber
                ? `*****${bankAccount.accountNumber.slice(-1)}`
                : undefined,
            accountHolderDocument: bankAccount.accountHolderDocument
                ? `***${bankAccount.accountHolderDocument.slice(-3)}`
                : undefined,
        };
    }
    async validateBankAccount(bankAccount) {
        const errors = [];
        if (!bankAccount.bankCode || !/^\d{3}$/.test(bankAccount.bankCode)) {
            errors.push('Invalid bank code format');
        }
        if (!bankAccount.accountNumber || bankAccount.accountNumber.length < 4) {
            errors.push('Invalid account number');
        }
        if (!bankAccount.agency || bankAccount.agency.length < 3) {
            errors.push('Invalid agency number');
        }
        if (!bankAccount.accountHolderDocument ||
            (!/^\d{11}$/.test(bankAccount.accountHolderDocument) &&
                !/^\d{14}$/.test(bankAccount.accountHolderDocument))) {
            errors.push('Invalid document format (must be CPF or CNPJ)');
        }
        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    async findOverdueWithdrawals(hours = 24) {
        return this.withdrawalRepository.findOverdueWithdrawals(hours);
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = WithdrawalsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [withdrawal_repository_1.WithdrawalRepository,
        transaction_repository_1.TransactionRepository])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map