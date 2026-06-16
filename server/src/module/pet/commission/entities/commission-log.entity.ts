import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_commission_log', { comment: '佣金流水表' })
export class CommissionLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('uk_log_no', { unique: true })
  @Column({ type: 'varchar', name: 'log_no', length: 32, comment: '流水号' })
  logNo: string;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '受益人ID' })
  userId: number;

  @Column({ type: 'bigint', name: 'from_user_id', nullable: true, comment: '消费用户ID' })
  fromUserId: number;

  @Column({ type: 'bigint', name: 'order_id', nullable: true, comment: '关联订单ID' })
  orderId: number;

  @Column({ type: 'varchar', name: 'type', length: 16, comment: '类型: order/withdraw' })
  type: string;

  @Column({ type: 'varchar', name: 'title', length: 128, nullable: true, comment: '标题' })
  title: string;

  @Column({ type: 'decimal', name: 'amount', precision: 12, scale: 2, comment: '金额' })
  amount: number;

  @Column({ type: 'int', name: 'commission_level', default: 0, comment: '佣金层级' })
  commissionLevel: number;

  @Column({ type: 'decimal', name: 'rate', precision: 5, scale: 2, nullable: true, comment: '佣金率' })
  rate: number;

  @Column({ type: 'decimal', name: 'order_amount', precision: 10, scale: 2, nullable: true, comment: '订单金额' })
  orderAmount: number;

  @Index('idx_status')
  @Column({ type: 'varchar', name: 'status', length: 16, default: 'pending', comment: '结算状态: pending/settled' })
  status: string;

  @Column({ type: 'datetime', name: 'settled_at', nullable: true, comment: '结算时间' })
  settledAt: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
