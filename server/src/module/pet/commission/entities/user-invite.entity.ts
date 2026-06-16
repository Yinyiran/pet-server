import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_user_invite', { comment: '用户邀请关系表' })
export class UserInviteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '被邀请人ID' })
  userId: number;

  @Index('idx_parent_id')
  @Column({ type: 'bigint', name: 'parent_id', comment: '邀请人ID' })
  parentId: number;

  @Column({ type: 'int', name: 'level_depth', default: 1, comment: '关系深度' })
  levelDepth: number;

  @Column({ type: 'varchar', name: 'status', length: 16, default: 'active', comment: '状态' })
  status: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '邀请时间' })
  createdAt: Date;
}
