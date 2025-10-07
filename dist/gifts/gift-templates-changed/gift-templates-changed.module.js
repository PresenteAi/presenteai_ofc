"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftTemplatesChangedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gift_template_changed_entity_1 = require("../entities/gift-template-changed.entity");
const gift_template_entity_1 = require("../entities/gift-template.entity");
const gift_templates_changed_controller_1 = require("./gift-templates-changed.controller");
const gift_templates_changed_service_1 = require("./gift-templates-changed.service");
const gift_templates_changed_repository_1 = require("./gift-templates-changed.repository");
let GiftTemplatesChangedModule = class GiftTemplatesChangedModule {
};
exports.GiftTemplatesChangedModule = GiftTemplatesChangedModule;
exports.GiftTemplatesChangedModule = GiftTemplatesChangedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gift_template_changed_entity_1.GiftTemplateChanged, gift_template_entity_1.GiftTemplate]),
        ],
        controllers: [gift_templates_changed_controller_1.GiftTemplatesChangedController],
        providers: [
            gift_templates_changed_service_1.GiftTemplatesChangedService,
            gift_templates_changed_repository_1.GiftTemplatesChangedRepository,
        ],
        exports: [
            gift_templates_changed_service_1.GiftTemplatesChangedService,
            gift_templates_changed_repository_1.GiftTemplatesChangedRepository,
        ],
    })
], GiftTemplatesChangedModule);
//# sourceMappingURL=gift-templates-changed.module.js.map