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
    findById(id: string): Promise<UserOutputDto>;
    update(id: string, updateDto: UpdateUserDto): Promise<UserOutputDto>;
    remove(id: string): Promise<void>;
    findByEmail(email: string): Promise<UserOutputDto | null>;
    updateLastLogin(id: string): Promise<void>;
    validatePassword(email: string, password: string): Promise<UserOutputDto | null>;
    countActiveUsers(): Promise<number>;
    private validateCreateUserDto;
    private validateUpdateUserDto;
    private sanitizePaginationDto;
    private mapToOutputDto;
}
