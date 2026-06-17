import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { PointsLogEntity } from './entities/points-log.entity';
import { RechargeLogEntity } from './entities/recharge-log.entity';
import { ConsumptionLogEntity } from './entities/consumption-log.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { ListPointsLogDto, ListRechargeLogDto, ListConsumptionLogDto } from './dto/index';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(PointsLogEntity) private readonly pointsRepo: Repository<PointsLogEntity>,
    @InjectRepository(RechargeLogEntity) private readonly rechargeRepo: Repository<RechargeLogEntity>,
    @InjectRepository(ConsumptionLogEntity) private readonly consumptionRepo: Repository<ConsumptionLogEntity>,
    @InjectRepository(PetUserEntity) private readonly userRepo: Repository<PetUserEntity>,
  ) {}

  // ====== 积分流水 ======
  async findPointsLogs(query: ListPointsLogDto) {
    const qb = this.pointsRepo.createQueryBuilder('p');
    if (query.userId) qb.andWhere('p.userId = :uid', { uid: query.userId });
    if (query.type) qb.andWhere('p.type = :t', { t: query.type });
    if (query.source) qb.andWhere('p.source = :s', { s: query.source });
    if (query.startDate) qb.andWhere('p.createdAt >= :sd', { sd: query.startDate });
    if (query.endDate) qb.andWhere('p.createdAt <= :ed', { ed: query.endDate });
    qb.orderBy('p.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 充值记录 ======
  async findRechargeLogs(query: ListRechargeLogDto) {
    const qb = this.rechargeRepo.createQueryBuilder('r');
    if (query.userId) qb.andWhere('r.userId = :uid', { uid: query.userId });
    if (query.method) qb.andWhere('r.method = :m', { m: query.method });
    if (query.status) qb.andWhere('r.status = :s', { s: query.status });
    qb.orderBy('r.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 消费流水 ======
  async findConsumptionLogs(query: ListConsumptionLogDto) {
    const qb = this.consumptionRepo.createQueryBuilder('c');
    if (query.userId) qb.andWhere('c.userId = :uid', { uid: query.userId });
    if (query.type) qb.andWhere('c.type = :t', { t: query.type });
    if (query.status) qb.andWhere('c.status = :s', { s: query.status });
    qb.orderBy('c.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 小程序端 ======
  async getMyPointsLogs(userId: number) {
    const list = await this.pointsRepo.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 50 });
    // 计算当前积分余额
    const lastLog = await this.pointsRepo.findOne({ where: { userId }, order: { createdAt: 'DESC' } });
    const balance = lastLog ? lastLog.balanceAfter : 0;
    return ResultData.ok({ balance, list });
  }

  async getMyRecharges(userId: number) {
    const list = await this.rechargeRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return ResultData.ok(list);
  }

  async getMyConsumptions(userId: number) {
    const list = await this.consumptionRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return ResultData.ok(list);
  }

  async signIn(userId: number) {
    // 签到加积分（简单实现）
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const exists = await this.pointsRepo.findOne({ where: { userId, source: 'sign_in' }, order: { createdAt: 'DESC' } });
    if (exists && exists.createdAt >= today && exists.createdAt < tomorrow) {
      return ResultData.fail(500, '今日已签到');
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const currentPoints = user ? (user.points || 0) : 0;
    const pointsToAdd = 10;
    const balanceAfter = currentPoints + pointsToAdd;
    await this.pointsRepo.save({ userId, type: 'earn', source: 'sign_in', changeValue: pointsToAdd, balanceAfter, remark: '每日签到' });
    // 同步更新 USER.points
    if (user) {
      await this.userRepo.update(userId, { points: balanceAfter });
    }
    return ResultData.ok({ points: pointsToAdd, balance: balanceAfter });
  }
}
