<script setup lang="ts">
/**
 * 加载更多组件
 */
withDefaults(
  defineProps<{
    status?: 'loading' | 'more' | 'noMore'
    text?: string
  }>(),
  {
    status: 'more',
    text: '',
  }
)

defineEmits<{
  loadMore: []
}>()
</script>

<template>
  <view class="load-more" @tap="status === 'more' && $emit('loadMore')">
    <view v-if="status === 'loading'" class="loading-row">
      <view class="mini-spinner" />
      <text class="load-text">加载中...</text>
    </view>
    <text v-else-if="status === 'noMore'" class="load-text no-more">— 没有更多了 —</text>
    <text v-else class="load-text tap-text">{{ text || '点击加载更多' }}</text>
  </view>
</template>

<style lang="scss" scoped>
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0 60rpx;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.mini-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid #f0e6dc;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.load-text {
  font-size: 24rpx;
  color: #b8a898;

  &.no-more {
    color: #c8bdb0;
  }

  &.tap-text {
    color: #f97316;
  }
}
</style>
