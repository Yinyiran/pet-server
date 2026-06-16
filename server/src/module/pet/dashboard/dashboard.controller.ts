import { Controller, Get, Query } from '@nestjs/common';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { DashboardService } from './dashboard.service';

@Controller('pet/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @RequirePermission('pet:dashboard:list')
  overview() {
    return this.dashboardService.getOverview();
  }

  @Get('trend')
  @RequirePermission('pet:dashboard:list')
  trend(@Query('days') days: number = 7) {
    return this.dashboardService.getTrend(+days || 7);
  }

  @Get('user-trend')
  @RequirePermission('pet:dashboard:list')
  userTrend(@Query('days') days: number = 7) {
    return this.dashboardService.getUserTrend(+days || 7);
  }

  @Get('top-products')
  @RequirePermission('pet:dashboard:list')
  topProducts(@Query('limit') limit: number = 10) {
    return this.dashboardService.getTopProducts(+limit || 10);
  }
}
