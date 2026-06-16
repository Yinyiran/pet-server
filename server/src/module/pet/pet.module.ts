import { Module } from '@nestjs/common';
import { PetUserModule } from './user/pet-user.module';

@Module({
  imports: [PetUserModule],
})
export class PetModule {}
