import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RefundService } from './refund.service';
import { ListRefundDto, AuditRefundDto, CreateRefundDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('业务-售后管理')
@ApiBearerAuth('Authorization')
@Controller('pet/refund')
export class RefundController {
  constructor(private readonly service: RefundService) {}

  @ApiOperation({ summary: '售后列表' })
  @RequirePermission('pet:refund:list')
  @Get('list')
  findAll(@Query() query: ListRefundDto) { return this.service.findAll(query); }

  @ApiOperation({ summary: '售后详情' })
  @RequirePermission('pet:refund:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ summary: '售后审核' })
  @RequirePermission('pet:refund:edit')
  @Put(':id/audit')
  audit(@Param('id') id: string, @Body() dto: AuditRefundDto) { return this.service.audit(+id, dto); }
}

@ApiTags('小程序-售后')
@ApiBearerAuth('Authorization')
@Controller('app/refund')
export class AppRefundController {
  constructor(private readonly service: RefundService) {}

  @ApiOperation({ summary: '申请售后' })
  @Post()
  submit(@Req() req: any, @Body() dto: CreateRefundDto) { return this.service.submitRefund(req.user?.userId, dto); }

  @ApiOperation({ summary: '我的售后列表' })
  @Get('list')
  getList(@Req() req: any, @Query() query: any) { return this.service.getAppRefunds(req.user?.userId, query); }

  @ApiOperation({ summary: '售后详情' })
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) { return this.service.getAppRefundDetail(req.user?.userId, +id); }
}
