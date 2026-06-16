import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_order', { comment: '订单表' })
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('uk_order_no', { unique: true })
  @Column({ type: 'varchar', name: 'order_no', length: 32, comment: '订单号' })
  orderNo: string;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', name: 'address_id', nullable: true, comment: '收货地址ID' })
  addressId: number;

  @Column({ type: 'decimal', name: 'total_amount', precision: 10, scale: 2, comment: '订单总额' })
  totalAmount: number;

  @Column({ type: 'decimal', name: 'original_amount', precision: 10, scale: 2, nullable: true, comment: '原始总额' })
  originalAmount: number;

  @Column({ type: 'decimal', name: 'discount_amount', precision: 10, scale: 2, default: 0, comment: '优惠金额' })
  discountAmount: number;

  @Index('idx_status')
  @Column({ type: 'varchar', name: 'status', length: 16, default: 'pending', comment: '订单状态: pending/paid/shipped/received/cancelled/refunding' })
  status: string;

  @Column({ type: 'json', name: 'payment', nullable: true, comment: '支付明细JSON' })
  payment: any;

  @Column({ type: 'varchar', name: 'logistics_company', length: 64, nullable: true, comment: '物流公司' })
  logisticsCompany: string;

  @Column({ type: 'varchar', name: 'logistics_no', length: 64, nullable: true, comment: '物流单号' })
  logisticsNo: string;

  @Column({ type: 'datetime', name: 'paid_at', nullable: true, comment: '支付时间' })
  paidAt: Date;

  @Column({ type: 'datetime', name: 'shipped_at', nullable: true, comment: '发货时间' })
  shippedAt: Date;

  @Column({ type: 'datetime', name: 'received_at', nullable: true, comment: '收货时间' })
  receivedAt: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '下单时间' })
  createdAt: Date;
}
