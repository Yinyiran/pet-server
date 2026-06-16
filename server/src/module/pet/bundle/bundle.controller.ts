import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BundleService } from './bundle.service';
import { CreateBundleDto, UpdateBundleDto, ListBundleDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@ApiTags('业务-商品组合包')
@ApiBearerAuth('Authorization')
@Controller('pet/bundle')
export class BundleController {
  constructor(private readonly service: BundleService) {}

  @ApiOperation({ summary: '组合包列表' })
  @RequirePermission('pet:bundle:list')
  @Get('list')
  findAll(@Query() query: ListBundleDto) { return this.service.findAll(query); }

  @ApiOperation({ summary: '组合包详情' })
  @RequirePermission('pet:bundle:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ summary: '新增组合包' })
  @RequirePermission('pet:bundle:add')
  @Post()
  create(@Body() dto: CreateBundleDto) { return this.service.create(dto); }

  @ApiOperation({ summary: '更新组合包' })
  @RequirePermission('pet:bundle:edit')
  @Put()
  update(@Body() dto: UpdateBundleDto) { return this.service.update(dto); }

  @ApiOperation({ summary: '删除组合包' })
  @RequirePermission('pet:bundle:remove')
  @Delete(':ids')
  remove(@Param('ids') ids: string) { return this.service.remove(ids); }

  @ApiOperation({ summary: '上下架组合包' })
  @RequirePermission('pet:bundle:edit')
  @Put(':id/status')
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: number) { return this.service.toggleStatus(+id, isActive); }
}

@ApiTags('小程序-商品组合包')
@ApiBearerAuth('Authorization')
@Controller('app/bundle')
export class AppBundleController {
  constructor(private readonly service: BundleService) {}

  @ApiOperation({ summary: '组合包列表' })
  @Get('list')
  getList() { return this.service.getActiveBundles(); }

  @ApiOperation({ summary: '组合包详情' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.getBundleDetail(+id); }
}
