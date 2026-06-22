import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class CreateProductDto {
  @ApiProperty({ required: true }) @IsString() @Length(1, 128) name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: true }) @IsNumber() price: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() originalPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() stock?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tags?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imgUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() gallery?: any;
  @ApiProperty({ required: false }) @IsOptional() specs?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() merchantId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isFlash?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() flashPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() flashStart?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() flashEnd?: string;
  @ApiProperty({ required: false, description: '拼团配置JSON [{size,discount}]' }) @IsOptional() groupBuyConfig?: any;
}

export class UpdateProductDto extends CreateProductDto {
  @ApiProperty({ required: true }) @IsNumber() id: number;
}

export class ListProductDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() keyword?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() merchantId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isFlash?: number;
  @ApiProperty({ required: false, enum: ['official', 'merchant'] }) @IsOptional() @IsString() source?: string;
}
