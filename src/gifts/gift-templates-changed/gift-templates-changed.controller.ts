import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GiftTemplatesChangedService } from './gift-templates-changed.service';
import { CreateGiftTemplateChangedDto } from './create-gift-template-changed.dto';
import { UpdateGiftTemplateChangedDto } from './update-gift-template-changed.dto';
import { GiftTemplateOutputDto } from '../dto/gift-output.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserId } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('gift-templates-changed')
@Controller('gift-templates-changed')
@UseGuards(JwtAuthGuard)
export class GiftTemplatesChangedController {
  constructor(
    private readonly giftTemplatesChangedService: GiftTemplatesChangedService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a customized version of a gift template',
    description: 'Create a personalized variation of an existing gift template with custom values'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Gift template customization created successfully',
    type: GiftTemplateOutputDto 
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot customize private templates' })
  @ApiResponse({ status: 404, description: 'Not Found - Base template not found' })
  async create(
    @Body() createGiftTemplateChangedDto: CreateGiftTemplateChangedDto,
    @UserId() userId: number,
  ) {
    return this.giftTemplatesChangedService.create(createGiftTemplateChangedDto, userId);
  }

  @Get('public')
  @Public()
  @ApiOperation({ 
    summary: 'List public customized gift templates',
    description: 'Get all public customized gift templates that can be reused by anyone'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of public customized gift templates',
    type: [GiftTemplateOutputDto] 
  })
  async findPublicChanged() {
    return this.giftTemplatesChangedService.findPublicChanged();
  }

  @Get('my-customizations')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user\'s customized templates',
    description: 'Get all gift template customizations created by the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of user customizations',
    type: [GiftTemplateOutputDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async findMyCustomizations(@UserId() userId: number) {
    return this.giftTemplatesChangedService.findByUserId(userId);
  }

  @Get('by-template/:giftTemplateId')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get customizations of a specific template',
    description: 'Get customizations based on a specific gift template. Only shows public customizations or your own private ones.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of customizations for the template',
    type: [GiftTemplateOutputDto] 
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid template ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async findByGiftTemplateId(
    @Param('giftTemplateId', ParseIntPipe) giftTemplateId: number,
    @UserId() userId: number
  ) {
    if (giftTemplateId <= 0) {
      throw new BadRequestException('Gift template ID must be a positive number');
    }
    return this.giftTemplatesChangedService.findByGiftTemplateId(giftTemplateId, userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get a specific customized template',
    description: 'Get details of a specific customized gift template'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Customized gift template details',
    type: GiftTemplateOutputDto 
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot view private customizations' })
  @ApiResponse({ status: 404, description: 'Not Found - Customization not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId?: number,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive number');
    }
    return this.giftTemplatesChangedService.findById(id, userId);
  }

  @Get(':id/combined')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get combined data (base template + customization)',
    description: 'Get merged data showing the final result of base template + customizations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Combined template data',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot view private customizations' })
  @ApiResponse({ status: 404, description: 'Not Found - Customization not found' })
  async getCombinedData(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId?: number,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive number');
    }
    return this.giftTemplatesChangedService.getCombinedData(id, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update a customized template',
    description: 'Update an existing customized gift template (only by the creator)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Customized template updated successfully',
    type: GiftTemplateOutputDto 
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update your own customizations' })
  @ApiResponse({ status: 404, description: 'Not Found - Customization not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGiftTemplateChangedDto: UpdateGiftTemplateChangedDto,
    @UserId() userId: number,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive number');
    }
    return this.giftTemplatesChangedService.update(id, updateGiftTemplateChangedDto, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete a customized template',
    description: 'Delete an existing customized gift template (only by the creator)'
  })
  @ApiResponse({ status: 200, description: 'Customized template deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete your own customizations' })
  @ApiResponse({ status: 404, description: 'Not Found - Customization not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive number');
    }
    await this.giftTemplatesChangedService.remove(id, userId);
    return { message: 'Gift template customization deleted successfully' };
  }

  @Get('stats/count-by-user')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Count user\'s customizations',
    description: 'Get the total count of customizations created by the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Count of user customizations',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        count: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async countByUser(@UserId() userId: number) {
    const count = await this.giftTemplatesChangedService.countByUserId(userId);
    return { userId, count };
  }

  @Get('stats/count-by-template/:giftTemplateId')
  @Public()
  @ApiOperation({ 
    summary: 'Count customizations of a template',
    description: 'Get the total count of customizations based on a specific gift template'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Count of template customizations',
    schema: {
      type: 'object',
      properties: {
        giftTemplateId: { type: 'number' },
        count: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid template ID' })
  async countByGiftTemplate(
    @Param('giftTemplateId', ParseIntPipe) giftTemplateId: number,
  ) {
    if (giftTemplateId <= 0) {
      throw new BadRequestException('Gift template ID must be a positive number');
    }
    const count = await this.giftTemplatesChangedService.countByGiftTemplateId(giftTemplateId);
    return { giftTemplateId, count };
  }
}