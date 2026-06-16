import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_commission_tier', { comment: '分佣等级表' })
export class CommissionTierEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 32, comment: '等级名' })
  name: string;

  @Column({ type: 'int', name: 'level', default: 0, comment: '等级序号' })
  level: number;

  @Column({ type: 'varchar', name: 'icon', length: 512, nullable: true, comment: '图标' })
  icon: string;

  @Column({ type: 'decimal', name: 'commission_rate', precision: 5, scale: 2, default: 0, comment: '佣金率%' })
  commissionRate: number;

  @Column({ type: 'text', name: 'rates', nullable: true, comment: '各层级佣金JSON' })
  rates: string;

  @Column({ type: 'varchar', name: 'upgrade_condition', length: 256, nullable: true, comment: '升级条件' })
  upgradeCondition: string;

  @Column({ type: 'varchar', name: 'qualification', length: 128, nullable: true, comment: '资格获取方式' })
  qualification: string;

  @Column({ type: 'tinyint', name: 'is_hidden', default: 0, comment: '是否隐藏' })
  isHidden: number;

  @Column({ type: 'varchar', name: 'color', length: 16, nullable: true, comment: '主题色' })
  color: string;

  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否启用' })
  isActive: number;
}
