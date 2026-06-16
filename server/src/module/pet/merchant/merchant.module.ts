import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityMerchantEntity } from './entities/city-merchant.entity';
import { MerchantApplyEntity } from './entities/merchant-apply.entity';
import { MerchantService } from './merchant.service';
import { MerchantController, MerchantApplyController, AppMerchantController } from './merchant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityMerchantEntity, MerchantApplyEntity])],
  controllers: [MerchantController, MerchantApplyController, AppMerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
