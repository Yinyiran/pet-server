import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CommissionTierEntity } from './entities/commission-tier.entity';
import { UserCommissionEntity } from './entities/user-commission.entity';
import { UserInviteEntity } from './entities/user-invite.entity';
import { CommissionLogEntity } from './entities/commission-log.entity';
import { WithdrawEntity } from './entities/withdraw.entity';
import { CreateTierDto, UpdateTierDto, ListAccountDto, ListLogDto, ListInviteDto, ListWithdrawDto, AuditWithdrawDto, ApplyWithdrawDto } from './dto/index';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(CommissionTierEntity) private readonly tierRepo: Repository<CommissionTierEntity>,
    @InjectRepository(UserCommissionEntity) private readonly ucRepo: Repository<UserCommissionEntity>,
    @InjectRepository(UserInviteEntity) private readonly inviteRepo: Repository<UserInviteEntity>,
    @InjectRepository(CommissionLogEntity) private readonly logRepo: Repository<CommissionLogEntity>,
    @InjectRepository(WithdrawEntity) private readonly withdrawRepo: Repository<WithdrawEntity>,
  ) {}

  // ====== 分佣等级 ======
  async findTiers() { return ResultData.ok(await this.tierRepo.find({ order: { level: 'ASC' } })); }
  async createTier(dto: CreateTierDto) { await this.tierRepo.save(dto); return ResultData.ok(); }
  async updateTier(dto: UpdateTierDto) { const { id, ...data } = dto; await this.tierRepo.update(id, data); return ResultData.ok(); }

  // ====== 分佣账户 ======
  async findAccounts(query: ListAccountDto) {
    const qb = this.ucRepo.createQueryBuilder('uc');
    if (query.userId) qb.andWhere('uc.userId = :uid', { uid: query.userId });
    if (query.tierId) qb.andWhere('uc.tierId = :tid', { tid: query.tierId });
    qb.orderBy('uc.totalEarned', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 佣金流水 ======
  async findLogs(query: ListLogDto) {
    const qb = this.logRepo.createQueryBuilder('l');
    if (query.userId) qb.andWhere('l.userId = :uid', { uid: query.userId });
    if (query.type) qb.andWhere('l.type = :t', { t: query.type });
    if (query.status) qb.andWhere('l.status = :s', { s: query.status });
    qb.orderBy('l.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 邀请关系 ======
  async findInvites(query: ListInviteDto) {
    const qb = this.inviteRepo.createQueryBuilder('i');
    if (query.parentId) qb.andWhere('i.parentId = :pid', { pid: query.parentId });
    if (query.userId) qb.andWhere('i.userId = :uid', { uid: query.userId });
    qb.orderBy('i.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 提现管理 ======
  async findWithdraws(query: ListWithdrawDto) {
    const qb = this.withdrawRepo.createQueryBuilder('w');
    if (query.userId) qb.andWhere('w.userId = :uid', { uid: query.userId });
    if (query.status) qb.andWhere('w.status = :s', { s: query.status });
    qb.orderBy('w.appliedAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }
  async auditWithdraw(id: number, dto: AuditWithdrawDto) {
    const update: any = { status: dto.status, auditRemark: dto.auditRemark };
    if (dto.status === 'completed') update.finishedAt = new Date();
    await this.withdrawRepo.update(id, update);
    return ResultData.ok();
  }

  // ====== 小程序端 ======
  async getMyCommission(userId: number) {
    const data = await this.ucRepo.findOne({ where: { userId } });
    return ResultData.ok(data);
  }
  async getMyLogs(userId: number, query: { pageNum?: number; pageSize?: number }) {
    const qb = this.logRepo.createQueryBuilder('l').where('l.userId = :uid', { uid: userId });
    qb.orderBy('l.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }
  async getMyInvites(userId: number) {
    const list = await this.inviteRepo.find({ where: { parentId: userId } });
    return ResultData.ok(list);
  }
  async applyWithdraw(userId: number, dto: ApplyWithdrawDto) {
    const withdrawNo = 'WD' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
    await this.withdrawRepo.save({ ...dto, userId, withdrawNo, status: 'pending', appliedAt: new Date() });
    return ResultData.ok();
  }
}
