import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('t_live_room', { comment: '直播间表' })
export class LiveRoomEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 128, comment: '直播间名称' })
  name: string;

  @Column({ type: 'varchar', name: 'platform', length: 32, nullable: true, comment: '平台: douyin/kuaishou等' })
  platform: string;

  @Column({ type: 'varchar', name: 'room_id', length: 64, nullable: true, comment: '房间号' })
  roomId: string;

  @Column({ type: 'varchar', name: 'share_code', length: 64, nullable: true, comment: '分享口令' })
  shareCode: string;

  @Column({ type: 'varchar', name: 'cover_img', length: 512, nullable: true, comment: '封面图' })
  coverImg: string;

  @Column({ type: 'varchar', name: 'live_url', length: 512, nullable: true, comment: '直播链接' })
  liveUrl: string;

  @Column({ type: 'tinyint', name: 'is_active', default: 1, comment: '是否启用: 0-禁用 1-启用' })
  isActive: number;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
