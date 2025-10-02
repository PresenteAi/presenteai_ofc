import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.input.dto';
import { UserOutputDto } from './dto/default.output.dto';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    create(dto: CreateUserDto): Promise<UserOutputDto>;
    findAll(): Promise<UserOutputDto[]>;
    findById(id: string): Promise<UserOutputDto>;
}
