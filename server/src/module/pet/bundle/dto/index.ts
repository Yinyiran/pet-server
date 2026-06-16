import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PagingDto } from 'src/common/dto/index';

export class BundleItemDto {
  @ApiProperty({ required: true }) @IsNumber() productId: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() qty?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() sortOrder?: number;
}

export class CreateBundleDto {
  @ApiProperty({ required: true }) @IsString() @Length(1, 128) name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() coverImg?: string;
  @ApiProperty({ required: true }) @IsNumber() bundlePrice: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() originalPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() sortOrder?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => BundleItemDto) items?: BundleItemDto[];
}

export class UpdateBundleDto extends CreateBundleDto {
  @ApiProperty({ required: true }) @IsNumber() id: number;
}

export class ListBundleDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() keyword?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
}
