import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from './entities/refund.entity';
import { RefundService } from './refund.service';
import { RefundController, AppRefundController } from './refund.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RefundEntity])],
  controllers: [RefundController, AppRefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}
