import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { ListOrderDto, ShipOrderDto, ListPaymentDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@ApiTags('业务-订单管理')
@ApiBearerAuth('Authorization')
@Controller('pet/order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @ApiOperation({ summary: '订单列表' })
  @RequirePermission('pet:order:list')
  @Get('list')
  findAll(@Query() query: ListOrderDto) { return this.service.findAll(query); }

  @ApiOperation({ summary: '订单详情' })
  @RequirePermission('pet:order:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ summary: '订单发货' })
  @RequirePermission('pet:order:edit')
  @Put(':id/ship')
  ship(@Param('id') id: string, @Body() dto: ShipOrderDto) { return this.service.shipOrder(+id, dto); }

  @ApiOperation({ summary: '更新订单状态' })
  @RequirePermission('pet:order:edit')
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) { return this.service.updateOrderStatus(+id, status); }
}

@ApiTags('业务-支付记录')
@ApiBearerAuth('Authorization')
@Controller('pet/payment')
export class PaymentController {
  constructor(private readonly service: OrderService) {}

  @ApiOperation({ summary: '支付记录列表' })
  @RequirePermission('pet:payment:list')
  @Get('list')
  findAll(@Query() query: ListPaymentDto) { return this.service.findPayments(query); }
}

@ApiTags('小程序-购物车与订单')
@ApiBearerAuth('Authorization')
@Controller('app/order')
export class AppOrderController {
  constructor(private readonly service: OrderService) {}

  // 购物车
  @ApiOperation({ summary: '购物车列表' })
  @Get('cart/list')
  getCart(@Req() req: any) { return this.service.getCartList(req.user?.userId); }

  @ApiOperation({ summary: '加入购物车' })
  @Post('cart')
  addCart(@Req() req: any, @Body() body: any) { return this.service.addToCart(req.user?.userId, body); }

  @ApiOperation({ summary: '更新购物车' })
  @Put('cart')
  updateCart(@Req() req: any, @Body() body: any) { return this.service.updateCart(req.user?.userId, body); }

  @ApiOperation({ summary: '删除购物车' })
  @Put('cart/remove')
  removeCart(@Req() req: any, @Body('ids') ids: string) { return this.service.removeFromCart(req.user?.userId, ids); }

  // 订单
  @ApiOperation({ summary: '创建订单' })
  @Post()
  create(@Req() req: any, @Body() body: any) { return this.service.createOrder(req.user?.userId, body); }

  @ApiOperation({ summary: '我的订单列表' })
  @Get('list')
  getList(@Req() req: any, @Query() query: any) { return this.service.getAppOrders(req.user?.userId, query); }

  @ApiOperation({ summary: '订单详情' })
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) { return this.service.getAppOrderDetail(req.user?.userId, +id); }

  @ApiOperation({ summary: '确认收货' })
  @Put(':id/receive')
  receive(@Req() req: any, @Param('id') id: string) { return this.service.confirmReceive(req.user?.userId, +id); }

  @ApiOperation({ summary: '取消订单' })
  @Put(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) { return this.service.cancelOrder(req.user?.userId, +id); }
}
