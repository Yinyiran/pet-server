import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_refund', { comment: '售后记录表' })
export class RefundEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_order_no')
  @Column({ type: 'varchar', name: 'order_no', length: 32, comment: '订单号' })
  orderNo: string;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', name: 'type', length: 16, comment: '售后类型: refund/exchange' })
  type: string;

  @Column({ type: 'varchar', name: 'reason', length: 256, nullable: true, comment: '售后原因' })
  reason: string;

  @Index('idx_status')
  @Column({ type: 'varchar', name: 'status', length: 16, default: 'pending', comment: '处理状态: pending/approved/rejected/completed' })
  status: string;

  @Column({ type: 'decimal', name: 'refund_amount', precision: 10, scale: 2, nullable: true, comment: '退款金额' })
  refundAmount: number;

  @Column({ type: 'text', name: 'remark', nullable: true, comment: '审核备注' })
  remark: string;

  @Column({ type: 'bigint', name: 'reviewer_id', nullable: true, comment: '审核人ID' })
  reviewerId: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '申请时间' })
  createdAt: Date;
}
