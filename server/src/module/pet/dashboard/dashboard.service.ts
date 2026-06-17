import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getOverview() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayStr = this.formatDate(today);

    // 今日新增用户
    const userResult = await this.dataSource.query(
      `SELECT COUNT(*) as count FROM t_user WHERE created_at >= ?`, [todayStr],
    );

    // 今日订单数
    const orderResult = await this.dataSource.query(
      `SELECT COUNT(*) as count, IFNULL(SUM(total_amount), 0) as gmv FROM t_order WHERE created_at >= ?`, [todayStr],
    );

    // 今日佣金
    const commissionResult = await this.dataSource.query(
      `SELECT IFNULL(SUM(amount), 0) as total FROM t_commission_log WHERE created_at >= ?`, [todayStr],
    );

    // 待审核数
    const pendingMerchant = await this.dataSource.query(`SELECT COUNT(*) as count FROM t_merchant_apply WHERE status = 'pending'`);
    const pendingWithdraw = await this.dataSource.query(`SELECT COUNT(*) as count FROM t_withdraw WHERE status = 'pending'`);
    const pendingRefund = await this.dataSource.query(`SELECT COUNT(*) as count FROM t_refund WHERE status = 'pending'`);

    return ResultData.ok({
      todayNewUsers: +userResult[0]?.count || 0,
      todayOrders: +orderResult[0]?.count || 0,
      todayGmv: +orderResult[0]?.gmv || 0,
      todayCommission: +commissionResult[0]?.total || 0,
      pendingMerchant: +pendingMerchant[0]?.count || 0,
      pendingWithdraw: +pendingWithdraw[0]?.count || 0,
      pendingRefund: +pendingRefund[0]?.count || 0,
    });
  }

  async getTrend(days: number = 7) {
    const result = await this.dataSource.query(`
      SELECT DATE(created_at) as date,
             COUNT(*) as orderCount,
             IFNULL(SUM(total_amount), 0) as gmv
      FROM t_order
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);
    return ResultData.ok(result);
  }

  async getUserTrend(days: number = 7) {
    const result = await this.dataSource.query(`
      SELECT DATE(created_at) as date,
             COUNT(*) as userCount
      FROM t_user
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);
    return ResultData.ok(result);
  }

  async getTopProducts(limit: number = 10) {
    const result = await this.dataSource.query(`
      SELECT p.id, p.name, SUM(oi.qty) as totalSold
      FROM t_order_item oi
      JOIN t_product p ON oi.product_id = p.id
      GROUP BY oi.product_id
      ORDER BY totalSold DESC
      LIMIT ?
    `, [limit]);
    return ResultData.ok(result);
  }

  private formatDate(d: Date) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
}
