import request from '@/utils/request'

export function listLiveRoom(query) {
  return request({ url: '/pet/live-room/list', method: 'get', params: query })
}
export function getLiveRoom(id) {
  return request({ url: '/pet/live-room/' + id, method: 'get' })
}
export function addLiveRoom(data) {
  return request({ url: '/pet/live-room', method: 'post', data })
}
export function updateLiveRoom(data) {
  return request({ url: '/pet/live-room', method: 'put', data })
}
export function delLiveRoom(ids) {
  return request({ url: '/pet/live-room/' + ids, method: 'delete' })
}
export function toggleLiveRoomStatus(id, isActive) {
  return request({ url: '/pet/live-room/' + id + '/status', method: 'put', data: { isActive } })
}
