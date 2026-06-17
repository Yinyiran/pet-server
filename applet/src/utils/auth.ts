/**
 * 认证相关工具函数
 */

const TOKEN_KEY = 'token'
const USER_KEY = 'userInfo'

export function getToken(): string {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setToken(token: string): void {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function removeToken(): void {
  uni.removeStorageSync(TOKEN_KEY)
}

export function getUserInfo<T = any>(): T | null {
  const raw = uni.getStorageSync(USER_KEY)
  return raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null
}

export function setUserInfo(info: any): void {
  uni.setStorageSync(USER_KEY, info)
}

export function removeUserInfo(): void {
  uni.removeStorageSync(USER_KEY)
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function clearAuth(): void {
  removeToken()
  removeUserInfo()
}

/** 检查登录状态，未登录则跳转 */
export function checkLogin(): boolean {
  if (!isLoggedIn()) {
    uni.navigateTo({ url: '/pages/login/index' })
    return false
  }
  return true
}
