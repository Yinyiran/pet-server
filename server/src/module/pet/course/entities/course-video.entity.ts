import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_course_video', { comment: '课程视频表' })
export class CourseVideoEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_course_id')
  @Column({ type: 'bigint', name: 'course_id', comment: '所属课程ID' })
  courseId: number;

  @Column({ type: 'varchar', name: 'title', length: 128, comment: '视频标题' })
  title: string;

  @Column({ type: 'varchar', name: 'video_url', length: 512, nullable: true, comment: '视频地址' })
  videoUrl: string;

  @Column({ type: 'varchar', name: 'thumbnail', length: 512, nullable: true, comment: '缩略图' })
  thumbnail: string;

  @Column({ type: 'int', name: 'duration', default: 0, comment: '时长(秒)' })
  duration: number;

  @Column({ type: 'tinyint', name: 'is_free', default: 0, comment: '是否免费: 0-否 1-是' })
  isFree: number;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;
}
