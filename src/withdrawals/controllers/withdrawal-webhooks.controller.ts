import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  UnauthorizedException,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { WithdrawalWebhookService } from '../services/withdrawal-webhook.service';
import { 
  StripeWithdrawalWebhookDto, 
  MercadoPagoWithdrawalWebhookDto, 
  PagarMeWithdrawalWebhookDto 
} from '../dto/withdrawal-webhook.dto';
import { WithdrawalGateway } from '../entities/withdrawal.entity';

@ApiTags('withdrawal-webhooks')
@Controller('withdrawals/webhooks')
export class WithdrawalWebhooksController {
  private readonly logger = new Logger(WithdrawalWebhooksController.name);

  constructor(
    private readonly withdrawalWebhookService: WithdrawalWebhookService,
  ) {}

  @Public()
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Stripe withdrawal webhook endpoint',
    description: 'Receives notifications from Stripe about withdrawal status changes'
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature for verification',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async handleStripeWebhook(
    @Body() payload: StripeWithdrawalWebhookDto,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ success: boolean }> {
    this.logger.log(`Received Stripe webhook: ${payload.type}`);

    if (!signature) {
      throw new UnauthorizedException('Missing Stripe signature');
    }

    // Verify webhook signature
    const isValidSignature = await this.withdrawalWebhookService.verifyWebhookSignature(
      WithdrawalGateway.STRIPE,
      JSON.stringify(payload),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );

    if (!isValidSignature) {
      this.logger.warn('Invalid Stripe webhook signature');
      throw new UnauthorizedException('Invalid signature');
    }

    // Only process payout-related events
    if (!payload.type.startsWith('payout.')) {
      this.logger.log(`Ignoring non-payout event: ${payload.type}`);
      return { success: true };
    }

    try {
      await this.withdrawalWebhookService.handleStripeWebhook(payload);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to process Stripe webhook: ${error.message}`);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  @Public()
  @Post('mercadopago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'MercadoPago withdrawal webhook endpoint',
    description: 'Receives notifications from MercadoPago about withdrawal status changes'
  })
  @ApiHeader({
    name: 'x-signature',
    description: 'MercadoPago webhook signature for verification',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async handleMercadoPagoWebhook(
    @Body() payload: MercadoPagoWithdrawalWebhookDto,
    @Headers('x-signature') signature: string,
  ): Promise<{ success: boolean }> {
    this.logger.log(`Received MercadoPago webhook: ${payload.action}`);

    if (!signature) {
      throw new UnauthorizedException('Missing MercadoPago signature');
    }

    // Verify webhook signature
    const isValidSignature = await this.withdrawalWebhookService.verifyWebhookSignature(
      WithdrawalGateway.MERCADOPAGO,
      JSON.stringify(payload),
      signature,
      process.env.MERCADOPAGO_WEBHOOK_SECRET || '',
    );

    if (!isValidSignature) {
      this.logger.warn('Invalid MercadoPago webhook signature');
      throw new UnauthorizedException('Invalid signature');
    }

    // Only process transfer-related actions
    if (!payload.action.startsWith('transfer.')) {
      this.logger.log(`Ignoring non-transfer action: ${payload.action}`);
      return { success: true };
    }

    try {
      await this.withdrawalWebhookService.handleMercadoPagoWebhook(payload);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to process MercadoPago webhook: ${error.message}`);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  @Public()
  @Post('pagarme')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pagar.me withdrawal webhook endpoint',
    description: 'Receives notifications from Pagar.me about withdrawal status changes'
  })
  @ApiHeader({
    name: 'x-hub-signature',
    description: 'Pagar.me webhook signature for verification',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async handlePagarMeWebhook(
    @Body() payload: PagarMeWithdrawalWebhookDto,
    @Headers('x-hub-signature') signature: string,
  ): Promise<{ success: boolean }> {
    this.logger.log(`Received Pagar.me webhook: ${payload.event}`);

    if (!signature) {
      throw new UnauthorizedException('Missing Pagar.me signature');
    }

    // Verify webhook signature
    const isValidSignature = await this.withdrawalWebhookService.verifyWebhookSignature(
      WithdrawalGateway.PAGARME,
      JSON.stringify(payload),
      signature,
      process.env.PAGARME_WEBHOOK_SECRET || '',
    );

    if (!isValidSignature) {
      this.logger.warn('Invalid Pagar.me webhook signature');
      throw new UnauthorizedException('Invalid signature');
    }

    // Only process transfer-related events
    if (!payload.event.includes('transfer')) {
      this.logger.log(`Ignoring non-transfer event: ${payload.event}`);
      return { success: true };
    }

    try {
      await this.withdrawalWebhookService.handlePagarMeWebhook(payload);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to process Pagar.me webhook: ${error.message}`);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  @Public()
  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Test webhook endpoint',
    description: 'Test endpoint for webhook integration development'
  })
  @ApiResponse({ status: 200, description: 'Test webhook received' })
  async handleTestWebhook(@Body() payload: any): Promise<{ success: boolean; received: any }> {
    this.logger.log('Received test webhook:', JSON.stringify(payload));
    return { 
      success: true, 
      received: payload 
    };
  }
}