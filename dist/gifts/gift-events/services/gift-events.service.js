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
exports.GiftEventsService = void 0;
const common_1 = require("@nestjs/common");
const gift_events_repository_1 = require("../repositories/gift-events.repository");
const gift_event_response_dto_1 = require("../dto/gift-event-response.dto");
const gift_event_entity_1 = require("../../entities/gift-event.entity");
let GiftEventsService = class GiftEventsService {
    giftEventsRepository;
    constructor(giftEventsRepository) {
        this.giftEventsRepository = giftEventsRepository;
    }
    async create(createGiftEventDto) {
        if (!createGiftEventDto.giftTemplateId && !createGiftEventDto.giftTemplateChangedId) {
            throw new common_1.BadRequestException('Either giftTemplateId or giftTemplateChangedId must be provided');
        }
        if (createGiftEventDto.giftTemplateId && createGiftEventDto.giftTemplateChangedId) {
            throw new common_1.BadRequestException('Cannot provide both giftTemplateId and giftTemplateChangedId');
        }
        const existingGiftEvent = await this.giftEventsRepository.findOneByEventAndTemplate(createGiftEventDto.eventId, createGiftEventDto.giftTemplateId, createGiftEventDto.giftTemplateChangedId);
        if (existingGiftEvent) {
            throw new common_1.ConflictException('Gift template is already associated with this event');
        }
        try {
            const giftEvent = await this.giftEventsRepository.create(createGiftEventDto);
            return new gift_event_response_dto_1.GiftEventResponseDto(giftEvent);
        }
        catch (error) {
            if (error.code === '23503') {
                throw new common_1.BadRequestException('Referenced event, gift template, or gift template changed does not exist');
            }
            throw error;
        }
    }
    async findAll(filters) {
        const [giftEvents, total] = await this.giftEventsRepository.findAll(filters);
        const data = giftEvents.map(giftEvent => new gift_event_response_dto_1.GiftEventResponseDto(giftEvent));
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        };
    }
    async findByEventId(eventId) {
        const giftEvents = await this.giftEventsRepository.findByEventId(eventId);
        return giftEvents.map(giftEvent => new gift_event_response_dto_1.GiftEventResponseDto(giftEvent));
    }
    async findOne(id) {
        const giftEvent = await this.giftEventsRepository.findOne(id);
        if (!giftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
        }
        return new gift_event_response_dto_1.GiftEventResponseDto(giftEvent);
    }
    async update(id, updateGiftEventDto) {
        const existingGiftEvent = await this.giftEventsRepository.findOne(id);
        if (!existingGiftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
        }
        if (updateGiftEventDto.giftTemplateId || updateGiftEventDto.giftTemplateChangedId) {
            const newGiftTemplateId = updateGiftEventDto.giftTemplateId ?? existingGiftEvent.giftTemplateId;
            const newGiftTemplateChangedId = updateGiftEventDto.giftTemplateChangedId ?? existingGiftEvent.giftTemplateChangedId;
            if (newGiftTemplateId && newGiftTemplateChangedId) {
                throw new common_1.BadRequestException('Cannot have both giftTemplateId and giftTemplateChangedId');
            }
            if (!newGiftTemplateId && !newGiftTemplateChangedId) {
                throw new common_1.BadRequestException('Must have either giftTemplateId or giftTemplateChangedId');
            }
            if (newGiftTemplateId !== existingGiftEvent.giftTemplateId ||
                newGiftTemplateChangedId !== existingGiftEvent.giftTemplateChangedId) {
                const conflictingGiftEvent = await this.giftEventsRepository.findOneByEventAndTemplate(existingGiftEvent.eventId, newGiftTemplateId || undefined, newGiftTemplateChangedId || undefined);
                if (conflictingGiftEvent && conflictingGiftEvent.id !== id) {
                    throw new common_1.ConflictException('Gift template is already associated with this event');
                }
            }
        }
        try {
            const updatedGiftEvent = await this.giftEventsRepository.update(id, updateGiftEventDto);
            if (!updatedGiftEvent) {
                throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
            }
            await this.checkAndMarkAsCompleted(updatedGiftEvent);
            const refreshedGiftEvent = await this.giftEventsRepository.findOne(id);
            return new gift_event_response_dto_1.GiftEventResponseDto(refreshedGiftEvent);
        }
        catch (error) {
            if (error.code === '23503') {
                throw new common_1.BadRequestException('Referenced event, gift template, or gift template changed does not exist');
            }
            throw error;
        }
    }
    async remove(id) {
        const giftEvent = await this.giftEventsRepository.findOne(id);
        if (!giftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
        }
        await this.giftEventsRepository.remove(id);
    }
    async updateCollectedValue(id, collectedValue) {
        if (collectedValue < 0) {
            throw new common_1.BadRequestException('Collected value cannot be negative');
        }
        const existingGiftEvent = await this.giftEventsRepository.findOne(id);
        if (!existingGiftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
        }
        if (!existingGiftEvent.canReceiveContributions()) {
            throw new common_1.BadRequestException('This gift cannot receive contributions (it might be completed)');
        }
        const updatedGiftEvent = await this.giftEventsRepository.updateCollectedValue(id, collectedValue);
        if (!updatedGiftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found after update`);
        }
        await this.checkAndMarkAsCompleted(updatedGiftEvent);
        const refreshedGiftEvent = await this.giftEventsRepository.findOne(id);
        return new gift_event_response_dto_1.GiftEventResponseDto(refreshedGiftEvent);
    }
    async addContribution(id, contributionAmount) {
        if (contributionAmount <= 0) {
            throw new common_1.BadRequestException('Contribution amount must be positive');
        }
        const existingGiftEvent = await this.giftEventsRepository.findOne(id);
        if (!existingGiftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
        }
        if (!existingGiftEvent.canReceiveContributions()) {
            throw new common_1.BadRequestException('This gift cannot receive contributions (it might be completed)');
        }
        const newCollectedValue = Number(existingGiftEvent.collectedValue) + contributionAmount;
        return await this.updateCollectedValue(id, newCollectedValue);
    }
    async markAsCompleted(id) {
        const giftEvent = await this.giftEventsRepository.findOne(id);
        if (!giftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
        }
        if (giftEvent.isCompleted()) {
            return new gift_event_response_dto_1.GiftEventResponseDto(giftEvent);
        }
        const updatedGiftEvent = await this.giftEventsRepository.update(id, {
            status: gift_event_entity_1.GiftEventStatus.COMPLETED
        });
        if (!updatedGiftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found after update`);
        }
        return new gift_event_response_dto_1.GiftEventResponseDto(updatedGiftEvent);
    }
    async reopenGift(id) {
        const giftEvent = await this.giftEventsRepository.findOne(id);
        if (!giftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found`);
        }
        if (!giftEvent.isCompleted()) {
            return new gift_event_response_dto_1.GiftEventResponseDto(giftEvent);
        }
        const updatedGiftEvent = await this.giftEventsRepository.update(id, {
            status: gift_event_entity_1.GiftEventStatus.OPEN
        });
        if (!updatedGiftEvent) {
            throw new common_1.NotFoundException(`Gift event with ID ${id} not found after update`);
        }
        return new gift_event_response_dto_1.GiftEventResponseDto(updatedGiftEvent);
    }
    async getEventStats(eventId) {
        return await this.giftEventsRepository.getStatsByEvent(eventId);
    }
    async checkAndMarkAsCompleted(giftEvent) {
        if (giftEvent.status === gift_event_entity_1.GiftEventStatus.OPEN) {
            const effectiveValue = giftEvent.getEffectiveValue();
            if (effectiveValue && Number(giftEvent.collectedValue) >= effectiveValue) {
                await this.giftEventsRepository.update(giftEvent.id, {
                    status: gift_event_entity_1.GiftEventStatus.COMPLETED
                });
            }
        }
    }
};
exports.GiftEventsService = GiftEventsService;
exports.GiftEventsService = GiftEventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gift_events_repository_1.GiftEventsRepository])
], GiftEventsService);
//# sourceMappingURL=gift-events.service.js.map