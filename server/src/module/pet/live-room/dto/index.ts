import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class CreateLiveRoomDto {
  @ApiProperty({ required: true }) @IsString() @Length(1, 128) name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() platform?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() roomId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() shareCode?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() coverImg?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() liveUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() sortOrder?: number;
}

export class UpdateLiveRoomDto extends CreateLiveRoomDto {
  @ApiProperty({ required: true }) @IsNumber() id: number;
}

export class ListLiveRoomDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() keyword?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
}
