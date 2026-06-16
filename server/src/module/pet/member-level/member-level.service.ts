import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { MemberLevelEntity } from './entities/member-level.entity';
import { CreateMemberLevelDto, UpdateMemberLevelDto } from './dto/index';

@Injectable()
export class MemberLevelService {
  constructor(
    @InjectRepository(MemberLevelEntity)
    private readonly repo: Repository<MemberLevelEntity>,
  ) {}

  async findAll() {
    const list = await this.repo.find({ order: { sortOrder: 'ASC' } });
    return ResultData.ok(list);
  }

  async findOne(levelKey: string) {
    const data = await this.repo.findOne({ where: { levelKey } });
    return ResultData.ok(data);
  }

  async create(dto: CreateMemberLevelDto) {
    const exists = await this.repo.findOne({ where: { levelKey: dto.levelKey } });
    if (exists) return ResultData.fail(500, '该等级标识已存在');
    await this.repo.save(dto);
    return ResultData.ok();
  }

  async update(dto: UpdateMemberLevelDto) {
    const { levelKey, ...data } = dto;
    await this.repo.update(levelKey, data);
    return ResultData.ok();
  }

  async remove(levelKey: string) {
    await this.repo.delete(levelKey);
    return ResultData.ok();
  }
}
