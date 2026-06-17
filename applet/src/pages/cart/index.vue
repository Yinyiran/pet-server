<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/store'
import { orderApi } from '@/api'
import { checkLogin } from '@/utils/auth'
import { formatPrice } from '@/utils'

const cartStore = useCartStore()

const isEmpty = computed(() => cartStore.items.length === 0)
const totalPrice = computed(() => formatPrice(cartStore.checkedTotal + 10)) // 含运费10

function goToShop() {
  uni.switchTab({ url: '/pages/home/index' })
}

async function loadCart() {
  if (!checkLogin()) return
  await cartStore.fetchCart()
}

function onQuantityChange(item: any, delta: number) {
  const newQty = item.quantity + delta
  if (newQty < 1) return
  cartStore.updateQuantity(item.id, newQty)
}

const showAddressList = ref(false)
const selectedAddress = ref<any>(null)

async function submitOrder() {
  if (!checkLogin()) return
  if (cartStore.checkedCount === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  try {
    const ids = cartStore.items.filter(i => i.checked).map(i => i.id).join(',')
    await orderApi.create({ cartIds: ids, addressId: selectedAddress.value?.id })
    uni.showToast({ title: '下单成功', icon: 'success' })
    await cartStore.fetchCart()
  } catch (e) {
    console.error(e)
  }
}

onMounted(loadCart)
</script>

<template>
  <view class="page-container">
    <view class="header">
      <view class="header-inner">
        <text class="brand-title">🛒 购物车</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="isEmpty" class="empty-cart">
      <text class="empty-icon">🛒</text>
      <text class="empty-title">购物车是空的</text>
      <text class="empty-desc">快去挑选心仪的宠物好物吧</text>
      <button class="btn-primary" @tap="goToShop">去逛逛</button>
    </view>

    <!-- 购物车内容 -->
    <view v-else class="cart-body">
      <!-- 收货地址 -->
      <view class="address-bar" @tap="showAddressList = true">
        <text class="addr-icon">📍</text>
        <view class="addr-info">
          <text v-if="selectedAddress">{{ selectedAddress.name }} {{ selectedAddress.phone }}</text>
          <text v-else class="addr-placeholder">请选择收货地址</text>
        </view>
        <text class="addr-arrow">›</text>
      </view>

      <!-- 商品列表 -->
      <scroll-view scroll-y class="cart-scroll">
        <view class="cart-item" v-for="item in cartStore.items" :key="item.id">
          <view class="item-check" @tap="cartStore.toggleItem(item.id)">
            <view class="check-box" :class="{ checked: item.checked }">✓</view>
          </view>
          <image class="item-img" :src="item.productImage || '/static/logo.png'" mode="aspectFill" />
          <view class="item-info">
            <text class="item-name text-ellipsis-2">{{ item.productName }}</text>
            <view class="item-bottom">
              <text class="item-price"><text class="unit">¥</text>{{ item.price }}</text>
              <view class="quantity-control">
                <view class="qty-btn" @tap="onQuantityChange(item, -1)">-</view>
                <text class="qty-num">{{ item.quantity }}</text>
                <view class="qty-btn" @tap="onQuantityChange(item, 1)">+</view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 底部栏 -->
      <view class="cart-bottom safe-bottom">
        <view class="bottom-check" @tap="cartStore.toggleAll(!cartStore.isAllChecked)">
          <view class="check-box" :class="{ checked: cartStore.isAllChecked }">✓</view>
          <text>全选</text>
        </view>
        <view class="bottom-total">
          <text class="total-label">含运费¥10.00 合计</text>
          <text class="total-price"><text class="unit">¥</text>{{ totalPrice }}</text>
        </view>
        <button class="btn-primary submit-btn" @tap="submitOrder">结算({{ cartStore.checkedCount }})</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.header { background: $header-gradient; padding: 24rpx 32rpx; }
.header-inner { display: flex; align-items: center; justify-content: center; }
.brand-title { font-size: 36rpx; font-weight: 700; color: $text; }

.empty-cart {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16rpx;
  .empty-icon { font-size: 80rpx; }
  .empty-title { font-size: 32rpx; font-weight: 600; }
  .empty-desc { font-size: 26rpx; color: $text-secondary; margin-bottom: 16rpx; }
}

.cart-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.address-bar {
  display: flex; align-items: center; background: $card-bg; margin: 16rpx 24rpx;
  padding: 20rpx 24rpx; border-radius: $radius; gap: 12rpx; box-shadow: $shadow-sm;
}
.addr-icon { font-size: 32rpx; }
.addr-info { flex: 1; font-size: 28rpx; }
.addr-placeholder { color: $text-light; }
.addr-arrow { font-size: 32rpx; color: $text-light; }

.cart-scroll { flex: 1; overflow: hidden; }

.cart-item {
  display: flex; align-items: center; background: $card-bg; margin: 0 24rpx 16rpx;
  padding: 20rpx; border-radius: $radius-lg; gap: 16rpx; box-shadow: $shadow-sm;
}
.check-box {
  width: 40rpx; height: 40rpx; border: 2rpx solid $border; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 24rpx; color: transparent;
  &.checked { background: $primary; border-color: $primary; color: #fff; }
}
.item-img { width: 140rpx; height: 140rpx; border-radius: $radius; flex-shrink: 0; }
.item-info { flex: 1; display: flex; flex-direction: column; gap: 12rpx; }
.item-name { font-size: 26rpx; font-weight: 600; }
.item-bottom { display: flex; align-items: center; justify-content: space-between; }
.item-price { color: $primary; font-weight: 700; font-size: 32rpx;
  .unit { font-size: 22rpx; }
}
.quantity-control {
  display: flex; align-items: center; gap: 16rpx;
  .qty-btn { width: 48rpx; height: 48rpx; background: $bg; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28rpx; font-weight: 700; }
  .qty-num { font-size: 28rpx; min-width: 40rpx; text-align: center; }
}

.cart-bottom {
  display: flex; align-items: center; background: $card-bg; padding: 16rpx 24rpx;
  border-top: 1rpx solid $border; gap: 16rpx;
}
.bottom-check { display: flex; align-items: center; gap: 8rpx; font-size: 26rpx; }
.bottom-total { flex: 1; text-align: right; }
.total-label { font-size: 22rpx; color: $text-secondary; display: block; }
.total-price { color: $primary; font-weight: 700; font-size: 36rpx;
  .unit { font-size: 24rpx; }
}
.submit-btn { padding: 16rpx 32rpx; font-size: 28rpx; }
</style>
