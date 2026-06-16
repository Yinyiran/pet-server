import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class CreateBannerDto {
  @ApiProperty({ required: true })
  @IsString() @Length(1, 64)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @Length(0, 128)
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  bgImg?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  bgColor?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  btnText?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  btnColor?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  linkType?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  linkValue?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsNumber()
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsNumber()
  isActive?: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  validFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  validUntil?: string;
}

export class UpdateBannerDto extends CreateBannerDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;
}

export class ListBannerDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsNumber()
  isActive?: number;
}
