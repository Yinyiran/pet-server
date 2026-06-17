<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { productApi, categoryApi } from '@/api'
import { debounce } from '@/utils'

const categories = ref<any[]>([])
const products = ref<any[]>([])
const activeCategory = ref('all')
const activeFilter = ref('default')
const searchKeyword = ref('')
const loading = ref(false)

const filters = [
  { key: 'default', label: '综合' },
  { key: 'sales', label: '销量' },
  { key: 'price-asc', label: '价格↑' },
  { key: 'price-desc', label: '价格↓' },
]

async function loadCategories() {
  try {
    const tree = await categoryApi.getTree()
    categories.value = [{ id: 'all', name: '全部' }, ...(tree || [])]
  } catch (e) { /* */ }
}

async function loadProducts() {
  loading.value = true
  try {
    const params: any = { pageNum: 1, pageSize: 50 }
    if (activeCategory.value !== 'all') params.category = activeCategory.value
    if (searchKeyword.value) params.keyword = searchKeyword.value
    products.value = await productApi.getList(params) || []
  } catch (e) { /* */ } finally { loading.value = false }
}

function switchCategory(id: string) { activeCategory.value = id; loadProducts() }
function setFilter(key: string) { activeFilter.value = key; loadProducts() }

const filterProducts = computed(() => {
  let list = [...products.value]
  if (activeFilter.value === 'sales') list.sort((a: any, b: any) => (b.sales || 0) - (a.sales || 0))
  else if (activeFilter.value === 'price-asc') list.sort((a: any, b: any) => (a.price || 0) - (b.price || 0))
  else if (activeFilter.value === 'price-desc') list.sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
  return list
})

const onSearch = debounce(() => loadProducts(), 300)

function goDetail(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

onMounted(async () => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  if (page?.$page?.options?.category) {
    activeCategory.value = page.$page.options.category
  }
  await loadCategories()
  await loadProducts()
})
</script>

<template>
  <view class="page-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input class="search-input" v-model="searchKeyword" placeholder="搜索商品..." @input="onSearch" />
        <text v-if="searchKeyword" class="search-clear" @tap="searchKeyword = ''; loadProducts()">✕</text>
      </view>
      <view class="back-btn" @tap="uni.navigateBack()">
        <text>返回</text>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-row">
      <view v-for="f in filters" :key="f.key" class="filter-chip" :class="{ active: activeFilter === f.key }" @tap="setFilter(f.key)">
        {{ f.label }}
      </view>
    </view>

    <!-- 主体：左分类 + 右列表 -->
    <view class="shop-main">
      <scroll-view scroll-y class="shop-sidebar">
        <view v-for="cat in categories" :key="cat.id"
          class="sidebar-item" :class="{ active: activeCategory === cat.id }"
          @tap="switchCategory(cat.id)"
        >
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>

      <scroll-view scroll-y class="shop-list">
        <view class="product-card" v-for="item in filterProducts" :key="item.id" @tap="goDetail(item.id)">
          <image class="product-img" :src="item.image || '/static/logo.png'" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name text-ellipsis-2">{{ item.name }}</text>
            <text class="product-sold">已售 {{ item.sold || 0 }} 件</text>
            <view class="product-price">
              <text class="price-current"><text class="unit">¥</text>{{ item.price }}</text>
              <text class="price-original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
            </view>
          </view>
        </view>
        <view v-if="!loading && filterProducts.length === 0" class="empty-state">
          <text>暂无商品</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.search-bar {
  display: flex; align-items: center; background: $card-bg; padding: 16rpx 24rpx; gap: 16rpx;
}
.search-input-wrap {
  flex: 1; display: flex; align-items: center; background: $bg; padding: 12rpx 20rpx; border-radius: 30rpx; gap: 8rpx;
}
.search-icon { font-size: 28rpx; }
.search-input { flex: 1; font-size: 26rpx; }
.search-clear { color: $text-light; font-size: 24rpx; padding: 8rpx; }
.back-btn { font-size: 26rpx; color: $primary; padding: 8rpx; }

.filter-row {
  display: flex; padding: 12rpx 24rpx; gap: 16rpx; background: $card-bg; border-bottom: 1rpx solid $border;
}
.filter-chip {
  padding: 8rpx 24rpx; border-radius: 20rpx; font-size: 24rpx; color: $text-secondary; background: $bg;
  &.active { background: $primary; color: #fff; }
}

.shop-main { flex: 1; display: flex; overflow: hidden; }

.shop-sidebar {
  width: 180rpx; background: $card-bg; border-right: 1rpx solid $border; height: 100%;
}
.sidebar-item {
  padding: 28rpx 16rpx; font-size: 24rpx; color: $text-secondary; text-align: center;
  border-left: 4rpx solid transparent;
  &.active { background: $bg; color: $primary; font-weight: 600; border-left-color: $primary; }
}

.shop-list { flex: 1; height: 100%; padding: 16rpx; }

.product-card {
  display: flex; background: $card-bg; border-radius: $radius; padding: 16rpx; margin-bottom: 16rpx; gap: 16rpx; box-shadow: $shadow-sm;
}
.product-img { width: 160rpx; height: 160rpx; border-radius: $radius-sm; flex-shrink: 0; }
.product-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.product-name { font-size: 26rpx; font-weight: 600; }
.product-sold { font-size: 22rpx; color: $text-light; }
.product-price { display: flex; align-items: baseline; gap: 8rpx; }

.empty-state { text-align: center; padding: 80rpx 0; color: $text-light; }
</style>
