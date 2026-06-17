<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productApi } from '@/api'
import { useCartStore } from '@/store'
import { checkLogin } from '@/utils/auth'

const cartStore = useCartStore()
const product = ref<any>(null)
const galleryCurrent = ref(0)

async function loadProduct() {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const id = page?.$page?.options?.id || page?.options?.id
  if (!id) return
  try { product.value = await productApi.getDetail(+id) } catch (e) { console.error(e) }
}

function addToCart() {
  if (!checkLogin() || !product.value) return
  cartStore.addToCart(product.value.id)
}

function buyNow() {
  if (!checkLogin()) return
  addToCart()
  uni.switchTab({ url: '/pages/cart/index' })
}

function shareProduct() {
  // #ifdef MP-WEIXIN
  // 微信小程序分享
  // #endif
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}

onMounted(loadProduct)
</script>

<template>
  <view class="page-container">
    <scroll-view scroll-y class="scroll-content" v-if="product">
      <!-- 图片轮播 -->
      <swiper class="gallery-swiper" autoplay circular indicator-dots @change="(e: any) => galleryCurrent = e.detail.current">
        <swiper-item v-for="(img, idx) in (product.images || [product.image])" :key="idx">
          <image class="gallery-img" :src="img || '/static/logo.png'" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <!-- 返回按钮 -->
      <view class="gallery-back" @tap="uni.navigateBack()">
        <text>‹</text>
      </view>

      <!-- 商品信息 -->
      <view class="info-card card">
        <view class="price-row">
          <text class="price-current"><text class="unit">¥</text>{{ product.price }}</text>
          <text class="price-original" v-if="product.originalPrice">¥{{ product.originalPrice }}</text>
          <text class="product-tag" v-if="product.tag">{{ product.tag }}</text>
        </view>
        <text class="product-name">{{ product.name }}</text>
        <text class="product-sold">已售 {{ product.sold || 0 }} 件</text>
      </view>

      <!-- 拼团区域 -->
      <view class="group-card card" v-if="product.groupBuy">
        <view class="group-header">
          <text>👥 拼团优惠</text>
          <text class="group-hint">拼团享折扣，人越多越便宜</text>
        </view>
      </view>

      <!-- 商品详情 -->
      <view class="desc-card card">
        <text class="desc-title">📋 商品详情</text>
        <rich-text :nodes="product.description || ''" />
      </view>

      <!-- 规格参数 -->
      <view class="specs-card card" v-if="product.specs?.length">
        <text class="desc-title">📦 规格参数</text>
        <view class="spec-row" v-for="(spec, idx) in product.specs" :key="idx">
          <text class="spec-label">{{ spec.label }}</text>
          <text class="spec-value">{{ spec.value }}</text>
        </view>
      </view>

      <view style="height: 160rpx" />
    </scroll-view>

    <!-- 底部固定栏 -->
    <view class="bottom-bar safe-bottom" v-if="product">
      <view class="bottom-left">
        <view class="bottom-action" @tap="uni.showToast({ title: '客服开发中', icon: 'none' })">
          <text>💬</text><text>客服</text>
        </view>
        <view class="bottom-action" @tap="shareProduct">
          <text>📤</text><text>分享</text>
        </view>
      </view>
      <view class="bottom-right">
        <view class="bottom-price">
          <text class="bp-current">¥{{ product.price }}</text>
        </view>
        <button class="cart-btn" @tap="addToCart">加入购物车</button>
        <button class="buy-btn" @tap="buyNow">立即购买</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.gallery-swiper { height: 600rpx; }
.gallery-img { width: 100%; height: 100%; }
.gallery-back {
  position: fixed; top: 80rpx; left: 24rpx; width: 64rpx; height: 64rpx;
  background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 36rpx; z-index: 10;
}

.info-card { margin-top: -40rpx; position: relative; z-index: 1; border-radius: $radius-lg $radius-lg 0 0; }
.price-row { display: flex; align-items: baseline; gap: 12rpx; margin-bottom: 12rpx; }
.product-name { font-size: 32rpx; font-weight: 700; display: block; margin-bottom: 8rpx; }
.product-sold { font-size: 24rpx; color: $text-light; }
.product-tag { font-size: 20rpx; background: $primary-light; color: $primary; padding: 4rpx 12rpx; border-radius: 6rpx; }

.group-card {
  .group-header { display: flex; align-items: center; justify-content: space-between; font-size: 28rpx; font-weight: 600; }
  .group-hint { font-size: 22rpx; color: $text-secondary; font-weight: 400; }
}

.desc-title { font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 16rpx; }

.spec-row { display: flex; padding: 12rpx 0; border-bottom: 1rpx solid $border;
  &:last-child { border-bottom: none; }
}
.spec-label { width: 180rpx; font-size: 24rpx; color: $text-secondary; }
.spec-value { flex: 1; font-size: 24rpx; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0; background: $card-bg; display: flex;
  align-items: center; padding: 16rpx 24rpx; border-top: 1rpx solid $border; z-index: 100; gap: 16rpx;
}
.bottom-left { display: flex; gap: 24rpx; }
.bottom-action {
  display: flex; flex-direction: column; align-items: center; font-size: 20rpx; color: $text-secondary; gap: 4rpx;
  text:first-child { font-size: 32rpx; }
}
.bottom-right { flex: 1; display: flex; align-items: center; gap: 12rpx; }
.bottom-price { flex: 1; text-align: right; }
.bp-current { color: $primary; font-weight: 700; font-size: 32rpx; }
.cart-btn {
  background: $accent; color: #fff; font-size: 24rpx; padding: 16rpx 24rpx; border-radius: $radius; border: none;
}
.buy-btn {
  background: $primary; color: #fff; font-size: 24rpx; padding: 16rpx 24rpx; border-radius: $radius; border: none;
}
</style>
