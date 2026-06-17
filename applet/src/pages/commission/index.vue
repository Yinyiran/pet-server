<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { commissionApi } from '@/api'

const account = ref({ totalEarning: 0, availableBalance: 0, withdrawn: 0, pendingBalance: 0 })
const logs = ref<any[]>([])
const loading = ref(false)
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'earn', label: '收益' },
  { key: 'withdraw', label: '提现' },
]

const filteredLogs = computed(() => {
  if (activeTab.value === 'all') return logs.value
  if (activeTab.value === 'earn') return logs.value.filter((l: any) => l.type === 'earning' || l.amount > 0)
  return logs.value.filter((l: any) => l.type === 'withdraw' || l.amount < 0)
})

async function loadAccount() {
  try {
    const data = await commissionApi.getAccount() as any
    if (data) account.value = { ...account.value, ...data }
  } catch (e) { /* */ }
}

async function loadLogs() {
  loading.value = true
  try {
    const data = await commissionApi.getLogs() as any
    logs.value = Array.isArray(data) ? data : data?.list || data?.rows || []
  } catch (e) { /* */ }
  finally { loading.value = false }
}

function formatMoney(num: number) {
  return (num || 0).toFixed(2)
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(async () => {
  await loadAccount()
  await loadLogs()
})
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">分佣收益</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 收益总览 -->
      <view class="earning-card">
        <view class="earning-total">
          <text class="earning-label">累计收益(元)</text>
          <text class="earning-num">{{ formatMoney(account.totalEarning) }}</text>
        </view>
        <view class="earning-row">
          <view class="earning-item">
            <text class="item-num">{{ formatMoney(account.availableBalance) }}</text>
            <text class="item-label">可提现</text>
          </view>
          <view class="earning-divider" />
          <view class="earning-item">
            <text class="item-num">{{ formatMoney(account.pendingBalance) }}</text>
            <text class="item-label">待结算</text>
          </view>
          <view class="earning-divider" />
          <view class="earning-item">
            <text class="item-num">{{ formatMoney(account.withdrawn) }}</text>
            <text class="item-label">已提现</text>
          </view>
        </view>
        <button class="withdraw-btn" @tap="uni.navigateTo({ url: '/pages/withdraw/index' })">申请提现</button>
      </view>

      <!-- 筛选 tabs -->
      <view class="tab-row">
        <view v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key">
          {{ t.label }}
        </view>
      </view>

      <!-- 收益明细 -->
      <view class="log-list">
        <view v-for="log in filteredLogs" :key="log.id" class="log-item">
          <view class="log-info">
            <text class="log-title">{{ log.title || log.description || '分佣收益' }}</text>
            <text class="log-time">{{ formatDate(log.createTime) }}</text>
          </view>
          <text class="log-amount" :class="{ positive: log.amount > 0 }">
            {{ log.amount > 0 ? '+' : '' }}{{ formatMoney(log.amount) }}
          </text>
        </view>
        <view v-if="filteredLogs.length === 0" class="empty-state">
          <text>暂无收益记录</text>
        </view>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
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

.earning-card {
  margin: 24rpx 32rpx; padding: 36rpx 32rpx;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: $radius-lg; text-align: center;
}
.earning-label { font-size: 24rpx; color: rgba(255,255,255,0.8); display: block; margin-bottom: 8rpx; }
.earning-num { font-size: 60rpx; font-weight: 700; color: #fff; display: block; margin-bottom: 24rpx; }
.earning-row {
  display: flex; align-items: center; margin-bottom: 24rpx;
  background: rgba(255,255,255,0.12); border-radius: $radius; padding: 20rpx 0;
}
.earning-item { flex: 1; text-align: center; }
.item-num { font-size: 32rpx; font-weight: 700; color: #fff; display: block; }
.item-label { font-size: 22rpx; color: rgba(255,255,255,0.7); display: block; margin-top: 4rpx; }
.earning-divider { width: 1rpx; height: 48rpx; background: rgba(255,255,255,0.2); }
.withdraw-btn {
  width: 100%; height: 80rpx; line-height: 80rpx;
  background: #fff; color: $primary;
  font-size: 30rpx; font-weight: 700;
  border-radius: $radius; border: none;
}

.tab-row { display: flex; padding: 0 32rpx; gap: 16rpx; margin-bottom: 16rpx; }
.tab-item {
  padding: 12rpx 28rpx; background: $card-bg; border-radius: 30rpx;
  font-size: 26rpx; color: $text-secondary;
  &.active { background: $primary; color: #fff; }
}

.log-list { margin: 0 32rpx; }
.log-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24rpx; background: $card-bg; margin-bottom: 2rpx;
  &:first-child { border-radius: $radius-lg $radius-lg 0 0; }
  &:last-child { border-radius: 0 0 $radius-lg $radius-lg; margin-bottom: 0; }
}
.log-info { flex: 1; }
.log-title { font-size: 28rpx; color: $text; display: block; }
.log-time { font-size: 22rpx; color: $text-light; display: block; margin-top: 4rpx; }
.log-amount { font-size: 32rpx; font-weight: 700; color: $text-secondary; &.positive { color: $primary; } }

.empty-state { text-align: center; padding: 80rpx 0; color: $text-light; font-size: 28rpx; }
</style>
