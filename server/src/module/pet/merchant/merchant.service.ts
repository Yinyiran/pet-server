import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CityMerchantEntity } from './entities/city-merchant.entity';
import { MerchantApplyEntity } from './entities/merchant-apply.entity';
import { CreateMerchantDto, UpdateMerchantDto, ListMerchantDto, CreateApplyDto, ListApplyDto } from './dto/index';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(CityMerchantEntity)
    private readonly merchantRepo: Repository<CityMerchantEntity>,
    @InjectRepository(MerchantApplyEntity)
    private readonly applyRepo: Repository<MerchantApplyEntity>,
  ) {}

  // ====== 商家管理 ======
  async findAll(query: ListMerchantDto) {
    const qb = this.merchantRepo.createQueryBuilder('m');
    if (query.keyword) qb.andWhere('(m.name LIKE :kw OR m.address LIKE :kw)', { kw: `%${query.keyword}%` });
    if (query.type) qb.andWhere('m.type = :t', { t: query.type });
    if (query.status) qb.andWhere('m.status = :s', { s: query.status });
    qb.orderBy('m.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findMerchant(id: number) {
    const data = await this.merchantRepo.findOne({ where: { id } });
    return ResultData.ok(data);
  }

  async createMerchant(dto: CreateMerchantDto) {
    await this.merchantRepo.save(dto);
    return ResultData.ok();
  }

  async updateMerchant(dto: UpdateMerchantDto) {
    const { id, ...data } = dto;
    await this.merchantRepo.update(id, data);
    return ResultData.ok();
  }

  async removeMerchant(ids: string) {
    await this.merchantRepo.delete(ids.split(',').map(Number));
    return ResultData.ok();
  }

  async toggleMerchantStatus(id: number, status: string) {
    await this.merchantRepo.update(id, { status });
    return ResultData.ok();
  }

  // ====== 入驻申请 ======
  async findApplies(query: ListApplyDto) {
    const qb = this.applyRepo.createQueryBuilder('a');
    if (query.keyword) qb.andWhere('(a.name LIKE :kw OR a.contact LIKE :kw OR a.phone LIKE :kw)', { kw: `%${query.keyword}%` });
    if (query.status) qb.andWhere('a.status = :s', { s: query.status });
    qb.orderBy('a.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findApply(id: number) {
    const data = await this.applyRepo.findOne({ where: { id } });
    return ResultData.ok(data);
  }

  async reviewApply(id: number, status: string, reviewerId?: number) {
    await this.applyRepo.update(id, { status, reviewerId });
    return ResultData.ok();
  }

  // ====== 小程序端 ======
  async getAppMerchants(query: { type?: string; keyword?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.merchantRepo.createQueryBuilder('m').where('m.status = :s', { s: 'active' });
    if (query.type) qb.andWhere('m.type = :t', { t: query.type });
    if (query.keyword) qb.andWhere('m.name LIKE :kw', { kw: `%${query.keyword}%` });
    qb.orderBy('m.score', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async getAppMerchantDetail(id: number) {
    const data = await this.merchantRepo.findOne({ where: { id, status: 'active' } });
    if (!data) return ResultData.fail(500, '商家不存在或已禁用');
    return ResultData.ok(data);
  }

  async submitApply(dto: CreateApplyDto) {
    await this.applyRepo.save({ ...dto, status: 'pending' });
    return ResultData.ok();
  }
}
