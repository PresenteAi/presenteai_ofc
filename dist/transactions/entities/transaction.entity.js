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
exports.Transaction = exports.PaymentGateway = exports.TransactionStatus = void 0;
const typeorm_1 = require("typeorm");
const contribution_entity_1 = require("../../contributions/entities/contribution.entity");
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["INITIATED"] = "initiated";
    TransactionStatus["PROCESSING"] = "processing";
    TransactionStatus["PAID"] = "paid";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["REFUNDED"] = "refunded";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var PaymentGateway;
(function (PaymentGateway) {
    PaymentGateway["STRIPE"] = "stripe";
    PaymentGateway["MERCADOPAGO"] = "mercadopago";
    PaymentGateway["PAGARME"] = "pagarme";
})(PaymentGateway || (exports.PaymentGateway = PaymentGateway = {}));
let Transaction = class Transaction {
    id;
    contributionId;
    paymentGateway;
    externalTransactionId;
    amount;
    fee;
    netAmount;
    status;
    paymentDate;
    refundDate;
    metadata;
    createdAt;
    updatedAt;
    contribution;
    calculateNetAmount() {
        if (this.amount && this.fee !== undefined) {
            this.netAmount = Number(this.amount) - Number(this.fee);
        }
        else if (this.amount) {
            this.netAmount = Number(this.amount);
        }
    }
    canBeRefunded() {
        return this.status === TransactionStatus.PAID && !this.refundDate;
    }
    isFinalState() {
        return [
            TransactionStatus.PAID,
            TransactionStatus.FAILED,
            TransactionStatus.REFUNDED,
        ].includes(this.status);
    }
    markAsPaid(paymentDate, externalTransactionId, metadata) {
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
    markAsFailed(errorDetails) {
        if (this.isFinalState()) {
            throw new Error('Cannot mark final state transactions as failed');
        }
        this.status = TransactionStatus.FAILED;
        if (errorDetails) {
            this.metadata = { ...this.metadata, error_details: errorDetails };
        }
    }
    markAsRefunded(refundDate, refundMetadata) {
        if (!this.canBeRefunded()) {
            throw new Error('Transaction cannot be refunded');
        }
        this.status = TransactionStatus.REFUNDED;
        this.refundDate = refundDate;
        if (refundMetadata) {
            this.metadata = { ...this.metadata, refund_details: refundMetadata };
        }
    }
    startProcessing() {
        if (this.status !== TransactionStatus.INITIATED) {
            throw new Error('Only initiated transactions can start processing');
        }
        this.status = TransactionStatus.PROCESSING;
    }
    updateMetadata(newMetadata) {
        this.metadata = { ...this.metadata, ...newMetadata };
    }
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contribution_id', type: 'int' }),
    __metadata("design:type", Number)
], Transaction.prototype, "contributionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_gateway',
        type: 'enum',
        enum: PaymentGateway,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "paymentGateway", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'external_transaction_id',
        type: 'varchar',
        length: 255,
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "externalTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.INITIATED,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Transaction.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Transaction.prototype, "refundDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contribution_entity_1.Contribution, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'contribution_id' }),
    __metadata("design:type", contribution_entity_1.Contribution)
], Transaction.prototype, "contribution", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Transaction.prototype, "calculateNetAmount", null);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions'),
    (0, typeorm_1.Index)(['contributionId']),
    (0, typeorm_1.Index)(['externalTransactionId'], { unique: true, where: 'external_transaction_id IS NOT NULL' }),
    (0, typeorm_1.Index)(['paymentGateway', 'status']),
    (0, typeorm_1.Index)(['status', 'paymentDate'])
], Transaction);
//# sourceMappingURL=transaction.entity.js.map