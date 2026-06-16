import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlanEntity } from './entities/meal-plan.entity';
import { MealIngredientEntity } from './entities/meal-ingredient.entity';
import { QuizRecordEntity } from './entities/quiz-record.entity';
import { MealOrderEntity } from './entities/meal-order.entity';
import { MealService } from './meal.service';
import { MealPlanController, QuizRecordController, MealOrderController, AppMealController } from './meal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlanEntity, MealIngredientEntity, QuizRecordEntity, MealOrderEntity])],
  controllers: [MealPlanController, QuizRecordController, MealOrderController, AppMealController],
  providers: [MealService],
})
export class MealModule {}
