<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { financeApi, productApi } from '@/api'

const totalPoints = ref(0)
const products = ref<any[]>([])
const loading = ref(false)

const demoProducts = [
  { id: 1, name: '猫咪冻干零食', image: '', points: 500, stock: 100 },
  { id: 2, name: '狗狗磨牙棒', image: '', points: 300, stock: 200 },
  { id: 3, name: '宠物湿巾(80抽)', image: '', points: 200, stock: 150 },
  { id: 4, name: '猫薄荷玩具', image: '', points: 800, stock: 50 },
  { id: 5, name: '宠物牵引绳', image: '', points: 1500, stock: 30 },
  { id: 6, name: '宠物营养膏', image: '', points: 2000, stock: 20 },
]

async function loadData() {
  loading.value = true
  try {
    const data = await financeApi.getPoints() as any
    totalPoints.value = data?.total ?? data?.points ?? 0
  } catch (e) { /* */ }
  try {
    const list = await productApi.getList({ pageNum: 1, pageSize: 20 }) as any
    products.value = list?.rows || list || demoProducts
  } catch (e) {
    products.value = demoProducts
  }
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
      <text class="page-title">积分兑换</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 积分余额 -->
      <view class="balance-bar">
        <text class="balance-label">我的积分</text>
        <text class="balance-num">{{ totalPoints }}</text>
      </view>

      <!-- 商品网格 -->
      <view class="product-grid">
        <view v-for="item in products" :key="item.id" class="product-card">
          <view class="product-img">
            <text v-if="!item.image" class="img-placeholder">🎁</text>
            <image v-else :src="item.image" mode="aspectFill" class="img-full" />
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-points">
              <text class="pts-num">{{ item.points }}</text>
              <text class="pts-unit">积分</text>
            </view>
            <button
              class="exchange-btn"
              :disabled="!canExchange(item.points)"
              @tap="exchangeItem(item)"
            >
              {{ canExchange(item.points) ? '兑换' : '积分不足' }}
            </button>
          </view>
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

.balance-bar {
  margin: 24rpx 32rpx; padding: 24rpx 32rpx;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: $radius-lg; display: flex; align-items: center; justify-content: space-between;
}
.balance-label { font-size: 28rpx; color: rgba(255,255,255,0.85); }
.balance-num { font-size: 48rpx; font-weight: 700; color: #fff; }

.product-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx;
  padding: 0 32rpx;
}
.product-card {
  background: $card-bg; border-radius: $radius-lg; overflow: hidden; box-shadow: $shadow-sm;
}
.product-img {
  width: 100%; height: 280rpx; background: $bg;
  display: flex; align-items: center; justify-content: center;
}
.img-placeholder { font-size: 72rpx; }
.img-full { width: 100%; height: 100%; }
.product-info { padding: 16rpx 20rpx 20rpx; }
.product-name {
  font-size: 26rpx; font-weight: 600; color: $text; display: block;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.product-points {
  display: flex; align-items: baseline; gap: 4rpx; margin: 8rpx 0 12rpx;
}
.pts-num { font-size: 36rpx; font-weight: 700; color: $primary; }
.pts-unit { font-size: 22rpx; color: $primary; }
.exchange-btn {
  width: 100%; height: 64rpx; line-height: 64rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff; font-size: 26rpx; font-weight: 600;
  border-radius: $radius; border: none; padding: 0;

  &[disabled] {
    background: $border; color: $text-light;
  }
}
</style>
