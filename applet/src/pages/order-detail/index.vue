<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { orderApi } from '@/api'

const order = ref<any>(null)
const loading = ref(true)
let orderId = 0

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: '待付款', color: '#f5c842', icon: '💳' },
  paid: { label: '待发货', color: '#f97316', icon: '📦' },
  shipped: { label: '待收货', color: '#2196f3', icon: '🚚' },
  completed: { label: '已完成', color: '#7bc67e', icon: '✅' },
  cancelled: { label: '已取消', color: '#b8a898', icon: '❌' },
  refunded: { label: '已退款', color: '#e05555', icon: '↩️' },
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
  return statusMap[status] || { label: status, color: '#8c7b6e', icon: '📋' }
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
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">订单详情</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 状态栏 -->
      <view class="status-bar" :style="{ background: `linear-gradient(135deg, ${getStatusInfo(order.status).color}, ${getStatusInfo(order.status).color}cc)` }">
        <text class="status-icon">{{ getStatusInfo(order.status).icon }}</text>
        <view class="status-info">
          <text class="status-label">{{ getStatusInfo(order.status).label }}</text>
          <text class="status-hint" v-if="order.status === 'pending'">请尽快完成付款</text>
          <text class="status-hint" v-else-if="order.status === 'shipped'">商品已发出，请耐心等待</text>
          <text class="status-hint" v-else>{{ formatDate(order.createTime) }}</text>
        </view>
      </view>

      <!-- 收货地址 -->
      <view class="section address-section" v-if="order.address">
        <view class="address-row">
          <text class="address-name">{{ order.address.name }} {{ order.address.phone }}</text>
        </view>
        <text class="address-detail">{{ order.address.province }}{{ order.address.city }}{{ order.address.detail }}</text>
      </view>

      <!-- 商品信息 -->
      <view class="section">
        <text class="section-title">商品信息</text>
        <view class="goods-card">
          <view v-for="(g, i) in (order.items || order.goods || [])" :key="i" class="goods-row">
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
      </view>

      <!-- 价格明细 -->
      <view class="section">
        <text class="section-title">价格明细</text>
        <view class="price-card">
          <view class="price-row">
            <text class="price-label">商品金额</text>
            <text class="price-value">¥{{ formatMoney(order.totalAmount || order.amount || 0) }}</text>
          </view>
          <view class="price-row" v-if="order.shippingFee !== undefined">
            <text class="price-label">运费</text>
            <text class="price-value">{{ order.shippingFee > 0 ? '¥' + formatMoney(order.shippingFee) : '免运费' }}</text>
          </view>
          <view class="price-row" v-if="order.discount">
            <text class="price-label">优惠</text>
            <text class="price-value discount">-¥{{ formatMoney(order.discount) }}</text>
          </view>
          <view class="price-divider" />
          <view class="price-row total">
            <text class="price-label">实付金额</text>
            <text class="price-value total-num">¥{{ formatMoney(order.payAmount || order.totalAmount || order.amount || 0) }}</text>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="section">
        <text class="section-title">订单信息</text>
        <view class="info-card">
          <view class="info-row"><text class="info-label">订单编号</text><text class="info-value">{{ order.orderNo || order.id }}</text></view>
          <view class="info-row"><text class="info-label">下单时间</text><text class="info-value">{{ formatDate(order.createTime) }}</text></view>
          <view class="info-row" v-if="order.payTime"><text class="info-label">付款时间</text><text class="info-value">{{ formatDate(order.payTime) }}</text></view>
          <view class="info-row" v-if="order.shipTime"><text class="info-label">发货时间</text><text class="info-value">{{ formatDate(order.shipTime) }}</text></view>
        </view>
      </view>

      <view style="height: 120rpx" />
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-bottom" v-if="order.status === 'pending' || order.status === 'shipped'">
      <button v-if="order.status === 'pending'" class="btn-cancel" @tap="cancelOrder">取消订单</button>
      <button v-if="order.status === 'pending'" class="btn-primary">立即付款 ¥{{ formatMoney(order.payAmount || order.totalAmount || order.amount || 0) }}</button>
      <button v-if="order.status === 'shipped'" class="btn-primary" style="flex:1" @tap="confirmReceive">确认收货</button>
    </view>
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

.status-bar {
  margin: 24rpx 32rpx; padding: 32rpx; border-radius: $radius-lg;
  display: flex; align-items: center; gap: 20rpx;
}
.status-icon { font-size: 52rpx; }
.status-label { font-size: 34rpx; font-weight: 700; color: #fff; display: block; }
.status-hint { font-size: 24rpx; color: rgba(255,255,255,0.8); }

.section { padding: 16rpx 32rpx; }
.section-title { font-size: 28rpx; font-weight: 700; color: $text; margin-bottom: 12rpx; display: block; }

.address-section {
  background: $card-bg; margin: 0 32rpx; padding: 20rpx 24rpx; border-radius: $radius-lg; box-shadow: $shadow-sm;
}
.address-name { font-size: 28rpx; font-weight: 700; color: $text; }
.address-detail { font-size: 24rpx; color: $text-secondary; display: block; margin-top: 8rpx; }

.goods-card { background: $card-bg; border-radius: $radius-lg; padding: 8rpx 24rpx; box-shadow: $shadow-sm; }
.goods-row { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 0; border-bottom: 1rpx solid $border;
  &:last-child { border-bottom: none; }
}
.goods-img {
  width: 120rpx; height: 120rpx; border-radius: $radius; background: $bg;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
}
.img-placeholder { font-size: 48rpx; }
.img-full { width: 100%; height: 100%; }
.goods-info { flex: 1; }
.goods-name { font-size: 28rpx; font-weight: 600; color: $text; display: block; }
.goods-spec { font-size: 22rpx; color: $text-light; }
.goods-right { text-align: right; flex-shrink: 0; }
.goods-price { font-size: 28rpx; font-weight: 600; color: $text; display: block; }
.goods-qty { font-size: 22rpx; color: $text-light; }

.price-card { background: $card-bg; border-radius: $radius-lg; padding: 20rpx 24rpx; box-shadow: $shadow-sm; }
.price-row { display: flex; justify-content: space-between; padding: 12rpx 0; }
.price-label { font-size: 26rpx; color: $text-secondary; }
.price-value { font-size: 26rpx; color: $text; }
.discount { color: $success; }
.price-divider { height: 1rpx; background: $border; margin: 12rpx 0; }
.price-row.total { padding-top: 16rpx; }
.total-num { font-size: 34rpx; font-weight: 700; color: $primary; }

.info-card { background: $card-bg; border-radius: $radius-lg; padding: 16rpx 24rpx; box-shadow: $shadow-sm; }
.info-row { display: flex; justify-content: space-between; padding: 12rpx 0; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 16rpx 32rpx; background: $card-bg; border-top: 1rpx solid $border;
  display: flex; gap: 16rpx;
}
.btn-cancel {
  flex: 0 0 200rpx; height: 88rpx; line-height: 88rpx;
  background: $card-bg; border: 2rpx solid $border; color: $text-secondary;
  font-size: 28rpx; border-radius: $radius-lg;
}
.btn-primary {
  flex: 1; height: 88rpx; line-height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff; font-size: 30rpx; font-weight: 700;
  border-radius: $radius-lg; border: none;
}
.safe-bottom { padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }
</style>
