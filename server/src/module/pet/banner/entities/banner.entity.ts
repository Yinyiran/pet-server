import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('t_banner', { comment: 'Banner轮播表' })
export class BannerEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'title', length: 64, comment: '主标题' })
  title: string;

  @Column({ type: 'varchar', name: 'subtitle', length: 128, nullable: true, comment: '副标题' })
  subtitle: string;

  @Column({ type: 'varchar', name: 'bg_img', length: 512, nullable: true, comment: '背景图URL' })
  bgImg: string;

  @Column({ type: 'varchar', name: 'bg_color', length: 16, default: '#f0f0f0', comment: '兜底背景色' })
  bgColor: string;

  @Column({ type: 'varchar', name: 'btn_text', length: 32, nullable: true, comment: '按钮文字' })
  btnText: string;

  @Column({ type: 'varchar', name: 'btn_color', length: 16, nullable: true, comment: '按钮颜色' })
  btnColor: string;

  @Column({ type: 'varchar', name: 'link_type', length: 16, default: 'none', comment: '跳转类型: product/merchant/page/url/none' })
  linkType: string;

  @Column({ type: 'varchar', name: 'link_value', length: 256, nullable: true, comment: '跳转目标ID或路径' })
  linkValue: string;

  @Index('idx_sort_order')
  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '轮播顺序' })
  sortOrder: number;

  @Index('idx_is_active')
  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否启用: 0-否 1-是' })
  isActive: number;

  @Column({ type: 'datetime', name: 'valid_from', nullable: true, comment: '展示开始时间' })
  validFrom: Date;

  @Column({ type: 'datetime', name: 'valid_until', nullable: true, comment: '展示结束时间' })
  validUntil: Date;
}
