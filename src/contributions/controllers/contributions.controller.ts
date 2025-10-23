import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContributionsService } from '../services/contributions.service';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { UpdateContributionStatusDto, ContributionResponseDto } from '../dto/update-contribution-status.dto';
import { ContributionFiltersDto } from '../dto/contribution-filters.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Controller for managing contributions to gift events
 * Handles contribution creation, status updates, and queries
 */
@ApiTags('contributions')
@Controller('contributions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new contribution',
    description: 'Creates a new contribution for a specific gift event. The contribution starts with pending status.',
  })
  @ApiResponse({
    status: 201,
    description: 'Contribution created successfully',
    type: ContributionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid contribution data provided' })
  @ApiResponse({ status: 404, description: 'Gift event not found' })
  @ApiResponse({ status: 409, description: 'Gift cannot receive contributions' })
  async create(@Body() createContributionDto: CreateContributionDto): Promise<ContributionResponseDto> {
    return await this.contributionsService.create(createContributionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List contributions',
    description: 'Retrieves a paginated list of contributions with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Contributions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        contributions: {
          type: 'array',
          items: { $ref: '#/components/schemas/ContributionResponseDto' },
        },
        total: { type: 'number', example: 150 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 20 },
        totalPages: { type: 'number', example: 8 },
      },
    },
  })
  async findAll(@Query() filters: ContributionFiltersDto): Promise<{
    contributions: ContributionResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return await this.contributionsService.findAll(filters);
  }

  @Get('gift-event/:eventGiftId')
  @ApiOperation({
    summary: 'Get contributions by gift event',
    description: 'Retrieves all contributions for a specific gift event',
  })
  @ApiParam({ name: 'eventGiftId', description: 'Gift event ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Contributions retrieved successfully',
    type: [ContributionResponseDto],
  })
  async findByEventGiftId(
    @Param('eventGiftId', ParseIntPipe) eventGiftId: number,
  ): Promise<ContributionResponseDto[]> {
    return await this.contributionsService.findByEventGiftId(eventGiftId);
  }

  @Get('gift-event/:eventGiftId/stats')
  @ApiOperation({
    summary: 'Get contribution statistics',
    description: 'Retrieves contribution statistics for a specific gift event',
  })
  @ApiParam({ name: 'eventGiftId', description: 'Gift event ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalContributions: { type: 'number', example: 25 },
        totalAmount: { type: 'number', example: 1250.00 },
        netAmount: { type: 'number', example: 1180.50 },
        pendingAmount: { type: 'number', example: 200.00 },
        approvedAmount: { type: 'number', example: 1050.00 },
        contributorCount: { type: 'number', example: 18 },
      },
    },
  })
  async getGiftEventStats(
    @Param('eventGiftId', ParseIntPipe) eventGiftId: number,
  ): Promise<{
    totalContributions: number;
    totalAmount: number;
    netAmount: number;
    pendingAmount: number;
    approvedAmount: number;
    contributorCount: number;
  }> {
    return await this.contributionsService.getGiftEventStats(eventGiftId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get contribution details',
    description: 'Retrieves detailed information about a specific contribution',
  })
  @ApiParam({ name: 'id', description: 'Contribution ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Contribution details retrieved successfully',
    type: ContributionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Contribution not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ContributionResponseDto> {
    return await this.contributionsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update contribution payment status',
    description: 'Updates the payment status of a contribution and synchronizes the gift event collected value',
  })
  @ApiParam({ name: 'id', description: 'Contribution ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Contribution status updated successfully',
    type: ContributionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid status transition or missing required data' })
  @ApiResponse({ status: 404, description: 'Contribution not found' })
  @ApiResponse({ status: 409, description: 'Contribution cannot be updated (invalid state)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContributionStatusDto: UpdateContributionStatusDto,
  ): Promise<ContributionResponseDto> {
    return await this.contributionsService.updateStatus(id, updateContributionStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete contribution',
    description: 'Soft deletes a contribution. Only pending contributions can be deleted.',
  })
  @ApiParam({ name: 'id', description: 'Contribution ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Contribution deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contribution not found' })
  @ApiResponse({ status: 409, description: 'Contribution cannot be deleted (invalid state)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.contributionsService.remove(id);
  }
}