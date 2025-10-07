import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository], // Exporta também o repository para outros módulos
})
export class UsersModule {}
