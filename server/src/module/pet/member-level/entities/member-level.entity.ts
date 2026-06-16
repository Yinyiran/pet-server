import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('t_member_level', { comment: '会员等级配置表' })
export class MemberLevelEntity {
  @PrimaryColumn({ type: 'varchar', name: 'level_key', length: 32, comment: '等级标识: silver/gold/diamond' })
  levelKey: string;

  @Column({ type: 'varchar', name: 'name', length: 32, comment: '等级名称' })
  name: string;

  @Column({ type: 'decimal', name: 'threshold', precision: 12, scale: 2, comment: '升级门槛(累计消费)' })
  threshold: number;

  @Column({ type: 'decimal', name: 'next_threshold', precision: 12, scale: 2, nullable: true, comment: '下一档门槛' })
  nextThreshold: number;

  @Column({ type: 'int', name: 'points_rate', default: 1, comment: '积分倍率' })
  pointsRate: number;

  @Column({ type: 'json', name: 'privileges', nullable: true, comment: '权益配置JSON' })
  privileges: any;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序权重' })
  sortOrder: number;
}
