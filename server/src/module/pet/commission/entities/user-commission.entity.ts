import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_user_commission', { comment: '用户分佣账户表' })
export class UserCommissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('uk_user_id', { unique: true })
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'int', name: 'tier_id', nullable: true, comment: '分佣等级ID' })
  tierId: number;

  @Column({ type: 'decimal', name: 'total_earned', precision: 12, scale: 2, default: 0, comment: '累计收益' })
  totalEarned: number;

  @Column({ type: 'decimal', name: 'pending_amount', precision: 12, scale: 2, default: 0, comment: '待结算' })
  pendingAmount: number;

  @Column({ type: 'decimal', name: 'available_balance', precision: 12, scale: 2, default: 0, comment: '可提现' })
  availableBalance: number;

  @Column({ type: 'decimal', name: 'frozen_amount', precision: 12, scale: 2, default: 0, comment: '冻结金额' })
  frozenAmount: number;

  @Column({ type: 'int', name: 'invite_count', default: 0, comment: '邀请人数' })
  inviteCount: number;

  @Column({ type: 'int', name: 'active_invite_count', default: 0, comment: '活跃邀请数' })
  activeInviteCount: number;

  @Column({ type: 'int', name: 'total_views', default: 0, comment: '总浏览量' })
  totalViews: number;

  @Column({ type: 'decimal', name: 'this_month_earned', precision: 12, scale: 2, default: 0, comment: '本月收益' })
  thisMonthEarned: number;

  @Column({ type: 'datetime', name: 'updated_at', nullable: true, comment: '更新时间' })
  updatedAt: Date;
}
