<script setup lang="ts">
/**
 * 自定义导航栏组件
 * 适配状态栏高度，支持返回、标题、右侧插槽
 * 支持两种模式：gradient（暖色渐变，默认）和 transparent（透明）
 */
const props = withDefaults(
  defineProps<{
    title?: string
    showBack?: boolean
    /** 头部样式：gradient=暖色渐变(默认), transparent=透明, custom=自定义bgColor */
    variant?: 'gradient' | 'transparent' | 'custom'
    bgColor?: string
    textColor?: string
    /** 右侧文字（如"删除"），不含则显示右侧槽 */
    rightText?: string
    rightColor?: string
  }>(),
  {
    title: '',
    showBack: true,
    variant: 'gradient',
    bgColor: '',
    textColor: '#3d2c1e',
    rightText: '',
    rightColor: '',
  }
)

const emit = defineEmits<{
  back: []
  right: []
}>()

function handleBack() {
  emit('back')
  uni.navigateBack({
    fail: () => uni.switchTab({ url: '/pages/home/index' }),
  })
}

function handleRight() {
  emit('right')
}
</script>

<template>
  <view
    class="nav-bar"
    :class="variant"
    :style="variant === 'custom' && bgColor ? { background: bgColor } : {}"
  >
    <view class="nav-bar-inner">
      <!-- 左侧返回 -->
      <view v-if="showBack" class="nav-back" @tap="handleBack">
        <view class="back-arrow" />
        <text class="back-text" :style="{ color: textColor }" v-if="variant === 'gradient'">返回</text>
      </view>
      <view v-else class="nav-spacer" />

      <!-- 标题 -->
      <text class="nav-title" :style="{ color: textColor }">{{ title }}</text>

      <!-- 右侧 -->
      <view class="nav-right">
        <text
          v-if="rightText"
          class="nav-right-text"
          :style="{ color: rightColor || textColor }"
          @tap="handleRight"
        >
          {{ rightText }}
        </text>
        <slot v-else name="right" />
        <view v-if="!rightText && !$slots.right" class="nav-spacer" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding-top: var(--status-bar-height, 44px);

  &.gradient {
    background: $header-gradient;
  }
  &.transparent {
    background: transparent;
  }
}

.nav-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  position: relative;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 8rpx;
  width: 120rpx;

  &:active {
    opacity: 0.7;
  }
}

.back-arrow {
  width: 16rpx;
  height: 16rpx;
  border-top: 4rpx solid $primary;
  border-left: 4rpx solid $primary;
  transform: rotate(-45deg);
}

.back-text {
  font-size: 28rpx;
  color: $primary;
}

.nav-spacer {
  width: 120rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 700;
  color: $text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 120rpx;
}

.nav-right-text {
  font-size: 26rpx;
  font-weight: 600;

  &:active {
    opacity: 0.7;
  }
}
</style>
