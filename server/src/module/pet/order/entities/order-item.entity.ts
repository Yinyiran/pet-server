import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_order_item', { comment: '订单明细表' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_order_id')
  @Column({ type: 'bigint', name: 'order_id', comment: '订单ID' })
  orderId: number;

  @Column({ type: 'bigint', name: 'product_id', comment: '商品ID' })
  productId: number;

  @Column({ type: 'varchar', name: 'product_name', length: 128, comment: '商品名快照' })
  productName: string;

  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2, comment: '单价快照' })
  price: number;

  @Column({ type: 'int', name: 'qty', comment: '数量' })
  qty: number;

  @Column({ type: 'decimal', name: 'subtotal', precision: 10, scale: 2, comment: '小计' })
  subtotal: number;
}
