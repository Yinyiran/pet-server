<script setup lang="ts">
import { ref } from 'vue'
import { merchantApi } from '@/api'

const typeOptions = ['宠物店','宠物医院','宠物美容','宠物乐园','线下聚会','其他']
const coopData = ref({ type: '', name: '', contact: '', phone: '', city: '杭州市', address: '', desc: '', wechat: '' })
const submitting = ref(false)

async function submitCoop() {
  if (!coopData.value.type || !coopData.value.name || !coopData.value.contact || !coopData.value.phone) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }
  if (!/^1\d{10}$/.test(coopData.value.phone)) {
    uni.showToast({ title: '手机号格式错误', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await merchantApi.apply(coopData.value)
    uni.showToast({ title: '提交成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
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
      <text class="page-title">申请合作入驻</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 顶部说明 -->
      <view class="intro-card">
        <text class="intro-icon">🤝</text>
        <text class="intro-title">商家合作入驻</text>
        <text class="intro-desc">宠物店、医院、美容院等商家免费入驻梵优茗宠平台，共享流量与客源。</text>
      </view>

      <!-- 表单 -->
      <view class="section">
        <text class="section-title">商户信息</text>
        <view class="form-card">
          <view class="form-field">
            <text class="form-label">商户类型 <text class="required">*</text></text>
            <picker :range="typeOptions" @change="(e: any) => coopData.type = typeOptions[+e.detail.value]">
              <view class="form-input" :class="{ placeholder: !coopData.type }">
                {{ coopData.type || '请选择商户类型' }}
              </view>
            </picker>
          </view>
          <view class="form-field">
            <text class="form-label">商户名称 <text class="required">*</text></text>
            <input class="form-input" v-model="coopData.name" placeholder="请输入商户名称" />
          </view>
          <view class="form-field">
            <text class="form-label">联系人 <text class="required">*</text></text>
            <input class="form-input" v-model="coopData.contact" placeholder="请输入您的姓名" />
          </view>
          <view class="form-field">
            <text class="form-label">联系电话 <text class="required">*</text></text>
            <input class="form-input" v-model="coopData.phone" type="number" placeholder="请输入手机号" maxlength="11" />
          </view>
          <view class="form-field">
            <text class="form-label">微信号</text>
            <input class="form-input" v-model="coopData.wechat" placeholder="选填，方便我们联系您" />
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">商户简介</text>
        <view class="form-card">
          <view class="form-field" style="border-bottom: none">
            <textarea
              class="form-textarea"
              v-model="coopData.desc"
              placeholder="简要介绍您的商户（主营项目、地址、特色服务等）"
              maxlength="300"
            />
            <text class="char-count">{{ coopData.desc.length }}/300</text>
          </view>
        </view>
      </view>

      <view style="height: 120rpx" />
    </scroll-view>

    <!-- 底部提交 -->
    <view class="bottom-bar safe-bottom">
      <button class="btn-submit" :loading="submitting" @tap="submitCoop">提交申请</button>
    </view>
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

.scroll-content { flex: 1; }

.intro-card {
  margin: 24rpx 32rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: $radius-lg;
  text-align: center;
}
.intro-icon { font-size: 60rpx; display: block; margin-bottom: 16rpx; }
.intro-title { font-size: 32rpx; font-weight: 700; color: #fff; display: block; margin-bottom: 12rpx; }
.intro-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); line-height: 1.6; }

.section { padding: 24rpx 32rpx; }
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  margin-bottom: 20rpx;
  display: block;
}

.form-card {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 8rpx 24rpx;
  box-shadow: $shadow-sm;
}
.form-field {
  padding: 24rpx 0;
  border-bottom: 1rpx solid $border;

  &:last-child { border-bottom: none; }
}
.form-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-bottom: 12rpx;
  display: block;
}
.required { color: $danger; }
.form-input {
  background: $bg;
  padding: 20rpx 24rpx;
  border-radius: $radius;
  font-size: 28rpx;
  color: $text;
  width: 100%;
  box-sizing: border-box;

  &.placeholder { color: $text-light; }
}
.form-textarea {
  background: $bg;
  padding: 20rpx 24rpx;
  border-radius: $radius;
  font-size: 28rpx;
  width: 100%;
  height: 200rpx;
  box-sizing: border-box;
  line-height: 1.6;
}
.char-count {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: $text-light;
  margin-top: 8rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 32rpx;
  background: $card-bg;
  border-top: 1rpx solid $border;
}
.btn-submit {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  border-radius: $radius-lg;
  border: none;
}

.safe-bottom {
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}
</style>
