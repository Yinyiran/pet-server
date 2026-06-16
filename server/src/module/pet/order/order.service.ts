import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CartEntity } from './entities/cart.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { PaymentEntity } from './entities/payment.entity';
import { ListOrderDto, ShipOrderDto, AddCartDto, UpdateCartDto, CreateOrderDto, ListPaymentDto } from './dto/index';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(CartEntity) private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(OrderEntity) private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity) private readonly itemRepo: Repository<OrderItemEntity>,
    @InjectRepository(PaymentEntity) private readonly payRepo: Repository<PaymentEntity>,
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
  async createOrder(userId: number, dto: CreateOrderDto) {
    const orderNo = 'FY' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
    const cartIds = dto.cartIds.split(',').map(Number);
    const carts = await this.cartRepo.findBy({ id: In(cartIds), userId });
    if (!carts.length) return ResultData.fail(500, '购物车为空');

    // TODO: 计算金额，关联商品信息（此处简化）
    const totalAmount = carts.reduce((sum, c) => sum + c.qty * 100, 0); // placeholder
    const order = await this.orderRepo.save({
      orderNo, userId, addressId: dto.addressId,
      totalAmount, originalAmount: totalAmount, discountAmount: 0,
      status: 'pending',
    });

    for (const c of carts) {
      await this.itemRepo.save({
        orderId: order.id, productId: c.productId,
        productName: '商品快照', price: 100, qty: c.qty, subtotal: c.qty * 100,
      });
    }
    await this.cartRepo.delete(cartIds.map(id => ({ id, userId })));
    return ResultData.ok({ orderNo });
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

  async confirmReceive(userId: number, id: number) {
    await this.orderRepo.update({ id, userId }, { status: 'received', receivedAt: new Date() });
    return ResultData.ok();
  }

  async cancelOrder(userId: number, id: number) {
    await this.orderRepo.update({ id, userId }, { status: 'cancelled' });
    return ResultData.ok();
  }
}
