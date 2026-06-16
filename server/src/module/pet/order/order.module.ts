import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { PaymentEntity } from './entities/payment.entity';
import { OrderService } from './order.service';
import { OrderController, PaymentController, AppOrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, OrderEntity, OrderItemEntity, PaymentEntity])],
  controllers: [OrderController, PaymentController, AppOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
