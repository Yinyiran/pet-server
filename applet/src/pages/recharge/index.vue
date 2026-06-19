<script setup lang="ts">
import { financeApi } from '@/api'
import { computed, onMounted, ref } from 'vue'

const rechargeList = ref<any[]>([])
const consumeList = ref<any[]>([])
const loading = ref(false)
const activeTab = ref('consume')

const tabs = [
  { key: 'consume', label: '消费记录' },
  { key: 'recharge', label: '充值记录' },
]

// 充值余额（模拟）
const balance = ref(128.50)
const totalRecharge = ref(128.50)

// 充值套餐
const rechargeCards = [
  { amount: 100, gift: '', hot: false },
  { amount: 300, gift: '送15元', hot: false },
  { amount: 500, gift: '送40元', hot: true },
  { amount: 1000, gift: '送100元', hot: false },
]

const currentList = computed(() => activeTab.value === 'recharge' ? rechargeList.value : consumeList.value)

async function loadData() {
  loading.value = true
  try {
    const data = await financeApi.getRecharges() as any
    rechargeList.value = Array.isArray(data) ? data : data?.list || data?.rows || []
  } catch (e) { /* */ }
  try {
    const data = await financeApi.getConsumptions() as any
    consumeList.value = Array.isArray(data) ? data : data?.list || data?.rows || []
  } catch (e) { /* */ }
  finally { loading.value = false }
}

function handleRecharge(amount: number) {
  uni.showModal({
    title: '确认充值',
    content: `充值 ¥${amount} ${rechargeCards.find(c => c.amount === amount)?.gift || ''}`,
    success: async (res) => {
      if (res.confirm) {
        uni.showToast({ title: '充值功能开发中', icon: 'none' })
      }
    },
  })
}

function openCustomRecharge() {
  uni.showToast({ title: '自定义充值开发中', icon: 'none' })
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatMoney(num: number) {
  return (num || 0).toFixed(2)
}

onMounted(loadData)
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">💰 充值管理</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 充值头部 -->
      <view class="recharge-header">
        <text class="recharge-subtitle">多充多送，会员升级更划算</text>
        <view class="balance-pills">
          <text class="balance-pill current">当前余额：¥{{ formatMoney(balance) }}</text>
          <text class="balance-pill total">累计充值：¥{{ formatMoney(totalRecharge) }}</text>
        </view>
      </view>

      <!-- 充值套餐 -->
      <view class="recharge-grid">
        <view
          v-for="card in rechargeCards"
          :key="card.amount"
          class="recharge-card"
          :class="{ hot: card.hot }"
          @tap="handleRecharge(card.amount)"
        >
          <text v-if="card.hot" class="card-tag">🔥 热门</text>
          <text class="card-amount">¥{{ card.amount }}</text>
          <text v-if="card.gift" class="card-gift">{{ card.gift }}</text>
        </view>
      </view>

      <!-- 自定义金额 -->
      <view class="custom-recharge" @tap="openCustomRecharge">
        <text class="custom-icon">＋</text>
        <text class="custom-text">自定义金额</text>
      </view>

      <!-- 消费/充值记录 -->
      <view class="consumption-section">
        <!-- Tab 切换 -->
        <view class="consumption-tabs">
          <view
            v-for="t in tabs"
            :key="t.key"
            class="consumption-tab"
            :class="{ active: activeTab === t.key }"
            @tap="activeTab = t.key"
          >
            {{ t.label }}
          </view>
        </view>

        <!-- 消费记录 -->
        <template v-if="activeTab === 'consume'">
          <view class="record-list">
            <view v-for="item in consumeList" :key="item.id" class="consumption-item">
              <view class="item-header">
                <text class="item-id">{{ item.orderId || item.id || '#' }}</text>
                <text class="item-type" :class="{ refund: item.amount < 0 }">
                  {{ item.amount < 0 ? '退款' : '消费' }}
                </text>
              </view>
              <text class="item-name">{{ item.title || item.description || '商品消费' }}</text>
              <view class="item-bottom">
                <text class="item-total">¥{{ formatMoney(Math.abs(item.amount || 0)) }}</text>
                <text class="item-time">{{ formatDate(item.createTime) }}</text>
              </view>
            </view>
          </view>
          <view v-if="consumeList.length === 0 && !loading" class="empty-state">
            <text class="empty-icon">📭</text>
            <text class="empty-text">暂无消费记录</text>
          </view>
        </template>

        <!-- 充值记录 -->
        <template v-if="activeTab === 'recharge'">
          <view class="record-list">
            <view v-for="item in rechargeList" :key="item.id" class="recharge-log-item">
              <view class="log-icon" :class="item.method || 'wechat'">
                <text>{{ item.method === 'bank' ? '🏦' : '💚' }}</text>
              </view>
              <view class="log-info">
                <text class="log-amount">+¥{{ formatMoney(item.amount) }}</text>
                <text class="log-time">{{ formatDate(item.createTime) }}</text>
              </view>
              <text class="log-status" :class="item.status">{{ item.status || '成功' }}</text>
            </view>
          </view>
          <view v-if="rechargeList.length === 0 && !loading" class="empty-state">
            <text class="empty-icon">📭</text>
            <text class="empty-text">暂无充值记录</text>
          </view>
        </template>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>

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

/* 充值头部 */
.recharge-header {
  padding: 24rpx 32rpx 0; text-align: center;
}
.recharge-subtitle {
  font-size: 24rpx; color: $text-secondary; display: block; margin-bottom: 16rpx;
}
.balance-pills { display: flex; justify-content: center; gap: 16rpx; flex-wrap: wrap; }
.balance-pill {
  display: inline-block; font-size: 24rpx; font-weight: 700;
  padding: 8rpx 24rpx; border-radius: 40rpx;
  &.current { color: $primary; background: $primary-light; }
  &.total { color: #7c2d12; background: linear-gradient(135deg, #fff3e0, #ffe0b2); }
}

/* 充值套餐 */
.recharge-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx;
  padding: 24rpx 32rpx 0;
}
.recharge-card {
  background: #faf8f5; border: 2rpx solid $border; border-radius: $radius-sm;
  padding: 20rpx 12rpx; text-align: center; position: relative; overflow: hidden;
  &:active { transform: scale(0.95); background: #f5f0ea; }
  &.hot {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    border-color: $accent;
  }
}
.card-tag {
  position: absolute; top: 0; right: 0;
  font-size: 16rpx; background: $accent; color: #fff;
  padding: 2rpx 12rpx; border-radius: 0 $radius-sm 0 8rpx; font-weight: 700;
}
.card-amount { font-size: 30rpx; font-weight: 800; color: $text; display: block; }
.card-gift { font-size: 20rpx; color: $accent; font-weight: 600; margin-top: 6rpx; display: block; }

/* 自定义金额 */
.custom-recharge {
  display: flex; align-items: center; justify-content: center; gap: 12rpx;
  margin: 16rpx 32rpx 0; padding: 20rpx;
  border: 2rpx dashed $accent; border-radius: $radius-sm;
  font-size: 26rpx; font-weight: 600; color: $accent;
  &:active { background: #fff8f0; }
}
.custom-icon { font-size: 32rpx; }

/* 消费/充值记录 */
.consumption-section { padding: 0 32rpx; margin-top: 40rpx; }

/* Tab 切换 — 分段控件 */
.consumption-tabs {
  display: flex; gap: 0; margin-bottom: 28rpx;
  background: #f0ece6; border-radius: $radius-sm; padding: 6rpx; overflow: hidden;
}
.consumption-tab {
  flex: 1; text-align: center; padding: 18rpx 0;
  font-size: 26rpx; font-weight: 600; color: $text-secondary;
  border-radius: 12rpx; transition: all 0.25s ease;
  &.active {
    background: #fff; color: $primary;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  }
}

/* 消费记录列表 */
.record-list { display: flex; flex-direction: column; gap: 20rpx; }
.consumption-item {
  background: $bg; border-radius: $radius; padding: 24rpx;
  box-shadow: $shadow-sm; border: 2rpx solid transparent;
}
.item-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12rpx;
}
.item-id { font-size: 24rpx; color: $text-light; }
.item-type {
  font-size: 22rpx; font-weight: 600; padding: 4rpx 16rpx; border-radius: 16rpx;
  background: #fff3e0; color: $primary;
  &.refund { background: #fee2e2; color: #dc2626; }
}
.item-name { font-size: 28rpx; color: $text; display: block; margin-bottom: 8rpx; }
.item-bottom {
  display: flex; align-items: center; justify-content: space-between;
}
.item-total { font-size: 30rpx; font-weight: 700; color: $text; }
.item-time { font-size: 22rpx; color: $text-light; }

/* 充值记录列表 */
.recharge-log-item {
  display: flex; align-items: center; gap: 24rpx;
  background: $bg; border-radius: $radius; padding: 24rpx;
  box-shadow: $shadow-sm;
}
.log-icon {
  width: 80rpx; height: 80rpx; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 40rpx;
  background: #e8f5e9; color: #07c160;
  &.bank { background: #eff6ff; color: #3b82f6; }
}
.log-info { flex: 1; }
.log-amount { font-size: 32rpx; font-weight: 800; color: $text; display: block; }
.log-time { font-size: 22rpx; color: $text-light; display: block; margin-top: 4rpx; }
.log-status {
  font-size: 22rpx; font-weight: 600; padding: 4rpx 16rpx; border-radius: 16rpx;
  background: #dcfce7; color: #16a34a;
  &.pending { background: #fef3c7; color: #b45309; }
  &.failed { background: #fee2e2; color: #dc2626; }
}

/* 空状态 */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 56rpx 0;
}
.empty-icon { font-size: 72rpx; margin-bottom: 16rpx; }
.empty-text { font-size: 26rpx; color: $text-light; font-weight: 500; }
</style>
