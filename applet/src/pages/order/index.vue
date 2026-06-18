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
  { key: 'shipped', label: '已发货' },
  { key: 'completed', label: '已完成' },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: '待付款', color: '#f5c842', bg: '#fef9e7' },
  paid:      { label: '待发货', color: '#f97316', bg: '#fff3e0' },
  shipped:   { label: '已发货', color: '#2196f3', bg: '#e3f2fd' },
  completed: { label: '已完成', color: '#7bc67e', bg: '#f0f9eb' },
  cancelled: { label: '已取消', color: '#b8a898', bg: '#f5f2ee' },
  refunded:  { label: '已退款', color: '#e05555', bg: '#fef0f0' },
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

function getStatusInfo(status: string) {
  return statusMap[status] || { label: status, color: '#8c7b6e', bg: '#f5f2ee' }
}

function getItemsPreview(order: any) {
  const items = order.items || order.goods || [order]
  return items.map((g: any) => g.emoji || '📦').join(' ')
}

function getItemsNames(order: any) {
  const items = order.items || order.goods || [order]
  return items.map((g: any) => g.name || g.productName || '商品').join('、')
}

onShow(loadOrders)
onMounted(loadOrders)
</script>

<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">📦 我的订单</text>
      <view style="width: 80rpx" />
    </view>

    <!-- 分段式标签 -->
    <view class="tab-segment">
      <view
        v-for="t in tabs" :key="t.key"
        class="tab-segment-item"
        :class="{ active: activeTab === t.key }"
        @tap="activeTab = t.key; loadOrders()"
      >{{ t.label }}</view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <view class="order-list">
        <view v-for="order in filteredOrders" :key="order.id" class="order-card" @tap="viewDetail(order.id)">
          <!-- 卡片头部 -->
          <view class="order-card-header">
            <text class="order-card-no">订单号: {{ order.orderNo || order.id }}</text>
            <view class="order-card-status" :style="{ color: getStatusInfo(order.status).color, background: getStatusInfo(order.status).bg }">
              {{ getStatusInfo(order.status).label }}
            </view>
          </view>
          <!-- 商品预览 -->
          <view class="order-card-items">
            <text class="items-preview">{{ getItemsPreview(order) }}</text>
            <text class="items-names">{{ getItemsNames(order) }}</text>
          </view>
          <!-- 底部 -->
          <view class="order-card-bottom">
            <text class="order-card-time">{{ formatDate(order.createTime) }}</text>
            <view class="order-card-right">
              <text class="order-card-total">合计 <b>¥{{ formatMoney(order.totalAmount || order.amount || 0) }}</b></text>
              <view class="order-card-actions">
                <view v-if="order.status === 'pending'" class="action-pill outline" @tap.stop="cancelOrder(order.id)">取消</view>
                <view v-if="order.status === 'pending'" class="action-pill primary" @tap.stop="">去付款</view>
                <view v-if="order.status === 'shipped'" class="action-pill primary" @tap.stop="confirmReceive(order.id)">确认收货</view>
                <view class="action-pill outline" @tap.stop="viewDetail(order.id)">详情</view>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="filteredOrders.length === 0 && !loading" class="empty-state">
          <view class="empty-icon">📦</view>
          <view class="empty-text">暂无订单</view>
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
.page-title { font-size: 34rpx; font-weight: 800; color: $text; }

/* 分段式标签 */
.tab-segment {
  display: flex; gap: 0; margin: 16rpx 24rpx 12rpx;
  background: #f5f2ee; border-radius: $radius-sm; padding: 6rpx;
}
.tab-segment-item {
  flex: 1; text-align: center; padding: 14rpx 0; font-size: 22rpx; font-weight: 600;
  color: $text-secondary; border-radius: 12rpx; transition: all 0.25s; white-space: nowrap;
  &.active { background: $card-bg; color: $text; box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.06); }
}

.scroll-content { flex: 1; }
.order-list { padding: 0 24rpx; display: flex; flex-direction: column; gap: 16rpx; }

/* 订单卡片 */
.order-card {
  background: #faf8f5; border-radius: $radius-sm; border: 2rpx solid $border;
  padding: 20rpx 24rpx; transition: box-shadow 0.2s;
  &:active { box-shadow: inset 0 0 0 2rpx $border; }
}
.order-card-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx;
}
.order-card-no { font-size: 22rpx; color: $text-light; }
.order-card-status {
  font-size: 22rpx; font-weight: 700; padding: 2rpx 16rpx; border-radius: 8rpx;
}
.order-card-items {
  display: flex; align-items: center; gap: 12rpx; margin-bottom: 12rpx;
}
.items-preview { font-size: 40rpx; letter-spacing: 4rpx; flex-shrink: 0; }
.items-names { font-size: 24rpx; color: $text; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.order-card-bottom {
  display: flex; align-items: center; justify-content: space-between;
}
.order-card-time { font-size: 20rpx; color: $text-light; }
.order-card-right { display: flex; align-items: center; gap: 16rpx; }
.order-card-total { font-size: 24rpx; color: $text-secondary;
  b { color: $accent; font-size: 28rpx; font-weight: 800; }
}
.order-card-actions { display: flex; gap: 8rpx; }
.action-pill {
  font-size: 22rpx; font-weight: 600; padding: 6rpx 20rpx; border-radius: 20rpx; transition: opacity 0.2s;
  &.primary { background: $primary; color: #fff; }
  &.outline { background: $card-bg; border: 2rpx solid $border; color: $text-secondary; }
  &:active { opacity: 0.8; }
}

/* 空状态 */
.empty-state { text-align: center; padding: 120rpx 0; }
.empty-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.empty-text { font-size: 28rpx; color: $text-light; }
</style>
