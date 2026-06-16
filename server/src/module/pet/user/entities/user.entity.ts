import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('t_user', { comment: '用户表' })
export class PetUserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('uk_open_id', { unique: true })
  @Column({ type: 'varchar', name: 'open_id', length: 64, comment: '微信OpenID' })
  openId: string;

  @Index('idx_phone')
  @Column({ type: 'varchar', name: 'phone', length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', name: 'nickname', length: 64, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'varchar', name: 'avatar', length: 512, nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ type: 'tinyint', name: 'gender', default: 0, comment: '性别: 0-未知 1-男 2-女' })
  gender: number;

  @Column({ type: 'date', name: 'birthday', nullable: true, comment: '生日' })
  birthday: string;

  @Column({ type: 'varchar', name: 'level', length: 32, nullable: true, comment: '轻创等级' })
  level: string;

  @Index('idx_member_level')
  @Column({ type: 'varchar', name: 'member_level', length: 32, default: 'silver', comment: '会员等级: silver/gold/diamond' })
  memberLevel: string;

  @Column({ type: 'decimal', name: 'balance', precision: 10, scale: 2, default: 0, comment: '账户余额' })
  balance: number;

  @Column({ type: 'decimal', name: 'total_spent', precision: 12, scale: 2, default: 0, comment: '累计消费金额' })
  totalSpent: number;

  @Column({ type: 'int', name: 'points', default: 0, comment: '积分余额' })
  points: number;

  @Column({ type: 'varchar', name: 'city', length: 64, nullable: true, comment: '所在城市' })
  city: string;

  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否活跃: 0-否 1-是' })
  isActive: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
