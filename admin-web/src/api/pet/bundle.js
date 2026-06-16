import request from '@/utils/request'

export function listBundle(query) {
  return request({ url: '/pet/bundle/list', method: 'get', params: query })
}
export function getBundle(id) {
  return request({ url: '/pet/bundle/' + id, method: 'get' })
}
export function addBundle(data) {
  return request({ url: '/pet/bundle', method: 'post', data })
}
export function updateBundle(data) {
  return request({ url: '/pet/bundle', method: 'put', data })
}
export function delBundle(ids) {
  return request({ url: '/pet/bundle/' + ids, method: 'delete' })
}
export function toggleBundleStatus(id, isActive) {
  return request({ url: '/pet/bundle/' + id + '/status', method: 'put', data: { isActive } })
}
