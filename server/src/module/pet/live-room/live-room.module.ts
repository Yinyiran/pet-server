import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveRoomEntity } from './entities/live-room.entity';
import { LiveRoomService } from './live-room.service';
import { LiveRoomController, AppLiveRoomController } from './live-room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LiveRoomEntity])],
  controllers: [LiveRoomController, AppLiveRoomController],
  providers: [LiveRoomService],
  exports: [LiveRoomService],
})
export class LiveRoomModule {}
