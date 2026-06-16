import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_user_course', { comment: '用户课程购买表' })
export class UserCourseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', name: 'course_id', comment: '课程ID' })
  courseId: number;

  @Column({ type: 'varchar', name: 'status', length: 16, default: 'active', comment: '学习状态: active/expired' })
  status: string;

  @Column({ type: 'datetime', name: 'paid_at', nullable: true, comment: '购买时间' })
  paidAt: Date;

  @Column({ type: 'datetime', name: 'expire_at', nullable: true, comment: '到期时间' })
  expireAt: Date;
}
