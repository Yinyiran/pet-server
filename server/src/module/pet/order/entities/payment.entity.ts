import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_payment', { comment: '支付记录表' })
export class PaymentEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_order_no')
  @Column({ type: 'varchar', name: 'order_no', length: 32, comment: '订单号' })
  orderNo: string;

  @Column({ type: 'varchar', name: 'method', length: 32, comment: '支付方式: wechat/alipay/balance' })
  method: string;

  @Column({ type: 'decimal', name: 'amount', precision: 10, scale: 2, comment: '支付金额' })
  amount: number;

  @Index('idx_status')
  @Column({ type: 'varchar', name: 'status', length: 16, default: 'pending', comment: '支付状态: pending/success/failed/refunded' })
  status: string;

  @Column({ type: 'varchar', name: 'transaction_id', length: 64, nullable: true, comment: '流水号' })
  transactionId: string;

  @Column({ type: 'datetime', name: 'paid_at', nullable: true, comment: '支付时间' })
  paidAt: Date;
}
