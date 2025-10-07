import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { UserOutputDto } from './dto/default.output.dto';
export declare class UsersService {
    private readonly repository;
    private readonly SALT_ROUNDS;
    private readonly PASSWORD_REGEX;
    private readonly EMAIL_REGEX;
    constructor(repository: UsersRepository);
    create(dto: CreateUserDto): Promise<UserOutputDto>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedUsersDto>;
    findById(id: number): Promise<UserOutputDto>;
    update(id: number, updateDto: UpdateUserDto): Promise<UserOutputDto>;
    remove(id: number): Promise<void>;
    findByEmail(email: string): Promise<UserOutputDto | null>;
    updateLastLogin(id: number): Promise<void>;
    validatePassword(email: string, password: string): Promise<UserOutputDto | null>;
    countActiveUsers(): Promise<number>;
    private validateCreateUserDto;
    private validateUpdateUserDto;
    private sanitizePaginationDto;
    private mapToOutputDto;
}
