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
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithPassword(email: string): Promise<User | null>;
    update(id: number, updateData: Partial<User>): Promise<User>;
    softDelete(id: number): Promise<void>;
    updateLastLogin(id: number): Promise<void>;
    countActiveUsers(): Promise<number>;
    exists(id: number): Promise<boolean>;
}
