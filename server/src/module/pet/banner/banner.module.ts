import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from './entities/banner.entity';
import { BannerService } from './banner.service';
import { BannerController, AppBannerController } from './banner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannerController, AppBannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
