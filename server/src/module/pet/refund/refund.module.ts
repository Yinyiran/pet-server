import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from './entities/refund.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderItemEntity } from '../order/entities/order-item.entity';
import { PaymentEntity } from '../order/entities/payment.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { PointsLogEntity } from '../finance/entities/points-log.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { RefundService } from './refund.service';
import { RefundController, AppRefundController } from './refund.controller';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefundEntity, OrderEntity, OrderItemEntity, PaymentEntity, PetUserEntity, PointsLogEntity, ProductEntity]),
    CommissionModule,
  ],
  controllers: [RefundController, AppRefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}
