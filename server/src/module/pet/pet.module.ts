import { Module } from '@nestjs/common';
import { PetUserModule } from './user/pet-user.module';
import { MemberLevelModule } from './member-level/member-level.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { BannerModule } from './banner/banner.module';
import { ProductModule } from './product/product.module';
import { BundleModule } from './bundle/bundle.module';
import { MerchantModule } from './merchant/merchant.module';

@Module({
  imports: [PetUserModule, MemberLevelModule, ProductCategoryModule, BannerModule, ProductModule, BundleModule, MerchantModule],
})
export class PetModule {}
