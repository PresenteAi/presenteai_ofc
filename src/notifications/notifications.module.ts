import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationDeliveryService } from './services/notification-delivery.service';
import { EmailNotificationProvider } from './providers/email-notification.provider';
import { PushNotificationProvider } from './providers/push-notification.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationRepository,
    NotificationDeliveryService,
    EmailNotificationProvider,
    PushNotificationProvider,
  ],
  exports: [
    NotificationsService,
    NotificationDeliveryService,
  ],
})
export class NotificationsModule {}
