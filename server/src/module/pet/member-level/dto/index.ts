import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberLevelDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(1, 32)
  levelKey: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(1, 32)
  name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  threshold: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  nextThreshold?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  pointsRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  privileges?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateMemberLevelDto extends CreateMemberLevelDto {}
