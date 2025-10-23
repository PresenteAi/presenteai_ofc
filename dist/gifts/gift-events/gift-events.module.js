"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftEventsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gift_event_entity_1 = require("../entities/gift-event.entity");
const gift_template_entity_1 = require("../entities/gift-template.entity");
const gift_template_changed_entity_1 = require("../entities/gift-template-changed.entity");
const event_entity_1 = require("../../events/events/entities/event.entity");
const gift_events_controller_1 = require("./controllers/gift-events.controller");
const gift_events_service_1 = require("./services/gift-events.service");
const gift_events_repository_1 = require("./repositories/gift-events.repository");
let GiftEventsModule = class GiftEventsModule {
};
exports.GiftEventsModule = GiftEventsModule;
exports.GiftEventsModule = GiftEventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gift_event_entity_1.GiftEvent, gift_template_entity_1.GiftTemplate, gift_template_changed_entity_1.GiftTemplateChanged, event_entity_1.Event]),
        ],
        controllers: [
            gift_events_controller_1.GiftEventsController,
        ],
        providers: [
            gift_events_service_1.GiftEventsService,
            gift_events_repository_1.GiftEventsRepository,
        ],
        exports: [
            gift_events_service_1.GiftEventsService,
            gift_events_repository_1.GiftEventsRepository,
        ],
    })
], GiftEventsModule);
//# sourceMappingURL=gift-events.module.js.map