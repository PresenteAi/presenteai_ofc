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
exports.Notification = exports.NotificationStatus = exports.NotificationPriority = exports.DeliveryMethod = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
var NotificationType;
(function (NotificationType) {
    NotificationType["SYSTEM"] = "system";
    NotificationType["PAYMENT"] = "payment";
    NotificationType["EVENT"] = "event";
    NotificationType["WITHDRAWAL"] = "withdrawal";
    NotificationType["CONTRIBUTION"] = "contribution";
    NotificationType["CUSTOM"] = "custom";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["IN_APP"] = "in_app";
    DeliveryMethod["EMAIL"] = "email";
    DeliveryMethod["PUSH"] = "push";
    DeliveryMethod["SMS"] = "sms";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["NORMAL"] = "normal";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["CREATED"] = "created";
    NotificationStatus["PENDING"] = "pending";
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["DELIVERED"] = "delivered";
    NotificationStatus["FAILED"] = "failed";
    NotificationStatus["EXPIRED"] = "expired";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
let Notification = class Notification {
    id;
    userId;
    eventId;
    contributionId;
    withdrawalId;
    transactionId;
    type;
    title;
    message;
    isRead;
    deliveryMethod;
    priority;
    status;
    sentAt;
    deliveredAt;
    expiresAt;
    metadata;
    templateId;
    templateData;
    retryCount;
    maxRetries;
    lastError;
    createdAt;
    updatedAt;
    markAsRead() {
        this.isRead = true;
        this.updatedAt = new Date();
    }
    markAsSent() {
        this.status = NotificationStatus.SENT;
        this.sentAt = new Date();
    }
    markAsDelivered() {
        this.status = NotificationStatus.DELIVERED;
        this.deliveredAt = new Date();
    }
    markAsFailed(error) {
        this.status = NotificationStatus.FAILED;
        this.lastError = error;
        this.retryCount += 1;
    }
    canRetry() {
        return this.retryCount < this.maxRetries &&
            this.status === NotificationStatus.FAILED;
    }
    isExpired() {
        return this.expiresAt ? this.expiresAt < new Date() : false;
    }
    shouldBeSent() {
        return this.status === NotificationStatus.CREATED &&
            !this.isExpired();
    }
    toDisplayData() {
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            message: this.message,
            isRead: this.isRead,
            priority: this.priority,
            createdAt: this.createdAt,
            metadata: this.metadata,
        };
    }
    setDefaultExpirationDate() {
        if (!this.expiresAt) {
            this.expiresAt = new Date();
            this.expiresAt.setDate(this.expiresAt.getDate() + 30);
        }
    }
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'int' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contribution_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "contributionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'withdrawal_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "withdrawalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.SYSTEM,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_read', type: 'boolean', default: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'delivery_method',
        type: 'enum',
        enum: DeliveryMethod,
        default: DeliveryMethod.IN_APP,
    }),
    __metadata("design:type", String)
], Notification.prototype, "deliveryMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationPriority,
        default: NotificationPriority.NORMAL,
    }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.CREATED,
    }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivered_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_data', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "templateData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'retry_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Notification.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_retries', type: 'int', default: 3 }),
    __metadata("design:type", Number)
], Notification.prototype, "maxRetries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_error', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "lastError", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Notification.prototype, "setDefaultExpirationDate", null);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    (0, typeorm_1.Index)(['userId', 'isRead']),
    (0, typeorm_1.Index)(['type', 'createdAt']),
    (0, typeorm_1.Index)(['status', 'sentAt'])
], Notification);
//# sourceMappingURL=notification.entity.js.map