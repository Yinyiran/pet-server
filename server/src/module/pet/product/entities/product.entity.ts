import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_product', { comment: '商品表' })
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Index('idx_merchant_id')
  @Column({ type: 'bigint', name: 'merchant_id', nullable: true, comment: '所属商家ID' })
  merchantId: number;

  @Column({ type: 'varchar', name: 'name', length: 128, comment: '商品名称' })
  name: string;

  @Column({ type: 'text', name: 'description', nullable: true, comment: '商品描述' })
  description: string;

  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2, comment: '售价' })
  price: number;

  @Column({ type: 'decimal', name: 'original_price', precision: 10, scale: 2, nullable: true, comment: '原价' })
  originalPrice: number;

  @Column({ type: 'int', name: 'stock', default: 0, comment: '库存数量' })
  stock: number;

  @Index('idx_category')
  @Column({ type: 'varchar', name: 'category', length: 64, nullable: true, comment: '分类编码' })
  category: string;

  @Column({ type: 'varchar', name: 'tags', length: 256, nullable: true, comment: '标签(逗号分隔)' })
  tags: string;

  @Column({ type: 'varchar', name: 'img_url', length: 512, nullable: true, comment: '主图URL' })
  imgUrl: string;

  @Column({ type: 'json', name: 'gallery', nullable: true, comment: '轮播图URL数组' })
  gallery: any;

  @Column({ type: 'json', name: 'specs', nullable: true, comment: '规格JSON' })
  specs: any;

  @Index('idx_is_active')
  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否上架: 0-下架 1-上架' })
  isActive: number;

  @Column({ type: 'int', name: 'sales', default: 0, comment: '销量' })
  sales: number;

  @Column({ type: 'tinyint', name: 'is_flash', default: 0, comment: '是否限时特供: 0-否 1-是' })
  isFlash: number;

  @Column({ type: 'decimal', name: 'flash_price', precision: 10, scale: 2, nullable: true, comment: '特供价' })
  flashPrice: number;

  @Column({ type: 'datetime', name: 'flash_start', nullable: true, comment: '特供开始时间' })
  flashStart: Date;

  @Column({ type: 'datetime', name: 'flash_end', nullable: true, comment: '特供结束时间' })
  flashEnd: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
