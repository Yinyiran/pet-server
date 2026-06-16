import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_product_bundle_item', { comment: '组合包子商品表' })
export class ProductBundleItemEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'bigint', name: 'bundle_id', comment: '所属组合包ID' })
  bundleId: number;

  @Column({ type: 'bigint', name: 'product_id', comment: '商品ID' })
  productId: number;

  @Column({ type: 'int', name: 'qty', default: 1, comment: '数量' })
  qty: number;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;
}
