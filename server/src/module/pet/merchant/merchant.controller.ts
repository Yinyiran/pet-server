import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto, UpdateMerchantDto, ListMerchantDto, CreateApplyDto, ListApplyDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('业务-同城商家')
@ApiBearerAuth('Authorization')
@Controller('pet/merchant')
export class MerchantController {
  constructor(private readonly service: MerchantService) {}

  @ApiOperation({ summary: '商家列表' })
  @RequirePermission('pet:merchant:list')
  @Get('list')
  findAll(@Query() query: ListMerchantDto) { return this.service.findAll(query); }

  @ApiOperation({ summary: '商家详情' })
  @RequirePermission('pet:merchant:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findMerchant(+id); }

  @ApiOperation({ summary: '新增商家' })
  @RequirePermission('pet:merchant:add')
  @Post()
  create(@Body() dto: CreateMerchantDto) { return this.service.createMerchant(dto); }

  @ApiOperation({ summary: '更新商家' })
  @RequirePermission('pet:merchant:edit')
  @Put()
  update(@Body() dto: UpdateMerchantDto) { return this.service.updateMerchant(dto); }

  @ApiOperation({ summary: '删除商家' })
  @RequirePermission('pet:merchant:remove')
  @Delete(':ids')
  remove(@Param('ids') ids: string) { return this.service.removeMerchant(ids); }

  @ApiOperation({ summary: '启用/禁用商家' })
  @RequirePermission('pet:merchant:edit')
  @Put(':id/status')
  toggleStatus(@Param('id') id: string, @Body('status') status: string) { return this.service.toggleMerchantStatus(+id, status); }
}

@ApiTags('业务-入驻申请')
@ApiBearerAuth('Authorization')
@Controller('pet/merchant-apply')
export class MerchantApplyController {
  constructor(private readonly service: MerchantService) {}

  @ApiOperation({ summary: '申请列表' })
  @RequirePermission('pet:merchant-apply:list')
  @Get('list')
  findAll(@Query() query: ListApplyDto) { return this.service.findApplies(query); }

  @ApiOperation({ summary: '申请详情' })
  @RequirePermission('pet:merchant-apply:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findApply(+id); }

  @ApiOperation({ summary: '审核申请' })
  @RequirePermission('pet:merchant-apply:edit')
  @Put(':id/review')
  review(@Param('id') id: string, @Body('status') status: string) { return this.service.reviewApply(+id, status); }
}

@ApiTags('小程序-同城商家')
@ApiBearerAuth('Authorization')
@Controller('app/merchant')
export class AppMerchantController {
  constructor(private readonly service: MerchantService) {}

  @ApiOperation({ summary: '商家列表' })
  @Get('list')
  getList(@Query() query: { type?: string; keyword?: string; pageNum?: number; pageSize?: number }) { return this.service.getAppMerchants(query); }

  @ApiOperation({ summary: '商家详情' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.getAppMerchantDetail(+id); }

  @ApiOperation({ summary: '提交入驻申请' })
  @Post('apply')
  apply(@Body() dto: CreateApplyDto) { return this.service.submitApply(dto); }
}
