import { WithdrawalsService } from '../services/withdrawals.service';
import { StripeWithdrawalWebhookDto, MercadoPagoWithdrawalWebhookDto, PagarMeWithdrawalWebhookDto } from '../dto/withdrawal-webhook.dto';
import { WithdrawalGateway } from '../entities/withdrawal.entity';
export declare class WithdrawalWebhookService {
    private readonly withdrawalsService;
    private readonly logger;
    constructor(withdrawalsService: WithdrawalsService);
    handleStripeWebhook(payload: StripeWithdrawalWebhookDto): Promise<void>;
    handleMercadoPagoWebhook(payload: MercadoPagoWithdrawalWebhookDto): Promise<void>;
    handlePagarMeWebhook(payload: PagarMeWithdrawalWebhookDto): Promise<void>;
    private processWebhook;
    private mapStripeStatus;
    private mapMercadoPagoStatus;
    private mapPagarMeStatus;
    private notifyUserOfStatusChange;
    verifyWebhookSignature(gateway: WithdrawalGateway, payload: string, signature: string, secret: string): Promise<boolean>;
}
