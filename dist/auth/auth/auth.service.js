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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../../users/users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        await this.validateLoginDto(loginDto);
        const user = await this.usersService.validatePassword(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            tokenType: 'bearer',
            expiresIn: 3600,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
    async validateLoginDto(dto) {
        const errors = [];
        if (!dto.email || typeof dto.email !== 'string') {
            errors.push('Email is required and must be a string');
        }
        else {
            const email = dto.email.trim().toLowerCase();
            if (!email) {
                errors.push('Email cannot be empty');
            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push('Invalid email format');
            }
            dto.email = email;
        }
        if (!dto.password || typeof dto.password !== 'string') {
            errors.push('Password is required and must be a string');
        }
        else if (dto.password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map