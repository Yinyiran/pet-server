<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const saving = ref(false)

const avatarOptions = [
  '🐱','🐶','🐰','🐹','🐼','🐨',
  '🦊','🐯','🐮','🐷','🐸','🐙',
  '🦁','🐻','🐵','🐧','🐦','🦄',
  '🐝','🐛','🦋','🐢','🐳','🦜',
]

async function selectAvatar(emoji: string) {
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
    <!-- 顶部 -->
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" />
        <text>返回</text>
      </view>
      <text class="page-title">选择头像</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 当前头像 -->
      <view class="current-avatar-section">
        <view class="current-avatar">
          <text class="current-emoji">{{ userStore.avatar }}</text>
        </view>
        <text class="current-hint">当前头像</text>
      </view>

      <!-- 选择网格 -->
      <view class="section">
        <text class="section-title">选择一个你喜欢的头像</text>
        <view class="avatar-grid">
          <view
            v-for="emoji in avatarOptions"
            :key="emoji"
            class="avatar-option"
            :class="{ active: emoji === userStore.avatar }"
            @tap="selectAvatar(emoji)"
          >
            <text class="option-emoji">{{ emoji }}</text>
          </view>
        </view>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-container {
  min-height: 100vh;
  background: $bg;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: $header-gradient;
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: $primary;
  width: 80rpx;
}
.arrow-icon {
  width: 16rpx;
  height: 16rpx;
  border-top: 4rpx solid $primary;
  border-left: 4rpx solid $primary;
  transform: rotate(-45deg);
}
.page-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text;
}

.scroll-content {
  flex: 1;
}

.current-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0 24rpx;
}
.current-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: $primary-light;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(249, 115, 22, 0.2);
  margin-bottom: 16rpx;
}
.current-emoji {
  font-size: 80rpx;
}
.current-hint {
  font-size: 24rpx;
  color: $text-light;
}

.section {
  padding: 24rpx 32rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-secondary;
  margin-bottom: 24rpx;
  display: block;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20rpx;
}
.avatar-option {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $card-bg;
  border-radius: 50%;
  box-shadow: $shadow-sm;
  border: 3rpx solid transparent;
  transition: all $transition;

  &.active {
    border-color: $primary;
    background: $primary-light;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}
.option-emoji {
  font-size: 40rpx;
}
</style>
