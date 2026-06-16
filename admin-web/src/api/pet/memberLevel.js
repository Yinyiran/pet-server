import request from '@/utils/request'

export function listMemberLevel() {
  return request({ url: '/pet/member-level/list', method: 'get' })
}

export function getMemberLevel(levelKey) {
  return request({ url: '/pet/member-level/' + levelKey, method: 'get' })
}

export function addMemberLevel(data) {
  return request({ url: '/pet/member-level', method: 'post', data })
}

export function updateMemberLevel(data) {
  return request({ url: '/pet/member-level', method: 'put', data })
}

export function delMemberLevel(levelKey) {
  return request({ url: '/pet/member-level/' + levelKey, method: 'delete' })
}
