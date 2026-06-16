import request from '@/utils/request'

// ===== 积分流水 =====
export function listPointsLog(params) {
  return request({ url: '/pet/finance/points', method: 'get', params })
}

// ===== 充值记录 =====
export function listRechargeLog(params) {
  return request({ url: '/pet/finance/recharge', method: 'get', params })
}

// ===== 消费流水 =====
export function listConsumptionLog(params) {
  return request({ url: '/pet/finance/consumption', method: 'get', params })
}
