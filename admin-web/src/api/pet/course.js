import request from '@/utils/request'

export function listCourse(query) {
  return request({ url: '/pet/course/list', method: 'get', params: query })
}
export function getCourse(id) {
  return request({ url: '/pet/course/' + id, method: 'get' })
}
export function addCourse(data) {
  return request({ url: '/pet/course', method: 'post', data })
}
export function updateCourse(data) {
  return request({ url: '/pet/course', method: 'put', data })
}
export function delCourse(ids) {
  return request({ url: '/pet/course/' + ids, method: 'delete' })
}

// 视频
export function listVideo(courseId) {
  return request({ url: '/pet/course-video/list', method: 'get', params: { courseId } })
}
export function addVideo(data) {
  return request({ url: '/pet/course-video', method: 'post', data })
}
export function updateVideo(data) {
  return request({ url: '/pet/course-video', method: 'put', data })
}
export function delVideo(ids) {
  return request({ url: '/pet/course-video/' + ids, method: 'delete' })
}

// 学员
export function listStudent(query) {
  return request({ url: '/pet/student/list', method: 'get', params: query })
}
