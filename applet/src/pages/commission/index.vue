<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { commissionApi } from '@/api'

const account = ref({ totalEarning: 0, availableBalance: 0, withdrawn: 0, pendingBalance: 0 })
const logs = ref<any[]>([])
const loading = ref(false)

// 等级信息（模拟数据，后续对接用户等级接口）
const tierInfo = ref({
  name: '梵优合伙人',
  subtitle: '享受三级分佣权益',
  icon: '🌟',
  totalRate: '9%',
  tier: 'default', // default | gold | diamond
})

const filteredLogs = computed(() => logs.value.slice(0, 10))

async function loadAccount() {
  try {
    const data = await commissionApi.getAccount() as any
    if (data) account.value = { ...account.value, ...data }
    // 根据可用余额判断等级
    if (data?.availableBalance > 10000) {
      tierInfo.value = { name: '梵优主理人', subtitle: '享受高级分佣权益', icon: '👑', totalRate: '15%', tier: 'gold' }
    }
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

function getLogIcon(log: any) {
  const title = log.title || log.description || ''
  if (title.includes('订单') || title.includes('商品')) return '🛒'
  if (title.includes('提现')) return '💳'
  if (title.includes('奖励') || title.includes('佣金')) return '💰'
  return '📊'
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
      <text class="page-title">💸 分佣收益</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 等级卡片 -->
      <view class="tier-card" :class="tierInfo.tier">
        <view class="tier-card-glow" v-if="tierInfo.tier === 'gold'" />
        <view class="tier-header">
          <text class="tier-icon">{{ tierInfo.icon }}</text>
          <view class="tier-text">
            <text class="tier-name">{{ tierInfo.name }}</text>
            <text class="tier-subtitle">{{ tierInfo.subtitle }}</text>
          </view>
          <text class="tier-rate">{{ tierInfo.totalRate }}</text>
        </view>
      </view>

      <!-- 收益统计 -->
      <view class="commission-stats">
        <view class="stat-item">
          <text class="stat-num">¥{{ formatMoney(account.totalEarning) }}</text>
          <text class="stat-label">累计收益</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num pending">¥{{ formatMoney(account.pendingBalance) }}</text>
          <text class="stat-label">待结算</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num available">¥{{ formatMoney(account.availableBalance) }}</text>
          <text class="stat-label">可提现</text>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="commission-actions">
        <button class="action-btn primary" @tap="uni.navigateTo({ url: '/pages/withdraw/index' })">
          💳 立即提现
        </button>
        <button class="action-btn secondary" @tap="uni.navigateTo({ url: '/pages/team/index' })">
          👥 我的团队
        </button>
      </view>

      <!-- 最近收益 -->
      <view class="section-title">
        <text>📋 最近收益</text>
      </view>
      <view class="log-list">
        <view v-for="log in filteredLogs" :key="log.id" class="log-item">
          <view class="log-icon">
            <text>{{ getLogIcon(log) }}</text>
          </view>
          <view class="log-info">
            <text class="log-title">{{ log.title || log.description || '分佣收益' }}</text>
            <text class="log-meta">{{ formatDate(log.createTime) }}</text>
          </view>
          <text class="log-amount" :class="{ pending: log.status === 'pending' }">
            +¥{{ formatMoney(log.amount) }}
          </text>
        </view>
        <view v-if="filteredLogs.length === 0" class="log-empty">
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
.back-btn { display: flex; align-items: center; gap: 8rpx; font-size: 28rpx; color: $primary; width: 120rpx; }
.arrow-icon { width: 16rpx; height: 16rpx; border-top: 4rpx solid $primary; border-left: 4rpx solid $primary; transform: rotate(-45deg); }
.page-title { font-size: 34rpx; font-weight: 700; color: $text; }
.scroll-content { flex: 1; }

/* 等级卡片 */
.tier-card {
  margin: 24rpx 32rpx 0; padding: 36rpx 32rpx 28rpx;
  border-radius: $radius-lg; position: relative; overflow: hidden;
  background: linear-gradient(145deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 100%);
  border: 3rpx solid rgba(249, 115, 22, 0.15);
  box-shadow: 0 4rpx 24rpx rgba(249, 115, 22, 0.08);
}
.tier-card.gold {
  background: linear-gradient(150deg, #fefce8 0%, #fffbeb 25%, #fef3c7 50%, #fde68a 85%, #fcd34d 100%);
  border: 3rpx solid rgba(217, 119, 6, 0.25);
  box-shadow: 0 4rpx 32rpx rgba(217, 119, 6, 0.1), inset 0 2rpx 0 rgba(255, 255, 255, 0.6);
}
.tier-card.diamond {
  background: linear-gradient(145deg, #eff6ff 0%, #e0f2fe 40%, #bae6fd 100%);
  border: 3rpx solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4rpx 32rpx rgba(59, 130, 246, 0.1), inset 0 2rpx 0 rgba(255, 255, 255, 0.6);
}
.tier-card-glow {
  position: absolute; top: -60rpx; right: -40rpx;
  width: 240rpx; height: 240rpx;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
}
.tier-header {
  display: flex; align-items: center; gap: 20rpx; position: relative; z-index: 1;
}
.tier-icon { font-size: 64rpx; }
.tier-text { flex: 1; min-width: 0; }
.tier-name {
  display: block; font-size: 34rpx; font-weight: 700; color: #78350f; letter-spacing: 0.6rpx;
}
.tier-card.gold .tier-name { color: #78350f; }
.tier-card.diamond .tier-name { color: #1e3a5f; }
.tier-subtitle {
  display: block; font-size: 26rpx; color: #a16207; margin-top: 8rpx;
}
.tier-card.diamond .tier-subtitle { color: #3b82f6; }
.tier-rate {
  font-size: 60rpx; font-weight: 800; color: #c2410c; line-height: 1; flex-shrink: 0;
}
.tier-card.gold .tier-rate {
  color: #b45309;
  background: linear-gradient(135deg, #b45309, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tier-card.diamond .tier-rate { color: #1d4ed8; }

/* 收益统计 */
.commission-stats {
  display: flex; margin: 24rpx 32rpx 0; padding: 28rpx 24rpx;
  background: $card-bg; border-radius: $radius-lg;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.04);
}
.stat-item { flex: 1; text-align: center; }
.stat-num {
  font-size: 40rpx; font-weight: 800; color: $text; line-height: 1.2; display: block;
  &.pending { color: #f59e0b; }
  &.available { color: #10b981; }
}
.stat-label { font-size: 22rpx; color: $text-light; margin-top: 6rpx; display: block; }
.stat-divider { width: 2rpx; background: #f0ebe4; margin: 0 12rpx; align-self: stretch; }

/* 快捷操作 */
.commission-actions {
  display: flex; gap: 20rpx; margin: 24rpx 32rpx 0;
}
.action-btn {
  flex: 1; height: 80rpx; line-height: 80rpx;
  font-size: 26rpx; font-weight: 700; border-radius: $radius-sm; border: none;
  &.primary {
    background: linear-gradient(135deg, $primary, #ea580c); color: #fff;
    box-shadow: 0 6rpx 20rpx rgba(249, 115, 22, 0.25);
  }
  &.secondary {
    background: $card-bg; color: $primary; border: 3rpx solid $primary;
  }
  &:active { transform: scale(0.97); }
}

/* Section title */
.section-title {
  font-size: 28rpx; font-weight: 700; color: $text;
  padding: 0 32rpx; margin: 28rpx 0 16rpx;
}

/* 收益列表 */
.log-list { margin: 0 32rpx; }
.log-item {
  display: flex; align-items: center; gap: 20rpx; padding: 24rpx;
  background: $card-bg; border-radius: $radius-sm; margin-bottom: 12rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.03);
}
.log-icon {
  width: 72rpx; height: 72rpx; border-radius: 50%;
  background: #fef3c7; display: flex; align-items: center; justify-content: center;
  font-size: 36rpx; flex-shrink: 0;
}
.log-info { flex: 1; min-width: 0; }
.log-title {
  font-size: 26rpx; font-weight: 600; color: $text; display: block;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.log-meta { font-size: 22rpx; color: $text-light; display: block; margin-top: 4rpx; }
.log-amount {
  font-size: 32rpx; font-weight: 800; color: #10b981; flex-shrink: 0;
  &.pending { color: #f59e0b; }
}

.log-empty {
  text-align: center; padding: 64rpx 32rpx; color: $text-light; font-size: 26rpx;
}
</style>
