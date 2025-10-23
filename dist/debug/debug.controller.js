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
exports.DebugController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const users_service_1 = require("../users/users/users.service");
let DebugController = class DebugController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAllUsers() {
        try {
            const users = await this.usersService.findAll({ page: 1, limit: 100 });
            return {
                success: true,
                count: users.data.length,
                users: users.data
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
    async testFindUser() {
        try {
            const user = await this.usersService.findById(1);
            return {
                success: true,
                user
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
    async createTestUser() {
        try {
            const user = await this.usersService.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'TestPass123!'
            });
            return {
                success: true,
                user
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
};
exports.DebugController = DebugController;
__decorate([
    (0, common_1.Get)('users'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os usuários (debug)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('test-find-user'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Testa buscar usuário por ID' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "testFindUser", null);
__decorate([
    (0, common_1.Post)('create-test-user'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cria um usuário de teste' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "createTestUser", null);
exports.DebugController = DebugController = __decorate([
    (0, swagger_1.ApiTags)('debug'),
    (0, common_1.Controller)('debug'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], DebugController);
//# sourceMappingURL=debug.controller.js.map