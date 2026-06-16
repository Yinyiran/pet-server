import { Module } from '@nestjs/common';
import { PetUserModule } from './user/pet-user.module';
import { MemberLevelModule } from './member-level/member-level.module';
import { ProductCategoryModule } from './product-category/product-category.module';

@Module({
  imports: [PetUserModule, MemberLevelModule, ProductCategoryModule],
})
export class PetModule {}
