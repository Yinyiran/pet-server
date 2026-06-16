import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto/index';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly repo: Repository<ProductCategoryEntity>,
  ) {}

  async findTree() {
    const all = await this.repo.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
    const map = new Map<number, any>();
    const roots: any[] = [];
    all.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });
    all.forEach(item => {
      const node = map.get(item.id);
      if (item.parentId === 0) {
        roots.push(node);
      } else {
        const parent = map.get(item.parentId);
        if (parent) parent.children.push(node);
        else roots.push(node);
      }
    });
    return ResultData.ok(roots);
  }

  async findAll() {
    const list = await this.repo.find({ order: { sortOrder: 'ASC' } });
    return ResultData.ok(list);
  }

  async create(dto: CreateProductCategoryDto) {
    await this.repo.save(dto);
    return ResultData.ok();
  }

  async update(dto: UpdateProductCategoryDto) {
    const { id, ...data } = dto;
    await this.repo.update(id, data);
    return ResultData.ok();
  }

  async remove(ids: string) {
    const idArr = ids.split(',').map(Number);
    // 检查是否有子分类
    const children = await this.repo.find({ where: { parentId: idArr[0] } });
    if (children.length > 0) return ResultData.fail(500, '存在子分类，不能删除');
    await this.repo.delete(idArr);
    return ResultData.ok();
  }
}
