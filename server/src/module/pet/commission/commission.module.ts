import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionTierEntity } from './entities/commission-tier.entity';
import { UserCommissionEntity } from './entities/user-commission.entity';
import { UserInviteEntity } from './entities/user-invite.entity';
import { CommissionLogEntity } from './entities/commission-log.entity';
import { WithdrawEntity } from './entities/withdraw.entity';
import { CommissionService } from './commission.service';
import { TierController, AccountController, LogController, InviteController, WithdrawController, AppCommissionController } from './commission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionTierEntity, UserCommissionEntity, UserInviteEntity, CommissionLogEntity, WithdrawEntity])],
  controllers: [TierController, AccountController, LogController, InviteController, WithdrawController, AppCommissionController],
  providers: [CommissionService],
  exports: [CommissionService],
})
export class CommissionModule {}
