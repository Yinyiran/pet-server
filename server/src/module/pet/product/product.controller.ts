import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ListProductDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('业务-商品管理')
@ApiBearerAuth('Authorization')
@Controller('pet/product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @ApiOperation({ summary: '商品列表' })
  @RequirePermission('pet:product:list')
  @Get('list')
  findAll(@Query() query: ListProductDto) { return this.service.findAll(query); }

  @ApiOperation({ summary: '商品详情' })
  @RequirePermission('pet:product:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ summary: '新增商品' })
  @RequirePermission('pet:product:add')
  @Post()
  create(@Body() dto: CreateProductDto) { return this.service.create(dto); }

  @ApiOperation({ summary: '更新商品' })
  @RequirePermission('pet:product:edit')
  @Put()
  update(@Body() dto: UpdateProductDto) { return this.service.update(dto); }

  @ApiOperation({ summary: '删除商品' })
  @RequirePermission('pet:product:remove')
  @Delete(':ids')
  remove(@Param('ids') ids: string) { return this.service.remove(ids); }

  @ApiOperation({ summary: '上下架商品' })
  @RequirePermission('pet:product:edit')
  @Put(':id/status')
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: number) { return this.service.toggleStatus(+id, isActive); }

  @ApiOperation({ summary: '批量上下架' })
  @RequirePermission('pet:product:edit')
  @Put('batch/status')
  batchToggleStatus(@Body('ids') ids: string, @Body('isActive') isActive: number) { return this.service.batchToggleStatus(ids, isActive); }
}

@ApiTags('小程序-商品')
@ApiBearerAuth('Authorization')
@Controller('app/product')
export class AppProductController {
  constructor(private readonly service: ProductService) {}

  @ApiOperation({ summary: '商品列表' })
  @Get('list')
  getList(@Query() query: { category?: string; keyword?: string; pageNum?: number; pageSize?: number }) { return this.service.getAppProducts(query); }

  @ApiOperation({ summary: '商品详情' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ summary: '限时特供' })
  @Get('flash/list')
  getFlash() { return this.service.getFlashProducts(); }
}
