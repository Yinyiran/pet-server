<script setup lang="ts">
import { merchantApi } from '@/api'
import { ref } from 'vue'

const typeOptions = [
  { value: 'shop', label: '宠物店（用品/活体）' },
  { value: 'hospital', label: '宠物医院' },
  { value: 'beauty', label: '宠物美容' },
  { value: 'park', label: '宠物乐园' },
  { value: 'party', label: '线下聚会/社群' },
  { value: 'other', label: '其他' },
]
const typeLabels = typeOptions.map(t => t.label)

const coopData = ref({
  type: '',
  name: '',
  contact: '',
  phone: '',
  city: '杭州市',
  address: '',
  desc: '',
  wechat: '',
})
const submitting = ref(false)

function onTypeChange(e: any) {
  const idx = +e.detail.value
  coopData.value.type = typeOptions[idx]?.value || ''
}

async function submitCoop() {
  const d = coopData.value
  if (!d.type || !d.name || !d.contact || !d.phone || !d.city || !d.address) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }
  if (!/^1\d{10}$/.test(d.phone)) {
    uni.showToast({ title: '手机号格式错误', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await merchantApi.apply(d)
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
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">申请合作入驻</text>
      <view style="width: 120rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 顶部说明卡片 -->
      <view class="intro-card">
        <text class="intro-icon">🤝</text>
        <view class="intro-body">
          <text class="intro-title">申请合作入驻</text>
          <text class="intro-desc">填写以下信息，我们将在1-3个工作日内与您联系确认</text>
        </view>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 商户类型 -->
        <view class="form-field">
          <text class="form-label">商户类型<text class="required">*</text></text>
          <picker :range="typeLabels" @change="onTypeChange">
            <view class="form-input" :class="{ placeholder: !coopData.type }">
              {{ typeOptions.find(t => t.value === coopData.type)?.label || '请选择商户类型' }}
            </view>
          </picker>
        </view>

        <!-- 商户名称 -->
        <view class="form-field">
          <text class="form-label">商户名称<text class="required">*</text></text>
          <input class="form-input" v-model="coopData.name" placeholder="请输入商户名称" maxlength="30" />
        </view>

        <!-- 联系人 -->
        <view class="form-field">
          <text class="form-label">联系人<text class="required">*</text></text>
          <input class="form-input" v-model="coopData.contact" placeholder="请输入联系人姓名" maxlength="10" />
        </view>

        <!-- 联系电话 -->
        <view class="form-field">
          <text class="form-label">联系电话<text class="required">*</text></text>
          <input class="form-input" v-model="coopData.phone" type="number" placeholder="请输入手机号码" maxlength="11" />
        </view>

        <!-- 所在城市 -->
        <view class="form-field">
          <text class="form-label">所在城市<text class="required">*</text></text>
          <input class="form-input" v-model="coopData.city" placeholder="请输入所在城市" maxlength="15" />
        </view>

        <!-- 详细地址 -->
        <view class="form-field">
          <text class="form-label">详细地址<text class="required">*</text></text>
          <input class="form-input" v-model="coopData.address" placeholder="请输入详细地址" maxlength="60" />
        </view>

        <!-- 商户简介 -->
        <view class="form-field">
          <text class="form-label">商户简介</text>
          <textarea
            class="form-textarea"
            v-model="coopData.desc"
            placeholder="请简要介绍您的商户，包括主营业务、特色服务等"
            maxlength="200"
          />
        </view>

        <!-- 微信号 -->
        <view class="form-field">
          <text class="form-label">微信号（选填）</text>
          <input class="form-input" v-model="coopData.wechat" placeholder="请输入微信号，方便我们联系您" />
        </view>
      </view>

      <!-- 协议说明 -->
      <view class="agreement-text">
        提交即表示同意《商户合作协议》与《隐私政策》
      </view>

      <view style="height: 140rpx" />
    </scroll-view>

    <!-- 底部提交 -->
    <view class="bottom-bar safe-bottom">
      <button class="btn-submit" :loading="submitting" @tap="submitCoop">提交申请</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

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

/* 顶部说明卡片 — 橙色品牌渐变 */
.intro-card {
  margin: 24rpx 32rpx; padding: 32rpx;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 100%);
  border-radius: $radius-lg;
  border: 2rpx solid rgba(249, 115, 22, 0.12);
  display: flex; align-items: flex-start; gap: 20rpx;
}
.intro-icon { font-size: 48rpx; flex-shrink: 0; line-height: 1.2; }
.intro-body { flex: 1; }
.intro-title { font-size: 32rpx; font-weight: 800; color: #7c2d12; display: block; margin-bottom: 8rpx; }
.intro-desc { font-size: 24rpx; color: #9a3412; line-height: 1.5; }

/* 表单区域 — 扁平字段布局 */
.form-section { padding: 8rpx 32rpx; }
.form-field { margin-bottom: 28rpx; }
.form-label {
  display: block; font-size: 24rpx; font-weight: 600; color: $text;
  margin-bottom: 12rpx;
}
.required { color: $danger; margin-left: 4rpx; }

.form-input {
  width: 100%; box-sizing: border-box;
  padding: 20rpx 24rpx; font-size: 26rpx; color: $text;
  background: #faf8f5; border: 2rpx solid $border;
  border-radius: $radius-sm; transition: border-color 0.2s;
  &.placeholder { color: $text-light; }
}
.form-textarea {
  width: 100%; box-sizing: border-box;
  padding: 20rpx 24rpx; font-size: 26rpx; color: $text;
  background: #faf8f5; border: 2rpx solid $border;
  border-radius: $radius-sm; min-height: 160rpx; line-height: 1.6;
}

/* 协议说明 */
.agreement-text {
  text-align: center; padding: 16rpx 32rpx;
  font-size: 22rpx; color: $text-light;
}

/* 底部栏 */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 16rpx 32rpx; background: $card-bg;
  border-top: 1rpx solid $border;
}
.btn-submit {
  width: 100%; height: 88rpx; line-height: 88rpx;
  background: linear-gradient(135deg, $primary, #ea580c);
  color: #fff; font-size: 32rpx; font-weight: 700;
  border-radius: $radius-lg; border: none;
  box-shadow: 0 8rpx 24rpx rgba(249, 115, 22, 0.25);
  &:active { transform: scale(0.98); }
}
.safe-bottom { padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }
</style>
