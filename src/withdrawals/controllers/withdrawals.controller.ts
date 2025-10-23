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
  UseGuards,
  Request,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { WithdrawalsService } from '../services/withdrawals.service';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';
import { UpdateWithdrawalStatusDto } from '../dto/update-withdrawal-status.dto';
import { 
  WithdrawalResponseDto, 
  CreateWithdrawalResponseDto, 
  BalanceResponseDto 
} from '../dto/withdrawal-response.dto';
import { WithdrawalStatus } from '../entities/withdrawal.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';

/**
 * Controller for withdrawal management and payout processing
 */
@ApiTags('withdrawals')
@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  /**
   * Create a new withdrawal request
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new withdrawal request',
    description: 'Creates a withdrawal request for the authenticated user with the specified amount and bank account',
  })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal request created successfully',
    type: CreateWithdrawalResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data, insufficient balance, or validation error',
  })
  async createWithdrawal(
    @CurrentUser() user: { userId: number },
    @Body() createWithdrawalDto: CreateWithdrawalDto,
  ): Promise<CreateWithdrawalResponseDto> {
    return this.withdrawalsService.createWithdrawal(user.userId, createWithdrawalDto);
  }

  /**
   * Get user's available balance
   */
  @Get('balance')
  @ApiOperation({
    summary: 'Get user available balance',
    description: 'Retrieves the current available balance and withdrawal information for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Balance information retrieved successfully',
    type: BalanceResponseDto,
  })
  async getUserBalance(
    @CurrentUser() user: { userId: number },
  ): Promise<BalanceResponseDto> {
    return this.withdrawalsService.getUserBalance(user.userId);
  }

  /**
   * Get user's withdrawal statistics
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Get user withdrawal statistics',
    description: 'Retrieves withdrawal statistics and history for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 10 },
        completed: { type: 'number', example: 8 },
        pending: { type: 'number', example: 1 },
        failed: { type: 'number', example: 1 },
        totalAmount: { type: 'number', example: 2500.00 },
        completedAmount: { type: 'number', example: 2000.00 },
        pendingAmount: { type: 'number', example: 300.00 },
      },
    },
  })
  async getUserWithdrawalStats(@CurrentUser() user: { userId: number }) {
    return this.withdrawalsService.getUserWithdrawalStats(user.userId);
  }

  /**
   * Get withdrawal by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get withdrawal by ID',
    description: 'Retrieves detailed information about a specific withdrawal',
  })
  @ApiParam({
    name: 'id',
    description: 'Withdrawal ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal found',
    type: WithdrawalResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Withdrawal not found',
  })
  @ApiForbiddenResponse({
    description: 'Access denied - you can only access your own withdrawals',
  })
  async getWithdrawal(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number },
  ): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalsService.findById(id, user.userId);
    
    return {
      id: withdrawal.id,
      userId: withdrawal.userId,
      totalAmount: withdrawal.totalAmount,
      feeAmount: withdrawal.feeAmount,
      netAmount: withdrawal.netAmount,
      status: withdrawal.status,
      paymentGateway: withdrawal.paymentGateway,
      transactionReference: withdrawal.transactionReference,
      bankAccount: withdrawal.bankAccount,
      requestedAt: withdrawal.requestedAt,
      processedAt: withdrawal.processedAt,
      metadata: withdrawal.metadata,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    };
  }

  /**
   * Get user's withdrawals
   */
  @Get('user/me')
  @ApiOperation({
    summary: 'Get current user withdrawals',
    description: 'Retrieves all withdrawals for the authenticated user',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter by withdrawal status',
    enum: WithdrawalStatus,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawals retrieved successfully',
    type: [WithdrawalResponseDto],
  })
  async getUserWithdrawals(
    @CurrentUser() user: { userId: number },
    @Query('status') status?: WithdrawalStatus,
  ): Promise<WithdrawalResponseDto[]> {
    const withdrawals = await this.withdrawalsService.findByUserId(user.userId, status);
    
    return withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      userId: withdrawal.userId,
      totalAmount: withdrawal.totalAmount,
      feeAmount: withdrawal.feeAmount,
      netAmount: withdrawal.netAmount,
      status: withdrawal.status,
      paymentGateway: withdrawal.paymentGateway,
      transactionReference: withdrawal.transactionReference,
      bankAccount: withdrawal.bankAccount,
      requestedAt: withdrawal.requestedAt,
      processedAt: withdrawal.processedAt,
      metadata: withdrawal.metadata,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    }));
  }

  /**
   * Update withdrawal status (for system/webhook use)
   */
  @Patch(':id/status')
  @Public() // This endpoint might be called by webhooks without user authentication
  @ApiOperation({
    summary: 'Update withdrawal status',
    description: 'Updates withdrawal status via gateway callback or system intervention',
  })
  @ApiParam({
    name: 'id',
    description: 'Withdrawal ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal status updated successfully',
    type: WithdrawalResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Withdrawal not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid status transition or withdrawal in final state',
  })
  async updateWithdrawalStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWithdrawalStatusDto: UpdateWithdrawalStatusDto,
  ): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalsService.updateWithdrawalStatus(id, updateWithdrawalStatusDto);
    
    return {
      id: withdrawal.id,
      userId: withdrawal.userId,
      totalAmount: withdrawal.totalAmount,
      feeAmount: withdrawal.feeAmount,
      netAmount: withdrawal.netAmount,
      status: withdrawal.status,
      paymentGateway: withdrawal.paymentGateway,
      transactionReference: withdrawal.transactionReference,
      bankAccount: withdrawal.bankAccount,
      requestedAt: withdrawal.requestedAt,
      processedAt: withdrawal.processedAt,
      metadata: withdrawal.metadata,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    };
  }

  /**
   * Cancel a pending withdrawal
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel a withdrawal request',
    description: 'Cancels a pending withdrawal request for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'Withdrawal ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal cancelled successfully',
    type: WithdrawalResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Withdrawal not found',
  })
  @ApiBadRequestResponse({
    description: 'Withdrawal cannot be cancelled (not in pending status)',
  })
  @ApiForbiddenResponse({
    description: 'Access denied - you can only cancel your own withdrawals',
  })
  async cancelWithdrawal(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number },
  ): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalsService.cancelWithdrawal(id, user.userId);
    
    return {
      id: withdrawal.id,
      userId: withdrawal.userId,
      totalAmount: withdrawal.totalAmount,
      feeAmount: withdrawal.feeAmount,
      netAmount: withdrawal.netAmount,
      status: withdrawal.status,
      paymentGateway: withdrawal.paymentGateway,
      transactionReference: withdrawal.transactionReference,
      bankAccount: withdrawal.bankAccount,
      requestedAt: withdrawal.requestedAt,
      processedAt: withdrawal.processedAt,
      metadata: withdrawal.metadata,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    };
  }

  /**
   * Validate bank account information
   */
  @Post('validate-bank-account')
  @ApiOperation({
    summary: 'Validate bank account information',
    description: 'Validates bank account details before creating a withdrawal',
  })
  @ApiResponse({
    status: 200,
    description: 'Bank account validation result',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean', example: true },
        errors: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['Invalid bank code format'],
          nullable: true 
        },
      },
    },
  })
  async validateBankAccount(@Body() bankAccount: any) {
    return this.withdrawalsService.validateBankAccount(bankAccount);
  }

  // Admin endpoints (would typically be in a separate admin controller)

  /**
   * Get overdue withdrawals (Admin only)
   */
  @Get('admin/overdue')
  @Public() // In real app, this would have admin guard
  @ApiOperation({
    summary: 'Get overdue withdrawals (Admin)',
    description: 'Retrieves withdrawals that are pending for too long and need attention',
  })
  @ApiQuery({
    name: 'hours',
    description: 'Hours threshold for considering overdue',
    type: 'number',
    required: false,
    example: 24,
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue withdrawals retrieved successfully',
    type: [WithdrawalResponseDto],
  })
  async getOverdueWithdrawals(
    @Query('hours', ParseIntPipe) hours: number = 24,
  ): Promise<WithdrawalResponseDto[]> {
    const withdrawals = await this.withdrawalsService.findOverdueWithdrawals(hours);
    
    return withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      userId: withdrawal.userId,
      totalAmount: withdrawal.totalAmount,
      feeAmount: withdrawal.feeAmount,
      netAmount: withdrawal.netAmount,
      status: withdrawal.status,
      paymentGateway: withdrawal.paymentGateway,
      transactionReference: withdrawal.transactionReference,
      bankAccount: withdrawal.bankAccount,
      requestedAt: withdrawal.requestedAt,
      processedAt: withdrawal.processedAt,
      metadata: withdrawal.metadata,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    }));
  }
}