import { Controller, Get, Post, Put, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroupBuyingService } from './group-buying.service';
import { StartGroupDto, JoinGroupDto, ListGroupDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@ApiTags('业务-拼团管理')
@ApiBearerAuth('Authorization')
@Controller('pet/group')
export class GroupBuyingController {
  constructor(private readonly service: GroupBuyingService) {}

  @ApiOperation({ summary: '拼团列表' })
  @RequirePermission('pet:group:list')
  @Get('list')
  findAll(@Query() query: ListGroupDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: '拼团详情' })
  @RequirePermission('pet:group:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @ApiOperation({ summary: '手动处理过期拼团' })
  @RequirePermission('pet:group:edit')
  @Post('expire-check')
  checkExpired() {
    return this.service.checkAndExpireGroups();
  }
}

@ApiTags('小程序-拼团')
@ApiBearerAuth('Authorization')
@Controller('app/group')
export class AppGroupBuyingController {
  constructor(private readonly service: GroupBuyingService) {}

  @ApiOperation({ summary: '发起拼团' })
  @Post('start')
  startGroup(@Request() req, @Body() dto: StartGroupDto) {
    return this.service.startGroup(req.user?.userId || 0, dto);
  }

  @ApiOperation({ summary: '参加拼团' })
  @Post('join')
  joinGroup(@Request() req, @Body() dto: JoinGroupDto) {
    return this.service.joinGroup(req.user?.userId || 0, dto);
  }

  @ApiOperation({ summary: '商品进行中的拼团列表' })
  @Get('product/:productId')
  getProductGroups(@Param('productId') productId: string) {
    return this.service.getProductGroups(+productId);
  }

  @ApiOperation({ summary: '我的拼团列表' })
  @Get('my/list')
  getMyGroups(@Request() req, @Query() query: { status?: string; pageNum?: number; pageSize?: number }) {
    return this.service.getUserGroups(req.user?.userId || 0, query);
  }

  @ApiOperation({ summary: '拼团详情（动态路由放最后）' })
  @Get(':groupNo')
  getDetail(@Param('groupNo') groupNo: string) {
    return this.service.getGroupDetail(groupNo);
  }

  @ApiOperation({ summary: '触发过期拼团检查' })
  @Post('expire-check')
  checkExpired() {
    return this.service.checkAndExpireGroups();
  }
}
