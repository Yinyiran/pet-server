import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { ProductBundleEntity } from './entities/bundle.entity';
import { ProductBundleItemEntity } from './entities/bundle-item.entity';
import { CreateBundleDto, UpdateBundleDto, ListBundleDto } from './dto/index';

@Injectable()
export class BundleService {
  constructor(
    @InjectRepository(ProductBundleEntity)
    private readonly bundleRepo: Repository<ProductBundleEntity>,
    @InjectRepository(ProductBundleItemEntity)
    private readonly itemRepo: Repository<ProductBundleItemEntity>,
  ) {}

  async findAll(query: ListBundleDto) {
    const qb = this.bundleRepo.createQueryBuilder('b');
    if (query.keyword) qb.andWhere('b.name LIKE :kw', { kw: `%${query.keyword}%` });
    if (query.isActive !== undefined && query.isActive !== null) qb.andWhere('b.isActive = :a', { a: query.isActive });
    qb.orderBy('b.sortOrder', 'ASC').addOrderBy('b.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const data = await this.bundleRepo.findOne({ where: { id } });
    const items = await this.itemRepo.find({ where: { bundleId: id }, order: { sortOrder: 'ASC' } });
    return ResultData.ok({ ...data, items });
  }

  async create(dto: CreateBundleDto) {
    const { items, ...bundleData } = dto;
    const bundle = await this.bundleRepo.save(bundleData);
    if (items?.length) {
      await this.itemRepo.save(items.map(i => ({ ...i, bundleId: bundle.id })));
    }
    return ResultData.ok();
  }

  async update(dto: UpdateBundleDto) {
    const { id, items, ...data } = dto;
    await this.bundleRepo.update(id, data);
    if (items) {
      await this.itemRepo.delete({ bundleId: id });
      if (items.length) {
        await this.itemRepo.save(items.map(i => ({ ...i, bundleId: id })));
      }
    }
    return ResultData.ok();
  }

  async remove(ids: string) {
    const idArr = ids.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
    if (!idArr.length) return ResultData.fail(500, '请选择要删除的组合包');
    // 先删除关联子项，再删除主表
    for (const id of idArr) {
      await this.itemRepo.delete({ bundleId: id });
    }
    await this.bundleRepo.delete(idArr);
    return ResultData.ok();
  }

  async toggleStatus(id: number, isActive: number) {
    await this.bundleRepo.update(id, { isActive });
    return ResultData.ok();
  }

  // 小程序端
  async getActiveBundles() {
    const list = await this.bundleRepo.find({ where: { isActive: 1 }, order: { sortOrder: 'ASC' } });
    const result = [];
    for (const b of list) {
      const items = await this.itemRepo.find({ where: { bundleId: b.id }, order: { sortOrder: 'ASC' } });
      result.push({ ...b, items });
    }
    return ResultData.ok(result);
  }

  async getBundleDetail(id: number) {
    const data = await this.bundleRepo.findOne({ where: { id, isActive: 1 } });
    if (!data) return ResultData.fail(500, '组合包不存在或已下架');
    const items = await this.itemRepo.find({ where: { bundleId: id }, order: { sortOrder: 'ASC' } });
    return ResultData.ok({ ...data, items });
  }
}
