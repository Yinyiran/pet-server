import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

// ---- 订单 ----
export class ListOrderDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() orderNo?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() userId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class ShipOrderDto {
  @ApiProperty({ required: true }) @IsString() logisticsCompany: string;
  @ApiProperty({ required: true }) @IsString() logisticsNo: string;
}

// ---- 购物车 ----
export class AddCartDto {
  @ApiProperty({ required: true }) @IsNumber() productId: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() qty?: number;
  @ApiProperty({ required: false }) @IsOptional() selectedSpec?: any;
}

export class UpdateCartDto {
  @ApiProperty({ required: true }) @IsNumber() id: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() qty?: number;
  @ApiProperty({ required: false }) @IsOptional() selectedSpec?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isChecked?: number;
}

export class CreateOrderDto {
  @ApiProperty({ required: true }) @IsNumber() addressId: number;
  @ApiProperty({ required: true }) @IsString() cartIds: string;
}

// ---- 支付 ----
export class ListPaymentDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() orderNo?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() method?: string;
}
