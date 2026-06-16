import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class CreateRefundDto {
  @ApiProperty({ required: true }) @IsString() orderNo: string;
  @ApiProperty({ required: true }) @IsString() type: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() refundAmount?: number;
}

export class ListRefundDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() orderNo?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() userId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
}

export class AuditRefundDto {
  @ApiProperty({ required: true }) @IsString() status: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() remark?: string;
}
