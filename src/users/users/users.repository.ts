import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) { }

    create(user: Partial<User>): Promise<User> {
        const entity = this.repository.create(user);
        return this.repository.save(entity);
    }

    findAll(): Promise<User[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }


    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOneBy({ email});
        if (!user) throw new NotFoundException(`User with email ${email} not found`);
        return user;
    }
}
