import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { RefundEntity } from './entities/refund.entity';
import { CreateRefundDto, ListRefundDto, AuditRefundDto } from './dto/index';

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(RefundEntity) private readonly repo: Repository<RefundEntity>,
  ) {}

  // ====== 管理端 ======
  async findAll(query: ListRefundDto) {
    const qb = this.repo.createQueryBuilder('r');
    if (query.orderNo) qb.andWhere('r.orderNo = :no', { no: query.orderNo });
    if (query.userId) qb.andWhere('r.userId = :uid', { uid: query.userId });
    if (query.status) qb.andWhere('r.status = :s', { s: query.status });
    if (query.type) qb.andWhere('r.type = :t', { t: query.type });
    if (query.params?.beginTime && query.params?.endTime) {
      qb.andWhere('r.createdAt BETWEEN :s AND :e', { s: query.params.beginTime, e: query.params.endTime });
    }
    qb.orderBy('r.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const data = await this.repo.findOne({ where: { id } });
    return ResultData.ok(data);
  }

  async audit(id: number, dto: AuditRefundDto, reviewerId?: number) {
    await this.repo.update(id, { status: dto.status, remark: dto.remark, reviewerId });
    return ResultData.ok();
  }

  // ====== 小程序端 ======
  async submitRefund(userId: number, dto: CreateRefundDto) {
    await this.repo.save({ ...dto, userId, status: 'pending' });
    return ResultData.ok();
  }

  async getAppRefunds(userId: number, query: { status?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.repo.createQueryBuilder('r').where('r.userId = :uid', { uid: userId });
    if (query.status) qb.andWhere('r.status = :s', { s: query.status });
    qb.orderBy('r.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async getAppRefundDetail(userId: number, id: number) {
    const data = await this.repo.findOne({ where: { id, userId } });
    if (!data) return ResultData.fail(500, '售后记录不存在');
    return ResultData.ok(data);
  }
}
