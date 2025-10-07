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
const update_gift_event_dto_1 = require("../dto/update-gift-event.dto");
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
    async update(id, updateGiftEventDto) {
        return await this.giftEventsService.update(id, updateGiftEventDto);
    }
    async addContribution(id, body) {
        return await this.giftEventsService.addContribution(id, body.amount);
    }
    async updateCollectedValue(id, body) {
        return await this.giftEventsService.updateCollectedValue(id, body.collectedValue);
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
        summary: 'Criar um novo presente no evento',
        description: 'Associa um template de presente (base ou personalizado) a um evento específico'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Presente criado com sucesso no evento',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos fornecidos' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Template de presente já associado ao evento' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gift_event_dto_1.CreateGiftEventDto]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar presentes de eventos',
        description: 'Lista todos os presentes associados a eventos com filtros e paginação'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de presentes retornada com sucesso',
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
        summary: 'Listar presentes de um evento específico',
        description: 'Retorna todos os presentes associados a um evento específico'
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID do evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presentes do evento retornados com sucesso',
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
        summary: 'Estatísticas dos presentes de um evento',
        description: 'Retorna estatísticas agregadas dos presentes de um evento'
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID do evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estatísticas retornadas com sucesso',
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
        summary: 'Buscar presente por ID',
        description: 'Retorna os detalhes de um presente específico no evento'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do presente no evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presente encontrado com sucesso',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualizar presente no evento',
        description: 'Atualiza informações de um presente específico no evento'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do presente no evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presente atualizado com sucesso',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos fornecidos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflito com template existente' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_gift_event_dto_1.UpdateGiftEventDto]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/contribution'),
    (0, swagger_1.ApiOperation)({
        summary: 'Adicionar contribuição ao presente',
        description: 'Adiciona uma contribuição ao valor coletado do presente'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do presente no evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contribuição adicionada com sucesso',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Valor de contribuição inválido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "addContribution", null);
__decorate([
    (0, common_1.Patch)(':id/collected-value'),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualizar valor coletado',
        description: 'Define diretamente o valor total coletado do presente'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do presente no evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Valor coletado atualizado com sucesso',
        type: gift_event_response_dto_1.GiftEventResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Valor inválido fornecido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GiftEventsController.prototype, "updateCollectedValue", null);
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
        summary: 'Remover presente do evento',
        description: 'Remove a associação de um presente com um evento'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do presente no evento', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Presente removido com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
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