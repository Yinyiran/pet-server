import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('t_quiz_record')
export class QuizRecordEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', nullable: true, comment: '关联宠物ID' })
  petId: number;

  @Column({ type: 'varchar', length: 16, comment: '宠物类型: cat/dog' })
  petType: string;

  @Column({ type: 'json', nullable: true, comment: '答题答案JSON' })
  answers: any;

  @Column({ type: 'varchar', length: 32, nullable: true, comment: '体质类型' })
  constitutionType: string;

  @Column({ type: 'text', nullable: true, comment: '体质描述' })
  constitutionDesc: string;

  @Column({ type: 'varchar', length: 256, nullable: true, comment: '体质标签JSON' })
  tags: string;

  @CreateDateColumn({ comment: '答题时间' })
  createdAt: Date;
}
