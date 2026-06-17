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

  /**
   * 审核提现（修复：余额回滚）
   * 通过：frozen_amount 扣减
   * 拒绝：available_balance 回滚，frozen_amount 扣减
   */
  async auditWithdraw(id: number, dto: AuditWithdrawDto) {
    const withdraw = await this.withdrawRepo.findOne({ where: { id } });
    if (!withdraw) return ResultData.fail(500, '提现记录不存在');
    if (withdraw.status !== 'pending') return ResultData.fail(500, '该提现已处理');

    const uc = await this.ucRepo.findOne({ where: { userId: withdraw.userId } });
    if (!uc) return ResultData.fail(500, '分佣账户不存在');

    const update: any = { status: dto.status, auditRemark: dto.auditRemark };

    if (dto.status === 'completed') {
      // 通过并打款：扣减冻结金额
      update.finishedAt = new Date();
      await this.ucRepo.update(uc.id, {
        frozenAmount: Math.max(0, Number(uc.frozenAmount) - Number(withdraw.amount)),
        updatedAt: new Date(),
      });
    } else if (dto.status === 'rejected') {
      // 拒绝：冻结金额回滚到可提现余额
      await this.ucRepo.update(uc.id, {
        availableBalance: Number(uc.availableBalance) + Number(withdraw.amount),
        frozenAmount: Math.max(0, Number(uc.frozenAmount) - Number(withdraw.amount)),
        updatedAt: new Date(),
      });
    }

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

  /**
   * 申请提现（修复：余额校验 + 冻结）
   * 校验：最低 10 元、金额 <= available_balance
   * 操作：available_balance -= amount, frozen_amount += amount
   */
  async applyWithdraw(userId: number, dto: ApplyWithdrawDto) {
    if (!dto.amount || dto.amount < 10) return ResultData.fail(500, '最低提现金额为 ¥10');

    const uc = await this.ucRepo.findOne({ where: { userId } });
    if (!uc) return ResultData.fail(500, '分佣账户不存在');
    if (Number(uc.availableBalance) < dto.amount) return ResultData.fail(500, `可提现余额不足，当前可提现 ¥${uc.availableBalance}`);

    // 冻结余额
    await this.ucRepo.update(uc.id, {
      availableBalance: Number(uc.availableBalance) - dto.amount,
      frozenAmount: Number(uc.frozenAmount) + dto.amount,
      updatedAt: new Date(),
    });

    const withdrawNo = 'WD' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
    await this.withdrawRepo.save({ ...dto, userId, withdrawNo, status: 'pending', appliedAt: new Date() });
    return ResultData.ok();
  }

  /**
   * 分佣自动计算（新增）
   * 追溯邀请链，按差额费率计算每级佣金
   * 公式：上级佣金 = order.total × (上级费率 - 下级费率)
   */
  async calculateCommission(orderId: number, buyerUserId: number, orderTotal: number) {
    // 查找买家的邀请人（depth=1 直接上级）
    const invite = await this.inviteRepo.findOne({ where: { userId: buyerUserId, status: 'active' } });
    if (!invite) return; // 无邀请关系，不产生佣金

    let currentUserId = invite.parentId;
    let childRate = 0; // 下级费率
    let depth = 1;
    const maxDepth = 10; // 防止无限循环

    while (currentUserId && depth <= maxDepth) {
      // 查询当前用户的分佣账户和等级
      const uc = await this.ucRepo.findOne({ where: { userId: currentUserId } });
      if (!uc || !uc.tierId) break; // 无分佣资格

      const tier = await this.tierRepo.findOne({ where: { id: uc.tierId, isActive: 1 } });
      if (!tier) break;

      const currentRate = Number(tier.commissionRate);
      // 差额费率 = 当前费率 - 下级费率
      const diffRate = currentRate - childRate;
      if (diffRate <= 0) break; // 无差额，不再往上追溯

      const commissionAmount = Math.round(orderTotal * diffRate) / 100;
      if (commissionAmount <= 0) break;

      const logNo = 'CM' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase() + depth;

      // 写入佣金流水
      await this.logRepo.save({
        logNo,
        userId: currentUserId,
        fromUserId: buyerUserId,
        orderId,
        type: 'order',
        title: `下级消费佣金(第${depth}级)`,
        amount: commissionAmount,
        commissionLevel: depth,
        rate: diffRate,
        orderAmount: orderTotal,
        status: 'pending', // 待结算，收货后转为 settled
      });

      // 更新分佣账户的 pending_amount
      await this.ucRepo.update(uc.id, {
        pendingAmount: Number(uc.pendingAmount) + commissionAmount,
        totalEarned: Number(uc.totalEarned) + commissionAmount,
        thisMonthEarned: Number(uc.thisMonthEarned) + commissionAmount,
        updatedAt: new Date(),
      });

      childRate = currentRate;

      // 继续往上追溯
      const parentInvite = await this.inviteRepo.findOne({ where: { userId: currentUserId, status: 'active' } });
      if (!parentInvite) break;
      currentUserId = parentInvite.parentId;
      depth++;
    }
  }

  /**
   * 结算佣金（新增）
   * 订单确认收货后，将 pending 状态的佣金转为 settled
   */
  async settleCommission(orderId: number) {
    const logs = await this.logRepo.find({ where: { orderId, status: 'pending' } });
    for (const log of logs) {
      await this.logRepo.update(log.id, { status: 'settled', settledAt: new Date() });

      // pending_amount → available_balance
      const uc = await this.ucRepo.findOne({ where: { userId: log.userId } });
      if (uc) {
        await this.ucRepo.update(uc.id, {
          pendingAmount: Math.max(0, Number(uc.pendingAmount) - Number(log.amount)),
          availableBalance: Number(uc.availableBalance) + Number(log.amount),
          updatedAt: new Date(),
        });
      }
    }
  }

  /**
   * 创建/更新分佣账户（供课程购买等调用）
   */
  async ensureCommissionAccount(userId: number, tierId: number) {
    let uc = await this.ucRepo.findOne({ where: { userId } });
    if (uc) {
      await this.ucRepo.update(uc.id, { tierId, updatedAt: new Date() });
    } else {
      await this.ucRepo.save({ userId, tierId });
    }
  }
}
