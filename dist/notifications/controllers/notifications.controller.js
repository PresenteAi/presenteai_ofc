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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("../services/notifications.service");
const notification_dto_1 = require("../dto/notification.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async createNotification(createNotificationDto) {
        return this.notificationsService.createNotification(createNotificationDto);
    }
    async getUserNotifications(userId, filters, currentUser) {
        if (currentUser.userId !== userId) {
            throw new Error('Access denied');
        }
        return this.notificationsService.getUserNotifications(userId, filters);
    }
    async getUserNotificationStats(userId, currentUser) {
        if (currentUser.userId !== userId) {
            throw new Error('Access denied');
        }
        return this.notificationsService.getUserNotificationStats(userId);
    }
    async getUnreadCount(userId, currentUser) {
        if (currentUser.userId !== userId) {
            throw new Error('Access denied');
        }
        return this.notificationsService.getUnreadCount(userId);
    }
    async getNotification(id, currentUser) {
        return this.notificationsService.getNotificationById(id, currentUser.userId);
    }
    async markAsRead(id, markAsReadDto, currentUser) {
        return this.notificationsService.markAsRead(id, currentUser.userId, markAsReadDto.isRead);
    }
    async markAllAsRead(userId, currentUser) {
        if (currentUser.userId !== userId) {
            throw new Error('Access denied');
        }
        return this.notificationsService.markAllAsRead(userId);
    }
    async deleteNotification(id, currentUser) {
        return this.notificationsService.deleteNotification(id, currentUser.userId);
    }
    async performBulkAction(userId, bulkActionDto, currentUser) {
        if (currentUser.userId !== userId) {
            throw new Error('Access denied');
        }
        return this.notificationsService.performBulkAction(userId, bulkActionDto.notificationIds, bulkActionDto.action);
    }
    async getLiveNotifications(userId, currentUser) {
        if (currentUser.userId !== userId) {
            throw new Error('Access denied');
        }
        return { message: 'SSE endpoint - implementation pending' };
    }
    async broadcastNotification(broadcastDto) {
        return { message: 'Broadcast functionality - implementation pending' };
    }
    async getNotificationAnalytics() {
        return { message: 'Analytics endpoint - implementation pending' };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new notification (Admin only)',
        description: 'Creates a new notification manually. Typically used for system announcements.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Notification created successfully',
        type: notification_dto_1.NotificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid notification data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get notifications for a user',
        description: 'Retrieves paginated notifications for a specific user with optional filtering.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiQuery)({ name: 'isRead', required: false, description: 'Filter by read status' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by notification type' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of notifications per page' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Number to skip' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notifications retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                notifications: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/NotificationResponseDto' },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        limit: { type: 'number' },
                        offset: { type: 'number' },
                        hasMore: { type: 'boolean' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, notification_dto_1.NotificationFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Get)('user/:userId/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get notification statistics for a user',
        description: 'Returns statistics about notifications for a specific user.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        type: notification_dto_1.NotificationStatsDto,
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserNotificationStats", null);
__decorate([
    (0, common_1.Get)('user/:userId/unread-count'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get unread notification count for a user',
        description: 'Returns the number of unread notifications for a user.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Unread count retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific notification',
        description: 'Retrieves a single notification by ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification retrieved successfully',
        type: notification_dto_1.NotificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotification", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark notification as read/unread',
        description: 'Updates the read status of a specific notification.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification status updated successfully',
        type: notification_dto_1.NotificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, notification_dto_1.MarkAsReadDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('user/:userId/mark-all-read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark all notifications as read for a user',
        description: 'Marks all notifications as read for the specified user.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All notifications marked as read',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a notification',
        description: 'Permanently deletes a specific notification.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Post)('user/:userId/bulk-action'),
    (0, swagger_1.ApiOperation)({
        summary: 'Perform bulk actions on notifications',
        description: 'Performs bulk actions (mark as read, delete) on multiple notifications.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bulk action completed successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                processed: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid bulk action data' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, notification_dto_1.BulkActionDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "performBulkAction", null);
__decorate([
    (0, common_1.Get)('user/:userId/live'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get live notification updates (SSE)',
        description: 'Server-Sent Events endpoint for real-time notification updates.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getLiveNotifications", null);
__decorate([
    (0, common_1.Post)('admin/broadcast'),
    (0, swagger_1.ApiOperation)({
        summary: 'Broadcast notification to multiple users (Admin only)',
        description: 'Sends a notification to multiple users at once.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Broadcast completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "broadcastNotification", null);
__decorate([
    (0, common_1.Get)('admin/analytics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get notification analytics (Admin only)',
        description: 'Returns analytics data about notifications system-wide.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationAnalytics", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map