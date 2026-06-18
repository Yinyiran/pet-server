/** 商品基础类型 */
export interface ProductItem {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  sales?: number
  tags?: string[]
}

/** 分页参数 */
export interface PaginationParams {
  pageNum?: number
  pageSize?: number
}

/** 分页响应 */
export interface PageResult<T> {
  rows: T[]
  total: number
  pageNum: number
  pageSize: number
}

/** 宠物信息 */
export interface PetInfo {
  id?: number
  type: 'cat' | 'dog' | 'other'
  name: string
  breed: string
  weight?: string | number
  birthday?: string
}

/** 用户画像 */
export interface UserProfile {
  nickName: string
  phone: string
  avatar: string
  level?: string
}

/** 订单状态 */
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'

/** 佣金账户 */
export interface CommissionAccount {
  totalEarning: number
  availableBalance: number
  withdrawn: number
  pendingBalance: number
}

/** 提现方式 */
export type WithdrawMethod = 'wechat' | 'bank' | 'alipay'

/** 充值记录 */
export interface RechargeRecord {
  id: number
  amount: number
  method: string
  status: string
  createTime: string
}

/** 消费记录 */
export interface ConsumptionRecord {
  id: number
  orderId?: string
  amount: number
  title: string
  description?: string
  createTime: string
}

/** 积分日志 */
export interface PointsLog {
  id: number
  amount: number
  title: string
  description?: string
  createTime: string
}

/** 团队成员 */
export interface TeamMember {
  id: number
  nickName: string
  avatar: string
  level: number | string
  joinTime: string
  createTime?: string
  consumed?: boolean
}

/** 课程信息 */
export interface CourseInfo {
  key: string
  icon: string
  tag: string
  name: string
  features: string[]
  price: number
  desc: string
  videos?: { title: string; duration: string }[]
}
