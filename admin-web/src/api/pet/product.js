import request from '@/utils/request'

export function listProduct(query) {
  return request({ url: '/pet/product/list', method: 'get', params: query })
}
export function getProduct(id) {
  return request({ url: '/pet/product/' + id, method: 'get' })
}
export function addProduct(data) {
  return request({ url: '/pet/product', method: 'post', data })
}
export function updateProduct(data) {
  return request({ url: '/pet/product', method: 'put', data })
}
export function delProduct(ids) {
  return request({ url: '/pet/product/' + ids, method: 'delete' })
}
export function toggleProductStatus(id, isActive) {
  return request({ url: '/pet/product/' + id + '/status', method: 'put', data: { isActive } })
}
export function getProductTags() {
  return request({ url: '/pet/product/tags/all', method: 'get' })
}
