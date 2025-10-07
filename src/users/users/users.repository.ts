import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) { }

    /**
     * Cria um novo usuário após verificar se o email não existe
     */
    async create(user: Partial<User>): Promise<User> {
        try {
            // Verificar se o email já existe
            const existingUser = await this.repository.findOne({ 
                where: { email: user.email } 
            });

            if (existingUser) {
                throw new ConflictException('Email already exists');
            }

            const entity = this.repository.create(user);
            return await this.repository.save(entity);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Failed to create user');
        }
    }

    /**
     * Busca todos os usuários com paginação e filtros
     */
    async findAll(paginationDto: PaginationDto): Promise<{ users: User[]; total: number }> {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search } = paginationDto;
        
        // Validação de parâmetros
        const validSortFields = ['name', 'email', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        
        const where: any = { isActive: true }; // Só buscar usuários ativos por padrão
        
        if (search) {
            where.name = ILike(`%${search}%`);
        }

        const findOptions: FindManyOptions<User> = {
            where,
            order: { [sortField]: order },
            skip: (page - 1) * limit,
            take: Math.min(limit, 100), // Limita a 100 itens por página
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                isIndicated: true,
                indicatedById: true,
                createdAt: true,
                updatedAt: true,
                lastLoginAt: true,
                // Excluir passwordHash por segurança
            }
        };

        const [users, total] = await this.repository.findAndCount(findOptions);
        return { users, total };
    }

    /**
     * Busca usuário por ID (apenas ativos)
     */
    async findById(id: number): Promise<User> {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.repository.findOne({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        
        return user;
    }

    /**
     * Busca usuário por email (para autenticação)
     */
    async findByEmail(email: string): Promise<User | null> {
        if (!email || typeof email !== 'string') {
            return null;
        }

        return await this.repository.findOne({ 
            where: { email: email.toLowerCase().trim(), isActive: true }
        });
    }

    /**
     * Busca usuário por email incluindo senha (para login)
     */
    async findByEmailWithPassword(email: string): Promise<User | null> {
        if (!email || typeof email !== 'string') {
            return null;
        }

        return await this.repository.findOne({ 
            where: { email: email.toLowerCase().trim(), isActive: true }
        });
    }

    /**
     * Atualiza um usuário
     */
    async update(id: number, updateData: Partial<User>): Promise<User> {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new BadRequestException('Invalid user ID');
        }

        // Verificar se o usuário existe
        const existingUser = await this.findById(id);
        
        // Se está atualizando email, verificar se não existe outro usuário com este email
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await this.repository.findOne({
                where: { email: updateData.email.toLowerCase().trim() }
            });
            
            if (emailExists && emailExists.id !== id) {
                throw new ConflictException('Email already exists');
            }

            updateData.email = updateData.email.toLowerCase().trim();
        }

        // Atualizar updatedAt
        updateData.updatedAt = new Date();

        try {
            await this.repository.update(id, updateData);
            return await this.findById(id);
        } catch (error) {
            throw new BadRequestException('Failed to update user');
        }
    }

    /**
     * Soft delete - desativa o usuário ao invés de deletar
     */
    async softDelete(id: number): Promise<void> {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.findById(id);
        
        await this.repository.update(id, { 
            isActive: false,
            updatedAt: new Date()
        });
    }

    /**
     * Atualiza o último login
     */
    async updateLastLogin(id: number): Promise<void> {
        if (!id || typeof id !== 'number' || id <= 0) {
            return;
        }

        await this.repository.update(id, {
            lastLoginAt: new Date(),
            updatedAt: new Date()
        });
    }

    /**
     * Conta usuários ativos
     */
    async countActiveUsers(): Promise<number> {
        return await this.repository.count({ where: { isActive: true } });
    }

    /**
     * Verifica se um usuário existe pelo ID
     */
    async exists(id: number): Promise<boolean> {
        if (!id || typeof id !== 'number' || id <= 0) {
            return false;
        }

        const count = await this.repository.count({ 
            where: { id, isActive: true } 
        });
        return count > 0;
    }
}
