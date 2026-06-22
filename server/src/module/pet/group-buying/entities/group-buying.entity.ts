import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_group_buying', { comment: '拼团实例表' })
export class GroupBuyingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('uk_group_no', { unique: true })
  @Column({ type: 'varchar', name: 'group_no', length: 32, comment: '拼团编号' })
  groupNo: string;

  @Index('idx_product_id')
  @Column({ type: 'bigint', name: 'product_id', comment: '商品ID' })
  productId: number;

  @Index('idx_leader_id')
  @Column({ type: 'bigint', name: 'leader_id', comment: '团长用户ID' })
  leaderId: number;

  @Column({ type: 'int', name: 'group_size', comment: '成团人数' })
  groupSize: number;

  @Column({ type: 'decimal', name: 'discount_rate', precision: 5, scale: 2, comment: '折扣率(%)' })
  discountRate: number;

  @Column({ type: 'decimal', name: 'group_price', precision: 10, scale: 2, comment: '拼团单价' })
  groupPrice: number;

  @Column({ type: 'decimal', name: 'original_price', precision: 10, scale: 2, comment: '原价快照' })
  originalPrice: number;

  @Column({ type: 'int', name: 'current_count', default: 1, comment: '当前参团人数' })
  currentCount: number;

  @Index('idx_status')
  @Column({ type: 'varchar', name: 'status', length: 16, default: 'forming', comment: '状态: forming/success/failed/expired' })
  status: string;

  @Column({ type: 'datetime', name: 'expire_at', comment: '过期时间' })
  expireAt: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
