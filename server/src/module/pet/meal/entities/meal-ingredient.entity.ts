import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('t_meal_ingredient')
export class MealIngredientEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', comment: '配餐方案ID' })
  planId: number;

  @Column({ type: 'varchar', length: 64, comment: '食材名称' })
  name: string;

  @Column({ type: 'varchar', length: 32, nullable: true, comment: '配比用量(如 50g)' })
  weight: string;

  @Column({ type: 'int', default: 0, comment: '排序权重' })
  sortOrder: number;
}
