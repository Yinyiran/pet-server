import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { LiveRoomEntity } from './entities/live-room.entity';
import { CreateLiveRoomDto, UpdateLiveRoomDto, ListLiveRoomDto } from './dto/index';

@Injectable()
export class LiveRoomService {
  constructor(
    @InjectRepository(LiveRoomEntity) private readonly repo: Repository<LiveRoomEntity>,
  ) {}

  async findAll(query: ListLiveRoomDto) {
    const qb = this.repo.createQueryBuilder('r');
    if (query.keyword) qb.andWhere('r.name LIKE :kw', { kw: `%${query.keyword}%` });
    if (query.isActive !== undefined && query.isActive !== null) qb.andWhere('r.isActive = :a', { a: query.isActive });
    qb.orderBy('r.sortOrder', 'ASC').addOrderBy('r.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const data = await this.repo.findOne({ where: { id } });
    return ResultData.ok(data);
  }

  async create(dto: CreateLiveRoomDto) {
    await this.repo.save(dto);
    return ResultData.ok();
  }

  async update(dto: UpdateLiveRoomDto) {
    const { id, ...data } = dto;
    await this.repo.update(id, data);
    return ResultData.ok();
  }

  async remove(ids: string) {
    await this.repo.delete(ids.split(',').map(Number));
    return ResultData.ok();
  }

  async toggleStatus(id: number, isActive: number) {
    await this.repo.update(id, { isActive });
    return ResultData.ok();
  }

  // 小程序端
  async getActiveRooms() {
    const list = await this.repo.find({ where: { isActive: 1 }, order: { sortOrder: 'ASC' } });
    return ResultData.ok(list);
  }
}
