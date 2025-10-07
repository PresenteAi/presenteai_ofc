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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const paginated_users_dto_1 = require("./dto/paginated-users.dto");
const default_output_dto_1 = require("./dto/default.output.dto");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        return this.service.create(dto);
    }
    async findAll(paginationDto) {
        return this.service.findAll(paginationDto);
    }
    async findById(id) {
        return this.service.findById(id);
    }
    async update(id, updateDto) {
        return this.service.update(id, updateDto);
    }
    async remove(id) {
        return this.service.remove(id);
    }
    async findByEmail(email) {
        return this.service.findByEmail(email);
    }
    async countActiveUsers() {
        const count = await this.service.countActiveUsers();
        return { count };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new user',
        description: 'Creates a new user with encrypted password and validation checks'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created successfully',
        type: default_output_dto_1.UserOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or validation failed'
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Email already exists'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users with pagination',
        description: 'Retrieves a paginated list of users with optional search and sorting'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users retrieved successfully',
        type: paginated_users_dto_1.PaginatedUsersDto
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Field to sort by', enum: ['name', 'email', 'createdAt', 'updatedAt'] }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term for name or email' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user by ID',
        description: 'Retrieves a specific user by their unique identifier'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User found successfully',
        type: default_output_dto_1.UserOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid UUID format'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'User not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user',
        description: 'Updates user information. Only provided fields will be updated.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User updated successfully',
        type: default_output_dto_1.UserOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or UUID format'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'User not found'
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Email already exists'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove user',
        description: 'Deactivates a user (soft delete). The user will be marked as inactive instead of being permanently deleted.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'User deactivated successfully'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid UUID format'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'User not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user by email',
        description: 'Retrieves a user by their email address'
    }),
    (0, swagger_1.ApiParam)({ name: 'email', description: 'User email address' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User found successfully',
        type: default_output_dto_1.UserOutputDto
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'User not found'
    }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('stats/count'),
    (0, swagger_1.ApiOperation)({
        summary: 'Count active users',
        description: 'Returns the total number of active users in the system'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User count retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number', example: 150 }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "countActiveUsers", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map