import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBundleEntity } from './entities/bundle.entity';
import { ProductBundleItemEntity } from './entities/bundle-item.entity';
import { BundleService } from './bundle.service';
import { BundleController, AppBundleController } from './bundle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBundleEntity, ProductBundleItemEntity])],
  controllers: [BundleController, AppBundleController],
  providers: [BundleService],
  exports: [BundleService],
})
export class BundleModule {}
