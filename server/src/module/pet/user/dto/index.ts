import { IsString, IsOptional, IsNumber, IsEnum, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class ListUserDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 64)
  keyword?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memberLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  isActive?: number;
}

export class UpdatePetUserDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 64)
  nickname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memberLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  isActive?: number;
}

// ---- 收货地址 DTO ----
export class CreateAddressDto {
  @ApiProperty({ required: true })
  @IsNumber()
  userId: number;

  @ApiProperty({ required: true })
  @IsString()
  @Length(1, 32)
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  phone: string;

  @ApiProperty({ required: true })
  @IsString()
  region: string;

  @ApiProperty({ required: true })
  @IsString()
  detail: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  isDefault?: number;
}

export class UpdateAddressDto extends CreateAddressDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;
}

// ---- 宠物 DTO ----
export class CreatePetDto {
  @ApiProperty({ required: true })
  @IsNumber()
  userId: number;

  @ApiProperty({ required: true })
  @IsString()
  @Length(1, 64)
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  gender?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  isNeutered?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ageGroup?: string;
}

export class UpdatePetDto extends CreatePetDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;
}

// ---- 小程序端 DTO ----
export class WxLoginDto {
  @ApiProperty({ required: true })
  @IsString()
  code: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  gender?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;
}
