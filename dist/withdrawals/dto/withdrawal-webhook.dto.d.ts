import { WithdrawalStatus, WithdrawalGateway } from '../entities/withdrawal.entity';
export declare class WithdrawalWebhookDto {
    gateway: WithdrawalGateway;
    externalId: string;
    status: WithdrawalStatus;
    transactionReference?: string;
    feeAmount?: number;
    processedAt?: string;
    failureReason?: string;
    metadata?: Record<string, any>;
}
export declare class StripeWithdrawalWebhookDto extends WithdrawalWebhookDto {
    type: string;
    data: {
        object: {
            id: string;
            status: string;
            amount: number;
            currency: string;
            failure_code?: string;
            failure_message?: string;
            arrival_date?: number;
            metadata?: Record<string, any>;
        };
    };
}
export declare class MercadoPagoWithdrawalWebhookDto extends WithdrawalWebhookDto {
    action: string;
    api_version: string;
    data: {
        id: string;
    };
    date_created?: string;
}
export declare class PagarMeWithdrawalWebhookDto extends WithdrawalWebhookDto {
    event: string;
    current_status: {
        id: string;
        status: string;
        amount: number;
        fee: number;
        date_created: string;
        date_updated: string;
    };
}
