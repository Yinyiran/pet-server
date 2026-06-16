import request from '@/utils/request'

export function listBanner(query) {
  return request({ url: '/pet/banner/list', method: 'get', params: query })
}

export function getBanner(id) {
  return request({ url: '/pet/banner/' + id, method: 'get' })
}

export function addBanner(data) {
  return request({ url: '/pet/banner', method: 'post', data })
}

export function updateBanner(data) {
  return request({ url: '/pet/banner', method: 'put', data })
}

export function delBanner(ids) {
  return request({ url: '/pet/banner/' + ids, method: 'delete' })
}
