<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const previewImage = ref('')
const posterTitle = ref('')

onLoad((options: any) => {
  previewImage.value = options?.image ? decodeURIComponent(options.image) : ''
  posterTitle.value = options?.title ? decodeURIComponent(options.title) : 'AI 配餐海报'
})

function savePoster() {
  if (!previewImage.value) {
    uni.showToast({ title: '暂无海报', icon: 'none' })
    return
  }
  uni.saveImageToPhotosAlbum({
    filePath: previewImage.value,
    success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
    fail: (err: any) => {
      if (err.errMsg?.includes('auth deny') || err.errMsg?.includes('authorize')) {
        uni.showModal({
          title: '提示',
          content: '需要相册权限才能保存图片',
          confirmText: '去设置',
          success: (res) => { if (res.confirm) uni.openSetting() },
        })
      } else {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
  })
}

function sharePoster() {
  uni.showToast({ title: '请点击右上角分享', icon: 'none' })
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
      <text class="page-title">海报预览</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <view class="preview-area">
        <view v-if="previewImage" class="poster-wrapper">
          <image class="poster-img" :src="previewImage" mode="widthFix" show-menu-by-longpress />
          <view class="long-press-hint">
            <text>👆 长按图片可直接保存</text>
          </view>
        </view>
        <view v-else class="no-poster">
          <text class="no-icon">🖼️</text>
          <text class="no-text">暂无海报内容</text>
          <text class="no-hint">请先在配餐方案页生成海报</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-bottom" v-if="previewImage">
      <button class="btn-save" @tap="savePoster">
        <text class="btn-icon">💾</text>
        <text>保存到相册</text>
      </button>
      <button class="btn-share" @tap="sharePoster">
        <text class="btn-icon">📤</text>
        <text>分享给好友</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>

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

.preview-area {
  padding: 32rpx;
}

.poster-wrapper {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 16rpx;
  box-shadow: $shadow-md;
}
.poster-img {
  width: 100%;
  border-radius: $radius;
}
.long-press-hint {
  text-align: center;
  padding: 20rpx;
  font-size: 24rpx;
  color: $text-light;
}

.no-poster {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 32rpx;
}
.no-icon { font-size: 80rpx; margin-bottom: 24rpx; }
.no-text { font-size: 32rpx; font-weight: 600; color: $text-secondary; margin-bottom: 12rpx; }
.no-hint { font-size: 24rpx; color: $text-light; }

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 32rpx;
  background: $card-bg;
  border-top: 1rpx solid $border;
  display: flex;
  gap: 16rpx;
}
.btn-save, .btn-share {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: $radius-lg;
  border: none;
}
.btn-save {
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff;
}
.btn-share {
  background: $card-bg;
  border: 2rpx solid $primary;
  color: $primary;
}
.btn-icon {
  font-size: 32rpx;
}

.safe-bottom {
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}
</style>
