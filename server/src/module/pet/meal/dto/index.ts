import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListMealPlanDto {
  @IsOptional() @IsString() petType?: string;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @IsNumber() isActive?: number;
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() pageNum?: number;
  @IsOptional() pageSize?: number;
}

export class CreateMealPlanDto {
  @IsString() petType: string;
  @IsString() name: string;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() matchRules?: any;
  @IsOptional() ingredients?: any;
  @IsOptional() @Type(() => Number) monthlyPrice?: number;
  @IsOptional() @Type(() => Number) sortOrder?: number;
  @IsOptional() @Type(() => Number) isDefault?: number;
  @IsOptional() @Type(() => Number) isActive?: number;
}

export class UpdateMealPlanDto extends CreateMealPlanDto {
  @Type(() => Number) id: number;
}

export class ListQuizRecordDto {
  @IsOptional() @Type(() => Number) userId?: number;
  @IsOptional() @IsString() petType?: string;
  @IsOptional() @IsString() constitutionType?: string;
  @IsOptional() pageNum?: number;
  @IsOptional() pageSize?: number;
}

export class ListMealOrderDto {
  @IsOptional() @Type(() => Number) userId?: number;
  @IsOptional() @Type(() => Number) planId?: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() pageNum?: number;
  @IsOptional() pageSize?: number;
}

export class SubmitQuizDto {
  @IsOptional() @Type(() => Number) petId?: number;
  @IsString() petType: string;
  @IsOptional() answers?: any;
  @IsOptional() @IsString() constitutionType?: string;
  @IsOptional() @IsString() constitutionDesc?: string;
  @IsOptional() @IsString() tags?: string;
}

export class CreateMealOrderDto {
  @Type(() => Number) planId: number;
  @IsOptional() @Type(() => Number) quizId?: number;
  @IsOptional() @Type(() => Number) mealFreq?: number;
  @IsOptional() @Type(() => Number) mealDays?: number;
}
