import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetUserEntity } from './entities/user.entity';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserPetEntity } from './entities/user-pet.entity';
import { PetUserService } from './pet-user.service';
import { PetUserController, AppUserController } from './pet-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PetUserEntity, UserAddressEntity, UserPetEntity])],
  controllers: [PetUserController, AppUserController],
  providers: [PetUserService],
  exports: [PetUserService],
})
export class PetUserModule {}
