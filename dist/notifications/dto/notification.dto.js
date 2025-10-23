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
exports.NotificationStatsDto = exports.NotificationResponseDto = exports.BulkActionDto = exports.MarkAsReadDto = exports.NotificationFiltersDto = exports.CreateNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const notification_entity_1 = require("../entities/notification.entity");
class CreateNotificationDto {
    userId;
    eventId;
    contributionId;
    withdrawalId;
    transactionId;
    type;
    title;
    message;
    deliveryMethod;
    priority;
    expiresAt;
    metadata;
    templateId;
    templateData;
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who will receive the notification' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related event ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related contribution ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "contributionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related withdrawal ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "withdrawalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related transaction ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of notification',
        enum: notification_entity_1.NotificationType,
        example: notification_entity_1.NotificationType.PAYMENT
    }),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification title',
        example: 'Payment Received'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification message',
        example: 'You received a new contribution of $50.00 for your event'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'How the notification should be delivered',
        enum: notification_entity_1.DeliveryMethod,
        default: notification_entity_1.DeliveryMethod.IN_APP
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.DeliveryMethod),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority of the notification',
        enum: notification_entity_1.NotificationPriority,
        default: notification_entity_1.NotificationPriority.NORMAL
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationPriority),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'When the notification expires (ISO 8601 format)',
        example: '2024-12-31T23:59:59.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata for the notification'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateNotificationDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template ID for structured notifications'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data for template rendering'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateNotificationDto.prototype, "templateData", void 0);
class NotificationFiltersDto {
    isRead;
    type;
    priority;
    startDate;
    endDate;
    limit;
    offset;
    sortBy;
    sortOrder;
}
exports.NotificationFiltersDto = NotificationFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by read status',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationFiltersDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by notification type',
        enum: notification_entity_1.NotificationType
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    __metadata("design:type", String)
], NotificationFiltersDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by priority',
        enum: notification_entity_1.NotificationPriority
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationPriority),
    __metadata("design:type", String)
], NotificationFiltersDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for filtering (ISO 8601)',
        example: '2024-01-01T00:00:00.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], NotificationFiltersDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for filtering (ISO 8601)',
        example: '2024-12-31T23:59:59.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], NotificationFiltersDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of notifications per page',
        default: 20,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NotificationFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of notifications to skip',
        default: 0,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NotificationFiltersDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        enum: ['createdAt', 'updatedAt', 'priority'],
        default: 'createdAt'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotificationFiltersDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        default: 'DESC'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotificationFiltersDto.prototype, "sortOrder", void 0);
class MarkAsReadDto {
    isRead;
}
exports.MarkAsReadDto = MarkAsReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to mark as read or unread',
        example: true,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MarkAsReadDto.prototype, "isRead", void 0);
class BulkActionDto {
    notificationIds;
    action;
}
exports.BulkActionDto = BulkActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of notification IDs to perform action on',
        example: [1, 2, 3, 4, 5]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], BulkActionDto.prototype, "notificationIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action to perform',
        enum: ['markAsRead', 'delete'],
        example: 'markAsRead'
    }),
    (0, class_validator_1.IsEnum)(['markAsRead', 'delete']),
    __metadata("design:type", String)
], BulkActionDto.prototype, "action", void 0);
class NotificationResponseDto {
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
    metadata;
    createdAt;
    updatedAt;
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification ID' }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event ID', required: false }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contribution ID', required: false }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "contributionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Withdrawal ID', required: false }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "withdrawalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', required: false }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: notification_entity_1.NotificationType }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Read status' }),
    __metadata("design:type", Boolean)
], NotificationResponseDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: notification_entity_1.DeliveryMethod }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: notification_entity_1.NotificationPriority }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata' }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation date' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update date' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "updatedAt", void 0);
class NotificationStatsDto {
    total;
    unread;
    byType;
    recent;
}
exports.NotificationStatsDto = NotificationStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total notifications' }),
    __metadata("design:type", Number)
], NotificationStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unread notifications' }),
    __metadata("design:type", Number)
], NotificationStatsDto.prototype, "unread", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notifications by type' }),
    __metadata("design:type", Object)
], NotificationStatsDto.prototype, "byType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recent notifications (last 7 days)' }),
    __metadata("design:type", Number)
], NotificationStatsDto.prototype, "recent", void 0);
//# sourceMappingURL=notification.dto.js.map