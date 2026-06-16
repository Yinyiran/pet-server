import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetUserService } from './pet-user.service';
import { ListUserDto, UpdatePetUserDto, CreateAddressDto, UpdateAddressDto, CreatePetDto, UpdatePetDto, WxLoginDto, UpdateProfileDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@ApiTags('业务-用户管理')
@ApiBearerAuth('Authorization')
@Controller('pet/user')
export class PetUserController {
  constructor(private readonly petUserService: PetUserService) {}

  @ApiOperation({ summary: '用户列表' })
  @RequirePermission('pet:user:list')
  @Get('list')
  findAll(@Query() query: ListUserDto) {
    return this.petUserService.findAll(query);
  }

  @ApiOperation({ summary: '用户详情' })
  @RequirePermission('pet:user:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petUserService.findOne(+id);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @RequirePermission('pet:user:edit')
  @Put()
  update(@Body() dto: UpdatePetUserDto) {
    return this.petUserService.update(dto);
  }

  @ApiOperation({ summary: '启用/禁用用户' })
  @RequirePermission('pet:user:edit')
  @Put(':id/status')
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: number) {
    return this.petUserService.toggleStatus(+id, isActive);
  }

  @ApiOperation({ summary: '宠物列表' })
  @RequirePermission('pet:user:list')
  @Get('pet/list')
  findPetList(@Query() query: { userId?: number; type?: string; pageNum?: number; pageSize?: number }) {
    return this.petUserService.findPetList(query);
  }

  @ApiOperation({ summary: '用户地址列表' })
  @RequirePermission('pet:user:list')
  @Get('address/:userId')
  findAddressList(@Param('userId') userId: string) {
    return this.petUserService.findAddressList(+userId);
  }
}

// ==================== 小程序端 Controller ====================
@ApiTags('小程序-用户')
@ApiBearerAuth('Authorization')
@Controller('app/user')
export class AppUserController {
  constructor(private readonly petUserService: PetUserService) {}

  @ApiOperation({ summary: '微信登录' })
  @Post('wxLogin')
  wxLogin(@Body() dto: WxLoginDto) {
    return this.petUserService.wxLogin(dto.code);
  }

  @ApiOperation({ summary: '获取个人信息' })
  @Get('profile')
  getProfile(@Request() req) {
    return this.petUserService.getAppProfile(req.user?.userId || 0);
  }

  @ApiOperation({ summary: '更新个人资料' })
  @Put('profile')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.petUserService.updateAppProfile(req.user?.userId || 0, dto);
  }

  // ---- 地址 ----
  @ApiOperation({ summary: '我的地址列表' })
  @Get('address')
  myAddresses(@Request() req) {
    return this.petUserService.findAddressList(req.user?.userId || 0);
  }

  @ApiOperation({ summary: '新增地址' })
  @Post('address')
  createAddress(@Request() req, @Body() dto: CreateAddressDto) {
    dto.userId = req.user?.userId || 0;
    return this.petUserService.createAddress(dto);
  }

  @ApiOperation({ summary: '更新地址' })
  @Put('address')
  updateAddress(@Request() req, @Body() dto: UpdateAddressDto) {
    dto.userId = req.user?.userId || 0;
    return this.petUserService.updateAddress(dto);
  }

  @ApiOperation({ summary: '删除地址' })
  @Delete('address/:id')
  deleteAddress(@Param('id') id: string) {
    return this.petUserService.deleteAddress(+id);
  }

  // ---- 宠物 ----
  @ApiOperation({ summary: '我的宠物列表' })
  @Get('pet')
  myPets(@Request() req) {
    return this.petUserService.getAppPets(req.user?.userId || 0);
  }

  @ApiOperation({ summary: '新增宠物' })
  @Post('pet')
  createPet(@Request() req, @Body() dto: CreatePetDto) {
    dto.userId = req.user?.userId || 0;
    return this.petUserService.createPet(dto);
  }

  @ApiOperation({ summary: '更新宠物' })
  @Put('pet')
  updatePet(@Body() dto: UpdatePetDto) {
    return this.petUserService.updatePet(dto);
  }

  @ApiOperation({ summary: '删除宠物' })
  @Delete('pet/:id')
  deletePet(@Param('id') id: string) {
    return this.petUserService.deletePet(+id);
  }
}
