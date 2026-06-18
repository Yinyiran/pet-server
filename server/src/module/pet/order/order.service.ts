import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CartEntity } from './entities/cart.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { PaymentEntity } from './entities/payment.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { UserAddressEntity } from '../user/entities/user-address.entity';
import { PointsLogEntity } from '../finance/entities/points-log.entity';
import { ConsumptionLogEntity } from '../finance/entities/consumption-log.entity';
import { MemberLevelEntity } from '../member-level/entities/member-level.entity';
import { CommissionService } from '../commission/commission.service';
import { ListOrderDto, ShipOrderDto, AddCartDto, UpdateCartDto, CreateOrderDto, ListPaymentDto } from './dto/index';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(CartEntity) private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(OrderEntity) private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity) private readonly itemRepo: Repository<OrderItemEntity>,
    @InjectRepository(PaymentEntity) private readonly payRepo: Repository<PaymentEntity>,
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(PetUserEntity) private readonly userRepo: Repository<PetUserEntity>,
    @InjectRepository(PointsLogEntity) private readonly pointsLogRepo: Repository<PointsLogEntity>,
    @InjectRepository(ConsumptionLogEntity) private readonly consumptionLogRepo: Repository<ConsumptionLogEntity>,
    @InjectRepository(MemberLevelEntity) private readonly memberLevelRepo: Repository<MemberLevelEntity>,
    private readonly commissionService: CommissionService,
    private readonly dataSource: DataSource,
  ) {}

  // ====== 管理端 - 订单 ======
  async findAll(query: ListOrderDto) {
    const qb = this.orderRepo.createQueryBuilder('o');
    if (query.orderNo) qb.andWhere('o.orderNo LIKE :no', { no: `%${query.orderNo}%` });
    if (query.userId) qb.andWhere('o.userId = :uid', { uid: query.userId });
    if (query.status) qb.andWhere('o.status = :s', { s: query.status });
    if (query.params?.beginTime && query.params?.endTime) {
      qb.andWhere('o.createdAt BETWEEN :s AND :e', { s: query.params.beginTime, e: query.params.endTime });
    }
    qb.orderBy('o.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const data = await this.orderRepo.findOne({ where: { id } });
    const items = await this.itemRepo.find({ where: { orderId: id } });
    const payments = await this.payRepo.find({ where: { orderNo: data?.orderNo } });
    return ResultData.ok({ ...data, items, payments });
  }

  async shipOrder(id: number, dto: ShipOrderDto) {
    await this.orderRepo.update(id, { ...dto, status: 'shipped', shippedAt: new Date() });
    return ResultData.ok();
  }

  async updateOrderStatus(id: number, status: string) {
    await this.orderRepo.update(id, { status });
    return ResultData.ok();
  }

  // ====== 管理端 - 支付记录 ======
  async findPayments(query: ListPaymentDto) {
    const qb = this.payRepo.createQueryBuilder('p');
    if (query.orderNo) qb.andWhere('p.orderNo = :no', { no: query.orderNo });
    if (query.status) qb.andWhere('p.status = :s', { s: query.status });
    if (query.method) qb.andWhere('p.method = :m', { m: query.method });
    qb.orderBy('p.paidAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 小程序端 - 购物车 ======
  async getCartList(userId: number) {
    const list = await this.cartRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return ResultData.ok(list);
  }

  async addToCart(userId: number, dto: AddCartDto) {
    await this.cartRepo.save({ ...dto, userId });
    return ResultData.ok();
  }

  async updateCart(userId: number, dto: UpdateCartDto) {
    const { id, ...data } = dto;
    await this.cartRepo.update({ id, userId }, data);
    return ResultData.ok();
  }

  async removeFromCart(userId: number, ids: string) {
    const idArr = ids.split(',').map(Number);
    await this.cartRepo.delete(idArr.map(id => ({ id, userId })));
    return ResultData.ok();
  }

  // ====== 小程序端 - 订单 ======

  /**
   * 创建订单（修复：原子扣库存防超卖 + 地址校验 + 金额精度）
   * 流程：查购物车 → 校验地址 → 查商品真实价格 → 原子扣减库存 → 创建订单/订单项 → 清空购物车
   */
  async createOrder(userId: number, dto: CreateOrderDto) {
    const cartIds = dto.cartIds.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
    if (!cartIds.length) return ResultData.fail(500, '请选择购物车商品');

    // 校验收货地址归属
    const address = await this.dataSource.getRepository(UserAddressEntity)
      .findOne({ where: { id: dto.addressId, userId } });
    if (!address) return ResultData.fail(500, '收货地址不存在或不属于当前用户');

    const carts = await this.cartRepo.findBy({ id: In(cartIds), userId });
    if (!carts.length) return ResultData.fail(500, '购物车为空');

    // 查询所有关联商品
    const productIds = carts.map(c => c.productId);
    const products = await this.productRepo.findBy({ id: In(productIds) });
    const productMap = new Map(products.map(p => [p.id, p]));

    // 使用事务保证原子性
    return await this.dataSource.transaction(async (manager) => {
      const orderItems: Partial<OrderItemEntity>[] = [];
      let totalAmount = 0;
      let originalAmount = 0;

      for (const cart of carts) {
        const product = productMap.get(cart.productId);
        if (!product) return ResultData.fail(500, `商品ID ${cart.productId} 不存在`);
        if (!product.isActive) return ResultData.fail(500, `商品「${product.name}」已下架`);
        if (cart.qty <= 0) return ResultData.fail(500, '商品数量必须大于 0');

        // 价格优先级：flash_price（限时特供期内） > price
        let unitPrice = Number(product.price);
        const now = new Date();
        if (product.isFlash && product.flashPrice && product.flashStart && product.flashEnd
          && product.flashStart <= now && product.flashEnd >= now) {
          unitPrice = Number(product.flashPrice);
        }

        const originalUnitPrice = Number(product.originalPrice || product.price);
        // 用分计算避免浮点误差，最后除回 100
        const subtotal = Math.round(unitPrice * 100) * cart.qty / 100;
        const originalSubtotal = Math.round(originalUnitPrice * 100) * cart.qty / 100;

        // 原子扣减库存：UPDATE ... SET stock = stock - qty WHERE id = ? AND stock >= qty
        const result = await manager.createQueryBuilder()
          .update(ProductEntity)
          .set({ stock: () => 'stock - :qty', sales: () => 'sales + :qty' })
          .where('id = :id AND stock >= :qty', { id: product.id, qty: cart.qty })
          .execute();
        if (result.affected === 0) {
          return ResultData.fail(500, `商品「${product.name}」库存不足`);
        }

        totalAmount += subtotal;
        originalAmount += originalSubtotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          price: unitPrice,
          qty: cart.qty,
          subtotal,
        });
      }

      // 金额四舍五入到分，避免浮点累计误差
      totalAmount = Math.round(totalAmount * 100) / 100;
      originalAmount = Math.round(originalAmount * 100) / 100;
      const discountAmount = Math.round((originalAmount - totalAmount) * 100) / 100;
      const orderNo = 'FY' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();

      const order = await manager.save(OrderEntity, {
        orderNo, userId, addressId: dto.addressId,
        totalAmount, originalAmount, discountAmount,
        status: 'pending',
      });

      for (const item of orderItems) {
        await manager.save(OrderItemEntity, { ...item, orderId: order.id });
      }

      // 清空购物车对应商品
      await manager.delete(CartEntity, cartIds.map(id => ({ id, userId })));

      return ResultData.ok({ orderNo, totalAmount });
    });
  }

  /**
   * 支付订单（修复：创建 pending 支付记录，由回调确认）
   * 流程：创建 PAYMENT(pending) 记录 → 返回给前端拉起微信支付
   */
  async payOrder(userId: number, orderNo: string, method: string) {
    const order = await this.orderRepo.findOne({ where: { orderNo, userId } });
    if (!order) return ResultData.fail(500, '订单不存在');
    if (order.status !== 'pending') return ResultData.fail(500, '订单状态不允许支付');

    // 检查是否已有成功支付
    const existPay = await this.payRepo.findOne({ where: { orderNo, status: 'success' } });
    if (existPay) return ResultData.fail(500, '订单已支付');

    const payment = await this.payRepo.save({
      orderNo, method, amount: order.totalAmount,
      status: 'pending',
      transactionId: 'TX' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase(),
    });
    return ResultData.ok(payment);
  }

  /**
   * 支付成功回调 / 模拟微信支付通知（修复：幂等 + 仅发放消费流水与佣金待结算）
   * 支付成功后触发：订单状态 paid → 消费流水 → 分佣计算(pending)
   * 注意：积分在「确认收货」时发放，避免重复
   */
  async onPaymentSuccess(orderNo: string) {
    // 幂等：查是否已处理过该订单的支付回调
    const order = await this.orderRepo.findOne({ where: { orderNo } });
    if (!order) return;
    // 已是 paid 之后的状态（shipped/received/cancelled），说明回调已处理过，直接返回
    if (['shipped', 'received', 'cancelled', 'refunded'].includes(order.status)) return;
    if (order.status !== 'pending') return;

    const user = await this.userRepo.findOne({ where: { id: order.userId } });
    if (!user) return;

    // 使用事务保证幂等性
    await this.dataSource.transaction(async (manager) => {
      // 更新支付记录与订单状态
      await manager.update(PaymentEntity, { orderNo, status: 'pending' }, { status: 'success', paidAt: new Date() });
      await manager.update(OrderEntity, order.id, { status: 'paid', paidAt: new Date() });

      // 1. 消费流水（支付时记录一次）
      await manager.save(ConsumptionLogEntity, {
        logNo: 'CL' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase(),
        userId: order.userId, type: 'purchase',
        itemSummary: `订单${order.orderNo}`,
        totalAmount: order.totalAmount, balancePay: 0, wechatPay: order.totalAmount,
        status: 'success',
      });
    });

    // 2. 分佣计算：追溯邀请链（佣金状态为 pending，收货后结算）
    await this.commissionService.calculateCommission(order.id, order.userId, Number(order.totalAmount));
  }

  async getAppOrders(userId: number, query: { status?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.orderRepo.createQueryBuilder('o').where('o.userId = :uid', { uid: userId });
    if (query.status) qb.andWhere('o.status = :s', { s: query.status });
    qb.orderBy('o.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async getAppOrderDetail(userId: number, id: number) {
    const data = await this.orderRepo.findOne({ where: { id, userId } });
    if (!data) return ResultData.fail(500, '订单不存在');
    const items = await this.itemRepo.find({ where: { orderId: id } });
    const payments = await this.payRepo.find({ where: { orderNo: data.orderNo } });
    return ResultData.ok({ ...data, items, payments });
  }

  /**
   * 确认收货（修复：不再重复计算佣金/消费流水，仅发放积分 + 结算佣金）
   * 流程：更新状态 → 更新累计消费 → 发放积分 → 结算佣金(pending→settled) → 检查会员升级
   */
  async confirmReceive(userId: number, id: number) {
    const order = await this.orderRepo.findOne({ where: { id, userId } });
    if (!order) return ResultData.fail(500, '订单不存在');
    if (order.status !== 'shipped') return ResultData.fail(500, '订单未发货，无法确认收货');

    await this.orderRepo.update(id, { status: 'received', receivedAt: new Date() });

    // 更新累计消费
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      const newTotalSpent = Number(user.totalSpent || 0) + Number(order.totalAmount);
      await this.userRepo.update(userId, { totalSpent: newTotalSpent });

      // 积分计算（仅收货时发放一次）
      const memberLevel = await this.memberLevelRepo.findOne({ where: { levelKey: user.memberLevel || 'silver' } });
      const pointsRate = memberLevel ? memberLevel.pointsRate : 1;
      const earnedPoints = Math.floor(Number(order.totalAmount) * pointsRate);

      if (earnedPoints > 0) {
        const newPoints = (user.points || 0) + earnedPoints;
        await this.userRepo.update(userId, { points: newPoints });
        await this.pointsLogRepo.save({
          userId, type: 'earn', source: 'order',
          changeValue: earnedPoints, balanceAfter: newPoints,
          remark: `订单${order.orderNo}收货积分`, relatedId: order.id,
        });
      }

      // 会员升级检查
      await this.checkMemberUpgrade(userId, newTotalSpent);
    }

    // 结算待结算的佣金（pending → settled），佣金在支付时已计算，此处仅结算
    await this.commissionService.settleCommission(order.id);

    return ResultData.ok();
  }

  /**
   * 取消订单（修复：事务 + 回滚库存/销量 + 回滚积分/佣金）
   */
  async cancelOrder(userId: number, id: number) {
    const order = await this.orderRepo.findOne({ where: { id, userId } });
    if (!order) return ResultData.fail(500, '订单不存在');
    if (!['pending', 'paid'].includes(order.status)) return ResultData.fail(500, '当前状态不允许取消');

    const items = await this.itemRepo.find({ where: { orderId: id } });

    await this.dataSource.transaction(async (manager) => {
      // 回滚库存和销量（原子操作）
      for (const item of items) {
        await manager.createQueryBuilder()
          .update(ProductEntity)
          .set({ stock: () => 'stock + :qty', sales: () => 'sales - :qty' })
          .where('id = :id', { id: item.productId, qty: item.qty })
          .execute();
      }

      await manager.update(OrderEntity, id, { status: 'cancelled' });

      // 如果已支付：回滚支付状态、积分、佣金
      if (order.status === 'paid') {
        await manager.update(PaymentEntity, { orderNo: order.orderNo, status: 'success' }, { status: 'refunded' });

        // 回滚已发放的积分
        const pointsLog = await manager.findOne(PointsLogEntity, {
          where: { userId, source: 'order', relatedId: order.id },
        });
        if (pointsLog && pointsLog.changeValue > 0) {
          const user = await manager.findOne(PetUserEntity, { where: { id: userId } });
          if (user) {
            const newPoints = Math.max(0, (user.points || 0) - pointsLog.changeValue);
            await manager.update(PetUserEntity, userId, { points: newPoints });
            await manager.save(PointsLogEntity, {
              userId, type: 'spend', source: 'refund',
              changeValue: -pointsLog.changeValue, balanceAfter: newPoints,
              remark: `订单取消回滚积分(${order.orderNo})`, relatedId: order.id,
            });
          }
        }
      }
    });

    // 事务外回滚佣金（pending 状态的佣金作废）
    if (order.status === 'paid') {
      await this.commissionService.revokeCommission(order.id);
    }

    return ResultData.ok();
  }

  /**
   * 会员自动升级检查（新增）
   * 规则：银牌(>=500) → 金牌(>=1000) → 黑钻(>=3000)，只升不降
   */
  async checkMemberUpgrade(userId: number, totalSpent: number) {
    const levels = await this.memberLevelRepo.find({ order: { sortOrder: 'DESC' } });
    if (!levels.length) return;

    // 按门槛从高到低匹配
    let newLevel: MemberLevelEntity | null = null;
    for (const level of levels) {
      if (totalSpent >= Number(level.threshold)) {
        newLevel = level;
        break;
      }
    }

    if (newLevel) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user && user.memberLevel !== newLevel.levelKey) {
        // 只升不降：比较 sortOrder
        const currentLevel = levels.find(l => l.levelKey === user.memberLevel);
        if (!currentLevel || newLevel.sortOrder > currentLevel.sortOrder) {
          await this.userRepo.update(userId, { memberLevel: newLevel.levelKey });
        }
      }
    }
  }
}
