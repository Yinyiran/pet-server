<script setup lang="ts">
/**
 * 空状态组件
 */
withDefaults(
  defineProps<{
    icon?: string
    title?: string
    desc?: string
    showBtn?: boolean
    btnText?: string
  }>(),
  {
    icon: '📭',
    title: '暂无数据',
    desc: '',
    showBtn: false,
    btnText: '去看看',
  }
)

defineEmits<{
  action: []
}>()
</script>

<template>
  <view class="empty-state">
    <text class="empty-icon">{{ icon }}</text>
    <text class="empty-title">{{ title }}</text>
    <text v-if="desc" class="empty-desc">{{ desc }}</text>
    <button v-if="showBtn" class="empty-btn" @tap="$emit('action')">{{ btnText }}</button>
  </view>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;

  .empty-icon {
    font-size: 96rpx;
    margin-bottom: 20rpx;
  }

  .empty-title {
    font-size: 30rpx;
    color: #8c7b6e;
    font-weight: 500;
  }

  .empty-desc {
    font-size: 26rpx;
    color: #b8a898;
    margin-top: 12rpx;
    text-align: center;
  }

  .empty-btn {
    margin-top: 40rpx;
    padding: 18rpx 56rpx;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff;
    border-radius: 44rpx;
    font-size: 28rpx;
    font-weight: 500;
    border: none;
    box-shadow: 0 6rpx 20rpx rgba(249, 115, 22, 0.25);

    &::after {
      border: none;
    }
  }
}
</style>
