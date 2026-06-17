<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { commissionApi } from '@/api'

const availableBalance = ref(0)
const withdrawAmount = ref('')
const withdrawMethod = ref('wechat')
const submitting = ref(false)

const methods = [
  { key: 'wechat', name: '微信零钱', icon: '💚', desc: '实时到账' },
  { key: 'alipay', name: '支付宝', icon: '💙', desc: '1-3个工作日' },
  { key: 'bank', name: '银行卡', icon: '🏦', desc: '1-5个工作日' },
]

const canSubmit = computed(() => {
  const amount = parseFloat(withdrawAmount.value)
  return amount > 0 && amount <= availableBalance.value && amount >= 1
})

const quickAmounts = [10, 50, 100, 500]

async function loadBalance() {
  try {
    const data = await commissionApi.getAccount() as any
    availableBalance.value = data?.availableBalance ?? 0
  } catch (e) { /* */ }
}

function setAmount(val: number | string) {
  withdrawAmount.value = val === 'all' ? String(availableBalance.value) : String(val)
}

function selectMethod(key: string) {
  withdrawMethod.value = key
}

async function submitWithdraw() {
  if (!canSubmit.value) {
    uni.showToast({ title: '请输入有效金额(最低1元)', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await commissionApi.withdraw({
      amount: parseFloat(withdrawAmount.value),
      method: withdrawMethod.value,
    })
    uni.showToast({ title: '提现申请已提交', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e) { /* */ }
  finally { submitting.value = false }
}

onMounted(loadBalance)
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">申请提现</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 可提现余额 -->
      <view class="balance-card">
        <text class="balance-label">可提现余额(元)</text>
        <text class="balance-num">{{ availableBalance.toFixed(2) }}</text>
      </view>

      <!-- 提现金额 -->
      <view class="section">
        <text class="section-title">提现金额</text>
        <view class="amount-card">
          <text class="amount-unit">¥</text>
          <input class="amount-input" v-model="withdrawAmount" type="digit" placeholder="请输入金额" />
          <text class="amount-all" @tap="setAmount('all')">全部提现</text>
        </view>
        <view class="quick-amounts">
          <view v-for="a in quickAmounts" :key="a" class="quick-btn" @tap="setAmount(a)">¥{{ a }}</view>
        </view>
      </view>

      <!-- 提现方式 -->
      <view class="section">
        <text class="section-title">提现方式</text>
        <view class="method-list">
          <view v-for="m in methods" :key="m.key" class="method-item" :class="{ active: withdrawMethod === m.key }" @tap="selectMethod(m.key)">
            <text class="method-icon">{{ m.icon }}</text>
            <view class="method-info">
              <text class="method-name">{{ m.name }}</text>
              <text class="method-desc">{{ m.desc }}</text>
            </view>
            <view class="method-radio" :class="{ checked: withdrawMethod === m.key }" />
          </view>
        </view>
      </view>

      <view style="height: 120rpx" />
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="bottom-bar safe-bottom">
      <button class="btn-submit" :disabled="!canSubmit" :loading="submitting" @tap="submitWithdraw">
        确认提现
      </button>
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
.back-btn { display: flex; align-items: center; gap: 8rpx; font-size: 28rpx; color: $primary; width: 80rpx; }
.arrow-icon { width: 16rpx; height: 16rpx; border-top: 4rpx solid $primary; border-left: 4rpx solid $primary; transform: rotate(-45deg); }
.page-title { font-size: 34rpx; font-weight: 700; color: $text; }
.scroll-content { flex: 1; }

.balance-card {
  margin: 24rpx 32rpx; padding: 36rpx 32rpx; text-align: center;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: $radius-lg;
}
.balance-label { font-size: 24rpx; color: rgba(255,255,255,0.8); display: block; margin-bottom: 8rpx; }
.balance-num { font-size: 56rpx; font-weight: 700; color: #fff; }

.section { padding: 24rpx 32rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text; margin-bottom: 16rpx; display: block; }

.amount-card {
  display: flex; align-items: center; gap: 12rpx;
  background: $card-bg; padding: 24rpx; border-radius: $radius-lg; box-shadow: $shadow-sm;
}
.amount-unit { font-size: 40rpx; font-weight: 700; color: $primary; }
.amount-input { flex: 1; font-size: 40rpx; font-weight: 700; color: $text; }
.amount-all { font-size: 26rpx; color: $primary; padding: 8rpx 16rpx; background: $primary-light; border-radius: 20rpx; }

.quick-amounts { display: flex; gap: 12rpx; margin-top: 16rpx; }
.quick-btn {
  flex: 1; text-align: center; padding: 16rpx; background: $card-bg;
  border-radius: $radius; font-size: 26rpx; color: $text-secondary;
  border: 2rpx solid $border;
  &:active { border-color: $primary; color: $primary; }
}

.method-list { background: $card-bg; border-radius: $radius-lg; overflow: hidden; box-shadow: $shadow-sm; }
.method-item {
  display: flex; align-items: center; gap: 16rpx; padding: 28rpx 24rpx;
  border-bottom: 1rpx solid $border;
  &:last-child { border-bottom: none; }
}
.method-icon { font-size: 36rpx; }
.method-info { flex: 1; }
.method-name { font-size: 28rpx; font-weight: 600; color: $text; display: block; }
.method-desc { font-size: 22rpx; color: $text-light; }
.method-radio {
  width: 36rpx; height: 36rpx; border: 3rpx solid $border; border-radius: 50%;
  &.checked { border-color: $primary; background: $primary; box-shadow: inset 0 0 0 6rpx #fff; }
}

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 16rpx 32rpx; background: $card-bg; border-top: 1rpx solid $border;
}
.btn-submit {
  width: 100%; height: 88rpx; line-height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff; font-size: 30rpx; font-weight: 700;
  border-radius: $radius-lg; border: none;
  &[disabled] { background: $border; color: $text-light; }
}
.safe-bottom { padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }
</style>
