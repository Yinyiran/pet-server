<script setup lang="ts">
import { merchantProductApi, merchantApi } from '@/api'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const products = ref<any[]>([])
const loading = ref(false)
const merchantInfo = ref<any>(null)
const searchKeyword = ref('')

const activeCount = computed(() => products.value.filter(p => p.isActive === 1).length)
const totalCount = computed(() => products.value.length)

async function loadMerchantInfo() {
  try {
    const res = await merchantApi.getList({ pageSize: 1 })
    // The merchant info will be derived from user profile in a real scenario
    // For now we load it from the API context
  } catch (e) { /* ignore */ }
}

async function loadProducts() {
  loading.value = true
  try {
    const params: any = { pageNum: 1, pageSize: 100 }
    if (searchKeyword.value) params.keyword = searchKeyword.value
    const res = await merchantProductApi.getList(params)
    products.value = res?.list || res || []
  } catch (e) {
    products.value = []
  } finally {
    loading.value = false
  }
}

function goEdit(id?: number) {
  const url = id ? `/pages/merchant-product-edit/index?id=${id}` : '/pages/merchant-product-edit/index'
  uni.navigateTo({ url })
}

async function toggleStatus(product: any) {
  const newStatus = product.isActive === 1 ? 0 : 1
  try {
    await merchantProductApi.toggleStatus(product.id, newStatus)
    product.isActive = newStatus
    uni.showToast({ title: newStatus ? '已上架' : '已下架', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

function deleteProduct(product: any) {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除商品「${product.name}」吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await merchantProductApi.remove(String(product.id))
          uni.showToast({ title: '已删除', icon: 'success' })
          loadProducts()
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    },
  })
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/profile/index' }) })
}

function onSearch() {
  loadProducts()
}

onShow(() => {
  loadProducts()
})
</script>

<template>
  <view class="page-container">
    <!-- Header -->
    <view class="header">
      <view class="header-inner">
        <view class="header-back" @tap="goBack">
          <view class="back-arrow" />
        </view>
        <text class="header-title">商家中心</text>
        <view class="header-placeholder" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <!-- 统计卡片 -->
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-num">{{ activeCount }}</text>
          <text class="stat-label">在售商品</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num">{{ totalCount }}</text>
          <text class="stat-label">全部商品</text>
        </view>
      </view>

      <!-- 搜索栏 -->
      <view class="search-bar">
        <view class="search-input-wrap">
          <text class="search-icon">🔍</text>
          <input class="search-input" v-model="searchKeyword" placeholder="搜索商品..." confirm-type="search" @confirm="onSearch" />
          <view v-if="searchKeyword" class="search-clear" @tap="searchKeyword = ''; loadProducts()">✕</view>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="product-list">
        <view v-if="loading" class="loading-wrap">
          <view class="loading-spinner" />
          <text>加载中...</text>
        </view>
        <template v-else-if="products.length">
          <view class="product-item" v-for="item in products" :key="item.id">
            <view class="product-thumb" @tap="goEdit(item.id)">
              <image v-if="item.imgUrl" class="thumb-img" :src="item.imgUrl" mode="aspectFill" />
              <text v-else class="thumb-placeholder">📦</text>
              <view v-if="!item.isActive" class="thumb-off">已下架</view>
            </view>
            <view class="product-info" @tap="goEdit(item.id)">
              <text class="product-name">{{ item.name }}</text>
              <view class="product-meta">
                <text class="product-price">¥{{ item.price }}</text>
                <text class="product-stock">库存 {{ item.stock }}</text>
                <text class="product-sales">销量 {{ item.sales || 0 }}</text>
              </view>
            </view>
            <view class="product-actions">
              <view class="action-btn" :class="item.isActive ? 'off' : 'on'" @tap="toggleStatus(item)">
                {{ item.isActive ? '下架' : '上架' }}
              </view>
              <view class="action-btn edit" @tap="goEdit(item.id)">编辑</view>
              <view class="action-btn del" @tap="deleteProduct(item)">删除</view>
            </view>
          </view>
        </template>
        <view v-else class="empty-state">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无商品，点击下方按钮添加</text>
        </view>
      </view>

      <view style="height: 140rpx" />
    </scroll-view>

    <!-- 底部新增按钮 -->
    <view class="bottom-bar">
      <view class="add-btn" @tap="goEdit()">
        <text>+ 新增商品</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: $bg;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background: $header-gradient;
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 24rpx);
  flex-shrink: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-back {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
}
.back-arrow {
  width: 18rpx;
  height: 18rpx;
  border-left: 4rpx solid $text;
  border-bottom: 4rpx solid $text;
  transform: rotate(45deg);
  margin-left: 6rpx;
}
.header-title {
  font-size: 36rpx;
  font-weight: 700;
  color: $text;
}
.header-placeholder { width: 56rpx; }

/* Stats */
.stats-card {
  display: flex;
  align-items: center;
  background: $card-bg;
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 32rpx;
  box-shadow: $shadow-sm;
}
.stat-item { flex: 1; text-align: center; }
.stat-num { font-size: 48rpx; font-weight: 800; color: $primary; display: block; }
.stat-label { font-size: 24rpx; color: $text-secondary; margin-top: 8rpx; display: block; }
.stat-divider { width: 2rpx; height: 60rpx; background: $border; }

/* Search */
.search-bar { padding: 0 24rpx; margin-bottom: 16rpx; }
.search-input-wrap {
  display: flex;
  align-items: center;
  background: $card-bg;
  padding: 18rpx 28rpx;
  border-radius: 40rpx;
  gap: 12rpx;
  box-shadow: $shadow-sm;
}
.search-icon { font-size: 28rpx; flex-shrink: 0; }
.search-input { flex: 1; font-size: 26rpx; }
.search-clear {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $text-light;
  color: #fff;
  border-radius: 50%;
  font-size: 20rpx;
  flex-shrink: 0;
}

/* Product List */
.product-list { padding: 0 24rpx; }
.product-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: $card-bg;
  border-radius: $radius;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: $shadow-sm;
}
.product-thumb {
  width: 140rpx;
  height: 140rpx;
  border-radius: $radius-sm;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(135deg, #fdf6f0, #faf1e6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-img { width: 100%; height: 100%; }
.thumb-placeholder { font-size: 60rpx; }
.thumb-off {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  color: #fff;
  font-size: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-info { flex: 1; min-width: 0; }
.product-name {
  font-size: 28rpx;
  font-weight: 700;
  color: $text;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 12rpx;
}
.product-meta { display: flex; align-items: center; gap: 16rpx; }
.product-price { font-size: 30rpx; font-weight: 800; color: $danger; }
.product-stock, .product-sales { font-size: 22rpx; color: $text-light; }
.product-actions { display: flex; flex-direction: column; gap: 12rpx; flex-shrink: 0; }
.action-btn {
  padding: 8rpx 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 20rpx;
  text-align: center;
  &:active { opacity: 0.7; }
}
.action-btn.edit { color: $primary; background: rgba(249,115,22,0.1); }
.action-btn.del { color: $danger; background: rgba(224,85,85,0.1); }
.action-btn.off { color: #666; background: #f0f0f0; }
.action-btn.on { color: $success; background: rgba(123,198,126,0.15); }

/* Loading & Empty */
.loading-wrap { display: flex; flex-direction: column; align-items: center; padding: 80rpx 0; color: $text-light; font-size: 24rpx; gap: 12rpx; }
.loading-spinner { width: 40rpx; height: 40rpx; border: 3rpx solid $border; border-top-color: $primary; border-radius: 50%; animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }
.empty-icon { font-size: 72rpx; margin-bottom: 16rpx; }
.empty-text { color: $text-light; font-size: 26rpx; }

/* Bottom bar */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom, 0) + 20rpx);
  background: $card-bg;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
  z-index: 100;
}
.add-btn {
  background: linear-gradient(135deg, $primary, $accent);
  color: #fff;
  text-align: center;
  padding: 24rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 700;
  box-shadow: 0 4rpx 16rpx rgba(249,115,22,0.35);
  &:active { opacity: 0.85; transform: scale(0.98); }
}
</style>
