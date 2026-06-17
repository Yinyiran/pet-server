<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { financeApi } from '@/api'

const rechargeList = ref<any[]>([])
const loading = ref(false)
const activeTab = ref('recharge')

const tabs = [
  { key: 'recharge', label: '充值记录' },
  { key: 'consume', label: '消费记录' },
]

const consumeList = ref<any[]>([])

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

const currentList = computed(() => activeTab.value === 'recharge' ? rechargeList.value : consumeList.value)

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
      <text class="page-title">充值管理</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- tabs -->
      <view class="tab-row">
        <view v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key">
          {{ t.label }}
        </view>
      </view>

      <!-- 记录列表 -->
      <view class="record-list">
        <view v-for="item in currentList" :key="item.id" class="record-item">
          <view class="record-info">
            <text class="record-title">{{ item.title || item.description || (activeTab === 'recharge' ? '充值' : '消费') }}</text>
            <text class="record-time">{{ formatDate(item.createTime) }}</text>
          </view>
          <view class="record-right">
            <text class="record-amount" :class="{ positive: item.amount > 0, negative: item.amount < 0 }">
              {{ item.amount > 0 ? '+' : '' }}¥{{ formatMoney(Math.abs(item.amount)) }}
            </text>
            <text v-if="item.status" class="record-status">{{ item.status }}</text>
          </view>
        </view>
        <view v-if="currentList.length === 0 && !loading" class="empty-state">
          <text>暂无{{ activeTab === 'recharge' ? '充值' : '消费' }}记录</text>
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

.tab-row {
  display: flex; padding: 24rpx 32rpx 16rpx; gap: 0;
  background: $card-bg; border-bottom: 1rpx solid $border;
}
.tab-item {
  flex: 1; text-align: center; padding: 16rpx 0; font-size: 28rpx; color: $text-secondary;
  border-bottom: 4rpx solid transparent;
  &.active { color: $primary; font-weight: 700; border-bottom-color: $primary; }
}

.record-list { margin: 16rpx 32rpx 0; }
.record-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24rpx; background: $card-bg; margin-bottom: 2rpx;
  &:first-child { border-radius: $radius-lg $radius-lg 0 0; }
  &:last-child { border-radius: 0 0 $radius-lg $radius-lg; margin-bottom: 0; }
}
.record-info { flex: 1; }
.record-title { font-size: 28rpx; color: $text; display: block; }
.record-time { font-size: 22rpx; color: $text-light; display: block; margin-top: 4rpx; }
.record-right { text-align: right; }
.record-amount {
  font-size: 32rpx; font-weight: 700; display: block;
  &.positive { color: $success; }
  &.negative { color: $danger; }
}
.record-status { font-size: 22rpx; color: $text-light; }

.empty-state { text-align: center; padding: 80rpx 0; color: $text-light; font-size: 28rpx; }
</style>
