import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, clearAuth } from '@/utils/auth'
import http from '@/utils/request'

export interface UserProfile {
  id: number
  nickName: string
  phone: string
  avatar: string
  level: string
  memberLevel: string
  points: number
  balance: number
  inviteCount: number
}

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const profile = ref<UserProfile | null>(getUserInfo<UserProfile>())

  const isLoggedIn = computed(() => !!token.value)
  const nickName = computed(() => profile.value?.nickName || '未登录')
  const avatar = computed(() => profile.value?.avatar || '🐱')
  const points = computed(() => profile.value?.points || 0)
  const balance = computed(() => profile.value?.balance || 0)

  /** 微信登录 */
  async function wxLogin() {
    return new Promise<void>((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          try {
            const data = await http.post<{ token: string; user: UserProfile }>('/app/user/wxLogin', { code: loginRes.code })
            token.value = data.token
            profile.value = data.user
            setToken(data.token)
            setUserInfo(data.user)
            resolve()
          } catch (e) {
            reject(e)
          }
        },
        fail: reject,
      })
      // #endif
      // #ifndef MP-WEIXIN
      // H5 或其他平台使用模拟登录
      resolve()
      // #endif
    })
  }

  /** 获取/刷新个人信息 */
  async function fetchProfile() {
    try {
      const data = await http.get<UserProfile>('/app/user/profile')
      profile.value = data
      setUserInfo(data)
    } catch (e) {
      console.error('fetchProfile error:', e)
    }
  }

  /** 更新个人资料 */
  async function updateProfile(info: Partial<UserProfile>) {
    await http.put('/app/user/profile', info)
    await fetchProfile()
  }

  /** 检查登录状态（App启动时调用） */
  function checkLoginStatus() {
    const savedToken = getToken()
    if (savedToken) {
      token.value = savedToken
      // 异步刷新个人信息
      fetchProfile()
    }
  }

  /** 退出登录 */
  function logout() {
    token.value = ''
    profile.value = null
    clearAuth()
  }

  return {
    token, profile, isLoggedIn, nickName, avatar, points, balance,
    wxLogin, fetchProfile, updateProfile, logout, checkLoginStatus,
  }
})
