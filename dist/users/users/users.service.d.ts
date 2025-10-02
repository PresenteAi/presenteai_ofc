import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.input.dto';
import { UserOutputDto } from './dto/default.output.dto';
export declare class UsersService {
    private readonly repository;
    constructor(repository: UsersRepository);
    create(dto: CreateUserDto): Promise<UserOutputDto>;
    findAll(): Promise<UserOutputDto[]>;
    findById(id: string): Promise<UserOutputDto>;
}
