import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('t_recharge_log')
export class RechargeLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, comment: '充值单号' })
  rechargeNo: string;

  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', length: 32, comment: '充值方式: wechat/balance/card' })
  method: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '充值金额' })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '赠送金额' })
  giftAmount: number;

  @Column({ type: 'varchar', length: 16, default: 'pending', comment: '状态: pending/success/failed' })
  status: string;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '第三方交易号' })
  transactionId: string;

  @CreateDateColumn({ comment: '充值时间' })
  createdAt: Date;
}
