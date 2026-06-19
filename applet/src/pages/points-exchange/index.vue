<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { financeApi } from '@/api'

const totalPoints = ref(0)
const products = ref<any[]>([])
const loading = ref(false)

const demoProducts = [
  { id: 1, name: '猫咪冻干零食', desc: '美味营养，猫咪最爱', icon: '🐟', points: 500, stock: 100 },
  { id: 2, name: '狗狗磨牙棒', desc: '清洁牙齿，强健颚骨', icon: '🦴', points: 300, stock: 200 },
  { id: 3, name: '宠物湿巾(80抽)', desc: '温和无刺激，日常清洁', icon: '🧴', points: 200, stock: 150 },
  { id: 4, name: '猫薄荷玩具', desc: '逗猫神器，快乐无穷', icon: '🐱', points: 800, stock: 50 },
  { id: 5, name: '宠物牵引绳', desc: '耐用防断，遛宠必备', icon: '🔗', points: 1500, stock: 30 },
  { id: 6, name: '宠物营养膏', desc: '补充营养，增强免疫', icon: '💊', points: 2000, stock: 20 },
]

async function loadData() {
  loading.value = true
  try {
    const data = await financeApi.getPoints() as any
    totalPoints.value = data?.total ?? data?.points ?? 0
  } catch (e) { /* */ }
  products.value = demoProducts
  finally { loading.value = false }
}

function canExchange(pts: number) {
  return totalPoints.value >= pts
}

function exchangeItem(item: any) {
  if (!canExchange(item.points)) {
    uni.showToast({ title: '积分不足', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认兑换',
    content: `消耗 ${item.points} 积分兑换「${item.name}」？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          // TODO: call exchange API
          totalPoints.value -= item.points
          uni.showToast({ title: '兑换成功', icon: 'success' })
        } catch (e) { /* */ }
      }
    },
  })
}

onMounted(loadData)
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">🎁 积分兑换</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 当前积分 -->
      <view class="balance-bar">
        <text class="balance-label">当前积分：</text>
        <text class="balance-num">{{ totalPoints }}</text>
      </view>

      <!-- 兑换商品列表 -->
      <view class="exchange-list">
        <view
          v-for="item in products"
          :key="item.id"
          class="exchange-item"
          :class="{ disabled: !canExchange(item.points) }"
          @tap="exchangeItem(item)"
        >
          <view class="item-icon">
            <text>{{ item.icon || '🎁' }}</text>
          </view>
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-desc">{{ item.desc }}</text>
          </view>
          <view class="item-points">
            <text class="pts-num">{{ item.points }}</text>
            <text class="pts-unit">积分</text>
          </view>
        </view>
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

/* 余额栏 */
.balance-bar {
  padding: 24rpx 32rpx; font-size: 26rpx; color: $text-secondary;
  border-bottom: 2rpx solid $border;
}
.balance-num { font-size: 36rpx; font-weight: 700; color: $primary; }

/* 兑换列表 */
.exchange-list {
  padding: 24rpx 32rpx; display: flex; flex-direction: column; gap: 20rpx;
}
.exchange-item {
  display: flex; align-items: center; gap: 24rpx; padding: 24rpx;
  background: #faf8f5; border-radius: $radius-sm;
  border: 3rpx solid $border;
  transition: all 0.2s;
  &:active {
    transform: scale(0.97);
    background: $primary-light;
    border-color: $primary;
  }
  &.disabled { opacity: 0.5; pointer-events: none; }
}
.item-icon {
  width: 96rpx; height: 96rpx; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 48rpx;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  border-radius: $radius-sm;
}
.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 28rpx; font-weight: 700; color: $text; display: block; margin-bottom: 6rpx; }
.item-desc { font-size: 22rpx; color: $text-light; }
.item-points { flex-shrink: 0; white-space: nowrap; }
.pts-num { font-size: 30rpx; font-weight: 800; color: $primary; }
.pts-unit { font-size: 22rpx; color: $primary; margin-left: 4rpx; }
</style>
