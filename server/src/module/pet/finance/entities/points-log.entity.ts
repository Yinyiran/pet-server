import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('t_points_log')
export class PointsLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', length: 16, comment: '类型: earn/spend/expire' })
  type: string;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '来源: order/sign_in/activity' })
  source: string;

  @Column({ type: 'int', comment: '变动值(正增负减)' })
  changeValue: number;

  @Column({ type: 'int', comment: '变动后余额' })
  balanceAfter: number;

  @Column({ type: 'varchar', length: 256, nullable: true, comment: '备注' })
  remark: string;

  @Column({ type: 'bigint', nullable: true, comment: '关联业务ID' })
  relatedId: number;

  @CreateDateColumn({ comment: '记录时间' })
  createdAt: Date;
}
