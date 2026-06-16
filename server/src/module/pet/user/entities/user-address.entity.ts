import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_user_address', { comment: '用户收货地址表' })
export class UserAddressEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', name: 'name', length: 32, comment: '收货人姓名' })
  name: string;

  @Column({ type: 'varchar', name: 'phone', length: 20, comment: '联系电话' })
  phone: string;

  @Column({ type: 'varchar', name: 'region', length: 128, comment: '省市区' })
  region: string;

  @Column({ type: 'varchar', name: 'detail', length: 256, comment: '详细地址' })
  detail: string;

  @Column({ type: 'tinyint', name: 'is_default', default: 0, comment: '是否默认: 0-否 1-是' })
  isDefault: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
