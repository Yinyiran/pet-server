import request from '@/utils/request'

// ===== 配餐方案 =====
export function listMealPlan(params) {
  return request({ url: '/pet/meal/plan', method: 'get', params })
}
export function getMealPlan(id) {
  return request({ url: `/pet/meal/plan/${id}`, method: 'get' })
}
export function addMealPlan(data) {
  return request({ url: '/pet/meal/plan', method: 'post', data })
}
export function updateMealPlan(data) {
  return request({ url: '/pet/meal/plan', method: 'put', data })
}
export function delMealPlan(ids) {
  return request({ url: `/pet/meal/plan/${ids}`, method: 'delete' })
}
export function getIngredients(planId) {
  return request({ url: `/pet/meal/plan/${planId}/ingredients`, method: 'get' })
}
export function saveIngredients(planId, items) {
  return request({ url: `/pet/meal/plan/${planId}/ingredients`, method: 'post', data: { items } })
}

// ===== 答题记录 =====
export function listQuizRecord(params) {
  return request({ url: '/pet/meal/quiz', method: 'get', params })
}

// ===== 配餐订单 =====
export function listMealOrder(params) {
  return request({ url: '/pet/meal/order', method: 'get', params })
}
export function getMealOrder(id) {
  return request({ url: `/pet/meal/order/${id}`, method: 'get' })
}
