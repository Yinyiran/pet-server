/**
 * 通用工具函数
 */

/** 格式化价格 */
export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toFixed(2)
}

/** 手机号脱敏 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

/** 防抖 */
export function debounce(fn: Function, delay = 300) {
  let timer: any = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/** 显示 Toast */
export function showToast(title: string, icon: 'none' | 'success' | 'error' = 'none') {
  uni.showToast({ title, icon, duration: 2000 })
}

/** 显示加载中 */
export function showLoading(title = '加载中...') {
  uni.showLoading({ title, mask: true })
}

/** 隐藏加载 */
export function hideLoading() {
  uni.hideLoading()
}

/** 倒计时格式化 */
export function formatCountdown(seconds: number): { h: string; m: string; s: string } {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return { h, m, s }
}

/** 格式化日期为 M/D HH:MM */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

/** 格式化日期为 YYYY/M/D */
export function formatDateLong(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

/** 格式化金额为两位小数 */
export function formatMoney(num: number): string {
  return (num || 0).toFixed(2)
}

/** 格式化千分位金额 */
export function formatMoneyThousand(num: number): string {
  return (num || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** 手机号验证 */
export function isValidPhone(phone: string): boolean {
  return /^1\d{10}$/.test(phone)
}
