import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { BannerEntity } from './entities/banner.entity';
import { CreateBannerDto, UpdateBannerDto, ListBannerDto } from './dto/index';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly repo: Repository<BannerEntity>,
  ) {}

  async findAll(query: ListBannerDto) {
    const qb = this.repo.createQueryBuilder('b');
    if (query.title) qb.andWhere('b.title LIKE :t', { t: `%${query.title}%` });
    if (query.isActive !== undefined && query.isActive !== null) qb.andWhere('b.isActive = :a', { a: query.isActive });
    qb.orderBy('b.sortOrder', 'ASC').addOrderBy('b.id', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const data = await this.repo.findOne({ where: { id } });
    return ResultData.ok(data);
  }

  async create(dto: CreateBannerDto) {
    await this.repo.save(dto);
    return ResultData.ok();
  }

  async update(dto: UpdateBannerDto) {
    const { id, ...data } = dto;
    await this.repo.update(id, data);
    return ResultData.ok();
  }

  async remove(ids: string) {
    await this.repo.delete(ids.split(',').map(Number));
    return ResultData.ok();
  }

  // 小程序端：获取当前有效Banner
  async getActiveBanners() {
    const now = new Date();
    const qb = this.repo.createQueryBuilder('b')
      .where('b.isActive = 1')
      .andWhere('(b.validFrom IS NULL OR b.validFrom <= :now)', { now })
      .andWhere('(b.validUntil IS NULL OR b.validUntil >= :now)', { now })
      .orderBy('b.sortOrder', 'ASC');
    const list = await qb.getMany();
    return ResultData.ok(list);
  }
}
