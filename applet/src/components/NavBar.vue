<script setup lang="ts">
/**
 * 自定义导航栏组件
 * 适配状态栏高度，支持返回、标题、右侧插槽
 */
const props = withDefaults(
  defineProps<{
    title?: string
    showBack?: boolean
    bgColor?: string
    textColor?: string
  }>(),
  {
    title: '',
    showBack: true,
    bgColor: 'rgba(253, 240, 230, 0.95)',
    textColor: '#3d2c1e',
  }
)

const emit = defineEmits<{
  back: []
}>()

function handleBack() {
  emit('back')
  uni.navigateBack({
    fail: () => uni.switchTab({ url: '/pages/home/index' }),
  })
}
</script>

<template>
  <view class="nav-bar" :style="{ background: bgColor }">
    <view class="nav-bar-inner">
      <view v-if="showBack" class="nav-back" @tap="handleBack">
        <view class="back-arrow" :style="{ borderColor: textColor }" />
      </view>
      <view v-else class="nav-spacer" />

      <text class="nav-title" :style="{ color: textColor }">{{ title }}</text>

      <view class="nav-right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  padding-top: var(--status-bar-height, 44px);
}

.nav-bar-inner {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  position: relative;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;

  &:active {
    background: rgba(0, 0, 0, 0.06);
  }
}

.back-arrow {
  width: 20rpx;
  height: 20rpx;
  border-left: 4rpx solid;
  border-bottom: 4rpx solid;
  transform: rotate(45deg);
  margin-left: 8rpx;
}

.nav-spacer {
  width: 64rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-width: 64rpx;
  justify-content: flex-end;
}
</style>
