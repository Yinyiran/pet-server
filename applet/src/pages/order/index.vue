<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { orderApi } from '@/api'

const activeTab = ref('all')
const orderList = ref<any[]>([])
const loading = ref(false)

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'paid', label: '待发货' },
  { key: 'shipped', label: '待收货' },
  { key: 'completed', label: '已完成' },
]

const statusMap: Record<string, string> = {
  pending: '待付款', paid: '待发货', shipped: '待收货',
  completed: '已完成', cancelled: '已取消', refunded: '已退款',
}

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orderList.value
  return orderList.value.filter((o: any) => o.status === activeTab.value)
})

async function loadOrders() {
  loading.value = true
  try {
    const data = await orderApi.getList({ status: activeTab.value === 'all' ? undefined : activeTab.value }) as any
    orderList.value = Array.isArray(data) ? data : data?.rows || data?.list || []
  } catch (e) { /* */ }
  finally { loading.value = false }
}

function viewDetail(id: number) {
  uni.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
}

async function confirmReceive(id: number) {
  uni.showModal({
    title: '确认收货', content: '确认已收到商品？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderApi.confirmReceive(id)
          uni.showToast({ title: '已确认收货', icon: 'success' })
          loadOrders()
        } catch (e) { /* */ }
      }
    },
  })
}

async function cancelOrder(id: number) {
  uni.showModal({
    title: '取消订单', content: '确定要取消此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderApi.cancel(id)
          uni.showToast({ title: '订单已取消', icon: 'success' })
          loadOrders()
        } catch (e) { /* */ }
      }
    },
  })
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatMoney(num: number) { return (num || 0).toFixed(2) }

onShow(loadOrders)
onMounted(loadOrders)
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">我的订单</text>
      <view style="width: 80rpx" />
    </view>

    <!-- tabs -->
    <view class="tab-row">
      <view v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key; loadOrders()">
        {{ t.label }}
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <view class="order-list">
        <view v-for="order in filteredOrders" :key="order.id" class="order-card" @tap="viewDetail(order.id)">
          <!-- 订单头部 -->
          <view class="order-top">
            <text class="order-no">订单号: {{ order.orderNo || order.id }}</text>
            <text class="order-status" :class="order.status">{{ statusMap[order.status] || order.status }}</text>
          </view>
          <!-- 商品信息 -->
          <view class="order-goods">
            <view v-for="(g, i) in (order.items || order.goods || [order])" :key="i" class="goods-row">
              <view class="goods-img">
                <text v-if="!g.image && !g.productImage" class="img-placeholder">📦</text>
                <image v-else :src="g.image || g.productImage" mode="aspectFill" class="img-full" />
              </view>
              <view class="goods-info">
                <text class="goods-name">{{ g.name || g.productName || '商品' }}</text>
                <text class="goods-spec" v-if="g.spec">{{ g.spec }}</text>
              </view>
              <view class="goods-right">
                <text class="goods-price">¥{{ formatMoney(g.price || 0) }}</text>
                <text class="goods-qty">x{{ g.quantity || 1 }}</text>
              </view>
            </view>
          </view>
          <!-- 底部操作 -->
          <view class="order-bottom">
            <text class="order-total">合计: <text class="total-num">¥{{ formatMoney(order.totalAmount || order.amount || 0) }}</text></text>
            <view class="order-actions">
              <button v-if="order.status === 'pending'" class="action-btn outline" @tap.stop="cancelOrder(order.id)">取消</button>
              <button v-if="order.status === 'pending'" class="action-btn primary" @tap.stop="">去付款</button>
              <button v-if="order.status === 'shipped'" class="action-btn primary" @tap.stop="confirmReceive(order.id)">确认收货</button>
            </view>
          </view>
        </view>
        <view v-if="filteredOrders.length === 0 && !loading" class="empty-state">
          <text class="empty-icon">📦</text>
          <text>暂无订单</text>
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

.tab-row {
  display: flex; padding: 0; gap: 0;
  background: $card-bg; border-bottom: 1rpx solid $border;
}
.tab-item {
  flex: 1; text-align: center; padding: 20rpx 0; font-size: 26rpx; color: $text-secondary;
  border-bottom: 4rpx solid transparent;
  &.active { color: $primary; font-weight: 700; border-bottom-color: $primary; }
}

.scroll-content { flex: 1; }

.order-list { padding: 16rpx 32rpx 0; }
.order-card {
  background: $card-bg; border-radius: $radius-lg; margin-bottom: 16rpx;
  overflow: hidden; box-shadow: $shadow-sm;
}
.order-top {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20rpx 24rpx; border-bottom: 1rpx solid $border;
}
.order-no { font-size: 24rpx; color: $text-light; }
.order-status {
  font-size: 24rpx; font-weight: 600;
  &.pending { color: $warning; }
  &.paid { color: $primary; }
  &.shipped { color: #2196f3; }
  &.completed { color: $success; }
  &.cancelled { color: $text-light; }
}

.order-goods { padding: 16rpx 24rpx; }
.goods-row {
  display: flex; align-items: center; gap: 16rpx; padding: 8rpx 0;
}
.goods-img {
  width: 100rpx; height: 100rpx; border-radius: $radius; background: $bg;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
}
.img-placeholder { font-size: 40rpx; }
.img-full { width: 100%; height: 100%; }
.goods-info { flex: 1; }
.goods-name { font-size: 26rpx; font-weight: 600; color: $text; display: block; }
.goods-spec { font-size: 22rpx; color: $text-light; }
.goods-right { text-align: right; flex-shrink: 0; }
.goods-price { font-size: 26rpx; font-weight: 600; color: $text; display: block; }
.goods-qty { font-size: 22rpx; color: $text-light; }

.order-bottom {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16rpx 24rpx; border-top: 1rpx solid $border;
}
.order-total { font-size: 26rpx; color: $text-secondary; }
.total-num { font-size: 30rpx; font-weight: 700; color: $primary; }
.order-actions { display: flex; gap: 12rpx; }
.action-btn {
  padding: 10rpx 28rpx; border-radius: 30rpx; font-size: 24rpx; font-weight: 600; border: none;
  line-height: 1.5;
  &.outline { background: $card-bg; border: 2rpx solid $border; color: $text-secondary; }
  &.primary { background: linear-gradient(135deg, $primary, $primary-dark); color: #fff; }
}

.empty-state { text-align: center; padding: 80rpx 0; color: $text-light; font-size: 28rpx; }
.empty-icon { font-size: 60rpx; display: block; margin-bottom: 16rpx; }
</style>
