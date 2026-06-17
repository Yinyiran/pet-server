/**
 * 封装 uni.request — 统一 HTTP 请求
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  loading?: boolean
}

interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

/** 获取本地 token */
function getToken(): string {
  return uni.getStorageSync('token') || ''
}

/** 统一请求函数 */
export function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header = {}, loading = false } = options

  if (loading) {
    uni.showLoading({ title: '加载中...', mask: true })
  }

  const token = getToken()
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: (res: any) => {
        const statusCode = res.statusCode
        const body = res.data as ApiResponse<T>

        if (statusCode === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.showToast({ title: '请先登录', icon: 'none' })
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/index' })
          }, 500)
          reject(new Error('未授权，请登录'))
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          if (body && body.code === 200) {
            resolve(body.data)
          } else if (body && body.code !== undefined) {
            uni.showToast({ title: body.msg || '请求失败', icon: 'none' })
            reject(new Error(body.msg || '请求失败'))
          } else {
            resolve(body as any)
          }
        } else {
          uni.showToast({ title: body?.msg || '网络请求失败', icon: 'none' })
          reject(new Error(body?.msg || `HTTP ${statusCode}`))
        }
      },
      fail: (err: any) => {
        uni.showToast({ title: '网络连接失败', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (loading) {
          uni.hideLoading()
        }
      },
    })
  })
}

/** 快捷方法 */
export const http = {
  get: <T = any>(url: string, data?: any, opts?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'GET', data, ...opts }),

  post: <T = any>(url: string, data?: any, opts?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'POST', data, ...opts }),

  put: <T = any>(url: string, data?: any, opts?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'PUT', data, ...opts }),

  delete: <T = any>(url: string, data?: any, opts?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'DELETE', data, ...opts }),
}

export default http
