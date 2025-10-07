import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { UserOutputDto } from './dto/default.output.dto';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    create(dto: CreateUserDto): Promise<UserOutputDto>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedUsersDto>;
    findById(id: number): Promise<UserOutputDto>;
    update(id: number, updateDto: UpdateUserDto): Promise<UserOutputDto>;
    remove(id: number): Promise<void>;
    findByEmail(email: string): Promise<UserOutputDto | null>;
    countActiveUsers(): Promise<{
        count: number;
    }>;
}
