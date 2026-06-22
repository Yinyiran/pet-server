<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"商品详情"}}
</route>

<script setup lang="ts">
import { productApi, groupApi } from '@/api'
import { useCartStore } from '@/store'
import { useUserStore } from '@/store/modules/user'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'

const cartStore = useCartStore()
const userStore = useUserStore()

const product = ref<any>(null)
const galleryCurrent = ref(0)
const loading = ref(true)

/** 拼团相关 */
const groupSizes = ref<{ size: number; discount: number }[]>([])
const selectedGroupSize = ref(0)
const activeGroups = ref<any[]>([])

const groupPrice = computed(() => {
  if (!product.value || !selectedGroupSize.value) return 0
  const config = groupSizes.value.find(g => g.size === selectedGroupSize.value)
  if (!config) return 0
  return +(product.value.price * (1 - config.discount / 100)).toFixed(2)
})

function getGroupPrice(size: number) {
  if (!product.value) return 0
  const config = groupSizes.value.find(g => g.size === size)
  if (!config) return 0
  return +(product.value.price * (1 - config.discount / 100)).toFixed(2)
}

function selectGroupSize(size: number) {
  selectedGroupSize.value = size
}

/** 加载商品 */
let productId = 0
onLoad((options: any) => {
  productId = +(options?.id || 0)
})

async function loadProduct() {
  if (!productId) { loading.value = false; return }
  loading.value = true
  try {
    product.value = await productApi.getDetail(productId)
    // 解析拼团配置
    if (product.value?.groupBuyConfig?.length) {
      groupSizes.value = product.value.groupBuyConfig.map((c: any) => ({
        size: Number(c.size),
        discount: Number(c.discount),
      }))
      selectedGroupSize.value = groupSizes.value[0]?.size || 0
    }
    // 加载进行中的拼团
    if (product.value?.groupBuyConfig?.length) {
      try {
        activeGroups.value = (await groupApi.getProductGroups(productId)) || []
      } catch { activeGroups.value = [] }
    }
  } catch (e) {
    // Demo fallback
    product.value = {
      id: productId,
      name: '手工鸡肉干 天然无添加 优质蛋白零食',
      price: 29.9,
      originalPrice: 45,
      sales: 1280,
      tag: '热销',
      images: [],
      image: '',
      description: '<p>精选优质鸡胸肉，低温烘焙工艺，保留天然营养，无添加防腐剂。适合各年龄段宠物，是训练奖励和日常零食的绝佳选择。</p><p>每袋净含量100g，独立小包装，方便携带和保存。</p>',
      specs: [
        { label: '品牌', value: '梵优茗宠' },
        { label: '产地', value: '中国' },
        { label: '净含量', value: '100g/袋' },
        { label: '保质期', value: '12个月' },
        { label: '适用宠物', value: '猫狗通用' },
        { label: '口味', value: '鸡肉味' },
      ],
      groupBuyConfig: [
        { size: 2, discount: 5 },
        { size: 3, discount: 10 },
        { size: 5, discount: 15 },
        { size: 10, discount: 25 },
      ],
    }
    groupSizes.value = product.value.groupBuyConfig
    selectedGroupSize.value = 2
  } finally {
    loading.value = false
  }
}

function addToCart() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  if (!product.value) return
  cartStore.add({
    productId: product.value.id,
    name: product.value.name,
    image: product.value.image || '',
    price: product.value.price,
    quantity: 1,
  })
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

function buyNow() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  addToCart()
  uni.switchTab({ url: '/pages/cart/index' })
}

function initiateGroup() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  if (!selectedGroupSize.value) {
    uni.showToast({ title: '请选择拼团规格', icon: 'none' })
    return
  }
  groupApi.start({ productId, groupSize: selectedGroupSize.value })
    .then((res: any) => {
      uni.showToast({ title: `已发起${selectedGroupSize.value}人拼团`, icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: `/pages/group-detail/index?groupNo=${res.groupNo}` })
      }, 800)
    })
    .catch((e: any) => {
      uni.showToast({ title: e?.message || '发起拼团失败', icon: 'none' })
    })
}

function joinGroup(groupNo: string) {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  groupApi.join({ groupNo })
    .then((res: any) => {
      uni.showToast({ title: res.isComplete ? '拼团成功！' : '已参加拼团', icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: `/pages/group-detail/index?groupNo=${groupNo}` })
      }, 800)
    })
    .catch((e: any) => {
      uni.showToast({ title: e?.message || '参加拼团失败', icon: 'none' })
    })
}

function viewGroupDetail(groupNo: string) {
  uni.navigateTo({ url: `/pages/group-detail/index?groupNo=${groupNo}` })
}

function shareProduct() {
  // #ifdef MP-WEIXIN
  uni.showToast({ title: '请点击右上角分享', icon: 'none' })
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
  // #endif
}

function contactService() {
  uni.showToast({ title: '客服功能开发中', icon: 'none' })
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/home/index' }) })
}

onMounted(loadProduct)

// 微信分享配置
onShareAppMessage(() => {
  if (!product.value) return { title: '梵优茗宠', path: '/pages/home/index' }
  return {
    title: `${product.value.name} - 拼团更优惠`,
    path: `/pages/product/detail?id=${product.value.id}`,
    imageUrl: product.value.image || product.value.imgUrl || '',
  }
})
</script>

<template>
  <view class="detail-page">
    <!-- 加载中 -->
    <view v-if="loading" class="loading-page">
      <view class="loading-spinner" />
      <text>加载中...</text>
    </view>

    <template v-else-if="product">
      <scroll-view scroll-y class="detail-scroll">
        <!-- 图片轮播 -->
        <view class="gallery-wrap">
          <swiper class="gallery-swiper" autoplay circular indicator-dots=false
            @change="(e: any) => galleryCurrent = e.detail.current">
            <swiper-item v-for="(img, idx) in (product.images?.length ? product.images : [product.image])" :key="idx">
              <image v-if="img" class="gallery-img" :src="img" mode="aspectFill" />
              <view v-else class="gallery-placeholder">
                <text class="gallery-emoji">📦</text>
              </view>
            </swiper-item>
          </swiper>
          <!-- 指示器 -->
          <view v-if="(product.images?.length || 1) > 1" class="gallery-indicator">
            {{ galleryCurrent + 1 }}/{{ product.images?.length || 1 }}
          </view>
        </view>

        <!-- 返回按钮 -->
        <view class="gallery-back" @tap="goBack">
          <view class="back-arrow" />
        </view>

        <!-- 分享按钮 -->
        <view class="gallery-share" @tap="shareProduct">
          <text>📤</text>
        </view>

        <!-- 商品信息卡片 -->
        <view class="info-card">
          <view class="price-row">
            <text class="price-current"><text class="price-symbol">¥</text>{{ product.price }}</text>
            <text v-if="product.originalPrice" class="price-original">¥{{ product.originalPrice }}</text>
            <text v-if="product.tag" class="product-tag">{{ product.tag }}</text>
          </view>
          <text class="product-name">{{ product.name }}</text>
          <text class="product-sold">已售 {{ product.sales || product.sold || 0 }} 件</text>
          <!-- 来源标识 -->
          <view class="source-badge-row">
            <view v-if="!product.merchantId" class="source-badge official-badge">
              <text>官方直营</text>
            </view>
            <view v-else-if="product.merchantName" class="source-badge merchant-badge">
              <text>{{ product.merchantName }}</text>
            </view>
          </view>
        </view>

        <!-- 拼团优惠 -->
        <view class="group-card" v-if="groupSizes.length">
          <view class="group-header">
            <view class="group-header-left">
              <text class="group-icon">👥</text>
              <text class="group-title">拼团优惠</text>
            </view>
            <text class="group-hint">拼团享折扣，人越多越便宜</text>
          </view>

          <!-- 拼团规格选择 -->
          <view class="group-spec-section">
            <text class="group-spec-label">选择拼团规格</text>
            <view class="group-spec-chips">
              <view v-for="g in groupSizes" :key="g.size"
                class="group-spec-chip" :class="{ active: selectedGroupSize === g.size }"
                @tap="selectGroupSize(g.size)">
                <text class="chip-size">{{ g.size }}人团</text>
                <text class="chip-discount">省{{ g.discount }}%</text>
              </view>
            </view>
          </view>

          <!-- 折扣差异表 -->
          <view class="group-discount-table">
            <view class="gdt-row gdt-header">
              <text class="gdt-cell">参团人数</text>
              <text class="gdt-cell">拼团价</text>
              <text class="gdt-cell">优惠</text>
              <text class="gdt-cell">操作</text>
            </view>
            <view v-for="g in groupSizes" :key="g.size"
              class="gdt-row" :class="{ highlight: selectedGroupSize === g.size }">
              <text class="gdt-cell">{{ g.size }} 人</text>
              <text class="gdt-cell price-cell">¥{{ getGroupPrice(g.size) }}</text>
              <text class="gdt-cell discount-cell">省 {{ g.discount }}%</text>
              <view class="gdt-cell">
                <view class="gdt-btn" :class="{ active: selectedGroupSize === g.size }" @tap="selectGroupSize(g.size)">去参团</view>
              </view>
            </view>
          </view>

          <!-- 发起拼团按钮 -->
          <button class="group-initiate-btn" @tap="initiateGroup">
            <text>👥</text>
            <text>发起 {{ selectedGroupSize }}人拼团 ¥{{ groupPrice }}</text>
          </button>
        </view>

        <!-- 正在拼团 -->
        <view class="active-groups-card" v-if="activeGroups.length">
          <view class="group-header">
            <view class="group-header-left">
              <text class="group-icon">🔥</text>
              <text class="group-title">正在拼团</text>
            </view>
            <text class="group-hint">可直接参加</text>
          </view>
          <view v-for="ag in activeGroups.slice(0, 3)" :key="ag.groupNo || ag.id" class="active-group-item">
            <view class="ag-left">
              <view class="ag-avatar">
                <image v-if="ag.leaderAvatar" :src="ag.leaderAvatar" mode="aspectFill" class="ag-avatar-img" />
                <text v-else class="ag-avatar-placeholder">👤</text>
              </view>
              <view class="ag-info">
                <text class="ag-name">{{ ag.leaderNickname || '团长' }}</text>
                <text class="ag-meta">还差{{ ag.remainSlots || (ag.groupSize - ag.currentCount) }}人成团</text>
              </view>
            </view>
            <view class="ag-right">
              <view class="ag-btn" @tap="joinGroup(ag.groupNo)">去参团</view>
            </view>
          </view>
        </view>

        <!-- 商品详情 -->
        <view class="desc-card">
          <text class="desc-title">📋 商品详情</text>
          <rich-text :nodes="product.description || '暂无详情'" />
        </view>

        <!-- 规格参数 -->
        <view class="specs-card" v-if="product.specs?.length">
          <text class="desc-title">📦 规格参数</text>
          <view class="specs-list">
            <view class="spec-row" v-for="(spec, idx) in product.specs" :key="idx">
              <text class="spec-label">{{ spec.label }}</text>
              <text class="spec-value">{{ spec.value }}</text>
            </view>
          </view>
        </view>

        <view style="height: 180rpx;" />
      </scroll-view>

      <!-- 底部固定栏 -->
      <view class="bottom-bar">
        <view class="bottom-left">
          <view class="bottom-action" @tap="contactService">
            <text class="action-icon">💬</text>
            <text class="action-label">客服</text>
          </view>
          <view class="bottom-action" @tap="shareProduct">
            <text class="action-icon">📤</text>
            <text class="action-label">分享</text>
          </view>
        </view>
        <view class="bottom-right">
          <view class="bottom-price">
            <text class="bp-current">¥{{ product.price }}</text>
            <text v-if="product.originalPrice" class="bp-original">¥{{ product.originalPrice }}</text>
          </view>
          <button class="cart-btn" @tap="addToCart">加入购物车</button>
          <button class="buy-btn" @tap="buyNow">立即购买</button>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>

.detail-page {
  min-height: 100vh;
  background: $bg;
  position: relative;
}

.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 300rpx;
  color: $text-light;
  font-size: 26rpx;
  gap: 16rpx;
}

.loading-spinner {
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid $border;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.detail-scroll {
  height: 100vh;
}

/* Gallery */
.gallery-wrap {
  position: relative;
}
.gallery-swiper {
  height: 600rpx;
}
.gallery-img {
  width: 100%;
  height: 100%;
}
.gallery-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $primary-light, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;

  .gallery-emoji {
    font-size: 120rpx;
  }
}
.gallery-indicator {
  position: absolute;
  bottom: 24rpx;
  right: 24rpx;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}
.gallery-back {
  position: fixed;
  top: calc(var(--status-bar-height, 44px) + 16rpx);
  left: 24rpx;
  width: 64rpx;
  height: 64rpx;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.back-arrow {
  width: 18rpx;
  height: 18rpx;
  border-left: 4rpx solid #fff;
  border-bottom: 4rpx solid #fff;
  transform: rotate(45deg);
  margin-left: 8rpx;
}
.gallery-share {
  position: fixed;
  top: calc(var(--status-bar-height, 44px) + 16rpx);
  right: 24rpx;
  width: 64rpx;
  height: 64rpx;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-size: 28rpx;
}

/* Info Card */
.info-card {
  margin-top: -40rpx;
  position: relative;
  z-index: 1;
  background: $card-bg;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.price-current {
  font-weight: 800;
  color: $accent;
  font-size: 52rpx;
  line-height: 1;
}
.price-symbol {
  font-size: 28rpx;
}
.price-original {
  font-size: 26rpx;
  color: $text-light;
  text-decoration: line-through;
}
.product-tag {
  font-size: 20rpx;
  background: $primary-light;
  color: $primary;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-weight: 500;
}
.product-name {
  font-size: 34rpx;
  font-weight: 700;
  color: $text;
  display: block;
  line-height: 1.4;
  margin-bottom: 10rpx;
}
.product-sold {
  font-size: 24rpx;
  color: $text-light;
}
.source-badge-row {
  margin-top: 16rpx;
}
.source-badge {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: #fff;
}
.official-badge {
  background: #3b82f6;
}
.merchant-badge {
  background: #f59e0b;
}

/* Group Buy */
.group-card {
  background: $card-bg;
  margin-top: 16rpx;
  padding: 32rpx;
}
.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.group-header-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.group-icon { font-size: 32rpx; }
.group-title { font-size: 30rpx; font-weight: 700; color: $text; }
.group-hint { font-size: 22rpx; color: $text-secondary; }

.group-spec-section {
  margin-bottom: 24rpx;
}
.group-spec-label {
  font-size: 26rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 16rpx;
}
.group-spec-chips {
  display: flex;
  gap: 16rpx;
}
.group-spec-chip {
  flex: 1;
  background: $bg;
  border: 2rpx solid $border;
  border-radius: $radius;
  padding: 16rpx 12rpx;
  text-align: center;
  transition: all 0.2s;

  &.active {
    border-color: $primary;
    background: $primary-light;
  }

  .chip-size {
    font-size: 26rpx;
    font-weight: 600;
    color: $text;
    display: block;
  }
  .chip-discount {
    font-size: 20rpx;
    color: $primary;
    margin-top: 4rpx;
    display: block;
  }
}

/* 折扣表 */
.group-discount-table {
  background: $bg;
  border-radius: $radius;
  overflow: hidden;
  margin-bottom: 24rpx;
}
.gdt-row {
  display: flex;
  padding: 16rpx 20rpx;
  font-size: 24rpx;
  border-bottom: 1rpx solid $border;

  &:last-child { border-bottom: none; }

  &.gdt-header {
    background: rgba(249, 115, 22, 0.06);
    font-weight: 600;
    color: $text-secondary;
  }
  &.highlight {
    background: $primary-light;
  }
}
.gdt-cell {
  flex: 1;
  text-align: center;
  color: $text;
}
.price-cell {
  color: $primary;
  font-weight: 600;
}
.discount-cell {
  color: $primary;
}
.gdt-btn {
  display: inline-block;
  background: $bg;
  color: $primary;
  padding: 6rpx 20rpx;
  border-radius: 16rpx;
  font-size: 22rpx;
  border: 2rpx solid $primary;

  &.active {
    background: $primary;
    color: #fff;
  }
}

.group-initiate-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff;
  border-radius: $radius;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(249, 115, 22, 0.25);

  &::after { border: none; }
}

/* Description */
.desc-card, .specs-card {
  background: $card-bg;
  margin-top: 16rpx;
  padding: 32rpx;
}
.desc-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  display: block;
  margin-bottom: 20rpx;
}

.specs-list {
  .spec-row {
    display: flex;
    padding: 14rpx 0;
    border-bottom: 1rpx solid $border;

    &:last-child { border-bottom: none; }
  }
  .spec-label {
    width: 200rpx;
    font-size: 24rpx;
    color: $text-secondary;
    flex-shrink: 0;
  }
  .spec-value {
    flex: 1;
    font-size: 24rpx;
    color: $text;
  }
}

/* Bottom Bar */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $card-bg;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid $border;
  z-index: 100;
  gap: 20rpx;
}
.bottom-left {
  display: flex;
  gap: 24rpx;
}
.bottom-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;

  .action-icon { font-size: 36rpx; }
  .action-label { font-size: 20rpx; color: $text-secondary; }
}
.bottom-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.bottom-price {
  flex: 1;
  text-align: right;
  padding-right: 8rpx;
}
.bp-current {
  color: $accent;
  font-weight: 800;
  font-size: 36rpx;
}
.bp-original {
  font-size: 22rpx;
  color: $text-light;
  text-decoration: line-through;
  margin-left: 8rpx;
}
.cart-btn {
  background: $accent;
  color: #fff;
  font-size: 26rpx;
  padding: 18rpx 28rpx;
  border-radius: $radius;
  border: none;
  font-weight: 500;
  white-space: nowrap;

  &::after { border: none; }
}
.buy-btn {
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff;
  font-size: 26rpx;
  padding: 18rpx 28rpx;
  border-radius: $radius;
  border: none;
  font-weight: 500;
  white-space: nowrap;

  &::after { border: none; }
}

/* Active Groups */
.active-groups-card {
  background: $card-bg;
  margin-top: 16rpx;
  padding: 32rpx;
}
.active-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border;

  &:last-child { border-bottom: none; }
}
.ag-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.ag-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  overflow: hidden;
  background: $bg;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ag-avatar-img {
  width: 100%;
  height: 100%;
}
.ag-avatar-placeholder {
  font-size: 32rpx;
}
.ag-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.ag-name {
  font-size: 26rpx;
  font-weight: 600;
  color: $text;
}
.ag-meta {
  font-size: 22rpx;
  color: $text-secondary;
}
.ag-right {
  flex-shrink: 0;
}
.ag-btn {
  background: $primary;
  color: #fff;
  padding: 12rpx 28rpx;
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: 500;
}
</style>
