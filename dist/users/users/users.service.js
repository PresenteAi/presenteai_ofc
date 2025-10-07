"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    repository;
    SALT_ROUNDS = 12;
    PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        await this.validateCreateUserDto(dto);
        try {
            const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
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
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create user');
        }
    }
    async findAll(paginationDto) {
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
    async findById(id) {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.repository.findById(id.trim());
        return this.mapToOutputDto(user);
    }
    async update(id, updateDto) {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        await this.validateUpdateUserDto(updateDto);
        const updateData = {};
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
    async remove(id) {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        await this.repository.softDelete(id.trim());
    }
    async findByEmail(email) {
        if (!email || typeof email !== 'string') {
            return null;
        }
        const user = await this.repository.findByEmail(email.toLowerCase().trim());
        return user ? this.mapToOutputDto(user) : null;
    }
    async updateLastLogin(id) {
        if (!id || typeof id !== 'string') {
            return;
        }
        await this.repository.updateLastLogin(id.trim());
    }
    async validatePassword(email, password) {
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
        await this.updateLastLogin(user.id);
        return this.mapToOutputDto(user);
    }
    async countActiveUsers() {
        return await this.repository.countActiveUsers();
    }
    async validateCreateUserDto(dto) {
        const errors = [];
        if (!dto.name || typeof dto.name !== 'string') {
            errors.push('Name is required');
        }
        else if (dto.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        else if (dto.name.trim().length > 300) {
            errors.push('Name must not exceed 300 characters');
        }
        if (!dto.email || typeof dto.email !== 'string') {
            errors.push('Email is required');
        }
        else if (!this.EMAIL_REGEX.test(dto.email.trim())) {
            errors.push('Please provide a valid email address');
        }
        else if (dto.email.trim().length > 150) {
            errors.push('Email must not exceed 150 characters');
        }
        if (!dto.password || typeof dto.password !== 'string') {
            errors.push('Password is required');
        }
        else if (!this.PASSWORD_REGEX.test(dto.password)) {
            errors.push('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
        }
        else if (dto.password.length > 255) {
            errors.push('Password must not exceed 255 characters');
        }
        if (dto.indicatedById !== undefined && dto.indicatedById !== null) {
            if (typeof dto.indicatedById !== 'number' || dto.indicatedById <= 0) {
                errors.push('IndicatedById must be a valid positive number');
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join(', '));
        }
    }
    async validateUpdateUserDto(dto) {
        const errors = [];
        if (dto.name !== undefined) {
            if (typeof dto.name !== 'string') {
                errors.push('Name must be a string');
            }
            else if (dto.name.trim().length < 2) {
                errors.push('Name must be at least 2 characters long');
            }
            else if (dto.name.trim().length > 300) {
                errors.push('Name must not exceed 300 characters');
            }
        }
        if (dto.email !== undefined) {
            if (typeof dto.email !== 'string') {
                errors.push('Email must be a string');
            }
            else if (!this.EMAIL_REGEX.test(dto.email.trim())) {
                errors.push('Please provide a valid email address');
            }
            else if (dto.email.trim().length > 150) {
                errors.push('Email must not exceed 150 characters');
            }
        }
        if (dto.password !== undefined) {
            if (typeof dto.password !== 'string') {
                errors.push('Password must be a string');
            }
            else if (!this.PASSWORD_REGEX.test(dto.password)) {
                errors.push('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
            }
            else if (dto.password.length > 255) {
                errors.push('Password must not exceed 255 characters');
            }
        }
        if (dto.isActive !== undefined && typeof dto.isActive !== 'boolean') {
            errors.push('isActive must be a boolean');
        }
        if (dto.indicatedById !== undefined && dto.indicatedById !== null) {
            if (typeof dto.indicatedById !== 'number' || dto.indicatedById <= 0) {
                errors.push('IndicatedById must be a valid positive number');
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join(', '));
        }
    }
    sanitizePaginationDto(dto) {
        return {
            page: Math.max(1, dto.page || 1),
            limit: Math.min(100, Math.max(1, dto.limit || 10)),
            sortBy: ['name', 'email', 'createdAt', 'updatedAt'].includes(dto.sortBy || '') ? dto.sortBy : 'createdAt',
            sortOrder: dto.sortOrder === 'ASC' ? 'ASC' : 'DESC',
            search: dto.search ? dto.search.trim() : undefined
        };
    }
    mapToOutputDto(user) {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map