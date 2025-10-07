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
exports.GiftTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gift_templates_service_1 = require("./gift-templates.service");
const create_gift_template_dto_1 = require("./create-gift-template.dto");
const update_gift_template_dto_1 = require("./update-gift-template.dto");
const gift_template_pagination_dto_1 = require("../dto/gift-template-pagination.dto");
const gift_output_dto_1 = require("../dto/gift-output.dto");
const paginated_gifts_dto_1 = require("../dto/paginated-gifts.dto");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const gift_template_entity_1 = require("../entities/gift-template.entity");
let GiftTemplatesController = class GiftTemplatesController {
    giftTemplatesService;
    constructor(giftTemplatesService) {
        this.giftTemplatesService = giftTemplatesService;
    }
    async create(dto, userId) {
        return this.giftTemplatesService.create(dto, userId);
    }
    async findAll(paginationDto) {
        return this.giftTemplatesService.findAll(paginationDto);
    }
    async findPublic() {
        return this.giftTemplatesService.findPublicTemplates();
    }
    async findByCategory(category) {
        return this.giftTemplatesService.findByCategory(category);
    }
    async findByEventType(eventType) {
        return this.giftTemplatesService.findByEventType(eventType);
    }
    async findMyTemplates(userId) {
        return this.giftTemplatesService.findByUserId(userId);
    }
    async findById(id) {
        return this.giftTemplatesService.findById(id);
    }
    async update(id, dto, userId) {
        return this.giftTemplatesService.update(id, dto, userId);
    }
    async remove(id, userId) {
        return this.giftTemplatesService.remove(id, userId);
    }
};
exports.GiftTemplatesController = GiftTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new gift template',
        description: 'Creates a new gift template that can be reused in events'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Gift template created successfully',
        type: gift_output_dto_1.GiftTemplateOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or validation failed'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gift_template_dto_1.CreateGiftTemplateDto, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List gift templates with pagination and filters',
        description: 'Returns paginated list of gift templates with optional filters'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gift templates retrieved successfully',
        type: paginated_gifts_dto_1.PaginatedGiftTemplatesDto
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Field to sort by', enum: ['title', 'category', 'defaultValue', 'createdAt', 'updatedAt'] }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term for title or description' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'eventType', required: false, description: 'Filter by event type', enum: gift_template_entity_1.EventType }),
    (0, swagger_1.ApiQuery)({ name: 'isPublic', required: false, description: 'Filter by public templates' }),
    (0, swagger_1.ApiQuery)({ name: 'createdByUserId', required: false, description: 'Filter by creator user ID' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gift_template_pagination_dto_1.GiftTemplatePaginationDto]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List public gift templates',
        description: 'Returns all public gift templates available for reuse'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Public templates retrieved successfully',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List gift templates by category',
        description: 'Returns public gift templates filtered by category'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Templates by category retrieved successfully',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    (0, swagger_1.ApiParam)({ name: 'category', description: 'Category name to filter by' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid category' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('event-type/:eventType'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List gift templates by event type',
        description: 'Returns public gift templates filtered by event type'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Templates by event type retrieved successfully',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    (0, swagger_1.ApiParam)({ name: 'eventType', description: 'Event type to filter by', enum: gift_template_entity_1.EventType }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid event type' }),
    __param(0, (0, common_1.Param)('eventType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "findByEventType", null);
__decorate([
    (0, common_1.Get)('my-templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List current user gift templates',
        description: 'Returns all gift templates created by the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User templates retrieved successfully',
        type: [gift_output_dto_1.GiftTemplateOutputDto]
    }),
    __param(0, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "findMyTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get gift template by ID',
        description: 'Returns a specific gift template by its ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gift template retrieved successfully',
        type: gift_output_dto_1.GiftTemplateOutputDto
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Gift template not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Gift template ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update gift template',
        description: 'Updates a gift template (only the creator can update)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gift template updated successfully',
        type: gift_output_dto_1.GiftTemplateOutputDto
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Gift template not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'You can only update your own templates' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input data' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Gift template ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_gift_template_dto_1.UpdateGiftTemplateDto, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete gift template',
        description: 'Deletes a gift template (only the creator can delete)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Gift template deleted successfully'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Gift template not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'You can only delete your own templates' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Gift template ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GiftTemplatesController.prototype, "remove", null);
exports.GiftTemplatesController = GiftTemplatesController = __decorate([
    (0, swagger_1.ApiTags)('gift-templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('gift-templates'),
    __metadata("design:paramtypes", [gift_templates_service_1.GiftTemplatesService])
], GiftTemplatesController);
//# sourceMappingURL=gift-templates.controller.js.map