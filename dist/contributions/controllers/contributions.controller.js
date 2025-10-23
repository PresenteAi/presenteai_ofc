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
exports.ContributionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contributions_service_1 = require("../services/contributions.service");
const create_contribution_dto_1 = require("../dto/create-contribution.dto");
const update_contribution_status_dto_1 = require("../dto/update-contribution-status.dto");
const contribution_filters_dto_1 = require("../dto/contribution-filters.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let ContributionsController = class ContributionsController {
    contributionsService;
    constructor(contributionsService) {
        this.contributionsService = contributionsService;
    }
    async create(createContributionDto) {
        return await this.contributionsService.create(createContributionDto);
    }
    async findAll(filters) {
        return await this.contributionsService.findAll(filters);
    }
    async findByEventGiftId(eventGiftId) {
        return await this.contributionsService.findByEventGiftId(eventGiftId);
    }
    async getGiftEventStats(eventGiftId) {
        return await this.contributionsService.getGiftEventStats(eventGiftId);
    }
    async findOne(id) {
        return await this.contributionsService.findOne(id);
    }
    async updateStatus(id, updateContributionStatusDto) {
        return await this.contributionsService.updateStatus(id, updateContributionStatusDto);
    }
    async remove(id) {
        return await this.contributionsService.remove(id);
    }
};
exports.ContributionsController = ContributionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new contribution',
        description: 'Creates a new contribution for a specific gift event. The contribution starts with pending status.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Contribution created successfully',
        type: update_contribution_status_dto_1.ContributionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid contribution data provided' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gift event not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Gift cannot receive contributions' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contribution_dto_1.CreateContributionDto]),
    __metadata("design:returntype", Promise)
], ContributionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List contributions',
        description: 'Retrieves a paginated list of contributions with optional filters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contributions retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                contributions: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ContributionResponseDto' },
                },
                total: { type: 'number', example: 150 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 20 },
                totalPages: { type: 'number', example: 8 },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contribution_filters_dto_1.ContributionFiltersDto]),
    __metadata("design:returntype", Promise)
], ContributionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('gift-event/:eventGiftId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contributions by gift event',
        description: 'Retrieves all contributions for a specific gift event',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventGiftId', description: 'Gift event ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contributions retrieved successfully',
        type: [update_contribution_status_dto_1.ContributionResponseDto],
    }),
    __param(0, (0, common_1.Param)('eventGiftId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContributionsController.prototype, "findByEventGiftId", null);
__decorate([
    (0, common_1.Get)('gift-event/:eventGiftId/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contribution statistics',
        description: 'Retrieves contribution statistics for a specific gift event',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventGiftId', description: 'Gift event ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalContributions: { type: 'number', example: 25 },
                totalAmount: { type: 'number', example: 1250.00 },
                netAmount: { type: 'number', example: 1180.50 },
                pendingAmount: { type: 'number', example: 200.00 },
                approvedAmount: { type: 'number', example: 1050.00 },
                contributorCount: { type: 'number', example: 18 },
            },
        },
    }),
    __param(0, (0, common_1.Param)('eventGiftId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContributionsController.prototype, "getGiftEventStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contribution details',
        description: 'Retrieves detailed information about a specific contribution',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contribution ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contribution details retrieved successfully',
        type: update_contribution_status_dto_1.ContributionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contribution not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContributionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update contribution payment status',
        description: 'Updates the payment status of a contribution and synchronizes the gift event collected value',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contribution ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contribution status updated successfully',
        type: update_contribution_status_dto_1.ContributionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition or missing required data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contribution not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Contribution cannot be updated (invalid state)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_contribution_status_dto_1.UpdateContributionStatusDto]),
    __metadata("design:returntype", Promise)
], ContributionsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete contribution',
        description: 'Soft deletes a contribution. Only pending contributions can be deleted.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contribution ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Contribution deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contribution not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Contribution cannot be deleted (invalid state)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContributionsController.prototype, "remove", null);
exports.ContributionsController = ContributionsController = __decorate([
    (0, swagger_1.ApiTags)('contributions'),
    (0, common_1.Controller)('contributions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [contributions_service_1.ContributionsService])
], ContributionsController);
//# sourceMappingURL=contributions.controller.js.map