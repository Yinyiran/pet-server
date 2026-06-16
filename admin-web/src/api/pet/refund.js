import request from '@/utils/request'

export function listRefund(query) {
  return request({ url: '/pet/refund/list', method: 'get', params: query })
}
export function getRefund(id) {
  return request({ url: '/pet/refund/' + id, method: 'get' })
}
export function auditRefund(id, data) {
  return request({ url: '/pet/refund/' + id + '/audit', method: 'put', data })
}
