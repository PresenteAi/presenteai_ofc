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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = exports.WithdrawalGateway = exports.WithdrawalStatus = void 0;
const typeorm_1 = require("typeorm");
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["PROCESSING"] = "processing";
    WithdrawalStatus["COMPLETED"] = "completed";
    WithdrawalStatus["FAILED"] = "failed";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var WithdrawalGateway;
(function (WithdrawalGateway) {
    WithdrawalGateway["STRIPE"] = "stripe";
    WithdrawalGateway["PAYPAL"] = "paypal";
    WithdrawalGateway["PAGARME"] = "pagarme";
    WithdrawalGateway["MERCADOPAGO"] = "mercadopago";
    WithdrawalGateway["BANK_TRANSFER"] = "bank_transfer";
})(WithdrawalGateway || (exports.WithdrawalGateway = WithdrawalGateway = {}));
let Withdrawal = class Withdrawal {
    id;
    userId;
    totalAmount;
    feeAmount;
    netAmount;
    status;
    paymentGateway;
    transactionReference;
    bankAccount;
    requestedAt;
    processedAt;
    metadata;
    createdAt;
    updatedAt;
    calculateNetAmount() {
        if (this.totalAmount && this.feeAmount !== undefined) {
            this.netAmount = Number(this.totalAmount) - Number(this.feeAmount);
        }
        else if (this.totalAmount) {
            this.netAmount = Number(this.totalAmount);
        }
    }
    canBeCancelled() {
        return this.status === WithdrawalStatus.PENDING;
    }
    isFinalState() {
        return [
            WithdrawalStatus.COMPLETED,
            WithdrawalStatus.FAILED,
        ].includes(this.status);
    }
    startProcessing(gateway, transactionReference) {
        if (this.status !== WithdrawalStatus.PENDING) {
            throw new Error('Only pending withdrawals can start processing');
        }
        this.status = WithdrawalStatus.PROCESSING;
        this.paymentGateway = gateway;
        if (transactionReference) {
            this.transactionReference = transactionReference;
        }
    }
    markAsCompleted(processedAt, transactionReference, metadata) {
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
    markAsFailed(errorDetails, processedAt) {
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
    updateMetadata(newMetadata) {
        this.metadata = { ...this.metadata, ...newMetadata };
    }
    setBankAccount(bankAccount) {
        this.bankAccount = bankAccount;
    }
    getProcessingTimeInSeconds() {
        if (!this.processedAt) {
            return null;
        }
        return Math.floor((this.processedAt.getTime() - this.requestedAt.getTime()) / 1000);
    }
    isOverdue(hours = 24) {
        if (this.status !== WithdrawalStatus.PENDING) {
            return false;
        }
        const thresholdTime = new Date();
        thresholdTime.setHours(thresholdTime.getHours() - hours);
        return this.requestedAt < thresholdTime;
    }
};
exports.Withdrawal = Withdrawal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Withdrawal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'int' }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fee_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "feeAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WithdrawalStatus,
        default: WithdrawalStatus.PENDING,
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_gateway',
        type: 'enum',
        enum: WithdrawalGateway,
        nullable: true,
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "paymentGateway", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_reference',
        type: 'varchar',
        length: 255,
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "transactionReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Withdrawal.prototype, "bankAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requested_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Withdrawal.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Withdrawal.prototype, "calculateNetAmount", null);
exports.Withdrawal = Withdrawal = __decorate([
    (0, typeorm_1.Entity)('withdrawals'),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['paymentGateway', 'status']),
    (0, typeorm_1.Index)(['requestedAt']),
    (0, typeorm_1.Index)(['transactionReference'], { unique: true, where: 'transaction_reference IS NOT NULL' })
], Withdrawal);
//# sourceMappingURL=withdrawal.entity.js.map