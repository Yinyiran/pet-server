import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class StartGroupDto {
  @ApiProperty({ required: true, description: '商品ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ required: true, description: '拼团人数规格' })
  @IsNumber()
  groupSize: number;
}

export class JoinGroupDto {
  @ApiProperty({ required: true, description: '拼团编号' })
  @IsString()
  @Length(1, 32)
  groupNo: string;
}

export class ListGroupDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  leaderId?: number;
}
