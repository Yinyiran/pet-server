<script setup lang="ts">
import { useUserStore } from '@/store'
import { ref } from 'vue'

const userStore = useUserStore()
const saving = ref(false)

const avatarOptions = [
  '🐱','🐶','🐰','🐹','🐼','🐨',
  '🦊','🐯','🐮','🐷','🐸','🐙',
  '🦁','🐻','🐵','🐧','🐦','🦄',
  '🐝','🐛','🦋','🐢','🐳','🦜',
]

async function selectAvatar(emoji: string) {
  if (emoji === userStore.avatar) return
  saving.value = true
  try {
    await userStore.updateProfile({ avatar: emoji })
    uni.showToast({ title: '头像已更新', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">选择头像</text>
      <view style="width: 120rpx" />
    </view> 

    <scroll-view scroll-y class="scroll-content">
      <!-- 当前头像 -->
      <view class="current-section">
        <view class="current-avatar" :class="{ saving }">
          <text class="current-emoji">{{ userStore.avatar }}</text>
        </view>
        <text class="current-hint">{{ saving ? '保存中...' : '当前头像' }}</text>
      </view>

      <!-- 选择网格 -->
      <view class="grid-section">
        <text class="grid-title">选择一个你喜欢的头像</text>
        <view class="avatar-grid">
          <view
            v-for="emoji in avatarOptions"
            :key="emoji"
            class="avatar-option"
            :class="{ active: emoji === userStore.avatar }"
            @tap="selectAvatar(emoji)"
          >
            <text class="option-emoji">{{ emoji }}</text>
            <view v-if="emoji === userStore.avatar" class="check-mark">✓</view>
          </view>
        </view>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>

.page-container { min-height: 100vh; background: $bg; display: flex; flex-direction: column; }

.page-header {
  background: $header-gradient; padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  display: flex; align-items: center; justify-content: space-between;
}
.back-btn { display: flex; align-items: center; gap: 8rpx; font-size: 28rpx; color: $primary; width: 120rpx; }
.arrow-icon { width: 16rpx; height: 16rpx; border-top: 4rpx solid $primary; border-left: 4rpx solid $primary; transform: rotate(-45deg); }
.page-title { font-size: 34rpx; font-weight: 700; color: $text; }
.scroll-content { flex: 1; }

/* 当前头像 */
.current-section {
  display: flex; flex-direction: column; align-items: center;
  padding: 48rpx 0 32rpx;
}
.current-avatar {
  width: 160rpx; height: 160rpx; border-radius: 50%;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(249, 115, 22, 0.2);
  margin-bottom: 16rpx; position: relative;
  transition: all 0.3s;
  &.saving { transform: scale(0.92); opacity: 0.7; }
}
.current-emoji { font-size: 80rpx; }
.current-hint { font-size: 24rpx; color: $text-light; }

/* 网格选择 */
.grid-section { padding: 16rpx 32rpx 0; }
.grid-title {
  font-size: 28rpx; font-weight: 600; color: $text-secondary;
  margin-bottom: 28rpx; display: block; text-align: center;
}
.avatar-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 24rpx;
}
.avatar-option {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  background: $card-bg; border-radius: 50%; box-shadow: $shadow-sm;
  border: 3rpx solid transparent; transition: all 0.2s; position: relative;
  &:active { transform: scale(0.92); }
  &.active {
    border-color: $primary; background: $primary-light; transform: scale(1.08);
    box-shadow: 0 4rpx 20rpx rgba(249, 115, 22, 0.25);
  }
}
.option-emoji { font-size: 44rpx; }
.check-mark {
  position: absolute; top: -8rpx; right: -8rpx;
  width: 36rpx; height: 36rpx; border-radius: 50%;
  background: $primary; color: #fff; font-size: 22rpx; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}
</style>
