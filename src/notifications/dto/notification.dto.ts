import { IsEnum, IsString, IsNumber, IsBoolean, IsOptional, IsObject, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType, DeliveryMethod, NotificationPriority } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID of the user who will receive the notification' })
  @IsNumber()
  userId: number;

  @ApiPropertyOptional({ description: 'Related event ID' })
  @IsOptional()
  @IsNumber()
  eventId?: number;

  @ApiPropertyOptional({ description: 'Related contribution ID' })
  @IsOptional()
  @IsNumber()
  contributionId?: number;

  @ApiPropertyOptional({ description: 'Related withdrawal ID' })
  @IsOptional()
  @IsNumber()
  withdrawalId?: number;

  @ApiPropertyOptional({ description: 'Related transaction ID' })
  @IsOptional()
  @IsNumber()
  transactionId?: number;

  @ApiProperty({ 
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.PAYMENT
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ 
    description: 'Notification title',
    example: 'Payment Received'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    description: 'Notification message',
    example: 'You received a new contribution of $50.00 for your event'
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({ 
    description: 'How the notification should be delivered',
    enum: DeliveryMethod,
    default: DeliveryMethod.IN_APP
  })
  @IsOptional()
  @IsEnum(DeliveryMethod)
  deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional({ 
    description: 'Priority of the notification',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiPropertyOptional({ 
    description: 'When the notification expires (ISO 8601 format)',
    example: '2024-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ 
    description: 'Additional metadata for the notification'
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Template ID for structured notifications'
  })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({ 
    description: 'Data for template rendering'
  })
  @IsOptional()
  @IsObject()
  templateData?: Record<string, any>;
}

export class NotificationFiltersDto {
  @ApiPropertyOptional({ 
    description: 'Filter by read status',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter by notification type',
    enum: NotificationType
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ 
    description: 'Filter by priority',
    enum: NotificationPriority
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiPropertyOptional({ 
    description: 'Start date for filtering (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'End date for filtering (ISO 8601)',
    example: '2024-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Number of notifications per page',
    default: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ 
    description: 'Number of notifications to skip',
    default: 0,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({ 
    description: 'Sort by field',
    enum: ['createdAt', 'updatedAt', 'priority'],
    default: 'createdAt'
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'updatedAt' | 'priority';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC'
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}

export class MarkAsReadDto {
  @ApiProperty({ 
    description: 'Whether to mark as read or unread',
    example: true,
    default: true
  })
  @IsBoolean()
  isRead: boolean;
}

export class BulkActionDto {
  @ApiProperty({ 
    description: 'Array of notification IDs to perform action on',
    example: [1, 2, 3, 4, 5]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  notificationIds: number[];

  @ApiProperty({ 
    description: 'Action to perform',
    enum: ['markAsRead', 'delete'],
    example: 'markAsRead'
  })
  @IsEnum(['markAsRead', 'delete'])
  action: 'markAsRead' | 'delete';
}

export class NotificationResponseDto {
  @ApiProperty({ description: 'Notification ID' })
  id: number;

  @ApiProperty({ description: 'User ID' })
  userId: number;

  @ApiProperty({ description: 'Event ID', required: false })
  eventId?: number;

  @ApiProperty({ description: 'Contribution ID', required: false })
  contributionId?: number;

  @ApiProperty({ description: 'Withdrawal ID', required: false })
  withdrawalId?: number;

  @ApiProperty({ description: 'Transaction ID', required: false })
  transactionId?: number;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty({ description: 'Notification title' })
  title: string;

  @ApiProperty({ description: 'Notification message' })
  message: string;

  @ApiProperty({ description: 'Read status' })
  isRead: boolean;

  @ApiProperty({ enum: DeliveryMethod })
  deliveryMethod: DeliveryMethod;

  @ApiProperty({ enum: NotificationPriority })
  priority: NotificationPriority;

  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class NotificationStatsDto {
  @ApiProperty({ description: 'Total notifications' })
  total: number;

  @ApiProperty({ description: 'Unread notifications' })
  unread: number;

  @ApiProperty({ description: 'Notifications by type' })
  byType: Record<string, number>;

  @ApiProperty({ description: 'Recent notifications (last 7 days)' })
  recent: number;
}