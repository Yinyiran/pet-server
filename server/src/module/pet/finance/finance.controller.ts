import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { FinanceService } from './finance.service';
import { ListPointsLogDto, ListRechargeLogDto, ListConsumptionLogDto } from './dto/index';

@ApiTags('业务-积分记录')
@ApiBearerAuth('Authorization')
@Controller('pet/finance/points')
export class PointsController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: '积分记录列表' })
  @Get()
  @RequirePermission('pet:finance:list')
  list(@Query() query: ListPointsLogDto) {
    return this.financeService.findPointsLogs(query);
  }
}

@ApiTags('业务-充值记录')
@ApiBearerAuth('Authorization')
@Controller('pet/finance/recharge')
export class RechargeController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: '充值记录列表' })
  @Get()
  @RequirePermission('pet:finance:list')
  list(@Query() query: ListRechargeLogDto) {
    return this.financeService.findRechargeLogs(query);
  }
}

@ApiTags('业务-消费记录')
@ApiBearerAuth('Authorization')
@Controller('pet/finance/consumption')
export class ConsumptionController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: '消费记录列表' })
  @Get()
  @RequirePermission('pet:finance:list')
  list(@Query() query: ListConsumptionLogDto) {
    return this.financeService.findConsumptionLogs(query);
  }
}

@ApiTags('小程序-财务管理')
@ApiBearerAuth('Authorization')
@Controller('app/finance')
export class AppFinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: '我的积分记录' })
  @Get('points')
  myPoints(@Req() req) {
    return this.financeService.getMyPointsLogs(req.user?.userId);
  }

  @ApiOperation({ summary: '我的充值记录' })
  @Get('recharges')
  myRecharges(@Req() req) {
    return this.financeService.getMyRecharges(req.user?.userId);
  }

  @ApiOperation({ summary: '我的消费记录' })
  @Get('consumptions')
  myConsumptions(@Req() req) {
    return this.financeService.getMyConsumptions(req.user?.userId);
  }

  @ApiOperation({ summary: '每日签到' })
  @Get('sign-in')
  signIn(@Req() req) {
    return this.financeService.signIn(req.user?.userId);
  }
}
