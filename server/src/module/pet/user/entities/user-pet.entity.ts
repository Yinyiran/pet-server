import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_user_pet', { comment: '用户宠物表' })
export class UserPetEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_user_id')
  @Column({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', name: 'name', length: 64, comment: '宠物名' })
  name: string;

  @Column({ type: 'varchar', name: 'type', length: 16, comment: '宠物类型: cat/dog' })
  type: string;

  @Column({ type: 'varchar', name: 'breed', length: 64, nullable: true, comment: '品种' })
  breed: string;

  @Column({ type: 'decimal', name: 'weight', precision: 5, scale: 2, nullable: true, comment: '体重(kg)' })
  weight: number;

  @Column({ type: 'date', name: 'birthday', nullable: true, comment: '生日' })
  birthday: string;

  @Column({ type: 'tinyint', name: 'gender', default: 0, comment: '性别: 0-未知 1-公 2-母' })
  gender: number;

  @Column({ type: 'tinyint', name: 'is_neutered', default: 0, comment: '是否绝育: 0-否 1-是' })
  isNeutered: number;

  @Column({ type: 'varchar', name: 'age_group', length: 16, nullable: true, comment: '年龄段: puppy/kitten/adult/senior' })
  ageGroup: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
