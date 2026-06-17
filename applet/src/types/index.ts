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
