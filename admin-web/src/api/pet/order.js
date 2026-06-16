import request from '@/utils/request'

// 订单管理
export function listOrder(query) {
  return request({ url: '/pet/order/list', method: 'get', params: query })
}
export function getOrder(id) {
  return request({ url: '/pet/order/' + id, method: 'get' })
}
export function shipOrder(id, data) {
  return request({ url: '/pet/order/' + id + '/ship', method: 'put', data })
}
export function updateOrderStatus(id, status) {
  return request({ url: '/pet/order/' + id + '/status', method: 'put', data: { status } })
}

// 支付记录
export function listPayment(query) {
  return request({ url: '/pet/payment/list', method: 'get', params: query })
}
