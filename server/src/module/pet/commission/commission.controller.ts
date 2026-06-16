import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommissionService } from './commission.service';
import { CreateTierDto, UpdateTierDto, ListAccountDto, ListLogDto, ListInviteDto, ListWithdrawDto, AuditWithdrawDto, ApplyWithdrawDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('业务-分佣等级')
@ApiBearerAuth('Authorization')
@Controller('pet/commission-tier')
export class TierController {
  constructor(private readonly service: CommissionService) {}
  @ApiOperation({ summary: '等级列表' }) @RequirePermission('pet:commission:tier') @Get('list') findList() { return this.service.findTiers(); }
  @ApiOperation({ summary: '新增等级' }) @RequirePermission('pet:commission:tier') @Post() create(@Body() dto: CreateTierDto) { return this.service.createTier(dto); }
  @ApiOperation({ summary: '更新等级' }) @RequirePermission('pet:commission:tier') @Put() update(@Body() dto: UpdateTierDto) { return this.service.updateTier(dto); }
}

@ApiTags('业务-分佣账户')
@ApiBearerAuth('Authorization')
@Controller('pet/commission-account')
export class AccountController {
  constructor(private readonly service: CommissionService) {}
  @ApiOperation({ summary: '账户列表' }) @RequirePermission('pet:commission:account') @Get('list') findList(@Query() q: ListAccountDto) { return this.service.findAccounts(q); }
}

@ApiTags('业务-佣金流水')
@ApiBearerAuth('Authorization')
@Controller('pet/commission-log')
export class LogController {
  constructor(private readonly service: CommissionService) {}
  @ApiOperation({ summary: '流水列表' }) @RequirePermission('pet:commission:log') @Get('list') findList(@Query() q: ListLogDto) { return this.service.findLogs(q); }
}

@ApiTags('业务-邀请关系')
@ApiBearerAuth('Authorization')
@Controller('pet/commission-invite')
export class InviteController {
  constructor(private readonly service: CommissionService) {}
  @ApiOperation({ summary: '邀请列表' }) @RequirePermission('pet:commission:invite') @Get('list') findList(@Query() q: ListInviteDto) { return this.service.findInvites(q); }
}

@ApiTags('业务-提现审核')
@ApiBearerAuth('Authorization')
@Controller('pet/commission-withdraw')
export class WithdrawController {
  constructor(private readonly service: CommissionService) {}
  @ApiOperation({ summary: '提现列表' }) @RequirePermission('pet:commission:withdraw') @Get('list') findList(@Query() q: ListWithdrawDto) { return this.service.findWithdraws(q); }
  @ApiOperation({ summary: '审核提现' }) @RequirePermission('pet:commission:withdraw') @Put(':id/audit') audit(@Param('id') id: string, @Body() dto: AuditWithdrawDto) { return this.service.auditWithdraw(+id, dto); }
}

@ApiTags('小程序-分佣')
@ApiBearerAuth('Authorization')
@Controller('app/commission')
export class AppCommissionController {
  constructor(private readonly service: CommissionService) {}
  @ApiOperation({ summary: '我的分佣账户' }) @Get('account') getAccount(@Req() req: any) { return this.service.getMyCommission(req.user?.userId); }
  @ApiOperation({ summary: '佣金流水' }) @Get('logs') getLogs(@Req() req: any, @Query() q: any) { return this.service.getMyLogs(req.user?.userId, q); }
  @ApiOperation({ summary: '邀请列表' }) @Get('invites') getInvites(@Req() req: any) { return this.service.getMyInvites(req.user?.userId); }
  @ApiOperation({ summary: '申请提现' }) @Post('withdraw') apply(@Req() req: any, @Body() dto: ApplyWithdrawDto) { return this.service.applyWithdraw(req.user?.userId, dto); }
}
