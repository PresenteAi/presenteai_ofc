import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from '../services/notifications.service';
import {
  CreateNotificationDto,
  NotificationFiltersDto,
  MarkAsReadDto,
  BulkActionDto,
  NotificationResponseDto,
  NotificationStatsDto,
} from '../dto/notification.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new notification (Admin only)',
    description: 'Creates a new notification manually. Typically used for system announcements.',
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid notification data' })
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get notifications for a user',
    description: 'Retrieves paginated notifications for a specific user with optional filtering.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'isRead', required: false, description: 'Filter by read status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by notification type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of notifications per page' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number to skip' })
  @ApiResponse({
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
  })
  async getUserNotifications(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() filters: NotificationFiltersDto,
    @CurrentUser() currentUser: any
  ) {
    // In a real app, you'd check if currentUser can access userId's notifications
    // For now, assuming users can only access their own notifications
    if (currentUser.userId !== userId) {
      // Only allow if admin or same user
      throw new Error('Access denied');
    }

    return this.notificationsService.getUserNotifications(userId, filters);
  }

  @Get('user/:userId/stats')
  @ApiOperation({
    summary: 'Get notification statistics for a user',
    description: 'Returns statistics about notifications for a specific user.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: NotificationStatsDto,
  })
  async getUserNotificationStats(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: any
  ): Promise<NotificationStatsDto> {
    // Check access permissions
    if (currentUser.userId !== userId) {
      throw new Error('Access denied');
    }

    return this.notificationsService.getUserNotificationStats(userId);
  }

  @Get('user/:userId/unread-count')
  @ApiOperation({
    summary: 'Get unread notification count for a user',
    description: 'Returns the number of unread notifications for a user.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
  })
  async getUnreadCount(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: any
  ) {
    // Check access permissions
    if (currentUser.userId !== userId) {
      throw new Error('Access denied');
    }

    return this.notificationsService.getUnreadCount(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific notification',
    description: 'Retrieves a single notification by ID.',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async getNotification(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.getNotificationById(id, currentUser.userId);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark notification as read/unread',
    description: 'Updates the read status of a specific notification.',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification status updated successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Body() markAsReadDto: MarkAsReadDto,
    @CurrentUser() currentUser: any
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markAsRead(
      id,
      currentUser.userId,
      markAsReadDto.isRead
    );
  }

  @Patch('user/:userId/mark-all-read')
  @ApiOperation({
    summary: 'Mark all notifications as read for a user',
    description: 'Marks all notifications as read for the specified user.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async markAllAsRead(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: any
  ) {
    // Check access permissions
    if (currentUser.userId !== userId) {
      throw new Error('Access denied');
    }

    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a notification',
    description: 'Permanently deletes a specific notification.',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async deleteNotification(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ) {
    return this.notificationsService.deleteNotification(id, currentUser.userId);
  }

  @Post('user/:userId/bulk-action')
  @ApiOperation({
    summary: 'Perform bulk actions on notifications',
    description: 'Performs bulk actions (mark as read, delete) on multiple notifications.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 400, description: 'Invalid bulk action data' })
  async performBulkAction(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() bulkActionDto: BulkActionDto,
    @CurrentUser() currentUser: any
  ) {
    // Check access permissions
    if (currentUser.userId !== userId) {
      throw new Error('Access denied');
    }

    return this.notificationsService.performBulkAction(
      userId,
      bulkActionDto.notificationIds,
      bulkActionDto.action
    );
  }

  // ============ WebSocket / Real-time endpoints ============

  @Get('user/:userId/live')
  @ApiOperation({
    summary: 'Get live notification updates (SSE)',
    description: 'Server-Sent Events endpoint for real-time notification updates.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getLiveNotifications(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: any
  ) {
    // Check access permissions
    if (currentUser.userId !== userId) {
      throw new Error('Access denied');
    }

    // TODO: Implement SSE for real-time notifications
    // This would typically return a stream of notifications
    return { message: 'SSE endpoint - implementation pending' };
  }

  // ============ Admin endpoints ============

  @Post('admin/broadcast')
  @ApiOperation({
    summary: 'Broadcast notification to multiple users (Admin only)',
    description: 'Sends a notification to multiple users at once.',
  })
  @ApiResponse({ status: 201, description: 'Broadcast completed successfully' })
  async broadcastNotification(
    @Body() broadcastDto: {
      userIds: number[];
      title: string;
      message: string;
      type: string;
      priority?: string;
    }
  ) {
    // TODO: Implement admin broadcast functionality
    // This would create notifications for multiple users
    return { message: 'Broadcast functionality - implementation pending' };
  }

  @Get('admin/analytics')
  @ApiOperation({
    summary: 'Get notification analytics (Admin only)',
    description: 'Returns analytics data about notifications system-wide.',
  })
  async getNotificationAnalytics() {
    // TODO: Implement analytics endpoint
    return { message: 'Analytics endpoint - implementation pending' };
  }
}