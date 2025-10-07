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
      // host: process.env.MYSQL_HOST,
      host: '172.17.80.1',
      port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
      username: 'root',
      password: 'familia100',
      database: 'presenteai',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // ⚠️ CUIDADO: Use apenas em desenvolvimento!
      logging: true, // Para ver as queries SQL sendo executadas
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

