import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupBuyingEntity } from './entities/group-buying.entity';
import { GroupBuyingMemberEntity } from './entities/group-buying-member.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderItemEntity } from '../order/entities/order-item.entity';
import { GroupBuyingService } from './group-buying.service';
import { GroupBuyingController, AppGroupBuyingController } from './group-buying.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupBuyingEntity,
      GroupBuyingMemberEntity,
      ProductEntity,
      PetUserEntity,
      OrderEntity,
      OrderItemEntity,
    ]),
  ],
  controllers: [GroupBuyingController, AppGroupBuyingController],
  providers: [GroupBuyingService],
  exports: [GroupBuyingService],
})
export class GroupBuyingModule {}
