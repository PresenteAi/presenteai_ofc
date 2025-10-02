import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersRepository {
    private readonly repository;
    constructor(repository: Repository<User>);
    create(user: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
}
