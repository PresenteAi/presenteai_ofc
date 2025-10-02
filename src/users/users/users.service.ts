// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.input.dto';
import * as bcrypt from 'bcrypt';
import { UserOutputDto } from './dto/default.output.dto';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository) { }

    async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    }

     async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    }
     async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    } async create(dto: CreateUserDto): Promise<UserOutputDto> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.repository.findAll();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
        }));
    }

    async findById(id: string): Promise<UserOutputDto> {
        const result = await this.repository.findById(id);

        if (!result) {
             throw new NotFoundException(`User with id ${id} not found`);
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        };
    }
}
