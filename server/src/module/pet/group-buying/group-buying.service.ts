import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { GroupBuyingEntity } from './entities/group-buying.entity';
import { GroupBuyingMemberEntity } from './entities/group-buying-member.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderItemEntity } from '../order/entities/order-item.entity';
import { StartGroupDto, JoinGroupDto, ListGroupDto } from './dto/index';

@Injectable()
export class GroupBuyingService {
  constructor(
    @InjectRepository(GroupBuyingEntity)
    private readonly groupRepo: Repository<GroupBuyingEntity>,
    @InjectRepository(GroupBuyingMemberEntity)
    private readonly memberRepo: Repository<GroupBuyingMemberEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(PetUserEntity)
    private readonly userRepo: Repository<PetUserEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // ====== 小程序端 ======

  /**
   * 发起拼团
   * 流程：校验商品拼团配置 → 校验库存 → 创建拼团记录 → 创建团长member → 预扣库存 → 创建待支付订单
   */
  async startGroup(userId: number, dto: StartGroupDto) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) return ResultData.fail(500, '商品不存在');
    if (!product.isActive) return ResultData.fail(500, '商品已下架');
    if (!product.groupBuyConfig?.length) return ResultData.fail(500, '该商品不支持拼团');

    // 查找匹配的拼团规格
    const config = product.groupBuyConfig.find((c: any) => c.size === dto.groupSize);
    if (!config) return ResultData.fail(500, `该商品不支持${dto.groupSize}人拼团`);

    // 校验库存
    if (product.stock < 1) return ResultData.fail(500, '商品库存不足');

    // 检查用户是否已有该商品的进行中的拼团
    const existingGroup = await this.groupRepo
      .createQueryBuilder('g')
      .innerJoin(GroupBuyingMemberEntity, 'm', 'm.groupBuyingId = g.id AND m.userId = :uid', { uid: userId })
      .where('g.productId = :pid', { pid: dto.productId })
      .andWhere('g.status = :status', { status: 'forming' })
      .andWhere('g.expireAt > :now', { now: new Date() })
      .getOne();
    if (existingGroup) {
      return ResultData.fail(500, '您已有该商品的进行中拼团，请先完成或取消');
    }

    const unitPrice = Number(product.price);
    const discountRate = Number(config.discount);
    const groupPrice = Math.round(unitPrice * (100 - discountRate)) / 100;
    const originalPrice = Number(product.originalPrice || product.price);

    // 24小时后过期
    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const groupNo = 'GB' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderNo = 'FY' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();

    // 使用事务保证原子性
    return await this.dataSource.transaction(async (manager) => {
      // 预扣库存
      const stockResult = await manager.createQueryBuilder()
        .update(ProductEntity)
        .set({ stock: () => 'stock - 1', sales: () => 'sales + 1' })
        .where('id = :id AND stock >= 1', { id: product.id })
        .execute();
      if (stockResult.affected === 0) {
        return ResultData.fail(500, '库存不足');
      }

      // 创建拼团实例
      const group = await manager.save(GroupBuyingEntity, {
        groupNo,
        productId: product.id,
        leaderId: userId,
        groupSize: config.size,
        discountRate,
        groupPrice,
        originalPrice,
        currentCount: 1,
        status: 'forming',
        expireAt,
      });

      // 创建团长订单（pending状态）
      const order = await manager.save(OrderEntity, {
        orderNo,
        userId,
        totalAmount: groupPrice,
        originalAmount: originalPrice,
        discountAmount: Math.round((originalPrice - groupPrice) * 100) / 100,
        status: 'pending',
      });

      await manager.save(OrderItemEntity, {
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        price: groupPrice,
        qty: 1,
        subtotal: groupPrice,
      });

      // 创建团长member记录
      await manager.save(GroupBuyingMemberEntity, {
        groupBuyingId: group.id,
        userId,
        orderId: order.id,
        isLeader: 1,
        status: 'pending',
      });

      return ResultData.ok({
        groupNo: group.groupNo,
        groupId: group.id,
        orderNo,
        groupPrice,
        expireAt,
      });
    });
  }

  /**
   * 参加拼团
   * 流程：校验拼团状态 → 防重复参团 → 预扣库存 → 创建订单 → 更新参团人数 → 判断是否成团
   */
  async joinGroup(userId: number, dto: JoinGroupDto) {
    const group = await this.groupRepo.findOne({ where: { groupNo: dto.groupNo } });
    if (!group) return ResultData.fail(500, '拼团不存在');
    if (group.status !== 'forming') return ResultData.fail(500, '该拼团已结束');
    if (group.expireAt < new Date()) {
      // 惰性过期处理
      await this.groupRepo.update(group.id, { status: 'expired' });
      return ResultData.fail(500, '该拼团已过期');
    }
    if (group.currentCount >= group.groupSize) return ResultData.fail(500, '拼团已满员');

    // 防重复参团
    const existingMember = await this.memberRepo.findOne({
      where: { groupBuyingId: group.id, userId },
    });
    if (existingMember) return ResultData.fail(500, '您已参加过该拼团');

    // 校验商品库存
    const product = await this.productRepo.findOne({ where: { id: group.productId } });
    if (!product || product.stock < 1) return ResultData.fail(500, '商品库存不足');

    const groupPrice = Number(group.groupPrice);
    const originalPrice = Number(group.originalPrice);
    const orderNo = 'FY' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();

    return await this.dataSource.transaction(async (manager) => {
      // 预扣库存
      const stockResult = await manager.createQueryBuilder()
        .update(ProductEntity)
        .set({ stock: () => 'stock - 1', sales: () => 'sales + 1' })
        .where('id = :id AND stock >= 1', { id: group.productId })
        .execute();
      if (stockResult.affected === 0) {
        return ResultData.fail(500, '库存不足');
      }

      // 创建订单
      const order = await manager.save(OrderEntity, {
        orderNo,
        userId,
        totalAmount: groupPrice,
        originalAmount: originalPrice,
        discountAmount: Math.round((originalPrice - groupPrice) * 100) / 100,
        status: 'pending',
      });

      await manager.save(OrderItemEntity, {
        orderId: order.id,
        productId: group.productId,
        productName: product.name,
        price: groupPrice,
        qty: 1,
        subtotal: groupPrice,
      });

      // 添加参团记录
      await manager.save(GroupBuyingMemberEntity, {
        groupBuyingId: group.id,
        userId,
        orderId: order.id,
        isLeader: 0,
        status: 'pending',
      });

      // 更新参团人数
      const newCount = group.currentCount + 1;
      const isComplete = newCount >= group.groupSize;
      await manager.update(GroupBuyingEntity, group.id, {
        currentCount: newCount,
        status: isComplete ? 'success' : 'forming',
      });

      return ResultData.ok({
        groupNo: group.groupNo,
        orderNo,
        groupPrice,
        isComplete,
        currentCount: newCount,
      });
    });
  }

  /**
   * 拼团详情（含参团者列表）
   */
  async getGroupDetail(groupNo: string) {
    const group = await this.groupRepo.findOne({ where: { groupNo } });
    if (!group) return ResultData.fail(500, '拼团不存在');

    // 惰性过期检查
    if (group.status === 'forming' && group.expireAt < new Date()) {
      await this.groupRepo.update(group.id, { status: 'expired' });
      group.status = 'expired';
    }

    const members = await this.memberRepo.find({
      where: { groupBuyingId: group.id },
      order: { joinedAt: 'ASC' },
    });

    // 获取参团者的昵称和头像
    const userIds = members.map(m => m.userId);
    const users = userIds.length
      ? await this.userRepo.findByIds(userIds)
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const membersWithUser = members.map(m => {
      const user = userMap.get(m.userId);
      return {
        ...m,
        nickname: user?.nickname || `用户${m.userId}`,
        avatar: user?.avatar || '',
      };
    });

    // 商品信息
    const product = await this.productRepo.findOne({ where: { id: group.productId } });

    return ResultData.ok({
      ...group,
      members: membersWithUser,
      product: product ? {
        id: product.id,
        name: product.name,
        imgUrl: product.imgUrl,
        price: product.price,
      } : null,
      remainSlots: group.groupSize - group.currentCount,
      isExpired: group.status === 'expired' || (group.status === 'forming' && group.expireAt < new Date()),
    });
  }

  /**
   * 商品正在进行中的拼团列表
   */
  async getProductGroups(productId: number) {
    const now = new Date();
    const groups = await this.groupRepo
      .createQueryBuilder('g')
      .where('g.productId = :pid', { pid: productId })
      .andWhere('g.status = :status', { status: 'forming' })
      .andWhere('g.expireAt > :now', { now })
      .orderBy('g.createdAt', 'DESC')
      .limit(20)
      .getMany();

    // 批量获取团长信息
    const leaderIds = [...new Set(groups.map(g => g.leaderId))];
    const leaders = leaderIds.length
      ? await this.userRepo.findByIds(leaderIds)
      : [];
    const leaderMap = new Map(leaders.map(u => [u.id, u]));

    const list = groups.map(g => {
      const leader = leaderMap.get(g.leaderId);
      return {
        ...g,
        leaderNickname: leader?.nickname || `用户${g.leaderId}`,
        leaderAvatar: leader?.avatar || '',
        remainSlots: g.groupSize - g.currentCount,
      };
    });

    return ResultData.ok(list);
  }

  /**
   * 用户参与的拼团列表
   */
  async getUserGroups(userId: number, query: { status?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.groupRepo
      .createQueryBuilder('g')
      .innerJoin(GroupBuyingMemberEntity, 'm', 'm.groupBuyingId = g.id AND m.userId = :uid', { uid: userId })
      .leftJoin(ProductEntity, 'p', 'p.id = g.productId')
      .addSelect(['p.name', 'p.imgUrl']);

    if (query.status) qb.andWhere('g.status = :status', { status: query.status });
    qb.orderBy('g.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) {
      qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    }

    const { entities, raw } = await qb.getRawAndEntities();
    const list = entities.map((entity, i) => ({
      ...entity,
      productName: raw[i]?.p_name || '',
      productImgUrl: raw[i]?.p_imgUrl || '',
    }));
    const total = await qb.getCount();

    return ResultData.ok({ list, total });
  }

  // ====== 管理端 ======

  /**
   * 管理端拼团列表
   */
  async findAll(query: ListGroupDto) {
    const qb = this.groupRepo.createQueryBuilder('g')
      .leftJoin(ProductEntity, 'p', 'p.id = g.productId')
      .addSelect(['p.name', 'p.imgUrl']);

    if (query.productId) qb.andWhere('g.productId = :pid', { pid: query.productId });
    if (query.status) qb.andWhere('g.status = :status', { status: query.status });
    if (query.leaderId) qb.andWhere('g.leaderId = :lid', { lid: query.leaderId });
    qb.orderBy('g.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) {
      qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    }

    const { entities, raw } = await qb.getRawAndEntities();
    const list = entities.map((entity, i) => ({
      ...entity,
      productName: raw[i]?.p_name || '',
      productImgUrl: raw[i]?.p_imgUrl || '',
    }));
    const total = await qb.getCount();

    return ResultData.ok({ list, total });
  }

  /**
   * 管理端拼团详情
   */
  async findOne(id: number) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) return ResultData.fail(500, '拼团不存在');

    const members = await this.memberRepo.find({
      where: { groupBuyingId: id },
      order: { joinedAt: 'ASC' },
    });

    const userIds = members.map(m => m.userId);
    const users = userIds.length ? await this.userRepo.findByIds(userIds) : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const membersWithUser = members.map(m => {
      const user = userMap.get(m.userId);
      return { ...m, nickname: user?.nickname || '', avatar: user?.avatar || '' };
    });

    return ResultData.ok({ ...group, members: membersWithUser });
  }

  /**
   * 过期拼团检查与处理（惰性 + 可定时调用）
   * 将过期且未成团的拼团标记为 expired，回滚库存
   */
  async checkAndExpireGroups() {
    const now = new Date();
    const expiredGroups = await this.groupRepo.find({
      where: {
        status: 'forming',
        expireAt: LessThan(now),
      },
    });

    for (const group of expiredGroups) {
      await this.dataSource.transaction(async (manager) => {
        // 标记为 expired
        await manager.update(GroupBuyingEntity, group.id, { status: 'expired' });

        // 回滚库存（所有参团者的库存都回滚）
        const members = await manager.find(GroupBuyingMemberEntity, {
          where: { groupBuyingId: group.id },
        });

        for (const member of members) {
          // 回滚商品库存
          await manager.createQueryBuilder()
            .update(ProductEntity)
            .set({ stock: () => 'stock + 1', sales: () => 'sales - 1' })
            .where('id = :id', { id: group.productId })
            .execute();

          // 更新订单状态为 cancelled
          if (member.orderId) {
            await manager.update(OrderEntity, member.orderId, { status: 'cancelled' });
          }

          // 更新member状态为 refunded
          await manager.update(GroupBuyingMemberEntity, member.id, { status: 'refunded' });
        }
      });
    }

    return ResultData.ok({ expiredCount: expiredGroups.length });
  }
}
