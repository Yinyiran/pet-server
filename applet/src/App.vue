<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
  // 尝试自动恢复登录态
  const userStore = useUserStore()
  userStore.checkLoginStatus()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@use '@/styles/index' as *;
</style>
