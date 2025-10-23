import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentGatewayInterface } from '../interfaces/payment-gateway.interface';
import { PaymentGateway } from '../entities/transaction.entity';
import { StripeGatewayService } from './stripe-gateway.service';

/**
 * Factory service to get the appropriate payment gateway provider
 * Implements Strategy Pattern for gateway selection
 */
@Injectable()
export class PaymentGatewayFactory {
  constructor(
    private readonly stripeGatewayService: StripeGatewayService,
    // Add other gateway services here as they are implemented
    // private readonly mercadoPagoGatewayService: MercadoPagoGatewayService,
    // private readonly pagarMeGatewayService: PagarMeGatewayService,
  ) {}

  /**
   * Get the appropriate gateway service based on gateway type
   * 
   * @param gateway - Payment gateway type
   * @returns Gateway service instance
   * @throws BadRequestException if gateway is not supported
   */
  getGatewayService(gateway: PaymentGateway): PaymentGatewayInterface {
    switch (gateway) {
      case PaymentGateway.STRIPE:
        return this.stripeGatewayService;

      case PaymentGateway.MERCADOPAGO:
        // TODO: Implement MercadoPago gateway service
        throw new BadRequestException(`MercadoPago gateway not implemented yet`);

      case PaymentGateway.PAGARME:
        // TODO: Implement Pagar.me gateway service
        throw new BadRequestException(`Pagar.me gateway not implemented yet`);

      default:
        throw new BadRequestException(`Unsupported payment gateway: ${gateway}`);
    }
  }

  /**
   * Get all supported gateway types
   * 
   * @returns Array of supported payment gateways
   */
  getSupportedGateways(): PaymentGateway[] {
    return [
      PaymentGateway.STRIPE,
      // Add other supported gateways here
      // PaymentGateway.MERCADOPAGO,
      // PaymentGateway.PAGARME,
    ];
  }

  /**
   * Check if a gateway is supported
   * 
   * @param gateway - Payment gateway to check
   * @returns True if gateway is supported
   */
  isGatewaySupported(gateway: PaymentGateway): boolean {
    return this.getSupportedGateways().includes(gateway);
  }
}