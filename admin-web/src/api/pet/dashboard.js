import request from '@/utils/request'

export function getOverview() {
  return request({ url: '/pet/dashboard/overview', method: 'get' })
}
export function getTrend(days) {
  return request({ url: '/pet/dashboard/trend', method: 'get', params: { days } })
}
export function getUserTrend(days) {
  return request({ url: '/pet/dashboard/user-trend', method: 'get', params: { days } })
}
export function getTopProducts(limit) {
  return request({ url: '/pet/dashboard/top-products', method: 'get', params: { limit } })
}
