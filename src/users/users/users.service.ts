import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import * as bcrypt from 'bcrypt';
import { UserOutputDto } from './dto/default.output.dto';

@Injectable()
export class UsersService {
    private readonly SALT_ROUNDS = 12; // Aumento da segurança do hash
    private readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(private readonly repository: UsersRepository) { }

    /**
     * Cria um novo usuário com validações de segurança
     */
    async create(dto: CreateUserDto): Promise<UserOutputDto> {
        // Validações de entrada
        await this.validateCreateUserDto(dto);

        try {
            // Hash da senha com salt rounds altos
            const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
            
            // Preparar dados do usuário
            const userData = {
                name: dto.name.trim(),
                email: dto.email.toLowerCase().trim(),
                passwordHash,
                isActive: true,
                isIndicated: !!dto.indicatedById,
                indicatedById: dto.indicatedById || undefined,
            };

            const user = await this.repository.create(userData);
            return this.mapToOutputDto(user);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Failed to create user');
        }
    }

    /**
     * Busca todos os usuários com paginação
     */
    async findAll(paginationDto: PaginationDto): Promise<PaginatedUsersDto> {
        // Sanitizar parâmetros de paginação
        const sanitizedPagination = this.sanitizePaginationDto(paginationDto);
        
        const { users, total } = await this.repository.findAll(sanitizedPagination);
        
        const totalPages = Math.ceil(total / (sanitizedPagination.limit || 10));
        const hasNext = (sanitizedPagination.page || 1) < totalPages;
        const hasPrev = (sanitizedPagination.page || 1) > 1;

        return {
            data: users.map(user => this.mapToOutputDto(user)),
            total,
            page: sanitizedPagination.page || 1,
            limit: sanitizedPagination.limit || 10,
            totalPages,
            hasNext,
            hasPrev
        };
    }

    /**
     * Busca usuário por ID
     */
    async findById(id: string): Promise<UserOutputDto> {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.repository.findById(id.trim());
        return this.mapToOutputDto(user);
    }

    /**
     * Atualiza um usuário
     */
    async update(id: string, updateDto: UpdateUserDto): Promise<UserOutputDto> {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new BadRequestException('Invalid user ID');
        }

        // Validar dados de atualização
        await this.validateUpdateUserDto(updateDto);

        const updateData: any = {};

        if (updateDto.name !== undefined) {
            updateData.name = updateDto.name.trim();
        }

        if (updateDto.email !== undefined) {
            updateData.email = updateDto.email.toLowerCase().trim();
        }

        if (updateDto.password !== undefined) {
            updateData.passwordHash = await bcrypt.hash(updateDto.password, this.SALT_ROUNDS);
        }

        if (updateDto.isActive !== undefined) {
            updateData.isActive = updateDto.isActive;
        }

        if (updateDto.indicatedById !== undefined) {
            updateData.indicatedById = updateDto.indicatedById;
            updateData.isIndicated = !!updateDto.indicatedById;
        }

        const updatedUser = await this.repository.update(id.trim(), updateData);
        return this.mapToOutputDto(updatedUser);
    }

    /**
     * Remove usuário (soft delete)
     */
    async remove(id: string): Promise<void> {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new BadRequestException('Invalid user ID');
        }

        await this.repository.softDelete(id.trim());
    }

    /**
     * Verifica se um usuário existe pelo email
     */
    async findByEmail(email: string): Promise<UserOutputDto | null> {
        if (!email || typeof email !== 'string') {
            return null;
        }

        const user = await this.repository.findByEmail(email.toLowerCase().trim());
        return user ? this.mapToOutputDto(user) : null;
    }

    /**
     * Atualiza o último login do usuário
     */
    async updateLastLogin(id: string): Promise<void> {
        if (!id || typeof id !== 'string') {
            return;
        }

        await this.repository.updateLastLogin(id.trim());
    }

    /**
     * Valida senha para login
     */
    async validatePassword(email: string, password: string): Promise<UserOutputDto | null> {
        if (!email || !password) {
            return null;
        }

        const user = await this.repository.findByEmailWithPassword(email.toLowerCase().trim());
        if (!user) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return null;
        }

        // Atualizar último login
        await this.updateLastLogin(user.id);

        return this.mapToOutputDto(user);
    }

    /**
     * Conta usuários ativos
     */
    async countActiveUsers(): Promise<number> {
        return await this.repository.countActiveUsers();
    }

    // ========== MÉTODOS PRIVADOS DE VALIDAÇÃO ==========

    private async validateCreateUserDto(dto: CreateUserDto): Promise<void> {
        const errors: string[] = [];

        // Validar nome
        if (!dto.name || typeof dto.name !== 'string') {
            errors.push('Name is required');
        } else if (dto.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        } else if (dto.name.trim().length > 300) {
            errors.push('Name must not exceed 300 characters');
        }

        // Validar email
        if (!dto.email || typeof dto.email !== 'string') {
            errors.push('Email is required');
        } else if (!this.EMAIL_REGEX.test(dto.email.trim())) {
            errors.push('Please provide a valid email address');
        } else if (dto.email.trim().length > 150) {
            errors.push('Email must not exceed 150 characters');
        }

        // Validar senha
        if (!dto.password || typeof dto.password !== 'string') {
            errors.push('Password is required');
        } else if (!this.PASSWORD_REGEX.test(dto.password)) {
            errors.push('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
        } else if (dto.password.length > 255) {
            errors.push('Password must not exceed 255 characters');
        }

        // Validar indicatedById
        if (dto.indicatedById !== undefined && dto.indicatedById !== null) {
            if (typeof dto.indicatedById !== 'number' || dto.indicatedById <= 0) {
                errors.push('IndicatedById must be a valid positive number');
            }
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors.join(', '));
        }
    }

    private async validateUpdateUserDto(dto: UpdateUserDto): Promise<void> {
        const errors: string[] = [];

        // Validar nome se fornecido
        if (dto.name !== undefined) {
            if (typeof dto.name !== 'string') {
                errors.push('Name must be a string');
            } else if (dto.name.trim().length < 2) {
                errors.push('Name must be at least 2 characters long');
            } else if (dto.name.trim().length > 300) {
                errors.push('Name must not exceed 300 characters');
            }
        }

        // Validar email se fornecido
        if (dto.email !== undefined) {
            if (typeof dto.email !== 'string') {
                errors.push('Email must be a string');
            } else if (!this.EMAIL_REGEX.test(dto.email.trim())) {
                errors.push('Please provide a valid email address');
            } else if (dto.email.trim().length > 150) {
                errors.push('Email must not exceed 150 characters');
            }
        }

        // Validar senha se fornecida
        if (dto.password !== undefined) {
            if (typeof dto.password !== 'string') {
                errors.push('Password must be a string');
            } else if (!this.PASSWORD_REGEX.test(dto.password)) {
                errors.push('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
            } else if (dto.password.length > 255) {
                errors.push('Password must not exceed 255 characters');
            }
        }

        // Validar isActive se fornecido
        if (dto.isActive !== undefined && typeof dto.isActive !== 'boolean') {
            errors.push('isActive must be a boolean');
        }

        // Validar indicatedById se fornecido
        if (dto.indicatedById !== undefined && dto.indicatedById !== null) {
            if (typeof dto.indicatedById !== 'number' || dto.indicatedById <= 0) {
                errors.push('IndicatedById must be a valid positive number');
            }
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors.join(', '));
        }
    }

    private sanitizePaginationDto(dto: PaginationDto): PaginationDto {
        return {
            page: Math.max(1, dto.page || 1),
            limit: Math.min(100, Math.max(1, dto.limit || 10)),
            sortBy: ['name', 'email', 'createdAt', 'updatedAt'].includes(dto.sortBy || '') ? dto.sortBy : 'createdAt',
            sortOrder: dto.sortOrder === 'ASC' ? 'ASC' : 'DESC',
            search: dto.search ? dto.search.trim() : undefined
        };
    }

    private mapToOutputDto(user: any): UserOutputDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            isIndicated: user.isIndicated,
            indicatedById: user.indicatedById,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt
        };
    }
}
