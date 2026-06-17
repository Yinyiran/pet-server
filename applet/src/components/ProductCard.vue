<script setup lang="ts">
/**
 * 商品卡片组件
 * 用于首页、商品列表等页面的商品展示
 */
import PriceDisplay from './PriceDisplay.vue'
import type { ProductItem } from '@/types'

const props = withDefaults(
  defineProps<{
    product: ProductItem
    layout?: 'vertical' | 'horizontal'
  }>(),
  {
    layout: 'vertical',
  }
)

function handleClick() {
  uni.navigateTo({
    url: `/pages/product/detail?id=${props.product.id}`,
  })
}
</script>

<template>
  <view class="product-card" :class="{ horizontal: layout === 'horizontal' }" @tap="handleClick">
    <image
      class="product-img"
      :src="product.image"
      mode="aspectFill"
      lazy-load
    />
    <view class="product-info">
      <text class="product-name">{{ product.name }}</text>
      <view v-if="product.tags?.length" class="product-tags">
        <text v-for="tag in product.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</text>
      </view>
      <view class="product-bottom">
        <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="sm" />
        <text v-if="product.sales !== undefined" class="product-sales">已售{{ product.sales }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.product-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(61, 44, 30, 0.06);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .product-img {
    width: 100%;
    height: 280rpx;
    display: block;
  }

  .product-info {
    padding: 16rpx 20rpx 20rpx;
  }

  .product-name {
    font-size: 26rpx;
    color: #3d2c1e;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 72rpx;
  }

  .product-tags {
    display: flex;
    gap: 8rpx;
    margin-top: 10rpx;
    flex-wrap: wrap;

    .tag {
      font-size: 20rpx;
      color: #f97316;
      background: rgba(249, 115, 22, 0.08);
      padding: 2rpx 10rpx;
      border-radius: 6rpx;
    }
  }

  .product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10rpx;
  }

  .product-sales {
    font-size: 22rpx;
    color: #b8a898;
  }

  /* 横向布局 */
  &.horizontal {
    display: flex;
    flex-direction: row;

    .product-img {
      width: 200rpx;
      height: 200rpx;
      flex-shrink: 0;
    }

    .product-info {
      flex: 1;
      padding: 16rpx 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .product-name {
      min-height: auto;
    }
  }
}
</style>
