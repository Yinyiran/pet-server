import { IsString, IsOptional, IsNumber, Length, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class CreateCourseDto {
  @ApiProperty({ required: true }) @IsString() @Length(1, 128) name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tier?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: true }) @IsNumber() price: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() heroImg?: string;
  @ApiProperty({ required: false }) @IsOptional() features?: any;
  @ApiProperty({ required: false }) @IsOptional() chapterList?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() sortOrder?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
}

export class UpdateCourseDto extends CreateCourseDto {
  @ApiProperty({ required: true }) @IsNumber() id: number;
}

export class ListCourseDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() keyword?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tier?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isActive?: number;
}

// 视频
export class CreateVideoDto {
  @ApiProperty({ required: true }) @IsNumber() courseId: number;
  @ApiProperty({ required: true }) @IsString() title: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() videoUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() thumbnail?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() duration?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() isFree?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() sortOrder?: number;
}

export class UpdateVideoDto extends CreateVideoDto {
  @ApiProperty({ required: true }) @IsNumber() id: number;
}

// 学员
export class ListStudentDto extends PagingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() courseId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}
