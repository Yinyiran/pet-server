<script setup lang="ts">
/**
 * 加载状态组件
 */
withDefaults(
  defineProps<{
    text?: string
    fullscreen?: boolean
  }>(),
  {
    text: '加载中...',
    fullscreen: false,
  }
)
</script>

<template>
  <view class="loading-state" :class="{ fullscreen }">
    <view class="loading-spinner" />
    <text class="loading-text">{{ text }}</text>
  </view>
</template>

<style lang="scss" scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;

  &.fullscreen {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.85);
    z-index: 999;
  }
}

.loading-spinner {
  width: 56rpx;
  height: 56rpx;
  border: 4rpx solid #f0e6dc;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 26rpx;
  color: #8c7b6e;
  margin-top: 16rpx;
}
</style>
