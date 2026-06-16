import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { PetUserEntity } from './entities/user.entity';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserPetEntity } from './entities/user-pet.entity';
import { ListUserDto, UpdatePetUserDto, CreateAddressDto, UpdateAddressDto, CreatePetDto, UpdatePetDto, UpdateProfileDto } from './dto/index';

@Injectable()
export class PetUserService {
  constructor(
    @InjectRepository(PetUserEntity)
    private readonly userRepo: Repository<PetUserEntity>,
    @InjectRepository(UserAddressEntity)
    private readonly addressRepo: Repository<UserAddressEntity>,
    @InjectRepository(UserPetEntity)
    private readonly petRepo: Repository<UserPetEntity>,
  ) {}

  // ==================== 管理端：用户 ====================

  async findAll(query: ListUserDto) {
    const qb = this.userRepo.createQueryBuilder('u');

    if (query.keyword) {
      qb.andWhere('(u.nickname LIKE :kw OR u.phone LIKE :kw OR u.openId LIKE :kw)', { kw: `%${query.keyword}%` });
    }
    if (query.memberLevel) {
      qb.andWhere('u.memberLevel = :memberLevel', { memberLevel: query.memberLevel });
    }
    if (query.city) {
      qb.andWhere('u.city LIKE :city', { city: `%${query.city}%` });
    }
    if (query.isActive !== undefined && query.isActive !== null) {
      qb.andWhere('u.isActive = :isActive', { isActive: query.isActive });
    }
    if (query.params?.beginTime && query.params?.endTime) {
      qb.andWhere('u.createdAt BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    qb.orderBy('u.createdAt', 'DESC');

    if (query.pageSize && query.pageNum) {
      qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    }

    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return ResultData.fail(500, '用户不存在');
    const pets = await this.petRepo.find({ where: { userId: id } });
    const addresses = await this.addressRepo.find({ where: { userId: id } });
    return ResultData.ok({ user, pets, addresses });
  }

  async update(dto: UpdatePetUserDto) {
    const { id, ...data } = dto;
    await this.userRepo.update(id, data);
    return ResultData.ok();
  }

  async toggleStatus(id: number, isActive: number) {
    await this.userRepo.update(id, { isActive });
    return ResultData.ok();
  }

  // ==================== 管理端：宠物 ====================

  async findPetList(query: { userId?: number; type?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.petRepo.createQueryBuilder('p');
    if (query.userId) qb.andWhere('p.userId = :userId', { userId: query.userId });
    if (query.type) qb.andWhere('p.type = :type', { type: query.type });
    qb.orderBy('p.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) {
      qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    }
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ==================== 管理端：地址 ====================

  async findAddressList(userId: number) {
    const list = await this.addressRepo.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'DESC' } });
    return ResultData.ok(list);
  }

  // ==================== 小程序端：用户 ====================

  async wxLogin(code: string) {
    // TODO: 调用微信接口换取 openId，此处简化处理
    return ResultData.fail(500, '微信登录接口待对接微信SDK');
  }

  async getAppProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return ResultData.fail(500, '用户不存在');
    const pets = await this.petRepo.find({ where: { userId } });
    const addresses = await this.addressRepo.find({ where: { userId }, order: { isDefault: 'DESC' } });
    return ResultData.ok({ user, pets, addresses });
  }

  async updateAppProfile(userId: number, dto: UpdateProfileDto) {
    await this.userRepo.update(userId, dto);
    return ResultData.ok();
  }

  // ==================== 小程序端：地址 CRUD ====================

  async createAddress(dto: CreateAddressDto) {
    if (dto.isDefault === 1) {
      await this.addressRepo.update({ userId: dto.userId }, { isDefault: 0 });
    }
    await this.addressRepo.save(dto);
    return ResultData.ok();
  }

  async updateAddress(dto: UpdateAddressDto) {
    const { id, ...data } = dto;
    if (data.isDefault === 1) {
      await this.addressRepo.update({ userId: data.userId }, { isDefault: 0 });
    }
    await this.addressRepo.update(id, data);
    return ResultData.ok();
  }

  async deleteAddress(id: number) {
    await this.addressRepo.delete(id);
    return ResultData.ok();
  }

  // ==================== 小程序端：宠物 CRUD ====================

  async createPet(dto: CreatePetDto) {
    await this.petRepo.save(dto);
    return ResultData.ok();
  }

  async updatePet(dto: UpdatePetDto) {
    const { id, ...data } = dto;
    await this.petRepo.update(id, data);
    return ResultData.ok();
  }

  async deletePet(id: number) {
    await this.petRepo.delete(id);
    return ResultData.ok();
  }

  async getAppPets(userId: number) {
    const list = await this.petRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return ResultData.ok(list);
  }
}
