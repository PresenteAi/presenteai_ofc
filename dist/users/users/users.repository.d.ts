import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationDto } from './dto/pagination.dto';
export declare class UsersRepository {
    private readonly repository;
    constructor(repository: Repository<User>);
    create(user: Partial<User>): Promise<User>;
    findAll(paginationDto: PaginationDto): Promise<{
        users: User[];
        total: number;
    }>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithPassword(email: string): Promise<User | null>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    softDelete(id: string): Promise<void>;
    updateLastLogin(id: string): Promise<void>;
    countActiveUsers(): Promise<number>;
    exists(id: string): Promise<boolean>;
}
