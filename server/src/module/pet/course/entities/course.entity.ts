import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('t_course', { comment: '课程表' })
export class CourseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 128, comment: '课程名称' })
  name: string;

  @Column({ type: 'varchar', name: 'tier', length: 16, default: 'basic', comment: '课程档位: basic/pro/partner' })
  tier: string;

  @Column({ type: 'text', name: 'description', nullable: true, comment: '简介' })
  description: string;

  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2, comment: '价格' })
  price: number;

  @Column({ type: 'varchar', name: 'hero_img', length: 512, nullable: true, comment: '封面图' })
  heroImg: string;

  @Column({ type: 'json', name: 'features', nullable: true, comment: '特色JSON' })
  features: any;

  @Column({ type: 'json', name: 'chapter_list', nullable: true, comment: '章节JSON' })
  chapterList: any;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;

  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否上架: 0-下架 1-上架' })
  isActive: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
