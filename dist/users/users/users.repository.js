"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
let UsersRepository = class UsersRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(user) {
        try {
            const existingUser = await this.repository.findOne({
                where: { email: user.email }
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
            const entity = this.repository.create(user);
            return await this.repository.save(entity);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create user');
        }
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search } = paginationDto;
        const validSortFields = ['name', 'email', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
        const where = { isActive: true };
        if (search) {
            where.name = (0, typeorm_1.ILike)(`%${search}%`);
        }
        const findOptions = {
            where,
            order: { [sortField]: order },
            skip: (page - 1) * limit,
            take: Math.min(limit, 100),
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
            }
        };
        const [users, total] = await this.repository.findAndCount(findOptions);
        return { users, total };
    }
    async findById(id) {
        if (!id || typeof id !== 'string') {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.repository.findOne({
            where: { id, isActive: true },
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
            }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        if (!email || typeof email !== 'string') {
            return null;
        }
        return await this.repository.findOne({
            where: { email: email.toLowerCase().trim(), isActive: true }
        });
    }
    async findByEmailWithPassword(email) {
        if (!email || typeof email !== 'string') {
            return null;
        }
        return await this.repository.findOne({
            where: { email: email.toLowerCase().trim(), isActive: true }
        });
    }
    async update(id, updateData) {
        if (!id || typeof id !== 'string') {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const existingUser = await this.findById(id);
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await this.repository.findOne({
                where: { email: updateData.email.toLowerCase().trim() }
            });
            if (emailExists && emailExists.id !== id) {
                throw new common_1.ConflictException('Email already exists');
            }
            updateData.email = updateData.email.toLowerCase().trim();
        }
        updateData.updatedAt = new Date();
        try {
            await this.repository.update(id, updateData);
            return await this.findById(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update user');
        }
    }
    async softDelete(id) {
        if (!id || typeof id !== 'string') {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.findById(id);
        await this.repository.update(id, {
            isActive: false,
            updatedAt: new Date()
        });
    }
    async updateLastLogin(id) {
        if (!id || typeof id !== 'string') {
            return;
        }
        await this.repository.update(id, {
            lastLoginAt: new Date(),
            updatedAt: new Date()
        });
    }
    async countActiveUsers() {
        return await this.repository.count({ where: { isActive: true } });
    }
    async exists(id) {
        if (!id || typeof id !== 'string') {
            return false;
        }
        const count = await this.repository.count({
            where: { id, isActive: true }
        });
        return count > 0;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map