import request from '@/utils/request'

// 用户列表
export function listPetUser(query) {
  return request({ url: '/pet/user/list', method: 'get', params: query })
}

// 用户详情
export function getPetUser(id) {
  return request({ url: '/pet/user/' + id, method: 'get' })
}

// 更新用户
export function updatePetUser(data) {
  return request({ url: '/pet/user', method: 'put', data })
}

// 启用/禁用用户
export function togglePetUserStatus(id, isActive) {
  return request({ url: '/pet/user/' + id + '/status', method: 'put', data: { isActive } })
}

// 宠物列表
export function listUserPet(query) {
  return request({ url: '/pet/user/pet/list', method: 'get', params: query })
}

// 用户地址列表
export function listUserAddress(userId) {
  return request({ url: '/pet/user/address/' + userId, method: 'get' })
}
