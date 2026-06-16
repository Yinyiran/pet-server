import request from '@/utils/request'

// 分佣等级
export function listTier() { return request({ url: '/pet/commission-tier/list', method: 'get' }) }
export function addTier(data) { return request({ url: '/pet/commission-tier', method: 'post', data }) }
export function updateTier(data) { return request({ url: '/pet/commission-tier', method: 'put', data }) }

// 分佣账户
export function listAccount(query) { return request({ url: '/pet/commission-account/list', method: 'get', params: query }) }

// 佣金流水
export function listLog(query) { return request({ url: '/pet/commission-log/list', method: 'get', params: query }) }

// 邀请关系
export function listInvite(query) { return request({ url: '/pet/commission-invite/list', method: 'get', params: query }) }

// 提现审核
export function listWithdraw(query) { return request({ url: '/pet/commission-withdraw/list', method: 'get', params: query }) }
export function auditWithdraw(id, data) { return request({ url: '/pet/commission-withdraw/' + id + '/audit', method: 'put', data }) }
