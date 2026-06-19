<script setup lang="ts">
import { commissionApi } from '@/api'
import { computed, onMounted, ref } from 'vue'

const availableBalance = ref(0)
const withdrawAmount = ref('')
const withdrawMethod = ref('wechat')
const submitting = ref(false)

const methods = [
  { key: 'wechat', name: '微信零钱', icon: '💚', desc: '实时到账' },
  { key: 'bank', name: '银行卡', icon: '🏦', desc: '1-3个工作日' },
]

const quickAmounts = [50, 100, 200, 500, 1000]

const canSubmit = computed(() => {
  const amount = parseFloat(withdrawAmount.value)
  return amount >= 10 && amount <= availableBalance.value
})

const showWarn = computed(() => {
  const amount = parseFloat(withdrawAmount.value)
  return withdrawAmount.value !== '' && amount < 10
})

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
    uni.showToast({ title: '请输入有效金额(最低10元)', icon: 'none' })
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
      <text class="page-title">💳 申请提现</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 可提现余额 -->
      <view class="balance-card">
        <text class="balance-label">可提现余额</text>
        <text class="balance-num">¥{{ availableBalance.toFixed(2) }}</text>
      </view>

      <!-- 提现表单 -->
      <view class="withdraw-form">
        <!-- 提现金额 -->
        <view class="form-group">
          <text class="form-label">提现金额</text>
          <view class="amount-input-wrap">
            <text class="amount-prefix">¥</text>
            <input
              class="amount-input"
              v-model="withdrawAmount"
              type="digit"
              placeholder="请输入提现金额"
            />
            <text class="amount-all" @tap="setAmount('all')">全部提现</text>
          </view>
          <text class="form-hint" :class="{ warn: showWarn }">
            {{ showWarn ? '最低提现金额 ¥10' : '最低提现金额 ¥10' }}
          </text>
        </view>

        <!-- 快捷金额 -->
        <view class="amount-presets">
          <view
            v-for="a in quickAmounts"
            :key="a"
            class="preset-chip"
            :class="{ selected: withdrawAmount === String(a) }"
            @tap="setAmount(a)"
          >
            ¥{{ a }}
          </view>
        </view>

        <!-- 提现方式 -->
        <view class="form-group">
          <text class="form-label">提现方式</text>
          <view class="method-list">
            <view
              v-for="m in methods"
              :key="m.key"
              class="method-item"
              :class="{ active: withdrawMethod === m.key }"
              @tap="selectMethod(m.key)"
            >
              <text class="method-icon">{{ m.icon }}</text>
              <view class="method-info">
                <text class="method-name">{{ m.name }}</text>
                <text class="method-desc">{{ m.desc }}</text>
              </view>
              <view class="method-radio" :class="{ checked: withdrawMethod === m.key }" />
            </view>
          </view>
        </view>

        <!-- 提交按钮 -->
        <button
          class="submit-btn"
          :disabled="!canSubmit"
          :loading="submitting"
          @tap="submitWithdraw"
        >
          确认提现
        </button>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
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

/* 余额卡片 — 绿色渐变 */
.balance-card {
  margin: 24rpx 32rpx; padding: 32rpx; text-align: center;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: $radius-lg;
}
.balance-label { font-size: 24rpx; color: #065f46; display: block; margin-bottom: 8rpx; }
.balance-num { font-size: 64rpx; font-weight: 800; color: #059669; }

/* 表单 */
.withdraw-form { margin: 0 32rpx; }
.form-group { margin-bottom: 28rpx; }
.form-label {
  font-size: 26rpx; font-weight: 600; color: $text;
  margin-bottom: 12rpx; display: block;
}

/* 金额输入 */
.amount-input-wrap {
  display: flex; align-items: center; gap: 12rpx;
  padding: 24rpx; background: #faf8f5;
  border: 3rpx solid $border; border-radius: $radius-sm;
}
.amount-prefix { font-size: 40rpx; font-weight: 700; color: $text; }
.amount-input { flex: 1; font-size: 36rpx; font-weight: 700; color: $text; }
.amount-all {
  font-size: 24rpx; color: $primary; font-weight: 600;
  padding: 8rpx 20rpx; background: $primary-light; border-radius: 20rpx;
}
.form-hint {
  font-size: 22rpx; color: $text-light; margin-top: 8rpx; display: block;
  &.warn { color: #ef4444; }
}

/* 快捷金额 */
.amount-presets {
  display: flex; gap: 16rpx; margin-bottom: 28rpx; flex-wrap: wrap;
}
.preset-chip {
  padding: 12rpx 28rpx; border-radius: 40rpx;
  font-size: 26rpx; font-weight: 600;
  background: #faf8f5; border: 2rpx solid $border; color: $text;
  &:active, &.selected {
    background: $primary; color: #fff; border-color: $primary;
  }
}

/* 提现方式 */
.method-list {
  background: $card-bg; border-radius: $radius-sm; overflow: hidden;
  box-shadow: $shadow-sm;
}
.method-item {
  display: flex; align-items: center; gap: 16rpx; padding: 24rpx;
  border-bottom: 2rpx solid $border;
  &:last-child { border-bottom: none; }
  &:active { background: #fef3c7; }
}
.method-icon { font-size: 36rpx; }
.method-info { flex: 1; }
.method-name { font-size: 28rpx; font-weight: 600; color: $text; display: block; }
.method-desc { font-size: 22rpx; color: $text-light; }
.method-radio {
  width: 36rpx; height: 36rpx; border: 3rpx solid $border; border-radius: 50%;
  &.checked {
    border-color: $primary; background: $primary;
    box-shadow: inset 0 0 0 6rpx #fff;
  }
}

/* 提交按钮 */
.submit-btn {
  width: 100%; height: 88rpx; line-height: 88rpx; margin-top: 8rpx;
  background: linear-gradient(135deg, $primary, #ea580c);
  color: #fff; font-size: 32rpx; font-weight: 700;
  border-radius: $radius-sm; border: none;
  box-shadow: 0 8rpx 28rpx rgba(249, 115, 22, 0.3);
  &:active { transform: scale(0.98); box-shadow: 0 4rpx 16rpx rgba(249, 115, 22, 0.3); }
  &[disabled] { background: #d4c8b8; box-shadow: none; }
}
</style>
