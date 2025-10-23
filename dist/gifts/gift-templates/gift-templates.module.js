"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gift_template_entity_1 = require("../entities/gift-template.entity");
const gift_templates_controller_1 = require("./gift-templates.controller");
const gift_templates_service_1 = require("./gift-templates.service");
const gift_templates_repository_1 = require("./gift-templates.repository");
let GiftTemplatesModule = class GiftTemplatesModule {
};
exports.GiftTemplatesModule = GiftTemplatesModule;
exports.GiftTemplatesModule = GiftTemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gift_template_entity_1.GiftTemplate]),
        ],
        controllers: [gift_templates_controller_1.GiftTemplatesController],
        providers: [
            gift_templates_service_1.GiftTemplatesService,
            gift_templates_repository_1.GiftTemplatesRepository,
        ],
        exports: [
            gift_templates_service_1.GiftTemplatesService,
            gift_templates_repository_1.GiftTemplatesRepository,
        ],
    })
], GiftTemplatesModule);
//# sourceMappingURL=gift-templates.module.js.map