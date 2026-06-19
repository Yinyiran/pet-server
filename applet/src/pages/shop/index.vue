<script setup lang="ts">
import { categoryApi, productApi } from '@/api'
import { debounce } from '@/utils'
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'

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

const demoProducts = [
  { id: 1, name: '手工鸡肉干 天然无添加', desc: '精选优质鸡胸肉，低温烘焙，无防腐剂', image: '', price: 29.9, originalPrice: 45, sales: 1280, category: 'snack', tag: 'hot' },
  { id: 2, name: '皇家猫粮 室内成猫专用', desc: '专为室内猫设计，富含膳食纤维', image: '', price: 189, originalPrice: 239, sales: 3560, category: 'brand', tag: 'best' },
  { id: 3, name: '可爱蝴蝶结领结 红色', desc: '柔软面料，适合小型犬猫', image: '', price: 19.9, originalPrice: 35, sales: 892, category: 'clothes', tag: 'new' },
  { id: 4, name: '互动逗猫棒 羽毛款', desc: '天然羽毛，铃铛设计，吸引猫咪', image: '', price: 15.9, originalPrice: 25, sales: 2100, category: 'toy' },
  { id: 5, name: '三文鱼冻干零食 50g', desc: '深海三文鱼，冻干锁鲜', image: '', price: 39.9, originalPrice: 59.9, sales: 1856, category: 'snack', tag: 'hot' },
  { id: 6, name: '牛肉粒训练零食 100g', desc: '训练奖励首选，小块易喂', image: '', price: 32.9, originalPrice: 45.9, sales: 1420, category: 'snack' },
  { id: 7, name: '渴望六种鱼配方狗粮', desc: '六种深海鱼，高蛋白低敏', image: '', price: 459, originalPrice: 559, sales: 680, category: 'brand', tag: 'best' },
  { id: 8, name: '宠物自动饮水机 2L', desc: '活氧循环，过滤净水', image: '', price: 129, originalPrice: 169, sales: 945, category: 'brand', tag: 'new' },
]

const emojis: Record<string, string> = {
  snack: '🍖', brand: '🏷️', clothes: '👗', toy: '🧸', staple: '🥫', clean: '🧴', health: '💊',
}

const tagMap: Record<string, { label: string; cls: string }> = {
  hot: { label: '热销', cls: 'hot' },
  new: { label: '新品', cls: 'new' },
  best: { label: '精选', cls: 'best' },
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
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter((p: any) => p.name?.toLowerCase().includes(kw))
  }
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
    <view class="shop-search-bar">
      <view class="search-top-row">
        <view class="back-btn" @tap="goBack">
          <view class="back-arrow" />
        </view>
        <view class="search-input-wrap">
          <text class="search-icon">🔍</text>
          <input class="search-input" v-model="searchKeyword" placeholder="搜索商品..." confirm-type="search" @input="onSearch" />
          <view v-if="searchKeyword" class="search-clear" @tap="searchKeyword = ''; loadProducts()">✕</view>
        </view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <scroll-view scroll-x class="shop-filter-row" :show-scrollbar="false">
      <view v-for="f in filters" :key="f.key" class="filter-chip" :class="{ active: activeFilter === f.key }" @tap="setFilter(f.key)">
        {{ f.label }}
      </view>
    </scroll-view>

    <!-- 主体：左分类 + 右列表 -->
    <view class="shop-main">
      <!-- 左侧分类 -->
      <scroll-view scroll-y class="shop-sidebar">
        <view v-for="cat in categories" :key="cat.id"
          class="sidebar-item" :class="{ active: activeCategory === cat.id }"
          @tap="switchCategory(cat.id)"
        >
          <view class="sidebar-dot" />
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
            <!-- 商品图片 -->
            <view class="product-img-wrap">
              <image v-if="item.image" class="product-img" :src="item.image" mode="aspectFill" lazy-load />
              <text v-else class="product-emoji">{{ emojis[item.category] || '📦' }}</text>
              <view v-if="item.tag && tagMap[item.tag]" class="product-tag" :class="tagMap[item.tag].cls">
                {{ tagMap[item.tag].label }}
              </view>
            </view>
            <!-- 商品信息 -->
            <view class="product-info">
              <text class="product-name">{{ item.name }}</text>
              <text class="product-desc" v-if="item.desc">{{ item.desc }}</text>
              <view class="product-meta">
                <text class="product-price"><text class="unit">¥</text>{{ item.price }}</text>
                <text v-if="item.originalPrice" class="product-orig">¥{{ item.originalPrice }}</text>
                <text class="product-sales">已售{{ item.sales || item.sold || 0 }}</text>
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

.shop-page { height: 100vh; display: flex; flex-direction: column; background: $bg; }

/* 搜索栏 */
.shop-search-bar { background: $card-bg; padding-top: var(--status-bar-height, 44px); flex-shrink: 0; }
.search-top-row { display: flex; align-items: center; padding: 16rpx 24rpx; gap: 16rpx; }
.back-btn { width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: $bg; flex-shrink: 0; }
.back-arrow { width: 18rpx; height: 18rpx; border-left: 4rpx solid $text; border-bottom: 4rpx solid $text; transform: rotate(45deg); margin-left: 6rpx; }
.search-input-wrap { flex: 1; display: flex; align-items: center; background: $bg; padding: 14rpx 28rpx; border-radius: 40rpx; gap: 12rpx; }
.search-icon { font-size: 28rpx; flex-shrink: 0; }
.search-input { flex: 1; font-size: 26rpx; }
.search-clear { width: 36rpx; height: 36rpx; display: flex; align-items: center; justify-content: center; background: $text-light; color: #fff; border-radius: 50%; font-size: 20rpx; flex-shrink: 0; }

/* 筛选标签 */
.shop-filter-row { display: flex; padding: 16rpx 24rpx; gap: 16rpx; background: $card-bg; border-bottom: 2rpx solid $border; flex-shrink: 0; white-space: nowrap; }
.filter-chip { flex-shrink: 0; padding: 10rpx 28rpx; border-radius: 28rpx; font-size: 24rpx; font-weight: 500; color: $text-secondary; background: $bg; transition: all 0.2s; white-space: nowrap;
  &.active { background: $primary; color: #fff; }
}

/* 主体 */
.shop-main { flex: 1; display: flex; overflow: hidden; }

/* 左侧分类 */
.shop-sidebar { width: 180rpx; background: $bg; flex-shrink: 0; height: 100%; }
.sidebar-item {
  display: flex; align-items: center; gap: 12rpx; padding: 28rpx 20rpx;
  font-size: 26rpx; font-weight: 500; color: $text-secondary; transition: all 0.25s; position: relative;
  &.active { color: $primary; font-weight: 700; background: $card-bg;
    &::before { content: ''; position: absolute; left: 0; top: 16rpx; bottom: 16rpx; width: 6rpx; background: $primary; border-radius: 0 6rpx 6rpx 0; }
  }
}
.sidebar-dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: $border; flex-shrink: 0; transition: background 0.25s; }
.sidebar-item.active .sidebar-dot { background: $primary; }

/* 右侧商品列表 */
.shop-list { flex: 1; height: 100%; padding: 16rpx; background: $card-bg; }

/* 加载 */
.loading-wrap { display: flex; flex-direction: column; align-items: center; padding: 80rpx 0; color: $text-light; font-size: 24rpx; gap: 12rpx; }
.loading-spinner { width: 40rpx; height: 40rpx; border: 3rpx solid $border; border-top-color: $primary; border-radius: 50%; animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* 商品卡片 */
.product-card {
  display: flex; background: $card-bg; border-radius: $radius; overflow: hidden;
  margin-bottom: 16rpx; box-shadow: $shadow-sm; transition: transform 0.2s;
  &:active { transform: scale(0.97); }
}
.product-img-wrap {
  width: 280rpx; min-height: 280rpx; flex-shrink: 0; position: relative;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #fdf6f0, #faf1e6);
}
.product-img { width: 100%; height: 100%; }
.product-emoji { font-size: 112rpx; line-height: 1; }
.product-tag {
  position: absolute; top: 12rpx; left: 12rpx; padding: 4rpx 16rpx;
  border-radius: 20rpx; font-size: 20rpx; font-weight: 700; color: #fff;
  &.hot { background: $danger; }
  &.new { background: $success; }
  &.best { background: $primary; }
}
.product-info { flex: 1; padding: 20rpx 24rpx; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
.product-name { font-size: 28rpx; font-weight: 700; color: $text; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8rpx; }
.product-desc { font-size: 22rpx; color: $text-secondary; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8rpx; }
.product-meta { display: flex; align-items: baseline; gap: 12rpx; }
.product-price { font-size: 36rpx; font-weight: 800; color: $danger;
  .unit { font-size: 22rpx; font-weight: 600; }
}
.product-orig { font-size: 20rpx; color: $text-light; text-decoration: line-through; }
.product-sales { font-size: 20rpx; color: $text-light; margin-left: auto; }

/* 空状态 */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 100rpx 0; }
.empty-icon { font-size: 72rpx; margin-bottom: 12rpx; }
.empty-text { color: $text-light; font-size: 26rpx; }
</style>
