import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { PaymentEntity } from './entities/payment.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { UserAddressEntity } from '../user/entities/user-address.entity';
import { PointsLogEntity } from '../finance/entities/points-log.entity';
import { ConsumptionLogEntity } from '../finance/entities/consumption-log.entity';
import { MemberLevelEntity } from '../member-level/entities/member-level.entity';
import { OrderService } from './order.service';
import { OrderController, PaymentController, AppOrderController } from './order.controller';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, OrderEntity, OrderItemEntity, PaymentEntity, ProductEntity, PetUserEntity, UserAddressEntity, PointsLogEntity, ConsumptionLogEntity, MemberLevelEntity]),
    CommissionModule,
  ],
  controllers: [OrderController, PaymentController, AppOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
