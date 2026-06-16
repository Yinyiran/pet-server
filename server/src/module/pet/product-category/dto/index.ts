import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(1, 64)
  name: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  isActive?: number;
}

export class UpdateProductCategoryDto extends CreateProductCategoryDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;
}
