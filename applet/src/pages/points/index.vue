<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { financeApi } from '@/api'

const totalPoints = ref(0)
const todaySigned = ref(false)
const pointLogs = ref<any[]>([])
const loading = ref(false)
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'earn', label: '获得' },
  { key: 'spend', label: '消耗' },
]

const filteredLogs = computed(() => {
  if (activeTab.value === 'all') return pointLogs.value
  if (activeTab.value === 'earn') return pointLogs.value.filter((l: any) => l.amount > 0)
  return pointLogs.value.filter((l: any) => l.amount < 0)
})

async function loadPoints() {
  try {
    const data = await financeApi.getPoints() as any
    if (data) {
      totalPoints.value = data.total ?? data.points ?? 0
      todaySigned.value = data.todaySigned ?? false
    }
  } catch (e) { /* */ }
}

async function loadLogs() {
  loading.value = true
  try {
    const data = await financeApi.getPoints() as any
    pointLogs.value = data?.logs || []
  } catch (e) { /* */ }
  finally { loading.value = false }
}

async function signIn() {
  try {
    await financeApi.signIn()
    uni.showToast({ title: '签到成功 +10积分', icon: 'success' })
    todaySigned.value = true
    totalPoints.value += 10
  } catch (e) { /* */ }
}

function setTab(key: string) { activeTab.value = key }

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(async () => {
  await loadPoints()
  await loadLogs()
})
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" />
        <text>返回</text>
      </view>
      <text class="page-title">我的积分</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 积分卡片 -->
      <view class="points-card">
        <view class="points-balance">
          <text class="points-label">当前积分</text>
          <text class="points-num">{{ totalPoints }}</text>
        </view>
        <button class="sign-btn" :class="{ signed: todaySigned }" :disabled="todaySigned" @tap="signIn">
          {{ todaySigned ? '✅ 今日已签到' : '📅 每日签到' }}
        </button>
      </view>

      <!-- 快捷入口 -->
      <view class="quick-actions">
        <view class="quick-btn" @tap="uni.navigateTo({ url: '/pages/points-exchange/index' })">
          <text class="quick-icon">🎁</text>
          <text class="quick-text">积分兑换</text>
        </view>
        <view class="quick-btn" @tap="uni.navigateTo({ url: '/pages/recharge/index' })">
          <text class="quick-icon">💰</text>
          <text class="quick-text">充值中心</text>
        </view>
      </view>

      <!-- 筛选 tabs -->
      <view class="tab-row">
        <view v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @tap="setTab(t.key)">
          {{ t.label }}
        </view>
      </view>

      <!-- 积分记录 -->
      <view class="log-list">
        <view v-for="log in filteredLogs" :key="log.id" class="log-item">
          <view class="log-info">
            <text class="log-title">{{ log.title || log.description }}</text>
            <text class="log-time">{{ formatDate(log.createTime) }}</text>
          </view>
          <text class="log-amount" :class="{ positive: log.amount > 0 }">
            {{ log.amount > 0 ? '+' : '' }}{{ log.amount }}
          </text>
        </view>
        <view v-if="filteredLogs.length === 0" class="empty-state">
          <text>暂无积分记录</text>
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

.points-card {
  margin: 24rpx 32rpx; padding: 40rpx 32rpx;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: $radius-lg; display: flex; align-items: center; justify-content: space-between;
}
.points-label { font-size: 24rpx; color: rgba(255,255,255,0.8); display: block; margin-bottom: 8rpx; }
.points-num { font-size: 56rpx; font-weight: 700; color: #fff; }
.sign-btn {
  padding: 16rpx 32rpx; background: rgba(255,255,255,0.2); color: #fff;
  font-size: 26rpx; border-radius: 30rpx; border: 2rpx solid rgba(255,255,255,0.4);
  &.signed { opacity: 0.6; }
}

.quick-actions {
  display: flex; gap: 16rpx; padding: 0 32rpx; margin-bottom: 24rpx;
}
.quick-btn {
  flex: 1; display: flex; align-items: center; gap: 12rpx; justify-content: center;
  padding: 24rpx; background: $card-bg; border-radius: $radius-lg; box-shadow: $shadow-sm;
}
.quick-icon { font-size: 36rpx; }
.quick-text { font-size: 28rpx; font-weight: 600; color: $text; }

.tab-row {
  display: flex; padding: 0 32rpx; gap: 16rpx; margin-bottom: 16rpx;
}
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
.log-amount {
  font-size: 32rpx; font-weight: 700; color: $text-secondary;
  &.positive { color: $primary; }
}

.empty-state {
  text-align: center; padding: 80rpx 0; color: $text-light; font-size: 28rpx;
}
</style>
