import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@ApiTags('业务-商品分类')
@ApiBearerAuth('Authorization')
@Controller('pet/product-category')
export class ProductCategoryController {
  constructor(private readonly service: ProductCategoryService) {}

  @ApiOperation({ summary: '分类树列表' })
  @RequirePermission('pet:productCategory:list')
  @Get('tree')
  findTree() {
    return this.service.findTree();
  }

  @ApiOperation({ summary: '全部分类(平铺)' })
  @Get('list')
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: '新增分类' })
  @RequirePermission('pet:productCategory:add')
  @Post()
  create(@Body() dto: CreateProductCategoryDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: '更新分类' })
  @RequirePermission('pet:productCategory:edit')
  @Put()
  update(@Body() dto: UpdateProductCategoryDto) {
    return this.service.update(dto);
  }

  @ApiOperation({ summary: '删除分类' })
  @RequirePermission('pet:productCategory:remove')
  @Delete(':ids')
  remove(@Param('ids') ids: string) {
    return this.service.remove(ids);
  }
}

// 小程序端
@ApiTags('小程序-商品分类')
@ApiBearerAuth('Authorization')
@Controller('app/product-category')
export class AppProductCategoryController {
  constructor(private readonly service: ProductCategoryService) {}

  @ApiOperation({ summary: '分类树(小程序)' })
  @Get('tree')
  findTree() {
    return this.service.findTree();
  }
}
