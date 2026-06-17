import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('业务-数据看板')
@ApiBearerAuth('Authorization')
@Controller('pet/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: '数据总览' })
  @Get('overview')
  @RequirePermission('pet:dashboard:list')
  overview() {
    return this.dashboardService.getOverview();
  }

  @ApiOperation({ summary: '销售趋势' })
  @Get('trend')
  @RequirePermission('pet:dashboard:list')
  trend(@Query('days') days: number = 7) {
    return this.dashboardService.getTrend(+days || 7);
  }

  @ApiOperation({ summary: '用户增长趋势' })
  @Get('user-trend')
  @RequirePermission('pet:dashboard:list')
  userTrend(@Query('days') days: number = 7) {
    return this.dashboardService.getUserTrend(+days || 7);
  }

  @ApiOperation({ summary: '热销商品排行' })
  @Get('top-products')
  @RequirePermission('pet:dashboard:list')
  topProducts(@Query('limit') limit: number = 10) {
    return this.dashboardService.getTopProducts(+limit || 10);
  }
}
