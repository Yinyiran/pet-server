import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('t_meal_order')
export class MealOrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, comment: '配餐订单号' })
  orderNo: string;

  @Column({ type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', comment: '配餐方案ID' })
  planId: number;

  @Column({ type: 'bigint', nullable: true, comment: '答题记录ID' })
  quizId: number;

  @Column({ type: 'int', default: 2, comment: '每日餐次' })
  mealFreq: number;

  @Column({ type: 'int', default: 30, comment: '周期天数' })
  mealDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '总价' })
  totalPrice: number;

  @Column({ type: 'varchar', length: 16, default: 'pending', comment: '状态: pending/paid/completed/cancelled' })
  status: string;

  @CreateDateColumn({ comment: '下单时间' })
  createdAt: Date;
}
