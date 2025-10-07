import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { GiftsModule } from './gifts/gifts.module';
import { ContributionsModule } from './contributions/contributions.module';
import { PaymentsModule } from './payments/payments.module';
import { InvitesModule } from './invites/invites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DebugModule } from './debug/debug.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.MYSQL_HOST,
      host: '172.17.80.1',
      port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
      username: 'root',
      password: 'familia100',
      database: 'presenteai',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // ⚠️ CUIDADO: Use apenas em desenvolvimento!
      logging: false, // Desabilitado para reduzir logs no console
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    GiftsModule,
    ContributionsModule,
    PaymentsModule,
    InvitesModule,
    NotificationsModule,
    DebugModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }

