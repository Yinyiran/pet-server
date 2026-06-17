import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { RefundEntity } from './entities/refund.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { PaymentEntity } from '../order/entities/payment.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { PointsLogEntity } from '../finance/entities/points-log.entity';
import { CreateRefundDto, ListRefundDto, AuditRefundDto } from './dto/index';

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(RefundEntity) private readonly repo: Repository<RefundEntity>,
    @InjectRepository(OrderEntity) private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(PaymentEntity) private readonly payRepo: Repository<PaymentEntity>,
    @InjectRepository(PetUserEntity) private readonly userRepo: Repository<PetUserEntity>,
    @InjectRepository(PointsLogEntity) private readonly pointsLogRepo: Repository<PointsLogEntity>,
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

  /**
   * 售后审核（修复：退款通过后执行退款、回滚积分）
   */
  async audit(id: number, dto: AuditRefundDto, reviewerId?: number) {
    const refund = await this.repo.findOne({ where: { id } });
    if (!refund) return ResultData.fail(500, '售后记录不存在');
    if (refund.status !== 'pending') return ResultData.fail(500, '该售后已处理');

    await this.repo.update(id, { status: dto.status, remark: dto.remark, reviewerId });

    if (dto.status === 'approved' && refund.type === 'refund') {
      // 更新订单状态为 refunding
      const order = await this.orderRepo.findOne({ where: { orderNo: refund.orderNo } });
      if (order) {
        await this.orderRepo.update(order.id, { status: 'refunding' });

        // 退款：更新支付记录状态
        await this.payRepo.update({ orderNo: refund.orderNo, status: 'success' }, { status: 'refunded' });

        // 回滚积分（如有）
        const user = await this.userRepo.findOne({ where: { id: refund.userId } });
        if (user && order) {
          // 查该订单获取的积分
          const pointsLog = await this.pointsLogRepo.findOne({
            where: { userId: user.id, source: 'order', relatedId: order.id },
          });
          if (pointsLog && pointsLog.changeValue > 0) {
            const newPoints = Math.max(0, (user.points || 0) - pointsLog.changeValue);
            await this.userRepo.update(user.id, { points: newPoints });
            await this.pointsLogRepo.save({
              userId: user.id, type: 'spend', source: 'refund',
              changeValue: -pointsLog.changeValue, balanceAfter: newPoints,
              remark: `退款回滚积分(${refund.orderNo})`, relatedId: order.id,
            });
          }
        }

        await this.orderRepo.update(order.id, { status: 'refunded' });
      }
    }

    return ResultData.ok();
  }

  // ====== 小程序端 ======
  async submitRefund(userId: number, dto: CreateRefundDto) {
    // 检查订单是否存在且状态允许售后
    const order = await this.orderRepo.findOne({ where: { orderNo: dto.orderNo, userId } });
    if (!order) return ResultData.fail(500, '订单不存在');
    if (!['received', 'completed'].includes(order.status)) return ResultData.fail(500, '当前订单状态不允许申请售后');

    // 检查是否已有进行中的售后
    const exists = await this.repo.findOne({ where: { orderNo: dto.orderNo, userId, status: 'pending' } });
    if (exists) return ResultData.fail(500, '已有进行中的售后申请');

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
