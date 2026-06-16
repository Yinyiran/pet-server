import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_withdraw', { comment: '提现记录表' })
export class WithdrawEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('uk_withdraw_no', { unique: true })
  @Column({ type: 'varchar', name: 'withdraw_no', length: 32, comment: '提现单号' })
  withdrawNo: string;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'decimal', name: 'amount', precision: 12, scale: 2, comment: '提现金额' })
  amount: number;

  @Column({ type: 'varchar', name: 'method', length: 32, nullable: true, comment: '提现方式: wechat/bank' })
  method: string;

  @Column({ type: 'varchar', name: 'account_info', length: 256, nullable: true, comment: '账号信息' })
  accountInfo: string;

  @Index('idx_status')
  @Column({ type: 'varchar', name: 'status', length: 16, default: 'pending', comment: '审核状态: pending/approved/rejected/completed' })
  status: string;

  @Column({ type: 'varchar', name: 'audit_remark', length: 256, nullable: true, comment: '审核备注' })
  auditRemark: string;

  @Column({ type: 'datetime', name: 'applied_at', nullable: true, comment: '申请时间' })
  appliedAt: Date;

  @Column({ type: 'datetime', name: 'finished_at', nullable: true, comment: '完成时间' })
  finishedAt: Date;
}
