<script setup lang="ts">
import { orderApi } from '@/api'
import { useCartStore } from '@/store'
import { formatPrice } from '@/utils'
import { checkLogin } from '@/utils/auth'
import { computed, onMounted, ref } from 'vue'

const cartStore = useCartStore()

const isEmpty = computed(() => cartStore.items.length === 0)
const totalPrice = computed(() => formatPrice(cartStore.checkedTotal + 10))

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

const selectedAddress = ref<any>(null)

function goAddressList() {
  uni.showToast({ title: '地址管理开发中', icon: 'none' })
}

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
  <view class="cart-page">
    <!-- 空状态 -->
    <view v-if="isEmpty" class="cart-empty">
      <view class="cart-empty-icon">🛒</view>
      <view class="cart-empty-title">购物车是空的</view>
      <view class="cart-empty-desc">快去挑选心仪的宠物好物吧</view>
      <view class="cart-empty-btn" @tap="goToShop">去逛逛</view>
    </view>

    <!-- 购物车内容 -->
    <view v-else class="cart-content">
      <scroll-view scroll-y class="cart-scroll">
        <!-- 收货地址栏 -->
        <view class="cart-address-bar" @tap="goAddressList">
          <view class="cart-address-bar-icon">📍</view>
          <view class="cart-address-bar-info">
            <block v-if="selectedAddress">
              <view class="cart-address-bar-name">
                {{ selectedAddress.name }}<span>{{ selectedAddress.phone }}</span>
              </view>
              <view class="cart-address-bar-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.detail }}</view>
            </block>
            <view v-else class="cart-address-bar-text">请选择收货地址</view>
          </view>
          <view class="cart-address-bar-arrow">›</view>
        </view>

        <!-- 商品列表 -->
        <view class="cart-store">
          <view class="cart-item" v-for="item in cartStore.items" :key="item.id">
            <view class="cart-item-check" @tap="cartStore.toggleItem(item.id)">
              <view class="check-circle" :class="{ checked: item.checked }">✓</view>
            </view>
            <view class="cart-item-img">
              <image v-if="item.productImage" :src="item.productImage" mode="aspectFill" class="img-full" />
              <text v-else>📦</text>
            </view>
            <view class="cart-item-info">
              <text class="cart-item-name text-ellipsis-2">{{ item.productName }}</text>
              <view class="cart-item-bottom">
                <text class="cart-item-price"><text class="unit">¥</text>{{ formatPrice(item.price) }}</text>
                <view class="cart-qty">
                  <view class="cart-qty-btn" @tap="onQuantityChange(item, -1)">−</view>
                  <view class="cart-qty-num">{{ item.quantity }}</view>
                  <view class="cart-qty-btn" @tap="onQuantityChange(item, 1)">+</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view style="height: 20rpx" />
      </scroll-view>

      <!-- 底部栏 -->
      <view class="cart-bottom safe-bottom">
        <view class="cart-bottom-check" @tap="cartStore.toggleAll(!cartStore.isAllChecked)">
          <view class="check-circle" :class="{ checked: cartStore.isAllChecked }">✓</view>
          <text>全选</text>
        </view>
        <view class="cart-bottom-total">
          <view class="cart-bottom-total-label"><text class="shipping-highlight">含运费¥10.00</text> 合计</view>
          <view class="cart-bottom-total-price"><text class="unit">¥</text>{{ totalPrice }}</view>
        </view>
        <view class="cart-bottom-btn" @tap="submitOrder">结算({{ cartStore.checkedCount }})</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

.cart-page {
  display: flex; flex-direction: column; height: 100vh; background: $bg;
}

/* 空状态 */
.cart-empty {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 120rpx 40rpx; text-align: center;
}
.cart-empty-icon { font-size: 128rpx; margin-bottom: 24rpx; opacity: 0.6; }
.cart-empty-title { font-size: 30rpx; font-weight: 700; color: $text; margin-bottom: 12rpx; }
.cart-empty-desc { font-size: 24rpx; color: $text-light; margin-bottom: 32rpx; }
.cart-empty-btn {
  padding: 16rpx 56rpx; background: $primary; color: #fff; border-radius: 40rpx;
  font-size: 26rpx; font-weight: 600;
  &:active { opacity: 0.85; }
}

/* 内容区 */
.cart-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.cart-scroll { flex: 1; }

/* 地址栏 */
.cart-address-bar {
  display: flex; align-items: center; gap: 20rpx; margin: 16rpx 24rpx;
  padding: 24rpx 28rpx; background: $card-bg; border-radius: $radius; box-shadow: $shadow-sm;
  &:active { opacity: 0.85; }
}
.cart-address-bar-icon { font-size: 44rpx; flex-shrink: 0; }
.cart-address-bar-info { flex: 1; min-width: 0; }
.cart-address-bar-text { font-size: 28rpx; font-weight: 600; color: $text; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-address-bar-name { font-size: 28rpx; font-weight: 700; color: $text; margin-bottom: 4rpx; }
.cart-address-bar-name span { font-weight: 400; color: $text-secondary; margin-left: 12rpx; font-size: 26rpx; }
.cart-address-bar-detail { font-size: 22rpx; color: $text-secondary; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-address-bar-arrow { font-size: 36rpx; color: #ccc; flex-shrink: 0; }

/* 商品列表 */
.cart-store { margin-bottom: 16rpx; }
.cart-item {
  background: $card-bg; border-radius: $radius; padding: 24rpx;
  display: flex; align-items: center; gap: 20rpx; margin: 0 24rpx 12rpx; box-shadow: $shadow-sm;
}
.cart-item-check { flex-shrink: 0; }
.check-circle {
  width: 40rpx; height: 40rpx; border: 3rpx solid $border; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 24rpx; color: transparent;
  transition: all 0.2s;
  &.checked { background: $primary; border-color: $primary; color: #fff; }
}
.cart-item-img {
  width: 112rpx; height: 112rpx; border-radius: $radius-sm;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  display: flex; align-items: center; justify-content: center; font-size: 56rpx; flex-shrink: 0; overflow: hidden;
}
.img-full { width: 100%; height: 100%; }
.cart-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12rpx; }
.cart-item-name { font-size: 26rpx; font-weight: 600; color: $text; }
.cart-item-bottom { display: flex; align-items: center; justify-content: space-between; }
.cart-item-price { font-size: 30rpx; font-weight: 800; color: $accent;
  .unit { font-size: 20rpx; }
}

/* 数量控制 — 连接式 */
.cart-qty { display: flex; align-items: center; flex-shrink: 0; }
.cart-qty-btn {
  width: 52rpx; height: 52rpx; border: 2rpx solid $border; background: #faf8f5;
  font-size: 32rpx; display: flex; align-items: center; justify-content: center; color: $text;
  transition: background 0.2s;
  &:active { background: #f0e8e0; }
  &:first-child { border-radius: 8rpx 0 0 8rpx; }
  &:last-child { border-radius: 0 8rpx 8rpx 0; }
}
.cart-qty-num {
  width: 64rpx; height: 52rpx; border-top: 2rpx solid $border; border-bottom: 2rpx solid $border;
  display: flex; align-items: center; justify-content: center; font-size: 26rpx; font-weight: 600; color: $text; background: #fff;
}

/* 底部栏 — 渐变背景 */
.cart-bottom {
  background: linear-gradient(135deg, #ffc596 0%, #ff9549 100%);
  display: flex; align-items: center; padding: 20rpx 24rpx; gap: 20rpx;
  box-shadow: 0 -8rpx 32rpx rgba(249, 115, 22, 0.25);
  border-radius: $radius-lg $radius-lg 0 0;
  color: #fff;
}
.cart-bottom-check { display: flex; align-items: center; gap: 8rpx; font-size: 24rpx; color: #fff; }
.cart-bottom-check .check-circle { border-color: rgba(255,255,255,0.6);
  &.checked { background: #fff; border-color: #fff; color: $primary; }
}
.cart-bottom-total { flex: 1; text-align: right; }
.cart-bottom-total-label { font-size: 22rpx; color: rgba(255, 255, 255, 0.75); }
.shipping-highlight { color: #fff; font-weight: 700; }
.cart-bottom-total-price { font-size: 34rpx; font-weight: 800; color: #fff;
  .unit { font-size: 22rpx; }
}
.cart-bottom-btn {
  padding: 20rpx 40rpx; background: #fff; color: $primary; border-radius: 40rpx;
  font-size: 26rpx; font-weight: 700; white-space: nowrap;
  &:active { opacity: 0.85; }
}
.safe-bottom { padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }
</style>
