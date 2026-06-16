import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('t_product_bundle', { comment: '商品组合包表' })
export class ProductBundleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 128, comment: '组合包名称' })
  name: string;

  @Column({ type: 'varchar', name: 'cover_img', length: 512, nullable: true, comment: '封面图' })
  coverImg: string;

  @Column({ type: 'decimal', name: 'bundle_price', precision: 10, scale: 2, comment: '组合价' })
  bundlePrice: number;

  @Column({ type: 'decimal', name: 'original_price', precision: 10, scale: 2, nullable: true, comment: '原价合计' })
  originalPrice: number;

  @Column({ type: 'text', name: 'description', nullable: true, comment: '描述' })
  description: string;

  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否上架: 0-下架 1-上架' })
  isActive: number;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
