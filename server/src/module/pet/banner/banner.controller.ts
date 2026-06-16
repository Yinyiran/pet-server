import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto, ListBannerDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@ApiTags('业务-Banner轮播')
@ApiBearerAuth('Authorization')
@Controller('pet/banner')
export class BannerController {
  constructor(private readonly service: BannerService) {}

  @ApiOperation({ summary: 'Banner列表' })
  @RequirePermission('pet:banner:list')
  @Get('list')
  findAll(@Query() query: ListBannerDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Banner详情' })
  @RequirePermission('pet:banner:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @ApiOperation({ summary: '新增Banner' })
  @RequirePermission('pet:banner:add')
  @Post()
  create(@Body() dto: CreateBannerDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: '更新Banner' })
  @RequirePermission('pet:banner:edit')
  @Put()
  update(@Body() dto: UpdateBannerDto) {
    return this.service.update(dto);
  }

  @ApiOperation({ summary: '删除Banner' })
  @RequirePermission('pet:banner:remove')
  @Delete(':ids')
  remove(@Param('ids') ids: string) {
    return this.service.remove(ids);
  }
}

@ApiTags('小程序-Banner')
@ApiBearerAuth('Authorization')
@Controller('app/banner')
export class AppBannerController {
  constructor(private readonly service: BannerService) {}

  @ApiOperation({ summary: '获取当前有效Banner' })
  @Get('active')
  getActive() {
    return this.service.getActiveBanners();
  }
}
