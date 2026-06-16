import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('t_merchant_apply', { comment: '商家入驻申请表' })
export class MerchantApplyEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'merchant_type', length: 32, nullable: true, comment: '商户类型' })
  merchantType: string;

  @Column({ type: 'varchar', name: 'name', length: 128, comment: '商户名称' })
  name: string;

  @Column({ type: 'varchar', name: 'contact', length: 64, nullable: true, comment: '联系人' })
  contact: string;

  @Column({ type: 'varchar', name: 'phone', length: 32, nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ type: 'varchar', name: 'city', length: 32, nullable: true, comment: '所在城市' })
  city: string;

  @Column({ type: 'varchar', name: 'address', length: 256, nullable: true, comment: '详细地址' })
  address: string;

  @Column({ type: 'text', name: 'description', nullable: true, comment: '申请说明' })
  description: string;

  @Column({ type: 'varchar', name: 'wechat', length: 64, nullable: true, comment: '微信号' })
  wechat: string;

  @Column({ type: 'varchar', name: 'status', length: 16, default: 'pending', comment: '审核状态: pending/approved/rejected' })
  status: string;

  @Column({ type: 'bigint', name: 'reviewer_id', nullable: true, comment: '审核人ID' })
  reviewerId: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '申请时间' })
  createdAt: Date;
}
