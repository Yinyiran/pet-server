import { Module } from '@nestjs/common';
import { PetUserModule } from './user/pet-user.module';
import { MemberLevelModule } from './member-level/member-level.module';

@Module({
  imports: [PetUserModule, MemberLevelModule],
})
export class PetModule {}
