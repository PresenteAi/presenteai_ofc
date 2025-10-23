"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const events_module_1 = require("./events/events.module");
const gifts_module_1 = require("./gifts/gifts.module");
const contributions_module_1 = require("./contributions/contributions-module");
const payments_module_1 = require("./payments/payments.module");
const transactions_module_1 = require("./transactions/transactions.module");
const withdrawals_module_1 = require("./withdrawals/withdrawals.module");
const invites_module_1 = require("./invites/invites.module");
const notifications_module_1 = require("./notifications/notifications.module");
const debug_module_1 = require("./debug/debug.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: '172.17.80.1',
                port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
                username: 'root',
                password: 'familia100',
                database: 'presenteai',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                logging: false,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            events_module_1.EventsModule,
            gifts_module_1.GiftsModule,
            contributions_module_1.ContributionsModule,
            payments_module_1.PaymentsModule,
            transactions_module_1.TransactionsModule,
            withdrawals_module_1.WithdrawalsModule,
            invites_module_1.InvitesModule,
            notifications_module_1.NotificationsModule,
            debug_module_1.DebugModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map