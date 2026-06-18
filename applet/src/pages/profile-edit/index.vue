<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const nickName = ref(userStore.profile?.nickName || '')
const phone = ref(userStore.profile?.phone || '')
const saving = ref(false)

async function saveProfile() {
  if (!nickName.value.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  saving.value = true
  try {
    await userStore.updateProfile({ nickName: nickName.value, phone: phone.value })
    uni.showToast({ title: '保存成功', icon: 'success' })
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
      <text class="page-title">编辑个人信息</text>
      <view style="width: 120rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 头像入口 -->
      <view class="avatar-entry" @tap="uni.navigateTo({ url: '/pages/avatar-pick/index' })">
        <view class="avatar-circle">
          <text class="avatar-emoji">{{ userStore.avatar }}</text>
        </view>
        <view class="avatar-arrow">
          <text class="avatar-hint">点击更换头像</text>
          <text class="arrow-right">›</text>
        </view>
      </view>

      <!-- 表单区域 — 扁平字段布局 -->
      <view class="form-section">
        <view class="form-field">
          <text class="form-label">昵称</text>
          <input class="form-input" v-model="nickName" placeholder="请输入昵称" maxlength="15" />
        </view>
        <view class="form-field">
          <text class="form-label">手机号</text>
          <input class="form-input" v-model="phone" type="number" placeholder="请输入手机号" maxlength="11" />
        </view>
      </view>

      <view style="height: 140rpx" />
    </scroll-view>

    <!-- 底部保存 -->
    <view class="bottom-bar safe-bottom">
      <button class="btn-save" :loading="saving" @tap="saveProfile">保存</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

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

/* 头像入口 */
.avatar-entry {
  display: flex; flex-direction: column; align-items: center;
  padding: 48rpx 0 32rpx;
}
.avatar-circle {
  width: 140rpx; height: 140rpx; border-radius: 50%;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8rpx 28rpx rgba(249, 115, 22, 0.15);
  margin-bottom: 16rpx;
}
.avatar-emoji { font-size: 72rpx; }
.avatar-arrow { display: flex; align-items: center; gap: 4rpx; }
.avatar-hint { font-size: 24rpx; color: $text-light; }
.arrow-right { font-size: 32rpx; color: $text-light; }

/* 扁平字段布局 */
.form-section { padding: 8rpx 32rpx; }
.form-field { margin-bottom: 28rpx; }
.form-label {
  display: block; font-size: 24rpx; font-weight: 600; color: $text;
  margin-bottom: 12rpx;
}
.form-input {
  width: 100%; box-sizing: border-box;
  padding: 20rpx 24rpx; font-size: 26rpx; color: $text;
  background: #faf8f5; border: 2rpx solid $border;
  border-radius: $radius-sm; transition: border-color 0.2s;
}

/* 底部栏 */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 16rpx 32rpx; background: $card-bg;
  border-top: 1rpx solid $border;
}
.btn-save {
  width: 100%; height: 88rpx; line-height: 88rpx;
  background: linear-gradient(135deg, $primary, #ea580c);
  color: #fff; font-size: 32rpx; font-weight: 700;
  border-radius: $radius-lg; border: none;
  box-shadow: 0 8rpx 24rpx rgba(249, 115, 22, 0.25);
  &:active { transform: scale(0.98); }
}
.safe-bottom { padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }
</style>
