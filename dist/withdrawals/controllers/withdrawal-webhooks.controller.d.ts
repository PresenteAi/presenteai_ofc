import { WithdrawalWebhookService } from '../services/withdrawal-webhook.service';
import { StripeWithdrawalWebhookDto, MercadoPagoWithdrawalWebhookDto, PagarMeWithdrawalWebhookDto } from '../dto/withdrawal-webhook.dto';
export declare class WithdrawalWebhooksController {
    private readonly withdrawalWebhookService;
    private readonly logger;
    constructor(withdrawalWebhookService: WithdrawalWebhookService);
    handleStripeWebhook(payload: StripeWithdrawalWebhookDto, signature: string): Promise<{
        success: boolean;
    }>;
    handleMercadoPagoWebhook(payload: MercadoPagoWithdrawalWebhookDto, signature: string): Promise<{
        success: boolean;
    }>;
    handlePagarMeWebhook(payload: PagarMeWithdrawalWebhookDto, signature: string): Promise<{
        success: boolean;
    }>;
    handleTestWebhook(payload: any): Promise<{
        success: boolean;
        received: any;
    }>;
}
