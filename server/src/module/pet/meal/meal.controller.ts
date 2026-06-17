import { Controller, Get, Post, Body, Query, Param, Put, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { MealService } from './meal.service';
import { ListMealPlanDto, CreateMealPlanDto, UpdateMealPlanDto, ListQuizRecordDto, ListMealOrderDto, SubmitQuizDto, CreateMealOrderDto } from './dto/index';

@ApiTags('业务-配餐管理')
@ApiBearerAuth('Authorization')
@Controller('pet/meal/plan')
export class MealPlanController {
  constructor(private readonly mealService: MealService) {}

  @ApiOperation({ summary: '配餐方案列表' })
  @Get()
  @RequirePermission('pet:meal:list')
  list(@Query() query: ListMealPlanDto) {
    return this.mealService.findPlans(query);
  }

  @ApiOperation({ summary: '配餐方案详情' })
  @Get(':id')
  @RequirePermission('pet:meal:list')
  detail(@Param('id') id: number) {
    return this.mealService.findPlanDetail(id);
  }

  @ApiOperation({ summary: '新增配餐方案' })
  @Post()
  @RequirePermission('pet:meal:add')
  create(@Body() dto: CreateMealPlanDto) {
    return this.mealService.createPlan(dto);
  }

  @ApiOperation({ summary: '更新配餐方案' })
  @Put()
  @RequirePermission('pet:meal:edit')
  update(@Body() dto: UpdateMealPlanDto) {
    return this.mealService.updatePlan(dto);
  }

  @ApiOperation({ summary: '删除配餐方案' })
  @Delete(':ids')
  @RequirePermission('pet:meal:remove')
  remove(@Param('ids') ids: string) {
    return this.mealService.removePlan(ids);
  }

  @ApiOperation({ summary: '查询方案配料' })
  @Get(':id/ingredients')
  @RequirePermission('pet:meal:list')
  ingredients(@Param('id') id: number) {
    return this.mealService.findIngredients(id);
  }

  @ApiOperation({ summary: '保存方案配料' })
  @Post(':id/ingredients')
  @RequirePermission('pet:meal:edit')
  saveIngredients(@Param('id') id: number, @Body() body: { items: any[] }) {
    return this.mealService.saveIngredients(id, body.items || []);
  }
}

@ApiTags('业务-配餐答题')
@ApiBearerAuth('Authorization')
@Controller('pet/meal/quiz')
export class QuizRecordController {
  constructor(private readonly mealService: MealService) {}

  @ApiOperation({ summary: '答题记录列表' })
  @Get()
  @RequirePermission('pet:meal:list')
  list(@Query() query: ListQuizRecordDto) {
    return this.mealService.findQuizRecords(query);
  }
}

@ApiTags('业务-配餐订单')
@ApiBearerAuth('Authorization')
@Controller('pet/meal/order')
export class MealOrderController {
  constructor(private readonly mealService: MealService) {}

  @ApiOperation({ summary: '配餐订单列表' })
  @Get()
  @RequirePermission('pet:meal:list')
  list(@Query() query: ListMealOrderDto) {
    return this.mealService.findOrders(query);
  }

  @ApiOperation({ summary: '配餐订单详情' })
  @Get(':id')
  @RequirePermission('pet:meal:list')
  detail(@Param('id') id: number) {
    return this.mealService.findOrderDetail(id);
  }
}

@ApiTags('小程序-配餐管理')
@ApiBearerAuth('Authorization')
@Controller('app/meal')
export class AppMealController {
  constructor(private readonly mealService: MealService) {}

  @ApiOperation({ summary: '提交答题' })
  @Post('quiz')
  submitQuiz(@Req() req, @Body() dto: SubmitQuizDto) {
    return this.mealService.submitQuiz(req.user?.userId, dto);
  }

  @ApiOperation({ summary: '我的答题记录' })
  @Get('quiz')
  myQuizRecords(@Req() req) {
    return this.mealService.getMyQuizRecords(req.user?.userId);
  }

  @ApiOperation({ summary: '配餐方案列表(小程序)' })
  @Get('plans')
  plans(@Query('petType') petType?: string) {
    return this.mealService.getAppPlans(petType);
  }

  @ApiOperation({ summary: '创建配餐订单' })
  @Post('order')
  createOrder(@Req() req, @Body() dto: CreateMealOrderDto) {
    return this.mealService.createMealOrder(req.user?.userId, dto);
  }

  @ApiOperation({ summary: '我的配餐订单' })
  @Get('orders')
  myOrders(@Req() req) {
    return this.mealService.getMyMealOrders(req.user?.userId);
  }
}
