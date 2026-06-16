import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberLevelEntity } from './entities/member-level.entity';
import { MemberLevelService } from './member-level.service';
import { MemberLevelController } from './member-level.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MemberLevelEntity])],
  controllers: [MemberLevelController],
  providers: [MemberLevelService],
  exports: [MemberLevelService],
})
export class MemberLevelModule {}
