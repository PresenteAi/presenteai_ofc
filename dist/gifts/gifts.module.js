"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gift_template_entity_1 = require("./entities/gift-template.entity");
const gift_template_changed_entity_1 = require("./entities/gift-template-changed.entity");
const gift_event_entity_1 = require("./entities/gift-event.entity");
const gift_templates_module_1 = require("./gift-templates/gift-templates.module");
const gift_templates_changed_module_1 = require("./gift-templates-changed/gift-templates-changed.module");
const gift_events_module_1 = require("./gift-events/gift-events.module");
const gifts_service_1 = require("./gifts/gifts.service");
const gifts_controller_1 = require("./gifts/gifts.controller");
let GiftsModule = class GiftsModule {
};
exports.GiftsModule = GiftsModule;
exports.GiftsModule = GiftsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                gift_template_entity_1.GiftTemplate,
                gift_template_changed_entity_1.GiftTemplateChanged,
                gift_event_entity_1.GiftEvent,
            ]),
            gift_templates_module_1.GiftTemplatesModule,
            gift_templates_changed_module_1.GiftTemplatesChangedModule,
            gift_events_module_1.GiftEventsModule,
        ],
        controllers: [
            gifts_controller_1.GiftsController,
        ],
        providers: [
            gifts_service_1.GiftsService,
        ],
        exports: [
            gift_templates_module_1.GiftTemplatesModule,
            gift_templates_changed_module_1.GiftTemplatesChangedModule,
            gift_events_module_1.GiftEventsModule,
            gifts_service_1.GiftsService,
        ],
    })
], GiftsModule);
//# sourceMappingURL=gifts.module.js.map