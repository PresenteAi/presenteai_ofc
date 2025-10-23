"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const withdrawal_entity_1 = require("./entities/withdrawal.entity");
const withdrawals_controller_1 = require("./controllers/withdrawals.controller");
const withdrawal_webhooks_controller_1 = require("./controllers/withdrawal-webhooks.controller");
const withdrawals_service_1 = require("./services/withdrawals.service");
const withdrawal_webhook_service_1 = require("./services/withdrawal-webhook.service");
const withdrawal_repository_1 = require("./repositories/withdrawal.repository");
const transaction_repository_1 = require("../transactions/repositories/transaction.repository");
let WithdrawalsModule = class WithdrawalsModule {
};
exports.WithdrawalsModule = WithdrawalsModule;
exports.WithdrawalsModule = WithdrawalsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([withdrawal_entity_1.Withdrawal]),
        ],
        controllers: [
            withdrawals_controller_1.WithdrawalsController,
            withdrawal_webhooks_controller_1.WithdrawalWebhooksController,
        ],
        providers: [
            withdrawals_service_1.WithdrawalsService,
            withdrawal_webhook_service_1.WithdrawalWebhookService,
            withdrawal_repository_1.WithdrawalRepository,
            transaction_repository_1.TransactionRepository,
        ],
        exports: [
            withdrawals_service_1.WithdrawalsService,
            withdrawal_webhook_service_1.WithdrawalWebhookService,
            withdrawal_repository_1.WithdrawalRepository,
        ],
    })
], WithdrawalsModule);
//# sourceMappingURL=withdrawals.module.js.map