import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CityMerchantEntity } from './entities/city-merchant.entity';
import { MerchantApplyEntity } from './entities/merchant-apply.entity';
import { CreateMerchantDto, UpdateMerchantDto, ListMerchantDto, CreateApplyDto, ListApplyDto, NearbyMerchantDto } from './dto/index';

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
    const apply = await this.applyRepo.findOne({ where: { id } });
    if (!apply) return ResultData.fail(500, '申请不存在');

    await this.applyRepo.update(id, { status, reviewerId });

    // 审核通过：自动创建商家
    if (status === 'approved') {
      await this.merchantRepo.save({
        name: apply.name,
        type: apply.merchantType || 'shop',
        description: apply.description,
        address: apply.address,
        phone: apply.phone,
        status: 'active',
      });
    }

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

  // ====== 附近商家（Haversine 距离计算） ======
  async findNearbyMerchants(query: NearbyMerchantDto) {
    const { userLat, userLng, maxDistance = 10, type, keyword, pageNum = 1, pageSize = 10 } = query;

    // Haversine 公式计算距离（单位：km）
    const distanceExpr = `(
      2 * 6371 * ASIN(SQRT(
        POW(SIN((:userLat1 - m.lat) * PI() / 180 / 2), 2)
        + COS(:userLat2 * PI() / 180) * COS(m.lat * PI() / 180)
        * POW(SIN((:userLng1 - m.lng) * PI() / 180 / 2), 2)
      ))
    )`;

    const params: Record<string, any> = {
      userLat1: userLat, userLat2: userLat, userLng1: userLng,
      s: 'active',
    };
    if (maxDistance > 0) params.maxDist = maxDistance;
    if (type) params.t = type;
    if (keyword) params.kw = `%${keyword}%`;

    const buildWhere = () => {
      const conds = [
        'm.status = :s',
        'm.lat IS NOT NULL',
        'm.lng IS NOT NULL',
      ];
      if (type) conds.push('m.type = :t');
      if (keyword) conds.push('m.name LIKE :kw');
      if (maxDistance > 0) conds.push(`${distanceExpr} <= :maxDist`);
      return conds;
    };

    // 分页查询（带距离字段）
    const qb = this.merchantRepo.createQueryBuilder('m')
      .addSelect(distanceExpr, 'distance')
      .where(buildWhere().join(' AND '), params)
      .orderBy('distance', 'ASC')
      .skip(+pageSize * (+pageNum - 1))
      .take(+pageSize);

    const { entities, raw } = await qb.getRawAndEntities();
    const list = entities.map((entity, i) => ({
      ...entity,
      distance: Math.round(Number(raw[i].distance) * 100) / 100,
    }));

    // 总数查询（不含排序和分页）
    const countQb = this.merchantRepo.createQueryBuilder('m')
      .select('COUNT(*)', 'cnt')
      .where(buildWhere().join(' AND '), params);
    const [{ cnt }] = await countQb.getRawMany();
    const total = Number(cnt) || 0;

    return ResultData.ok({ list, total });
  }
}
