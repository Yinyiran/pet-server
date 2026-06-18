import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { PetUserEntity } from './entities/user.entity';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserPetEntity } from './entities/user-pet.entity';
import { ListUserDto, UpdatePetUserDto, CreateAddressDto, UpdateAddressDto, CreatePetDto, UpdatePetDto, UpdateProfileDto } from './dto/index';
import { UserService } from 'src/module/system/user/user.service';

@Injectable()
export class PetUserService {
  constructor(
    @InjectRepository(PetUserEntity)
    private readonly userRepo: Repository<PetUserEntity>,
    @InjectRepository(UserAddressEntity)
    private readonly addressRepo: Repository<UserAddressEntity>,
    @InjectRepository(UserPetEntity)
    private readonly petRepo: Repository<UserPetEntity>,
    private readonly sysUserService: UserService,
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
    // 开发模式：用 code 作为 openId，查找或创建用户
    let user = await this.userRepo.findOne({ where: { openId: code } });
    if (!user) {
      user = await this.userRepo.save({
        openId: code,
        nickname: `用户${code.slice(-6)}`,
        avatar: '',
        memberLevel: 'silver',
        points: 0,
        balance: 0,
        totalSpent: 0,
        isActive: 1,
      });
    }
    // 生成 JWT token（复用系统 UserService 的 createToken）
    const token = this.sysUserService.createToken({ uuid: `pet_${user.id}`, userId: user.id });
    return ResultData.ok({ token, user: { id: user.id, nickname: user.nickname, avatar: user.avatar, memberLevel: user.memberLevel, points: user.points } });
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

  async updateAddress(userId: number, dto: UpdateAddressDto) {
    const { id, ...data } = dto;
    // 校验地址归属
    const addr = await this.addressRepo.findOne({ where: { id, userId } });
    if (!addr) return ResultData.fail(500, '地址不存在或无权操作');
    if (data.isDefault === 1) {
      await this.addressRepo.update({ userId }, { isDefault: 0 });
    }
    await this.addressRepo.update(id, data);
    return ResultData.ok();
  }

  async deleteAddress(userId: number, id: number) {
    // 校验地址归属，防止越权删除他人地址
    const addr = await this.addressRepo.findOne({ where: { id, userId } });
    if (!addr) return ResultData.fail(500, '地址不存在或无权操作');
    await this.addressRepo.delete(id);
    return ResultData.ok();
  }

  // ==================== 小程序端：宠物 CRUD ====================

  async createPet(dto: CreatePetDto) {
    await this.petRepo.save(dto);
    return ResultData.ok();
  }

  async updatePet(userId: number, dto: UpdatePetDto) {
    const { id, ...data } = dto;
    // 校验宠物归属
    const pet = await this.petRepo.findOne({ where: { id, userId } });
    if (!pet) return ResultData.fail(500, '宠物不存在或无权操作');
    await this.petRepo.update(id, data);
    return ResultData.ok();
  }

  async deletePet(userId: number, id: number) {
    // 校验宠物归属，防止越权删除他人宠物
    const pet = await this.petRepo.findOne({ where: { id, userId } });
    if (!pet) return ResultData.fail(500, '宠物不存在或无权操作');
    await this.petRepo.delete(id);
    return ResultData.ok();
  }

  async getAppPets(userId: number) {
    const list = await this.petRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return ResultData.ok(list);
  }
}
