import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_group_buying_member', { comment: '拼团参与者表' })
export class GroupBuyingMemberEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_group_buying_id')
  @Column({ type: 'bigint', name: 'group_buying_id', comment: '拼团实例ID' })
  groupBuyingId: number;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', name: 'order_id', nullable: true, comment: '关联订单ID' })
  orderId: number;

  @Column({ type: 'tinyint', name: 'is_leader', default: 0, comment: '是否团长: 0-否 1-是' })
  isLeader: number;

  @Column({ type: 'varchar', name: 'status', length: 16, default: 'pending', comment: '状态: pending/paid/refunded' })
  status: string;

  @CreateDateColumn({ type: 'datetime', name: 'joined_at', comment: '加入时间' })
  joinedAt: Date;
}
