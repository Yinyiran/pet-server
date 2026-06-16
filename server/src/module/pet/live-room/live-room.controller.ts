import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LiveRoomService } from './live-room.service';
import { CreateLiveRoomDto, UpdateLiveRoomDto, ListLiveRoomDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('业务-直播间管理')
@ApiBearerAuth('Authorization')
@Controller('pet/live-room')
export class LiveRoomController {
  constructor(private readonly service: LiveRoomService) {}

  @ApiOperation({ summary: '直播间列表' })
  @RequirePermission('pet:liveRoom:list')
  @Get('list')
  findAll(@Query() query: ListLiveRoomDto) { return this.service.findAll(query); }

  @ApiOperation({ summary: '直播间详情' })
  @RequirePermission('pet:liveRoom:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ summary: '新增直播间' })
  @RequirePermission('pet:liveRoom:add')
  @Post()
  create(@Body() dto: CreateLiveRoomDto) { return this.service.create(dto); }

  @ApiOperation({ summary: '更新直播间' })
  @RequirePermission('pet:liveRoom:edit')
  @Put()
  update(@Body() dto: UpdateLiveRoomDto) { return this.service.update(dto); }

  @ApiOperation({ summary: '删除直播间' })
  @RequirePermission('pet:liveRoom:remove')
  @Delete(':ids')
  remove(@Param('ids') ids: string) { return this.service.remove(ids); }

  @ApiOperation({ summary: '启用/禁用' })
  @RequirePermission('pet:liveRoom:edit')
  @Put(':id/status')
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: number) { return this.service.toggleStatus(+id, isActive); }
}

@ApiTags('小程序-直播间')
@ApiBearerAuth('Authorization')
@Controller('app/live-room')
export class AppLiveRoomController {
  constructor(private readonly service: LiveRoomService) {}

  @ApiOperation({ summary: '直播间列表' })
  @Get('list')
  getList() { return this.service.getActiveRooms(); }
}
