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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const event_pagination_dto_1 = require("./dto/event-pagination.dto");
const paginated_events_dto_1 = require("./dto/paginated-events.dto");
const event_output_dto_1 = require("./dto/event-output.dto");
const swagger_1 = require("@nestjs/swagger");
let EventsController = class EventsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto, userId) {
        try {
            console.log('Creating event for userId:', userId, "userId type:", typeof userId);
            console.log('DTO received:', JSON.stringify(dto, null, 2));
            dto.userId = userId;
            console.log('DTO after userId set:', JSON.stringify(dto, null, 2));
            return this.service.create(dto);
        }
        catch (error) {
            console.error('Error creating event:');
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Full error:', error);
            throw error;
        }
    }
    async findAll(paginationDto, userId) {
        paginationDto.userId = userId;
        return this.service.findAll(paginationDto);
    }
    async findById(id, userId) {
        const event = await this.service.findById(id);
        if (event.userId !== userId) {
            throw new common_1.ForbiddenException('You can only access your own events');
        }
        return event;
    }
    async findByPublicUrl(publicUrl) {
        return this.service.findByPublicUrl(publicUrl);
    }
    async update(id, updateDto, userId) {
        const event = await this.service.findById(id);
        if (event.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own events');
        }
        return this.service.update(id, updateDto);
    }
    async remove(id, userId) {
        const event = await this.service.findById(id);
        if (event.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own events');
        }
        return this.service.remove(id);
    }
    async togglePublish(id, isPublished, userId) {
        if (typeof isPublished !== 'boolean') {
            throw new Error('isPublished must be a boolean');
        }
        const event = await this.service.findById(id);
        if (event.userId !== userId) {
            throw new common_1.ForbiddenException('You can only modify your own events');
        }
        return this.service.togglePublish(id, isPublished);
    }
    async countActiveEvents() {
        const count = await this.service.countActiveEvents();
        return { count };
    }
    async findUpcomingEvents(days) {
        const daysToCheck = days && days > 0 && days <= 30 ? days : 7;
        return this.service.findUpcomingEvents(daysToCheck);
    }
    async test() {
        return {
            success: true,
            message: 'Events API is working!',
            timestamp: new Date().toISOString()
        };
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new event',
        description: 'Creates a new event with validation checks and generates a unique public URL'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Event created successfully',
        type: event_output_dto_1.EventOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or validation failed'
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Public URL already exists'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all events with pagination and filters',
        description: 'Retrieves a paginated list of events with optional search, filters and sorting'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Events retrieved successfully',
        type: paginated_events_dto_1.PaginatedEventsDto
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Field to sort by', enum: ['title', 'eventType', 'startDate', 'createdAt', 'updatedAt'] }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term for title or description' }),
    (0, swagger_1.ApiQuery)({ name: 'eventType', required: false, description: 'Filter by event type' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by organizer user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'isPublished', required: false, description: 'Filter by published status' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, description: 'Filter by active status' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_pagination_dto_1.EventPaginationDto, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get event by ID',
        description: 'Retrieves a specific event by their unique identifier'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event found successfully',
        type: event_output_dto_1.EventOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid UUID format'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Event not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findById", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/:publicUrl'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get event by public URL',
        description: 'Retrieves a published event by its public URL slug'
    }),
    (0, swagger_1.ApiParam)({ name: 'publicUrl', description: 'Event public URL slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event found successfully',
        type: event_output_dto_1.EventOutputDto
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Event not found or not published'
    }),
    __param(0, (0, common_1.Param)('publicUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findByPublicUrl", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update event',
        description: 'Updates event information. Only provided fields will be updated. Users can only update their own events.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event updated successfully',
        type: event_output_dto_1.EventOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or UUID format'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Event not found'
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Public URL already exists'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'You can only update your own events'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_event_dto_1.UpdateEventDto, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove event',
        description: 'Deactivates an event (soft delete). The event will be marked as inactive instead of being permanently deleted. Users can only delete their own events.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Event deactivated successfully'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid UUID format'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Event not found'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'You can only delete your own events'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, swagger_1.ApiOperation)({
        summary: 'Toggle event publish status',
        description: 'Publishes or unpublishes an event. Users can only modify their own events.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event publish status updated successfully',
        type: event_output_dto_1.EventOutputDto
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid UUID format or request body'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Event not found'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'You can only modify your own events'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('isPublished')),
    __param(2, (0, current_user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "togglePublish", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('stats/count'),
    (0, swagger_1.ApiOperation)({
        summary: 'Count active events',
        description: 'Returns the total number of active events in the system'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event count retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number', example: 75 }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "countActiveEvents", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('stats/upcoming'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get upcoming events',
        description: 'Returns events that are ending soon (within specified number of days)'
    }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Number of days to look ahead (default: 7)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Upcoming events retrieved successfully',
        type: [event_output_dto_1.EventOutputDto]
    }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findUpcomingEvents", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Test endpoint (public)',
        description: 'Public endpoint to test if API is working'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API is working'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "test", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('events'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map