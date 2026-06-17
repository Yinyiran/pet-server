import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsLogEntity } from './entities/points-log.entity';
import { RechargeLogEntity } from './entities/recharge-log.entity';
import { ConsumptionLogEntity } from './entities/consumption-log.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { FinanceService } from './finance.service';
import { PointsController, RechargeController, ConsumptionController, AppFinanceController } from './finance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PointsLogEntity, RechargeLogEntity, ConsumptionLogEntity, PetUserEntity])],
  controllers: [PointsController, RechargeController, ConsumptionController, AppFinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
