import request from '@/utils/request'

// 商家管理
export function listMerchant(query) {
  return request({ url: '/pet/merchant/list', method: 'get', params: query })
}
export function getMerchant(id) {
  return request({ url: '/pet/merchant/' + id, method: 'get' })
}
export function addMerchant(data) {
  return request({ url: '/pet/merchant', method: 'post', data })
}
export function updateMerchant(data) {
  return request({ url: '/pet/merchant', method: 'put', data })
}
export function delMerchant(ids) {
  return request({ url: '/pet/merchant/' + ids, method: 'delete' })
}
export function toggleMerchantStatus(id, status) {
  return request({ url: '/pet/merchant/' + id + '/status', method: 'put', data: { status } })
}

// 入驻申请
export function listApply(query) {
  return request({ url: '/pet/merchant-apply/list', method: 'get', params: query })
}
export function getApply(id) {
  return request({ url: '/pet/merchant-apply/' + id, method: 'get' })
}
export function reviewApply(id, status) {
  return request({ url: '/pet/merchant-apply/' + id + '/review', method: 'put', data: { status } })
}
