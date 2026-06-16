import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MemberLevelService } from './member-level.service';
import { CreateMemberLevelDto, UpdateMemberLevelDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('业务-会员等级')
@ApiBearerAuth('Authorization')
@Controller('pet/member-level')
export class MemberLevelController {
  constructor(private readonly service: MemberLevelService) {}

  @ApiOperation({ summary: '等级列表' })
  @RequirePermission('pet:memberLevel:list')
  @Get('list')
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: '等级详情' })
  @RequirePermission('pet:memberLevel:query')
  @Get(':levelKey')
  findOne(@Param('levelKey') levelKey: string) {
    return this.service.findOne(levelKey);
  }

  @ApiOperation({ summary: '新增等级' })
  @RequirePermission('pet:memberLevel:add')
  @Post()
  create(@Body() dto: CreateMemberLevelDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: '更新等级' })
  @RequirePermission('pet:memberLevel:edit')
  @Put()
  update(@Body() dto: UpdateMemberLevelDto) {
    return this.service.update(dto);
  }

  @ApiOperation({ summary: '删除等级' })
  @RequirePermission('pet:memberLevel:remove')
  @Delete(':levelKey')
  remove(@Param('levelKey') levelKey: string) {
    return this.service.remove(levelKey);
  }
}
