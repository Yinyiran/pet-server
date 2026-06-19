<script setup lang="ts">
import { orderApi } from '@/api'
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'

const order = ref<any>(null)
const loading = ref(true)
let orderId = 0

const statusMap: Record<string, { label: string; color: string; icon: string; bg: string }> = {
  pending:   { label: '待付款', color: '#f5c842', icon: '💳', bg: '#fef9e7' },
  paid:      { label: '待发货', color: '#f97316', icon: '📦', bg: '#fff3e0' },
  shipped:   { label: '待收货', color: '#2196f3', icon: '🚚', bg: '#e3f2fd' },
  completed: { label: '已完成', color: '#7bc67e', icon: '✅', bg: '#f0f9eb' },
  cancelled: { label: '已取消', color: '#b8a898', icon: '❌', bg: '#f5f2ee' },
  refunded:  { label: '已退款', color: '#e05555', icon: '↩️', bg: '#fef0f0' },
}

onLoad((options: any) => {
  orderId = Number(options?.id) || 0
})

async function loadDetail() {
  if (!orderId) return
  loading.value = true
  try {
    order.value = await orderApi.getDetail(orderId) as any
  } catch (e) { /* */ }
  finally { loading.value = false }
}

function getStatusInfo(status: string) {
  return statusMap[status] || { label: status, color: '#8c7b6e', icon: '📋', bg: '#f5f2ee' }
}

async function confirmReceive() {
  uni.showModal({
    title: '确认收货', content: '确认已收到商品？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderApi.confirmReceive(orderId)
          uni.showToast({ title: '已确认收货', icon: 'success' })
          loadDetail()
        } catch (e) { /* */ }
      }
    },
  })
}

async function cancelOrder() {
  uni.showModal({
    title: '取消订单', content: '确定要取消此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderApi.cancel(orderId)
          uni.showToast({ title: '订单已取消', icon: 'success' })
          loadDetail()
        } catch (e) { /* */ }
      }
    },
  })
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatMoney(num: number) { return (num || 0).toFixed(2) }

onMounted(loadDetail)
</script>

<template>
  <view class="page-container" v-if="order">
    <!-- 导航栏 -->
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">订单详情</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 状态头部 -->
      <view class="status-header" :style="{ background: getStatusInfo(order.status).bg }">
        <view class="status-icon">{{ getStatusInfo(order.status).icon }}</view>
        <view class="status-info">
          <view class="status-label" :style="{ color: getStatusInfo(order.status).color }">{{ getStatusInfo(order.status).label }}</view>
          <view class="status-no">订单号: {{ order.orderNo || order.id }}</view>
        </view>
      </view>

      <!-- 收货地址 -->
      <view class="section-card" v-if="order.address">
        <view class="address-row">
          <view class="address-icon">📍</view>
          <view class="address-info">
            <view class="address-name">{{ order.address.name }} <span>{{ order.address.phone }}</span></view>
            <view class="address-detail">{{ order.address.province }}{{ order.address.city }}{{ order.address.detail }}</view>
          </view>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="section-card">
        <view class="section-label">商品信息</view>
        <view class="order-items">
          <view v-for="(g, i) in (order.items || order.goods || [])" :key="i" class="order-item">
            <view class="order-item-img">
              <image v-if="g.image || g.productImage" :src="g.image || g.productImage" mode="aspectFill" class="img-full" />
              <text v-else>📦</text>
            </view>
            <view class="order-item-info">
              <text class="order-item-name">{{ g.name || g.productName || '商品' }}</text>
              <text class="order-item-price" v-if="g.spec">{{ g.spec }}</text>
              <text class="order-item-price">¥{{ formatMoney(g.price || 0) }} × {{ g.quantity || 1 }}</text>
            </view>
            <text class="order-item-subtotal">¥{{ formatMoney((g.price || 0) * (g.quantity || 1)) }}</text>
          </view>
        </view>
        <view class="detail-divider" />
        <!-- 价格明细 -->
        <view class="detail-row"><text>商品原价</text><text>¥{{ formatMoney(order.totalAmount || order.amount || 0) }}</text></view>
        <view class="detail-row"><text>运费</text><text>{{ order.shippingFee > 0 ? '¥' + formatMoney(order.shippingFee) : '含运费¥10.00' }}</text></view>
        <view class="detail-row discount" v-if="order.discount"><text>优惠减免</text><text>-¥{{ formatMoney(order.discount) }}</text></view>
        <view class="detail-row bold"><text>实付金额</text><text class="detail-price">¥{{ formatMoney(order.payAmount || order.totalAmount || order.amount || 0) }}</text></view>
      </view>

      <!-- 物流信息 -->
      <view class="section-card" v-if="order.status === 'shipped' || order.status === 'completed'">
        <view class="detail-label">📮 物流信息</view>
        <view class="detail-divider" />
        <view class="detail-row"><text>快递公司</text><text>{{ order.logisticsCompany || '顺丰速运' }}</text></view>
        <view class="detail-row"><text>运单号</text><text class="logistics-no">{{ order.logisticsNo || '—' }}</text></view>
      </view>

      <!-- 售后操作 -->
      <view class="section-card" v-if="order.status === 'completed' || order.status === 'shipped'">
        <view class="detail-label">🔄 售后服务</view>
        <view class="detail-divider" />
        <view class="aftersale-actions">
          <view class="aftersale-btn"><text class="aftersale-icon">💰</text>申请退款</view>
          <view class="aftersale-btn"><text class="aftersale-icon">📦</text>申请换货</view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="section-card">
        <view class="detail-label">📋 订单信息</view>
        <view class="detail-divider" />
        <view class="detail-row"><text>订单编号</text><text>{{ order.orderNo || order.id }}</text></view>
        <view class="detail-row"><text>下单时间</text><text>{{ formatDate(order.createTime) }}</text></view>
        <view class="detail-row" v-if="order.payTime"><text>付款时间</text><text>{{ formatDate(order.payTime) }}</text></view>
        <view class="detail-row" v-if="order.shipTime"><text>发货时间</text><text>{{ formatDate(order.shipTime) }}</text></view>
      </view>

      <view style="height: 140rpx" />
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-bottom" v-if="order.status === 'pending' || order.status === 'shipped'">
      <view v-if="order.status === 'pending'" class="btn-outline" @tap="cancelOrder">取消订单</view>
      <view v-if="order.status === 'pending'" class="btn-primary">立即付款 ¥{{ formatMoney(order.payAmount || order.totalAmount || order.amount || 0) }}</view>
      <view v-if="order.status === 'shipped'" class="btn-primary" style="flex:1" @tap="confirmReceive">确认收货</view>
    </view>
  </view>

  <!-- 加载中 -->
  <view v-else class="loading-state">
    <text>加载中...</text>
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
.back-btn { display: flex; align-items: center; gap: 8rpx; font-size: 28rpx; color: $primary; width: 80rpx; }
.arrow-icon { width: 16rpx; height: 16rpx; border-top: 4rpx solid $primary; border-left: 4rpx solid $primary; transform: rotate(-45deg); }
.page-title { font-size: 34rpx; font-weight: 700; color: $text; }
.scroll-content { flex: 1; }

/* 状态头部 */
.status-header {
  margin: 24rpx 24rpx 0; padding: 32rpx; border-radius: $radius-lg;
  display: flex; align-items: center; gap: 20rpx;
}
.status-icon { font-size: 52rpx; }
.status-info { flex: 1; }
.status-label { font-size: 36rpx; font-weight: 800; margin-bottom: 8rpx; }
.status-no { font-size: 24rpx; color: $text-secondary; }

/* 通用区块卡片 */
.section-card {
  background: $card-bg; margin: 16rpx 24rpx; padding: 24rpx 28rpx;
  border-radius: $radius-lg; box-shadow: $shadow-sm;
}

/* 收货地址 */
.address-row { display: flex; align-items: flex-start; gap: 16rpx; }
.address-icon { font-size: 36rpx; flex-shrink: 0; }
.address-info { flex: 1; }
.address-name { font-size: 28rpx; font-weight: 700; color: $text; margin-bottom: 8rpx;
  span { font-weight: 400; color: $text-secondary; margin-left: 12rpx; }
}
.address-detail { font-size: 24rpx; color: $text-secondary; }

/* 商品列表 */
.section-label { font-size: 26rpx; font-weight: 700; color: $text; margin-bottom: 16rpx; }
.order-items { display: flex; flex-direction: column; gap: 20rpx; }
.order-item { display: flex; align-items: center; gap: 20rpx; }
.order-item-img {
  width: 96rpx; height: 96rpx; border-radius: $radius-sm;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  display: flex; align-items: center; justify-content: center; font-size: 48rpx; flex-shrink: 0; overflow: hidden;
}
.img-full { width: 100%; height: 100%; }
.order-item-info { flex: 1; min-width: 0; }
.order-item-name { font-size: 26rpx; font-weight: 600; color: $text; display: block; margin-bottom: 4rpx; }
.order-item-price { font-size: 24rpx; color: $text-secondary; display: block; }
.order-item-subtotal { font-size: 28rpx; font-weight: 700; color: $accent; flex-shrink: 0; }

/* 分隔线 */
.detail-divider { height: 2rpx; background: $border; margin: 24rpx 0; }

/* 价格明细行 */
.detail-row { display: flex; justify-content: space-between; padding: 8rpx 0; font-size: 24rpx; color: $text-secondary; }
.detail-row.bold { font-size: 28rpx; font-weight: 700; color: $text; padding-top: 16rpx; }
.detail-row.discount text:last-child { color: #e53935; font-weight: 600; }
.detail-price { font-size: 32rpx; font-weight: 800; color: $accent; }

/* 物流信息 */
.detail-label { font-size: 26rpx; font-weight: 700; color: $text; margin-bottom: 8rpx; }
.logistics-no { font-weight: 600; color: #1565c0; }

/* 售后操作 */
.aftersale-actions { display: flex; gap: 16rpx; }
.aftersale-btn {
  flex: 1; text-align: center; padding: 20rpx; border: 2rpx solid $border;
  border-radius: $radius-sm; font-size: 24rpx; font-weight: 600; color: $text; background: #faf8f5;
}
.aftersale-icon { font-size: 32rpx; display: block; margin-bottom: 4rpx; }

/* 底部操作栏 */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 16rpx 32rpx; background: $card-bg; border-top: 2rpx solid $border;
  display: flex; gap: 16rpx;
}
.btn-outline {
  flex: 0 0 200rpx; height: 88rpx; line-height: 88rpx; text-align: center;
  background: $card-bg; border: 2rpx solid $border; color: $text-secondary;
  font-size: 28rpx; border-radius: $radius-lg;
}
.btn-primary {
  flex: 1; height: 88rpx; line-height: 88rpx; text-align: center;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff; font-size: 30rpx; font-weight: 700;
  border-radius: $radius-lg;
}
.safe-bottom { padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }

.loading-state { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 28rpx; color: $text-light; }
</style>
