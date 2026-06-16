import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_city_merchant', { comment: '同城商家表' })
export class CityMerchantEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 128, comment: '商家名称' })
  name: string;

  @Index('idx_type')
  @Column({ type: 'varchar', name: 'type', length: 32, nullable: true, comment: '商家类型: shop/hospital等' })
  type: string;

  @Column({ type: 'json', name: 'tags', nullable: true, comment: '标签JSON' })
  tags: any;

  @Column({ type: 'text', name: 'description', nullable: true, comment: '简介' })
  description: string;

  @Column({ type: 'varchar', name: 'address', length: 256, nullable: true, comment: '地址' })
  address: string;

  @Column({ type: 'varchar', name: 'phone', length: 32, nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ type: 'decimal', name: 'score', precision: 3, scale: 1, default: 5.0, comment: '评分' })
  score: number;

  @Column({ type: 'varchar', name: 'img_url', length: 512, nullable: true, comment: '封面图' })
  imgUrl: string;

  @Column({ type: 'json', name: 'business_hours', nullable: true, comment: '营业时间JSON' })
  businessHours: any;

  @Column({ type: 'decimal', name: 'lat', precision: 10, scale: 6, nullable: true, comment: '纬度' })
  lat: number;

  @Column({ type: 'decimal', name: 'lng', precision: 10, scale: 6, nullable: true, comment: '经度' })
  lng: number;

  @Index('idx_status')
  @Column({ type: 'varchar', name: 'status', length: 16, default: 'active', comment: '状态: active/disabled/pending' })
  status: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
