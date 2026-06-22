import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController, AppProductController, MerchantProductController } from './product.controller';
import { CityMerchantEntity } from '../merchant/entities/city-merchant.entity';
import { PetUserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CityMerchantEntity, PetUserEntity])],
  controllers: [ProductController, AppProductController, MerchantProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
