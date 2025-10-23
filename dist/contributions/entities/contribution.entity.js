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
exports.Contribution = exports.PaymentStatus = exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const gift_event_entity_1 = require("../../gifts/entities/gift-event.entity");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["BOLETO"] = "boleto";
    PaymentMethod["PIX"] = "pix";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["APPROVED"] = "approved";
    PaymentStatus["REJECTED"] = "rejected";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Contribution = class Contribution {
    id;
    eventGiftId;
    userId;
    contributorName;
    contributorEmail;
    amount;
    currency;
    paymentMethod;
    paymentStatus;
    transactionId;
    feePlatform;
    feeGateway;
    netAmount;
    message;
    refundedAt;
    deletedAt;
    createdAt;
    updatedAt;
    eventGift;
    transactions;
    canBeRefunded() {
        return this.paymentStatus === PaymentStatus.APPROVED && !this.refundedAt;
    }
    isFinalState() {
        return [PaymentStatus.APPROVED, PaymentStatus.REJECTED, PaymentStatus.REFUNDED].includes(this.paymentStatus);
    }
    getEffectiveAmount() {
        if (this.paymentStatus === PaymentStatus.APPROVED && this.netAmount) {
            return Number(this.netAmount);
        }
        return 0;
    }
    calculateNetAmount() {
        if (this.amount && (this.feePlatform || this.feeGateway)) {
            const totalFees = (this.feePlatform || 0) + (this.feeGateway || 0);
            this.netAmount = Number(this.amount) - totalFees;
        }
        else if (this.amount) {
            this.netAmount = Number(this.amount);
        }
    }
    approve(transactionId, feePlatform, feeGateway) {
        if (this.paymentStatus !== PaymentStatus.PENDING) {
            throw new Error('Only pending contributions can be approved');
        }
        this.paymentStatus = PaymentStatus.APPROVED;
        this.transactionId = transactionId;
        this.feePlatform = feePlatform;
        this.feeGateway = feeGateway;
        this.calculateNetAmount();
    }
    reject() {
        if (this.paymentStatus !== PaymentStatus.PENDING) {
            throw new Error('Only pending contributions can be rejected');
        }
        this.paymentStatus = PaymentStatus.REJECTED;
    }
    refund() {
        if (!this.canBeRefunded()) {
            throw new Error('Contribution cannot be refunded');
        }
        this.paymentStatus = PaymentStatus.REFUNDED;
        this.refundedAt = new Date();
    }
};
exports.Contribution = Contribution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Contribution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_gift_id', type: 'int' }),
    __metadata("design:type", Number)
], Contribution.prototype, "eventGiftId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Contribution.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contributor_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Contribution.prototype, "contributorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contributor_email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Contribution.prototype, "contributorEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Contribution.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'BRL' }),
    __metadata("design:type", String)
], Contribution.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_method',
        type: 'enum',
        enum: PaymentMethod,
    }),
    __metadata("design:type", String)
], Contribution.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Contribution.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Contribution.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fee_platform', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Contribution.prototype, "feePlatform", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fee_gateway', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Contribution.prototype, "feeGateway", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Contribution.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Contribution.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refunded_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Contribution.prototype, "refundedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Contribution.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Contribution.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Contribution.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gift_event_entity_1.GiftEvent, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'event_gift_id' }),
    __metadata("design:type", gift_event_entity_1.GiftEvent)
], Contribution.prototype, "eventGift", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Transaction', 'contribution', { cascade: false }),
    __metadata("design:type", Array)
], Contribution.prototype, "transactions", void 0);
exports.Contribution = Contribution = __decorate([
    (0, typeorm_1.Entity)('contributions'),
    (0, typeorm_1.Index)(['eventGiftId', 'paymentStatus']),
    (0, typeorm_1.Index)(['contributorEmail']),
    (0, typeorm_1.Index)(['transactionId'], { unique: true, where: 'transaction_id IS NOT NULL' })
], Contribution);
//# sourceMappingURL=contribution.entity.js.map