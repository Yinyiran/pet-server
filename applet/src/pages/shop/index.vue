<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"商品列表"}}
</route>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { productApi, categoryApi } from '@/api'
import { debounce } from '@/utils'

interface Category {
  id: string
  name: string
  icon?: string
}

const categories = ref<Category[]>([
  { id: 'all', name: '全部' },
  { id: 'snack', name: '手工零食', icon: '🍪' },
  { id: 'brand', name: '品牌优选', icon: '🏷️' },
  { id: 'clothes', name: '服装配饰', icon: '👗' },
  { id: 'toy', name: '宠物玩具', icon: '🧸' },
  { id: 'staple', name: '主粮罐头', icon: '🥫' },
  { id: 'clean', name: '清洁洗护', icon: '🧴' },
  { id: 'health', name: '保健营养', icon: '💊' },
])

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

// 模拟商品数据
const demoProducts = [
  { id: 1, name: '手工鸡肉干 天然无添加', image: '', price: 29.9, originalPrice: 45, sales: 1280, category: 'snack' },
  { id: 2, name: '皇家猫粮 室内成猫专用', image: '', price: 189, originalPrice: 239, sales: 3560, category: 'brand' },
  { id: 3, name: '可爱蝴蝶结领结 红色', image: '', price: 19.9, originalPrice: 35, sales: 892, category: 'clothes' },
  { id: 4, name: '互动逗猫棒 羽毛款', image: '', price: 15.9, originalPrice: 25, sales: 2100, category: 'toy' },
  { id: 5, name: '三文鱼冻干零食 50g', image: '', price: 39.9, originalPrice: 59.9, sales: 1856, category: 'snack' },
  { id: 6, name: '牛肉粒训练零食 100g', image: '', price: 32.9, originalPrice: 45.9, sales: 1420, category: 'snack' },
  { id: 7, name: '渴望六种鱼配方狗粮', image: '', price: 459, originalPrice: 559, sales: 680, category: 'brand' },
  { id: 8, name: '宠物自动饮水机 2L', image: '', price: 129, originalPrice: 169, sales: 945, category: 'brand' },
]

const emojis: Record<string, string> = {
  snack: '🍖', brand: '🏷️', clothes: '👗', toy: '🧸', staple: '🥫', clean: '🧴', health: '💊',
}

async function loadCategories() {
  try {
    const tree = await categoryApi.getTree()
    if (tree?.length) categories.value = [{ id: 'all', name: '全部' }, ...tree]
  } catch (e) { /* use demo */ }
}

async function loadProducts() {
  loading.value = true
  try {
    const params: any = { pageNum: 1, pageSize: 50 }
    if (activeCategory.value !== 'all') params.category = activeCategory.value
    if (searchKeyword.value) params.keyword = searchKeyword.value
    const res = await productApi.getList(params)
    products.value = res?.rows || res || []
  } catch (e) {
    // Fallback to demo data
    if (activeCategory.value === 'all') {
      products.value = demoProducts
    } else {
      products.value = demoProducts.filter(p => p.category === activeCategory.value)
    }
  } finally {
    loading.value = false
  }
}

function switchCategory(id: string) {
  activeCategory.value = id
  loadProducts()
}

function setFilter(key: string) {
  activeFilter.value = key
}

const filteredProducts = computed(() => {
  let list = [...products.value]
  // 搜索过滤
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter((p: any) => p.name?.toLowerCase().includes(kw))
  }
  // 排序
  if (activeFilter.value === 'sales') list.sort((a: any, b: any) => (b.sales || 0) - (a.sales || 0))
  else if (activeFilter.value === 'price-asc') list.sort((a: any, b: any) => (a.price || 0) - (b.price || 0))
  else if (activeFilter.value === 'price-desc') list.sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
  return list
})

const onSearch = debounce(() => loadProducts(), 300)

function goDetail(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/home/index' }) })
}

onLoad((options: any) => {
  if (options?.category) {
    activeCategory.value = options.category
  }
})

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>

<template>
  <view class="shop-page">
    <!-- 顶部搜索栏 -->
    <view class="top-bar">
      <view class="top-bar-inner">
        <view class="back-btn" @tap="goBack">
          <view class="back-arrow" />
        </view>
        <view class="search-input-wrap">
          <text class="search-icon">🔍</text>
          <input class="search-input" v-model="searchKeyword" placeholder="搜索商品..." confirm-type="search" @input="onSearch" />
          <text v-if="searchKeyword" class="search-clear" @tap="searchKeyword = ''; loadProducts()">✕</text>
        </view>
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
      <!-- 左侧分类 -->
      <scroll-view scroll-y class="shop-sidebar">
        <view v-for="cat in categories" :key="cat.id"
          class="sidebar-item" :class="{ active: activeCategory === cat.id }"
          @tap="switchCategory(cat.id)"
        >
          <view v-if="activeCategory === cat.id" class="sidebar-dot" />
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view scroll-y class="shop-list">
        <view v-if="loading" class="loading-wrap">
          <view class="loading-spinner" />
          <text>加载中...</text>
        </view>
        <template v-else>
          <view class="product-card" v-for="item in filteredProducts" :key="item.id" @tap="goDetail(item.id)">
            <view class="product-img-wrap">
              <image v-if="item.image" class="product-img" :src="item.image" mode="aspectFill" lazy-load />
              <view v-else class="product-img-placeholder">
                <text>{{ emojis[item.category] || '📦' }}</text>
              </view>
            </view>
            <view class="product-info">
              <text class="product-name">{{ item.name }}</text>
              <text class="product-sold">已售 {{ item.sales || item.sold || 0 }} 件</text>
              <view class="product-price-row">
                <text class="product-price">¥{{ item.price }}</text>
                <text v-if="item.originalPrice" class="product-price-orig">¥{{ item.originalPrice }}</text>
              </view>
            </view>
          </view>
          <view v-if="filteredProducts.length === 0" class="empty-state">
            <text class="empty-icon">📭</text>
            <text class="empty-text">暂无商品</text>
          </view>
        </template>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.shop-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg;
}

/* 顶部搜索栏 */
.top-bar {
  background: $card-bg;
  padding-top: var(--status-bar-height, 44px);
  flex-shrink: 0;
}
.top-bar-inner {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  gap: 16rpx;
}
.back-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: $bg;
  flex-shrink: 0;
}
.back-arrow {
  width: 16rpx;
  height: 16rpx;
  border-left: 4rpx solid $text;
  border-bottom: 4rpx solid $text;
  transform: rotate(45deg);
  margin-left: 6rpx;
}
.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: $bg;
  padding: 14rpx 24rpx;
  border-radius: 36rpx;
  gap: 10rpx;
}
.search-icon { font-size: 28rpx; flex-shrink: 0; }
.search-input { flex: 1; font-size: 26rpx; }
.search-clear { color: $text-light; font-size: 24rpx; padding: 8rpx; }

/* 筛选标签 */
.filter-row {
  display: flex;
  padding: 14rpx 24rpx;
  gap: 16rpx;
  background: $card-bg;
  border-bottom: 1rpx solid $border;
  flex-shrink: 0;
}
.filter-chip {
  padding: 10rpx 28rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: $text-secondary;
  background: $bg;
  transition: all 0.2s;

  &.active {
    background: $primary;
    color: #fff;
    font-weight: 600;
  }
}

/* 主体 */
.shop-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.shop-sidebar {
  width: 180rpx;
  background: $card-bg;
  border-right: 1rpx solid $border;
  height: 100%;
  flex-shrink: 0;
}
.sidebar-item {
  padding: 30rpx 20rpx;
  font-size: 24rpx;
  color: $text-secondary;
  text-align: center;
  position: relative;
  transition: all 0.2s;

  &.active {
    background: $bg;
    color: $primary;
    font-weight: 600;
  }
}
.sidebar-dot {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 36rpx;
  background: $primary;
  border-radius: 0 4rpx 4rpx 0;
}

.shop-list {
  flex: 1;
  height: 100%;
  padding: 16rpx;
}

/* 加载状态 */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  color: $text-light;
  font-size: 24rpx;
  gap: 12rpx;
}
.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid $border;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 商品卡片 */
.product-card {
  display: flex;
  background: $card-bg;
  border-radius: $radius;
  padding: 16rpx;
  margin-bottom: 16rpx;
  gap: 16rpx;
  box-shadow: $shadow-sm;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}
.product-img-wrap {
  width: 160rpx;
  height: 160rpx;
  flex-shrink: 0;
  border-radius: $radius-sm;
  overflow: hidden;
}
.product-img {
  width: 100%;
  height: 100%;
}
.product-img-placeholder {
  width: 100%;
  height: 100%;
  background: $primary-light;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}
.product-name {
  font-size: 26rpx;
  font-weight: 600;
  color: $text;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.product-sold {
  font-size: 22rpx;
  color: $text-light;
}
.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}
.product-price {
  font-size: 30rpx;
  font-weight: 700;
  color: $primary;
}
.product-price-orig {
  font-size: 22rpx;
  color: $text-light;
  text-decoration: line-through;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 72rpx;
    margin-bottom: 12rpx;
  }
  .empty-text {
    color: $text-light;
    font-size: 26rpx;
  }
}
</style>
