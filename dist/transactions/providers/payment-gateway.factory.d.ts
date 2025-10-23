import { PaymentGatewayInterface } from '../interfaces/payment-gateway.interface';
import { PaymentGateway } from '../entities/transaction.entity';
import { StripeGatewayService } from './stripe-gateway.service';
export declare class PaymentGatewayFactory {
    private readonly stripeGatewayService;
    constructor(stripeGatewayService: StripeGatewayService);
    getGatewayService(gateway: PaymentGateway): PaymentGatewayInterface;
    getSupportedGateways(): PaymentGateway[];
    isGatewaySupported(gateway: PaymentGateway): boolean;
}
