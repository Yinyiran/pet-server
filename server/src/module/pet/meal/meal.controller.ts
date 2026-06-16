import { Controller, Get, Post, Body, Query, Param, Put, Delete, Req } from '@nestjs/common';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { MealService } from './meal.service';
import { ListMealPlanDto, CreateMealPlanDto, UpdateMealPlanDto, ListQuizRecordDto, ListMealOrderDto, SubmitQuizDto, CreateMealOrderDto } from './dto/index';

@Controller('pet/meal/plan')
export class MealPlanController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  @RequirePermission('pet:meal:list')
  list(@Query() query: ListMealPlanDto) {
    return this.mealService.findPlans(query);
  }

  @Get(':id')
  @RequirePermission('pet:meal:list')
  detail(@Param('id') id: number) {
    return this.mealService.findPlanDetail(id);
  }

  @Post()
  @RequirePermission('pet:meal:add')
  create(@Body() dto: CreateMealPlanDto) {
    return this.mealService.createPlan(dto);
  }

  @Put()
  @RequirePermission('pet:meal:edit')
  update(@Body() dto: UpdateMealPlanDto) {
    return this.mealService.updatePlan(dto);
  }

  @Delete(':ids')
  @RequirePermission('pet:meal:remove')
  remove(@Param('ids') ids: string) {
    return this.mealService.removePlan(ids);
  }

  @Get(':id/ingredients')
  @RequirePermission('pet:meal:list')
  ingredients(@Param('id') id: number) {
    return this.mealService.findIngredients(id);
  }

  @Post(':id/ingredients')
  @RequirePermission('pet:meal:edit')
  saveIngredients(@Param('id') id: number, @Body() body: { items: any[] }) {
    return this.mealService.saveIngredients(id, body.items || []);
  }
}

@Controller('pet/meal/quiz')
export class QuizRecordController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  @RequirePermission('pet:meal:list')
  list(@Query() query: ListQuizRecordDto) {
    return this.mealService.findQuizRecords(query);
  }
}

@Controller('pet/meal/order')
export class MealOrderController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  @RequirePermission('pet:meal:list')
  list(@Query() query: ListMealOrderDto) {
    return this.mealService.findOrders(query);
  }

  @Get(':id')
  @RequirePermission('pet:meal:list')
  detail(@Param('id') id: number) {
    return this.mealService.findOrderDetail(id);
  }
}

@Controller('app/meal')
export class AppMealController {
  constructor(private readonly mealService: MealService) {}

  @Post('quiz')
  submitQuiz(@Req() req, @Body() dto: SubmitQuizDto) {
    return this.mealService.submitQuiz(req.user?.userId, dto);
  }

  @Get('quiz')
  myQuizRecords(@Req() req) {
    return this.mealService.getMyQuizRecords(req.user?.userId);
  }

  @Get('plans')
  plans(@Query('petType') petType?: string) {
    return this.mealService.getAppPlans(petType);
  }

  @Post('order')
  createOrder(@Req() req, @Body() dto: CreateMealOrderDto) {
    return this.mealService.createMealOrder(req.user?.userId, dto);
  }

  @Get('orders')
  myOrders(@Req() req) {
    return this.mealService.getMyMealOrders(req.user?.userId);
  }
}
