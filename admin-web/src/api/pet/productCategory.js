import request from '@/utils/request'

export function getCategoryTree() {
  return request({ url: '/pet/product-category/tree', method: 'get' })
}

export function getCategoryList() {
  return request({ url: '/pet/product-category/list', method: 'get' })
}

export function addCategory(data) {
  return request({ url: '/pet/product-category', method: 'post', data })
}

export function updateCategory(data) {
  return request({ url: '/pet/product-category', method: 'put', data })
}

export function delCategory(ids) {
  return request({ url: '/pet/product-category/' + ids, method: 'delete' })
}
