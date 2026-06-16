import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_cart', { comment: '购物车表' })
export class CartEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', name: 'product_id', comment: '商品ID' })
  productId: number;

  @Column({ type: 'int', name: 'qty', default: 1, comment: '数量' })
  qty: number;

  @Column({ type: 'json', name: 'selected_spec', nullable: true, comment: '选中规格' })
  selectedSpec: any;

  @Column({ type: 'tinyint', name: 'is_checked', default: 1, comment: '是否选中: 0-否 1-是' })
  isChecked: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '加入时间' })
  createdAt: Date;
}
