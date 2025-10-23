import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  Headers,
  RawBody,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';
import { TransactionResponseDto, CreateTransactionResponseDto } from '../dto/transaction-response.dto';

/**
 * Controller for transaction management and payment gateway integration
 */
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Create a new transaction
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Creates a new transaction and processes it through the selected payment gateway',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: CreateTransactionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or payment gateway error',
  })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<CreateTransactionResponseDto> {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  /**
   * Get transaction by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Retrieves detailed information about a specific transaction',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  async getTransaction(@Param('id', ParseIntPipe) id: number): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.findById(id);
    
    return {
      id: transaction.id,
      contributionId: transaction.contributionId,
      paymentGateway: transaction.paymentGateway,
      externalTransactionId: transaction.externalTransactionId,
      amount: transaction.amount,
      fee: transaction.fee,
      netAmount: transaction.netAmount,
      status: transaction.status,
      paymentDate: transaction.paymentDate,
      refundDate: transaction.refundDate,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  /**
   * Update transaction status
   */
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update transaction status',
    description: 'Updates transaction status via gateway callback or manual intervention',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction status updated successfully',
    type: TransactionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid status transition or transaction in final state',
  })
  async updateTransactionStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionStatusDto: UpdateTransactionStatusDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.updateTransactionStatus(id, updateTransactionStatusDto);
    
    return {
      id: transaction.id,
      contributionId: transaction.contributionId,
      paymentGateway: transaction.paymentGateway,
      externalTransactionId: transaction.externalTransactionId,
      amount: transaction.amount,
      fee: transaction.fee,
      netAmount: transaction.netAmount,
      status: transaction.status,
      paymentDate: transaction.paymentDate,
      refundDate: transaction.refundDate,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  /**
   * Get transactions for a contribution
   */
  @Get('contribution/:contributionId')
  @ApiOperation({
    summary: 'Get transactions by contribution ID',
    description: 'Retrieves all transactions associated with a specific contribution',
  })
  @ApiParam({
    name: 'contributionId',
    description: 'Contribution ID',
    type: 'integer',
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions found',
    type: [TransactionResponseDto],
  })
  async getTransactionsByContribution(
    @Param('contributionId', ParseIntPipe) contributionId: number,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionsService.findByContributionId(contributionId);
    
    return transactions.map(transaction => ({
      id: transaction.id,
      contributionId: transaction.contributionId,
      paymentGateway: transaction.paymentGateway,
      externalTransactionId: transaction.externalTransactionId,
      amount: transaction.amount,
      fee: transaction.fee,
      netAmount: transaction.netAmount,
      status: transaction.status,
      paymentDate: transaction.paymentDate,
      refundDate: transaction.refundDate,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));
  }

  /**
   * Sync transaction status with gateway
   */
  @Post(':id/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync transaction with gateway',
    description: 'Synchronizes transaction status with the payment gateway',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction synchronized successfully',
    type: TransactionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  @ApiBadRequestResponse({
    description: 'Transaction has no external ID or gateway sync failed',
  })
  async syncTransaction(@Param('id', ParseIntPipe) id: number): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.syncTransactionStatus(id);
    
    return {
      id: transaction.id,
      contributionId: transaction.contributionId,
      paymentGateway: transaction.paymentGateway,
      externalTransactionId: transaction.externalTransactionId,
      amount: transaction.amount,
      fee: transaction.fee,
      netAmount: transaction.netAmount,
      status: transaction.status,
      paymentDate: transaction.paymentDate,
      refundDate: transaction.refundDate,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  /**
   * Process transaction refund
   */
  @Post(':id/refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process transaction refund',
    description: 'Processes a refund for a paid transaction through the payment gateway',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'integer',
    example: 1,
  })
  @ApiQuery({
    name: 'amount',
    description: 'Refund amount (optional, defaults to full amount)',
    type: 'number',
    required: false,
    example: 25.00,
  })
  @ApiQuery({
    name: 'reason',
    description: 'Refund reason',
    type: 'string',
    required: false,
    example: 'Customer request',
  })
  @ApiResponse({
    status: 200,
    description: 'Refund processed successfully',
    type: TransactionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  @ApiBadRequestResponse({
    description: 'Transaction cannot be refunded or refund processing failed',
  })
  async processRefund(
    @Param('id', ParseIntPipe) id: number,
    @Query('amount') amount?: number,
    @Query('reason') reason?: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.processRefund(id, amount, reason);
    
    return {
      id: transaction.id,
      contributionId: transaction.contributionId,
      paymentGateway: transaction.paymentGateway,
      externalTransactionId: transaction.externalTransactionId,
      amount: transaction.amount,
      fee: transaction.fee,
      netAmount: transaction.netAmount,
      status: transaction.status,
      paymentDate: transaction.paymentDate,
      refundDate: transaction.refundDate,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  /**
   * Handle payment gateway webhooks
   */
  @Post('webhook/:gateway')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Handle payment gateway webhook',
    description: 'Processes webhook notifications from payment gateways',
  })
  @ApiParam({
    name: 'gateway',
    description: 'Payment gateway name',
    type: 'string',
    example: 'stripe',
  })
  @ApiHeader({
    name: 'X-Stripe-Signature',
    description: 'Webhook signature for validation',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        processed: { type: 'boolean', example: true },
        transactionId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid webhook signature or processing error',
  })
  async handleWebhook(
    @Param('gateway') gateway: string,
    @Headers('x-stripe-signature') signature: string,
    @RawBody() payload: Buffer,
  ): Promise<{ processed: boolean; transactionId?: number }> {
    const payloadString = payload.toString();
    return this.transactionsService.handleWebhook(signature, payloadString, gateway);
  }

  /**
   * Get transaction statistics for a contribution
   */
  @Get('contribution/:contributionId/stats')
  @ApiOperation({
    summary: 'Get transaction statistics',
    description: 'Retrieves transaction statistics for a specific contribution',
  })
  @ApiParam({
    name: 'contributionId',
    description: 'Contribution ID',
    type: 'integer',
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 5 },
        paid: { type: 'number', example: 3 },
        failed: { type: 'number', example: 1 },
        totalAmount: { type: 'number', example: 150.00 },
        paidAmount: { type: 'number', example: 142.50 },
      },
    },
  })
  async getTransactionStats(@Param('contributionId', ParseIntPipe) contributionId: number) {
    return this.transactionsService.getTransactionStats(contributionId);
  }
}