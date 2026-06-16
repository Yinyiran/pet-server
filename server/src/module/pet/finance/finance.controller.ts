import { Controller, Get, Query, Req } from '@nestjs/common';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { FinanceService } from './finance.service';
import { ListPointsLogDto, ListRechargeLogDto, ListConsumptionLogDto } from './dto/index';

@Controller('pet/finance/points')
export class PointsController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  @RequirePermission('pet:finance:list')
  list(@Query() query: ListPointsLogDto) {
    return this.financeService.findPointsLogs(query);
  }
}

@Controller('pet/finance/recharge')
export class RechargeController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  @RequirePermission('pet:finance:list')
  list(@Query() query: ListRechargeLogDto) {
    return this.financeService.findRechargeLogs(query);
  }
}

@Controller('pet/finance/consumption')
export class ConsumptionController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  @RequirePermission('pet:finance:list')
  list(@Query() query: ListConsumptionLogDto) {
    return this.financeService.findConsumptionLogs(query);
  }
}

@Controller('app/finance')
export class AppFinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('points')
  myPoints(@Req() req) {
    return this.financeService.getMyPointsLogs(req.user?.userId);
  }

  @Get('recharges')
  myRecharges(@Req() req) {
    return this.financeService.getMyRecharges(req.user?.userId);
  }

  @Get('consumptions')
  myConsumptions(@Req() req) {
    return this.financeService.getMyConsumptions(req.user?.userId);
  }

  @Get('sign-in')
  signIn(@Req() req) {
    return this.financeService.signIn(req.user?.userId);
  }
}
