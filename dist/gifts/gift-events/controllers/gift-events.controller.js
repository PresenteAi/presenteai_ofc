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
exports.GiftEventsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gift_events_service_1 = require("../services/gift-events.service");
const create_gift_event_dto_1 = require("../dto/create-gift-event.dto");
const gift_event_filters_dto_1 = require("../dto/gift-event-filters.dto");
const gift_event_response_dto_1 = require("../dto/gift-event-response.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
let GiftEventsController = class GiftEventsController {
    giftEventsService;
    constructor(giftEventsService) {
        this.giftEventsService = giftEventsService;
    }
    async create(createGiftEventDto) {
        return await this.giftEventsService.create(createGiftEventDto);
    }
    async findAll(filters) {
        return await this.giftEventsService.findAll(filters);
    }
    async findByEventId(eventId) {
        return await this.giftEventsService.findByEventId(eventId);
    }
    async getEventStats(eventId) {
        return await this.giftEventsService.getEventStats(eventId);
    }
    async findOne(id) {
        return await this.giftEventsService.findOne(id);
    }
    async markAsCompleted(id) {
        return await this.giftEventsService.markAsCompleted(id);
    }
    async reopenGift(id) {
        return await this.giftEventsService.reopenGift(id);
    }
    async remove(id) {
        return await this.giftEventsService.remove(id);
    }
};
exports.GiftEventsController = GiftEventsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new gift event',
        description: 'Associates a gift template (base or customized) with a specific event'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Gift event created successfully',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data provided' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Gift template already associated with this event' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gift_event_dto_1.CreateGiftEventDto]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List gift events',
        description: 'Lists all gift events with filters and pagination'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gift events list returned successfully',
        type: gift_event_response_dto_1.PaginatedGiftEventResponseDto
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gift_event_filters_dto_1.GiftEventFiltersDto]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('event/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'List gifts for a specific event',
        description: 'Returns all gifts associated with a specific event'
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'Event ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event gifts returned successfully',
        type: [gift_event_response_dto_1.GiftEventResponseDto]
    }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "findByEventId", null);
__decorate([
    (0, common_1.Get)('event/:eventId/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Event gift statistics',
        description: 'Returns aggregated statistics for gifts in an event'
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'Event ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics returned successfully',
        schema: {
            type: 'object',
            properties: {
                totalGifts: { type: 'number', example: 5 },
                completedGifts: { type: 'number', example: 2 },
                openGifts: { type: 'number', example: 3 },
                totalValue: { type: 'number', example: 2500.00 },
                collectedValue: { type: 'number', example: 1200.00 },
                averageProgress: { type: 'number', example: 48 },
            }
        }
    }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "getEventStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Find gift event by ID',
        description: 'Returns details of a specific gift event'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Gift event ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gift event found successfully',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gift event not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Marcar presente como completo',
        description: 'Marca um presente como completado manualmente'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do presente no evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presente marcado como completo',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "markAsCompleted", null);
__decorate([
    (0, common_1.Patch)(':id/reopen'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reabrir presente para contribuições',
        description: 'Reabre um presente completado para receber mais contribuições'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do presente no evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presente reaberto com sucesso',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "reopenGift", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove gift event',
        description: 'Removes the association of a gift with an event'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Gift event ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Gift event removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gift event not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "remove", null);
exports.GiftEventsController = GiftEventsController = __decorate([
    (0, swagger_1.ApiTags)('Gift Events'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('gift-events'),
    __metadata("design:paramtypes", [gift_events_service_1.GiftEventsService])
], GiftEventsController);
//# sourceMappingURL=gift-events.controller.js.map