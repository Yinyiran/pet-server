<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"登录"}}
</route>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { isLoggedIn } from '@/utils/auth'

const userStore = useUserStore()
const agreeing = ref(false)
const loading = ref(false)

// 微信一键登录
async function handleWxLogin() {
  if (!agreeing.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }
  loading.value = true
  try {
    await userStore.wxLogin()
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/home/index' }) })
    }, 1000)
  } catch (e: any) {
    uni.showToast({ title: e?.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 手机号登录
function handlePhoneLogin() {
  if (!agreeing.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }
  // #ifdef MP-WEIXIN
  // 微信环境使用 getPhoneNumber
  uni.showToast({ title: '请使用微信一键登录', icon: 'none' })
  // #endif
}

// 游客模式
function handleGuest() {
  uni.switchTab({ url: '/pages/home/index' })
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/home/index' }) })
}
</script>

<template>
  <view class="login-page">
    <!-- 顶部返回 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
    </view>

    <!-- 品牌区域 -->
    <view class="brand-section">
      <view class="brand-logo">
        <text class="brand-emoji">🐾</text>
      </view>
      <text class="brand-name">梵优茗宠</text>
      <text class="brand-slogan">爱宠专属好物 · 智能营养配餐</text>
    </view>

    <!-- 登录区域 -->
    <view class="login-section">
      <!-- 微信一键登录 -->
      <!-- #ifdef MP-WEIXIN -->
      <button class="login-btn wx-btn" :loading="loading" :disabled="loading" @tap="handleWxLogin">
        <text class="btn-icon">📱</text>
        <text class="btn-text">微信一键登录</text>
      </button>
      <!-- #endif -->

      <!-- #ifndef MP-WEIXIN -->
      <button class="login-btn wx-btn" :loading="loading" :disabled="loading" @tap="handleWxLogin">
        <text class="btn-icon">📱</text>
        <text class="btn-text">立即登录</text>
      </button>
      <!-- #endif -->

      <!-- 游客模式 -->
      <button class="login-btn guest-btn" @tap="handleGuest">
        <text class="btn-text">游客模式浏览</text>
      </button>
    </view>

    <!-- 协议 -->
    <view class="agreement-section">
      <view class="agreement-check" @tap="agreeing = !agreeing">
        <view class="checkbox" :class="{ checked: agreeing }">
          <text v-if="agreeing" class="check-icon">✓</text>
        </view>
        <text class="agreement-text">
          我已阅读并同意
          <text class="link">《用户协议》</text>
          和
          <text class="link">《隐私政策》</text>
        </text>
      </view>
    </view>

    <!-- 底部装饰 -->
    <view class="footer-decor">
      <text class="footer-text">专为爱宠打造的智能养宠平台</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf0e6 0%, #f8f4f0 40%, #fff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--status-bar-height, 44px);
}

.nav-bar {
  width: 100%;
  padding: 20rpx 30rpx;

  .nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }

  .back-icon {
    font-size: 36rpx;
    color: #3d2c1e;
    font-weight: bold;
  }
}

.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;

  .brand-logo {
    width: 160rpx;
    height: 160rpx;
    background: linear-gradient(135deg, #fff7ed, #fed7aa);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 40rpx rgba(249, 115, 22, 0.15);

    .brand-emoji {
      font-size: 72rpx;
    }
  }

  .brand-name {
    font-size: 44rpx;
    font-weight: 700;
    color: #3d2c1e;
    margin-top: 30rpx;
    letter-spacing: 4rpx;
  }

  .brand-slogan {
    font-size: 26rpx;
    color: #8c7b6e;
    margin-top: 12rpx;
  }
}

.login-section {
  width: 100%;
  padding: 0 60rpx;
  margin-top: 100rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.login-btn {
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  border: none;
  font-size: 30rpx;

  &::after {
    border: none;
  }

  .btn-text {
    font-weight: 600;
  }

  .btn-icon {
    font-size: 36rpx;
  }

  &.wx-btn {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff;
    box-shadow: 0 8rpx 30rpx rgba(249, 115, 22, 0.3);

    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }

  &.guest-btn {
    background: transparent;
    color: #8c7b6e;
    border: 2rpx solid #e0d6cc;

    .btn-text {
      font-weight: 500;
    }
  }
}

.agreement-section {
  margin-top: 40rpx;
  padding: 0 60rpx;

  .agreement-check {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
  }

  .checkbox {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid #d4c8bc;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 4rpx;
    transition: all 0.2s;

    &.checked {
      background: #f97316;
      border-color: #f97316;
    }

    .check-icon {
      color: #fff;
      font-size: 22rpx;
      font-weight: bold;
    }
  }

  .agreement-text {
    font-size: 24rpx;
    color: #8c7b6e;
    line-height: 1.6;

    .link {
      color: #f97316;
    }
  }
}

.footer-decor {
  position: fixed;
  bottom: 60rpx;
  left: 0;
  right: 0;
  text-align: center;

  .footer-text {
    font-size: 24rpx;
    color: #c4b5a6;
  }
}
</style>
