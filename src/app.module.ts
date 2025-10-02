import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
      username: process.env.MYSQL_USER,
      // password: process.env.MYSQL_PASSWORD,
      password: "familia100",
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, 
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    GiftsModule,
    ContributionsModule,
    PaymentsModule,
    InvitesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

