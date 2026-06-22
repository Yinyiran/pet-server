import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto, ListProductDto } from './dto/index';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(query: ListProductDto) {
    const qb = this.repo.createQueryBuilder('p');
    if (query.keyword) qb.andWhere('(p.name LIKE :kw OR p.tags LIKE :kw)', { kw: `%${query.keyword}%` });
    if (query.category) qb.andWhere('FIND_IN_SET(:cat, p.category) > 0', { cat: query.category });
    if (query.merchantId) qb.andWhere('p.merchantId = :mid', { mid: query.merchantId });
    if (query.isActive !== undefined && query.isActive !== null) qb.andWhere('p.isActive = :a', { a: query.isActive });
    if (query.isFlash !== undefined && query.isFlash !== null) qb.andWhere('p.isFlash = :f', { f: query.isFlash });
    if (query.params?.beginTime && query.params?.endTime) {
      qb.andWhere('p.createdAt BETWEEN :s AND :e', { s: query.params.beginTime, e: query.params.endTime });
    }
    qb.orderBy('p.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const data = await this.repo.findOne({ where: { id } });
    return ResultData.ok(data);
  }

  async create(dto: CreateProductDto) {
    await this.repo.save(dto);
    return ResultData.ok();
  }

  async update(dto: UpdateProductDto) {
    const { id, ...data } = dto;
    await this.repo.update(id, data);
    return ResultData.ok();
  }

  async remove(ids: string) {
    await this.repo.delete(ids.split(',').map(Number));
    return ResultData.ok();
  }

  async toggleStatus(id: number, isActive: number) {
    await this.repo.update(id, { isActive });
    return ResultData.ok();
  }

  async batchToggleStatus(ids: string, isActive: number) {
    await this.repo.update(ids.split(',').map(Number), { isActive });
    return ResultData.ok();
  }

  // 小程序端
  async getAppProducts(query: { category?: string; keyword?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.repo.createQueryBuilder('p').where('p.isActive = 1');
    if (query.category) qb.andWhere('FIND_IN_SET(:cat, p.category) > 0', { cat: query.category });
    if (query.keyword) qb.andWhere('p.name LIKE :kw', { kw: `%${query.keyword}%` });
    qb.orderBy('p.sales', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async getFlashProducts() {
    const now = new Date();
    const qb = this.repo.createQueryBuilder('p')
      .where('p.isActive = 1 AND p.isFlash = 1')
      .andWhere('(p.flashStart IS NULL OR p.flashStart <= :now)', { now })
      .andWhere('(p.flashEnd IS NULL OR p.flashEnd >= :now)', { now })
      .orderBy('p.sales', 'DESC');
    const list = await qb.getMany();
    return ResultData.ok(list);
  }

  /**
   * 获取商品已使用的所有标签（去重）
   */
  async getAllTags(): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('p')
      .select('p.tags', 'tags')
      .where('p.tags IS NOT NULL AND p.tags != ""')
      .getRawMany();
    const tagSet = new Set<string>();
    rows.forEach(r => {
      if (r.tags) {
        r.tags.split(',').map((t: string) => t.trim()).filter(Boolean).forEach((t: string) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }
}
