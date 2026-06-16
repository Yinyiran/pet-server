import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_product_category', { comment: '商品分类表' })
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 64, comment: '分类名称' })
  name: string;

  @Index('idx_parent_id')
  @Column({ type: 'int', name: 'parent_id', default: 0, comment: '父分类ID, 0为顶级' })
  parentId: number;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序权重' })
  sortOrder: number;

  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否启用: 0-否 1-是' })
  isActive: number;
}
