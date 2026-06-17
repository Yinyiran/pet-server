import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from './entities/refund.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { PaymentEntity } from '../order/entities/payment.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { PointsLogEntity } from '../finance/entities/points-log.entity';
import { RefundService } from './refund.service';
import { RefundController, AppRefundController } from './refund.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RefundEntity, OrderEntity, PaymentEntity, PetUserEntity, PointsLogEntity])],
  controllers: [RefundController, AppRefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}
