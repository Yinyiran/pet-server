import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto, ListProductDto } from './dto/index';
import { CityMerchantEntity } from '../merchant/entities/city-merchant.entity';
import { PetUserEntity } from '../user/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
    @InjectRepository(CityMerchantEntity)
    private readonly merchantRepo: Repository<CityMerchantEntity>,
    @InjectRepository(PetUserEntity)
    private readonly userRepo: Repository<PetUserEntity>,
  ) {}

  async findAll(query: ListProductDto) {
    const qb = this.repo.createQueryBuilder('p')
      .leftJoin(CityMerchantEntity, 'm', 'm.id = p.merchantId')
      .addSelect('m.name', 'p_merchantName');
    if (query.keyword) qb.andWhere('(p.name LIKE :kw OR p.tags LIKE :kw)', { kw: `%${query.keyword}%` });
    if (query.category) qb.andWhere('FIND_IN_SET(:cat, p.category) > 0', { cat: query.category });
    if (query.merchantId) qb.andWhere('p.merchantId = :mid', { mid: query.merchantId });
    if (query.isActive !== undefined && query.isActive !== null) qb.andWhere('p.isActive = :a', { a: query.isActive });
    if (query.isFlash !== undefined && query.isFlash !== null) qb.andWhere('p.isFlash = :f', { f: query.isFlash });
    if (query.source === 'official') qb.andWhere('p.merchantId IS NULL');
    if (query.source === 'merchant') qb.andWhere('p.merchantId IS NOT NULL');
    if (query.params?.beginTime && query.params?.endTime) {
      qb.andWhere('p.createdAt BETWEEN :s AND :e', { s: query.params.beginTime, e: query.params.endTime });
    }
    qb.orderBy('p.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const { entities, raw } = await qb.getRawAndEntities();
    const list = entities.map((entity, i) => ({ ...entity, merchantName: raw[i].p_merchantName || null }));
    const total = await qb.getCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const qb = this.repo.createQueryBuilder('p')
      .where('p.id = :id', { id })
      .leftJoin(CityMerchantEntity, 'm', 'm.id = p.merchantId')
      .addSelect('m.name', 'p_merchantName');
    const { entities, raw } = await qb.getRawAndEntities();
    if (!entities.length) return ResultData.ok(null);
    const data = { ...entities[0], merchantName: raw[0]?.p_merchantName || null };
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
  async getAppProducts(query: { category?: string; keyword?: string; source?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.repo.createQueryBuilder('p')
      .where('p.isActive = 1')
      .leftJoin(CityMerchantEntity, 'm', 'm.id = p.merchantId')
      .addSelect('m.name', 'p_merchantName');
    if (query.category) qb.andWhere('FIND_IN_SET(:cat, p.category) > 0', { cat: query.category });
    if (query.keyword) qb.andWhere('p.name LIKE :kw', { kw: `%${query.keyword}%` });
    if (query.source === 'official') qb.andWhere('p.merchantId IS NULL');
    if (query.source === 'merchant') qb.andWhere('p.merchantId IS NOT NULL');
    qb.orderBy('p.sales', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const { entities, raw } = await qb.getRawAndEntities();
    const list = entities.map((entity, i) => ({ ...entity, merchantName: raw[i].p_merchantName || null }));
    const total = await qb.getCount();
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

  // ====== 商家自助商品管理 ======

  /** 根据小程序用户ID获取其绑定的merchantId */
  async getMerchantIdByUserId(userId: number): Promise<number | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user?.merchantId || null;
  }

  /** 商家查询自己的商品列表 */
  async findMerchantProducts(merchantId: number, query: { keyword?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.repo.createQueryBuilder('p').where('p.merchantId = :mid', { mid: merchantId });
    if (query.keyword) qb.andWhere('(p.name LIKE :kw OR p.tags LIKE :kw)', { kw: `%${query.keyword}%` });
    qb.orderBy('p.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  /** 商家查询自己的商品详情（校验归属） */
  async findMerchantProduct(merchantId: number, id: number) {
    const data = await this.repo.findOne({ where: { id, merchantId } });
    if (!data) return ResultData.fail(500, '商品不存在或无权操作');
    return ResultData.ok(data);
  }

  /** 商家新增商品（自动绑定merchantId） */
  async createMerchantProduct(merchantId: number, dto: CreateProductDto) {
    await this.repo.save({ ...dto, merchantId });
    return ResultData.ok();
  }

  /** 商家更新商品（校验归属） */
  async updateMerchantProduct(merchantId: number, dto: UpdateProductDto) {
    const { id, ...data } = dto;
    const product = await this.repo.findOne({ where: { id, merchantId } });
    if (!product) return ResultData.fail(500, '商品不存在或无权操作');
    await this.repo.update(id, data);
    return ResultData.ok();
  }

  /** 商家删除商品（校验归属） */
  async removeMerchantProducts(merchantId: number, ids: string) {
    const idArr = ids.split(',').map(Number);
    // 校验所有商品归属
    const count = await this.repo.count({ where: { id: idArr as any, merchantId } });
    if (count !== idArr.length) return ResultData.fail(500, '部分商品不存在或无权操作');
    await this.repo.delete(idArr);
    return ResultData.ok();
  }

  /** 商家上下架商品（校验归属） */
  async toggleMerchantProductStatus(merchantId: number, id: number, isActive: number) {
    const product = await this.repo.findOne({ where: { id, merchantId } });
    if (!product) return ResultData.fail(500, '商品不存在或无权操作');
    await this.repo.update(id, { isActive });
    return ResultData.ok();
  }
}
