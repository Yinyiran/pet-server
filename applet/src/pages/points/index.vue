<script setup lang="ts">
import { financeApi } from '@/api'
import { computed, onMounted, ref } from 'vue'

const totalPoints = ref(0)
const totalEarned = ref(0)
const totalUsed = ref(0)
const todaySigned = ref(false)
const pointLogs = ref<any[]>([])
const loading = ref(false)
const activeTab = ref('all')

// 会员倍率（模拟数据，后续对接接口）
const multiplierInfo = ref({
  level: '银牌会员',
  rate: 1.3,
  calc: '1元 = 1.3积分',
})

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

const logIcon = (log: any) => {
  if (log.amount > 0) {
    if (log.title?.includes('签到')) return '📅'
    if (log.title?.includes('消费')) return '🛒'
    if (log.title?.includes('充值')) return '💰'
    return '🎁'
  }
  return ' exchanged '
}

async function loadPoints() {
  try {
    const data = await financeApi.getPoints() as any
    if (data) {
      totalPoints.value = data.total ?? data.points ?? 0
      todaySigned.value = data.todaySigned ?? false
      totalEarned.value = data.totalEarned ?? 0
      totalUsed.value = data.totalUsed ?? 0
    }
  } catch (e) { /* */ }
}

async function loadLogs() {
  loading.value = true
  try {
    const data = await financeApi.getPoints() as any
    pointLogs.value = data?.logs || []
    // 如果没有 totalEarned/totalUsed，从日志计算
    if (!totalEarned.value) totalEarned.value = pointLogs.value.filter((l: any) => l.amount > 0).reduce((s: number, l: any) => s + l.amount, 0)
    if (!totalUsed.value) totalUsed.value = Math.abs(pointLogs.value.filter((l: any) => l.amount < 0).reduce((s: number, l: any) => s + l.amount, 0))
  } catch (e) { /* */ }
  finally { loading.value = false }
}

async function signIn() {
  try {
    await financeApi.signIn()
    uni.showToast({ title: '签到成功 +10积分', icon: 'success' })
    todaySigned.value = true
    totalPoints.value += 10
    totalEarned.value += 10
  } catch (e) { /* */ }
}

function setTab(key: string) { activeTab.value = key }

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function getIcon(log: any) {
  const title = log.title || log.description || ''
  if (title.includes('签到')) return '📅'
  if (title.includes('消费') || title.includes('购买')) return '🛒'
  if (title.includes('充值')) return '💰'
  if (title.includes('兑换')) return '🎁'
  if (title.includes('邀请') || title.includes('好友')) return '👥'
  return log.amount > 0 ? '✨' : ' exchange '
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
      <text class="page-title">📋 积分明细</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 积分统计 -->
      <view class="points-stats">
        <view class="stat-item">
          <text class="stat-num">{{ totalPoints }}</text>
          <text class="stat-label">当前积分</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num">{{ totalEarned }}</text>
          <text class="stat-label">累计获得</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num">{{ totalUsed }}</text>
          <text class="stat-label">累计使用</text>
        </view>
      </view>

      <!-- 会员积分倍率 -->
      <view class="multiplier-card">
        <view class="multiplier-header">
          <text class="multiplier-label">🏅 会员积分倍率</text>
          <text class="multiplier-badge">{{ multiplierInfo.level }}</text>
        </view>
        <view class="multiplier-body">
          <view class="multiplier-row">
            <text class="multiplier-key">当前倍率</text>
            <text class="multiplier-val">×{{ multiplierInfo.rate }}</text>
          </view>
          <view class="multiplier-row">
            <text class="multiplier-key">消费积分计算</text>
            <text class="multiplier-val">{{ multiplierInfo.calc }}</text>
          </view>
        </view>
        <view class="multiplier-example">
          示例：消费100元 → 100×{{ multiplierInfo.rate }} = <text class="example-strong">{{ Math.round(100 * multiplierInfo.rate) }}积分</text>
        </view>
      </view>

      <!-- 签到 + 兑换按钮 -->
      <view class="action-row">
        <button class="action-btn sign" :class="{ signed: todaySigned }" :disabled="todaySigned" @tap="signIn">
          {{ todaySigned ? '✅ 今日已签到' : '📅 每日签到' }}
        </button>
        <button class="action-btn exchange" @tap="uni.navigateTo({ url: '/pages/points-exchange/index' })">
          🎁 积分兑换
        </button>
      </view>

      <!-- 快捷入口 -->
      <view class="quick-actions">
        <view class="quick-btn" @tap="uni.navigateTo({ url: '/pages/recharge/index' })">
          <text class="quick-icon">💰</text>
          <text class="quick-text">充值中心</text>
        </view>
        <view class="quick-btn" @tap="uni.navigateTo({ url: '/pages/commission/index' })">
          <text class="quick-icon">💸</text>
          <text class="quick-text">分佣收益</text>
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
          <text class="log-icon">{{ getIcon(log) }}</text>
          <view class="log-info">
            <text class="log-title">{{ log.title || log.description }}</text>
            <text class="log-time">{{ formatDate(log.createTime) }}</text>
          </view>
          <text class="log-points" :class="{ positive: log.amount > 0, negative: log.amount < 0 }">
            {{ log.amount > 0 ? '+' : '' }}{{ log.amount }}
          </text>
        </view>
        <view v-if="filteredLogs.length === 0" class="empty-state">
          <text>暂无积分明细</text>
        </view>
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

/* 积分统计 */
.points-stats {
  display: flex; align-items: center;
  margin: 24rpx 32rpx 0; padding: 28rpx 20rpx;
  background: $card-bg; border-radius: $radius-lg; box-shadow: $shadow-sm;
}
.stat-item { flex: 1; text-align: center; }
.stat-num { font-size: 40rpx; font-weight: 800; color: $primary; line-height: 1.2; display: block; }
.stat-label { font-size: 22rpx; color: $text-light; margin-top: 6rpx; display: block; }
.stat-divider { width: 2rpx; height: 70rpx; background: $border; flex-shrink: 0; }

/* 会员倍率卡片 */
.multiplier-card {
  margin: 20rpx 32rpx 0; padding: 28rpx;
  background: linear-gradient(135deg, #fff7ed, #fff3e0);
  border-radius: $radius-lg;
  border: 2rpx solid #ffe0b2;
}
.multiplier-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 20rpx;
}
.multiplier-label { font-size: 26rpx; font-weight: 700; color: $text; }
.multiplier-badge {
  font-size: 22rpx; font-weight: 600; color: #fff;
  background: $primary; padding: 6rpx 20rpx; border-radius: 20rpx;
}
.multiplier-body { display: flex; flex-direction: column; gap: 12rpx; }
.multiplier-row {
  display: flex; align-items: center; justify-content: space-between;
}
.multiplier-key { font-size: 24rpx; color: $text-secondary; }
.multiplier-val { font-size: 28rpx; font-weight: 700; color: $primary; }
.multiplier-example {
  margin-top: 20rpx; padding-top: 20rpx;
  border-top: 2rpx dashed #ffe0b2;
  font-size: 22rpx; color: $text-light; text-align: center;
}
.example-strong { color: $primary; font-size: 26rpx; font-weight: 700; }

/* 操作按钮 */
.action-row {
  display: flex; gap: 16rpx; margin: 20rpx 32rpx 0;
}
.action-btn {
  flex: 1; height: 80rpx; line-height: 80rpx;
  font-size: 26rpx; font-weight: 600; border-radius: $radius-sm; border: none;
  &.sign {
    background: $primary; color: #fff;
    &.signed { background: $border; color: $text-light; }
  }
  &.exchange {
    background: #f5f1ec; color: $text;
  }
}

/* 快捷入口 */
.quick-actions {
  display: flex; gap: 16rpx; padding: 20rpx 32rpx 0;
}
.quick-btn {
  flex: 1; display: flex; align-items: center; gap: 12rpx; justify-content: center;
  padding: 20rpx; background: $card-bg; border-radius: $radius-lg; box-shadow: $shadow-sm;
}
.quick-icon { font-size: 36rpx; }
.quick-text { font-size: 28rpx; font-weight: 600; color: $text; }

/* Tab */
.tab-row {
  display: flex; padding: 24rpx 32rpx 16rpx; gap: 16rpx;
}
.tab-item {
  padding: 12rpx 28rpx; background: $card-bg; border-radius: 30rpx;
  font-size: 26rpx; color: $text-secondary;
  &.active { background: $primary; color: #fff; }
}

/* 明细列表 */
.log-list { margin: 0 32rpx; }
.log-item {
  display: flex; align-items: center; gap: 20rpx;
  padding: 24rpx 0; border-bottom: 2rpx solid #f5f1ec;
  &:last-child { border-bottom: none; }
}
.log-icon { font-size: 44rpx; flex-shrink: 0; width: 64rpx; text-align: center; }
.log-info { flex: 1; min-width: 0; }
.log-title { font-size: 26rpx; font-weight: 600; color: $text; display: block; line-height: 1.3; }
.log-time { font-size: 20rpx; color: $text-light; display: block; margin-top: 4rpx; }
.log-points {
  font-size: 30rpx; font-weight: 700; flex-shrink: 0;
  &.positive { color: $success; }
  &.negative { color: $danger; }
}

.empty-state {
  text-align: center; padding: 80rpx 0; color: $text-light; font-size: 28rpx;
}
</style>
