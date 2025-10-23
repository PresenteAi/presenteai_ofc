"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_entity_1 = require("./entities/notification.entity");
const notifications_controller_1 = require("./controllers/notifications.controller");
const notifications_service_1 = require("./services/notifications.service");
const notification_repository_1 = require("./repositories/notification.repository");
const notification_delivery_service_1 = require("./services/notification-delivery.service");
const email_notification_provider_1 = require("./providers/email-notification.provider");
const push_notification_provider_1 = require("./providers/push-notification.provider");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification]),
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notifications_service_1.NotificationsService,
            notification_repository_1.NotificationRepository,
            notification_delivery_service_1.NotificationDeliveryService,
            email_notification_provider_1.EmailNotificationProvider,
            push_notification_provider_1.PushNotificationProvider,
        ],
        exports: [
            notifications_service_1.NotificationsService,
            notification_delivery_service_1.NotificationDeliveryService,
        ],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map