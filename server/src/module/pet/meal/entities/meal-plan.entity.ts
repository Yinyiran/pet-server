import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('t_meal_plan')
export class MealPlanEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 16, comment: '宠物类型: cat/dog' })
  petType: string;

  @Column({ type: 'varchar', length: 64, comment: '方案名称' })
  name: string;

  @Column({ type: 'varchar', length: 32, nullable: true, comment: '标签' })
  tag: string;

  @Column({ type: 'json', nullable: true, comment: '匹配规则JSON' })
  matchRules: any;

  @Column({ type: 'json', nullable: true, comment: '食材配方JSON' })
  ingredients: any;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '月单价' })
  monthlyPrice: number;

  @Column({ type: 'int', default: 0, comment: '排序权重' })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 0, comment: '是否默认方案: 0-否 1-是' })
  isDefault: number;

  @Column({ type: 'tinyint', default: 1, comment: '是否启用: 0-否 1-是' })
  isActive: number;
}
