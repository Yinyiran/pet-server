import { Module } from '@nestjs/common';
import { PetUserModule } from './user/pet-user.module';
import { MemberLevelModule } from './member-level/member-level.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { BannerModule } from './banner/banner.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PetUserModule, MemberLevelModule, ProductCategoryModule, BannerModule, ProductModule],
})
export class PetModule {}
