import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('t_consumption_log')
export class ConsumptionLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, comment: '消费流水号' })
  logNo: string;

  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', length: 32, comment: '类型: purchase/refund' })
  type: string;

  @Column({ type: 'varchar', length: 256, nullable: true, comment: '商品摘要' })
  itemSummary: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '总金额' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '余额支付' })
  balancePay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '微信支付' })
  wechatPay: number;

  @Column({ type: 'varchar', length: 16, default: 'success', comment: '状态: success/refunded' })
  status: string;

  @CreateDateColumn({ comment: '消费时间' })
  createdAt: Date;
}
