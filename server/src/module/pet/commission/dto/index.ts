import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

// 分佣等级
export class CreateTierDto {
  @ApiProperty({ required: true }) @IsString() @Length(1, 32) name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() level?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() icon?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() commissionRate?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rates?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() upgradeCondition?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() qualification?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isHidden?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
}
export class UpdateTierDto extends CreateTierDto { @ApiProperty({ required: true }) @IsNumber() id: number; }

// 账户
export class ListAccountDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() userId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() tierId?: number;
}

// 佣金流水
export class ListLogDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() userId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

// 邀请关系
export class ListInviteDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() parentId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() userId?: number;
}

// 提现
export class ListWithdrawDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() userId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}
export class AuditWithdrawDto {
  @ApiProperty({ required: true }) @IsString() status: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() auditRemark?: string;
}

// 小程序端 - 提现申请
export class ApplyWithdrawDto {
  @ApiProperty({ required: true }) @IsNumber() amount: number;
  @ApiProperty({ required: true }) @IsString() method: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() accountInfo?: string;
}
