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
exports.GiftTemplatesChangedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gift_templates_changed_service_1 = require("./gift-templates-changed.service");
const create_gift_template_changed_dto_1 = require("./create-gift-template-changed.dto");
const update_gift_template_changed_dto_1 = require("./update-gift-template-changed.dto");
const gift_output_dto_1 = require("../dto/gift-output.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
let GiftTemplatesChangedController = class GiftTemplatesChangedController {
    giftTemplatesChangedService;
    constructor(giftTemplatesChangedService) {
        this.giftTemplatesChangedService = giftTemplatesChangedService;
    }
    async create(createGiftTemplateChangedDto, userId) {
        return this.giftTemplatesChangedService.create(createGiftTemplateChangedDto, userId);
    }
    async findAll() {
        return this.giftTemplatesChangedService.findAll();
    }
    async findPublicChanged() {
        return this.giftTemplatesChangedService.findPublicChanged();
    }
    async findMyCustomizations(userId) {
        return this.giftTemplatesChangedService.findByUserId(userId);
    }
    async findByGiftTemplateId(giftTemplateId) {
        if (giftTemplateId <= 0) {
            throw new common_1.BadRequestException('Gift template ID must be a positive number');
        }
        return this.giftTemplatesChangedService.findByGiftTemplateId(giftTemplateId);
    }
    async findOne(id, userId) {
        if (id <= 0) {
            throw new common_1.BadRequestException('ID must be a positive number');
        }
        return this.giftTemplatesChangedService.findById(id, userId);
    }
    async getCombinedData(id, userId) {
        if (id <= 0) {
            throw new common_1.BadRequestException('ID must be a positive number');
        }
        return this.giftTemplatesChangedService.getCombinedData(id, userId);
    }
    async update(id, updateGiftTemplateChangedDto, userId) {
        if (id <= 0) {
            throw new common_1.BadRequestException('ID must be a positive number');
        }
        return this.giftTemplatesChangedService.update(id, updateGiftTemplateChangedDto, userId);
    }
    async remove(id, userId) {
        if (id <= 0) {
            throw new common_1.BadRequestException('ID must be a positive number');
        }
        await this.giftTemplatesChangedService.remove(id, userId);
        return { message: 'Gift template customization deleted successfully' };
    }
    async countByUser(userId) {
        const count = await this.giftTemplatesChangedService.countByUserId(userId);
        return { userId, count };
    }
    async countByGiftTemplate(giftTemplateId) {
        if (giftTemplateId <= 0) {
            throw new common_1.BadRequestException('Gift template ID must be a positive number');
        }
        const count = await this.giftTemplatesChangedService.countByGiftTemplateId(giftTemplateId);
        return { giftTemplateId, count };
    }
};
exports.GiftTemplatesChangedController = GiftTemplatesChangedController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a customized version of a gift template',
        description: 'Create a personalized variation of an existing gift template with custom values'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Gift template customization created successfully',
        type: gift_output_dto_1.GiftTemplateOutputDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Cannot customize private templates' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - Base template not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gift_template_changed_dto_1.CreateGiftTemplateChangedDto, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List all customized gift templates',
        description: 'Get all customized gift templates (public ones or your own if authenticated)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of customized gift templates',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List public customized gift templates',
        description: 'Get all public customized gift templates that can be reused by anyone'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of public customized gift templates',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "findPublicChanged", null);
__decorate([
    (0, common_1.Get)('my-customizations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user\'s customized templates',
        description: 'Get all gift template customizations created by the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of user customizations',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    __param(0, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "findMyCustomizations", null);
__decorate([
    (0, common_1.Get)('by-template/:giftTemplateId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get customizations of a specific template',
        description: 'Get all customizations based on a specific gift template'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of customizations for the template',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid template ID' }),
    __param(0, (0, common_1.Param)('giftTemplateId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "findByGiftTemplateId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific customized template',
        description: 'Get details of a specific customized gift template'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customized gift template details',
        type: gift_output_dto_1.GiftTemplateOutputDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid ID' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Cannot view private customizations' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - Customization not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/combined'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get combined data (base template + customization)',
        description: 'Get merged data showing the final result of base template + customizations'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Combined template data',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid ID' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Cannot view private customizations' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - Customization not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "getCombinedData", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a customized template',
        description: 'Update an existing customized gift template (only by the creator)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customized template updated successfully',
        type: gift_output_dto_1.GiftTemplateOutputDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only update your own customizations' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - Customization not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_gift_template_changed_dto_1.UpdateGiftTemplateChangedDto, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a customized template',
        description: 'Delete an existing customized gift template (only by the creator)'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customized template deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid ID' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only delete your own customizations' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - Customization not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('stats/count-by-user'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Count user\'s customizations',
        description: 'Get the total count of customizations created by the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Count of user customizations',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number' },
                count: { type: 'number' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    __param(0, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "countByUser", null);
__decorate([
    (0, common_1.Get)('stats/count-by-template/:giftTemplateId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Count customizations of a template',
        description: 'Get the total count of customizations based on a specific gift template'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Count of template customizations',
        schema: {
            type: 'object',
            properties: {
                giftTemplateId: { type: 'number' },
                count: { type: 'number' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid template ID' }),
    __param(0, (0, common_1.Param)('giftTemplateId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesChangedController.prototype, "countByGiftTemplate", null);
exports.GiftTemplatesChangedController = GiftTemplatesChangedController = __decorate([
    (0, swagger_1.ApiTags)('gift-templates-changed'),
    (0, common_1.Controller)('gift-templates-changed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [gift_templates_changed_service_1.GiftTemplatesChangedService])
], GiftTemplatesChangedController);
//# sourceMappingURL=gift-templates-changed.controller.js.map