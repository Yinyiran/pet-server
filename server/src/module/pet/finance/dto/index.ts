import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListPointsLogDto {
  @IsOptional() @Type(() => Number) userId?: number;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() pageNum?: number;
  @IsOptional() pageSize?: number;
}

export class ListRechargeLogDto {
  @IsOptional() @Type(() => Number) userId?: number;
  @IsOptional() @IsString() method?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() pageNum?: number;
  @IsOptional() pageSize?: number;
}

export class ListConsumptionLogDto {
  @IsOptional() @Type(() => Number) userId?: number;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() pageNum?: number;
  @IsOptional() pageSize?: number;
}
