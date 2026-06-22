import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

// ---- 商家 ----
export class CreateMerchantDto {
  @ApiProperty({ required: true }) @IsString() @Length(1, 128) name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() tags?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() score?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imgUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() businessHours?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() lat?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() lng?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class UpdateMerchantDto extends CreateMerchantDto {
  @ApiProperty({ required: true }) @IsNumber() id: number;
}

export class ListMerchantDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() keyword?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

// ---- 入驻申请 ----
export class CreateApplyDto {
  @ApiProperty({ required: true }) @IsString() @Length(1, 128) name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() merchantType?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contact?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() wechat?: string;
}

export class ListApplyDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() keyword?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

// ---- 附近商家 ----
export class NearbyMerchantDto extends PagingDto {
  @ApiProperty({ description: '用户纬度', required: true }) @IsNumber() userLat: number;
  @ApiProperty({ description: '用户经度', required: true }) @IsNumber() userLng: number;
  @ApiProperty({ description: '最大距离(km)，默认10', required: false }) @IsOptional() @IsNumber() maxDistance?: number;
  @ApiProperty({ description: '商家类型', required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ description: '关键词', required: false }) @IsOptional() @IsString() keyword?: string;
}
