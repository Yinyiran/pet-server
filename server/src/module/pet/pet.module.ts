import { Module } from '@nestjs/common';
import { PetUserModule } from './user/pet-user.module';
import { MemberLevelModule } from './member-level/member-level.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { BannerModule } from './banner/banner.module';
import { ProductModule } from './product/product.module';
import { BundleModule } from './bundle/bundle.module';
import { MerchantModule } from './merchant/merchant.module';
import { OrderModule } from './order/order.module';
import { RefundModule } from './refund/refund.module';
import { CourseModule } from './course/course.module';
import { LiveRoomModule } from './live-room/live-room.module';

@Module({
  imports: [PetUserModule, MemberLevelModule, ProductCategoryModule, BannerModule, ProductModule, BundleModule, MerchantModule, OrderModule, RefundModule, CourseModule, LiveRoomModule],
})
export class PetModule {}
