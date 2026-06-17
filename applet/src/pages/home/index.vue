<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"梵优茗宠"}}
</route>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { bannerApi, bundleApi, categoryApi, productApi, liveRoomApi } from '@/api'
import { useCartStore } from '@/store'
import { useUserStore } from '@/store/modules/user'

const cartStore = useCartStore()
const userStore = useUserStore()

/** Banner 轮播 */
const bannerList = ref<any[]>([
  { tag: '🛒 品质甄选', title: '宠物优选商城', desc: '零食·主粮·用品，一站式采购爱宠所需', bgColor: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 40%, #ffcc80 100%)', icon: '🛍️' },
  { tag: '🏪 线下体验', title: '合作宠物门店', desc: '洗澡美容·寄养托管，就近预约服务', bgColor: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%)', icon: '✂️' },
  { tag: '🏥 健康守护', title: '在线宠物医院', desc: '在线问诊·疫苗预约·体检套餐一站搞定', bgColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 40%, #90caf9 100%)', icon: '💊' },
])
const bannerCurrent = ref(0)
function onBannerChange(e: any) {
  bannerCurrent.value = e.detail.current
}

/** 信息栏 */
const cityName = ref('杭州市')
const localFriends = ref('8,562')
const allFriends = ref('128,936')
const isLive = ref(false)

/** 零食全家桶 */
const bundleInfo = ref<any>({
  id: 0,
  name: '超值零食全家桶（8款豪礼）',
  desc: '精选磨牙棒、冻干肉、牛肉粒、芝士饼干、牛骨、鸡肝、蔬菜圈等8大爆款，一次满足爱宠所有口味。优质天然食材，低盐低脂配方，营养全面均衡，好吃更健康',
  price: 80,
  originalPrice: 168,
  images: ['🍖', '🐟', '🧀', '🥩', '🍗', '🦴', '🐔', '🥕'],
})

/** 商品分类 tabs */
const categoryTabs = ref<any[]>([
  { id: 1, name: '手工零食', icon: '🍪' },
  { id: 2, name: '品牌优选', icon: '🏷️' },
  { id: 3, name: '服装配饰', icon: '👗' },
  { id: 4, name: '宠物玩具', icon: '🧸' },
])

/** 限时特供 */
const flashProducts = ref<any[]>([
  { id: 1, name: '磨牙洁齿棒', price: 19.9, originalPrice: 39.9, image: '' },
  { id: 2, name: '三文鱼冻干', price: 39.9, originalPrice: 59.9, image: '' },
  { id: 3, name: '芝士训练饼干', price: 18.9, originalPrice: 29.9, image: '' },
  { id: 4, name: '牛肉粒零食', price: 32.9, originalPrice: 45.9, image: '' },
])
const flashEmojis = ['🦴', '🐟', '🧀', '🥩']
const countdown = ref({ h: '08', m: '00', s: '00' })

/** 倒计时 */
let countdownTimer: any = null
function startCountdown() {
  // 计算到今天结束的秒数
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  let total = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000))
  const update = () => {
    if (total <= 0) return
    total--
    countdown.value = {
      h: Math.floor(total / 3600).toString().padStart(2, '0'),
      m: Math.floor((total % 3600) / 60).toString().padStart(2, '0'),
      s: (total % 60).toString().padStart(2, '0'),
    }
  }
  update()
  countdownTimer = setInterval(update, 1000)
}

/** 初始化加载 */
onMounted(async () => {
  try {
    const [banners, bundles, categories, flash, liveRooms] = await Promise.allSettled([
      bannerApi.getActive(),
      bundleApi.getList(),
      categoryApi.getTree(),
      productApi.getFlash(),
      liveRoomApi.getList(),
    ])
    if (banners.status === 'fulfilled' && banners.value?.length) bannerList.value = banners.value
    if (bundles.status === 'fulfilled' && bundles.value?.length) {
      bundleInfo.value = { ...bundleInfo.value, ...bundles.value[0] }
    }
    if (categories.status === 'fulfilled' && categories.value?.length) categoryTabs.value = categories.value
    if (flash.status === 'fulfilled' && flash.value?.length) flashProducts.value = flash.value
    if (liveRooms.status === 'fulfilled' && liveRooms.value?.length) isLive.value = true
  } catch (e) {
    console.error('Home load error:', e)
  }
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

/** 导航 */
function goToShop(category?: string) {
  const url = category ? `/pages/shop/index?category=${category}` : '/pages/shop/index'
  uni.navigateTo({ url })
}
function goToQuiz() {
  uni.navigateTo({ url: '/pages/quiz/index' })
}
function goToProductDetail(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
function goToCity() {
  uni.switchTab({ url: '/pages/city/index' })
}
function goToBundle() {
  if (bundleInfo.value?.id) {
    uni.navigateTo({ url: `/pages/product/detail?id=${bundleInfo.value.id}&type=bundle` })
  }
}
function addBundleToCart() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  if (bundleInfo.value?.id) {
    cartStore.add({ productId: bundleInfo.value.id, name: bundleInfo.value.name, image: '', price: bundleInfo.value.price, quantity: 1 })
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
}
function onBannerTap(item: any) {
  if (item.link) {
    uni.navigateTo({ url: item.link })
  }
}
</script>

<template>
  <view class="page-container">
    <!-- Header -->
    <view class="header">
      <view class="header-inner">
        <view class="brand-title">
          <view class="brand-icon">🐾</view>
          <text>梵优茗宠</text>
        </view>
      </view>
    </view>

    <!-- 主内容滚动 -->
    <scroll-view scroll-y class="scroll-content">
      <!-- Banner 轮播 -->
      <view class="banner-section">
        <swiper class="banner-swiper" autoplay circular indicator-dots=false @change="onBannerChange">
          <swiper-item v-for="(item, idx) in bannerList" :key="idx" @tap="onBannerTap(item)">
            <view class="banner-slide" :style="{ background: item.bgColor || 'linear-gradient(135deg, #ff9a56, #f97316)' }">
              <view class="banner-content">
                <text class="banner-tag">{{ item.tag }}</text>
                <text class="banner-title">{{ item.title }}</text>
                <text class="banner-desc">{{ item.desc }}</text>
                <view class="banner-btn">
                  去逛逛
                  <text class="arrow">›</text>
                </view>
              </view>
              <text class="banner-icon">{{ item.icon || '🛍️' }}</text>
            </view>
          </swiper-item>
        </swiper>
        <!-- 圆点指示器 -->
        <view class="banner-dots">
          <view v-for="(_, idx) in bannerList" :key="idx" class="banner-dot" :class="{ active: idx === bannerCurrent }" />
        </view>
      </view>

      <!-- 信息栏 -->
      <view class="stats-bar">
        <view class="stats-item" @tap="goToCity">
          <text class="stats-loc-icon">📍</text>
          <text class="stats-city">{{ cityName }}</text>
          <text class="stats-arrow">›</text>
        </view>
        <view class="stats-divider" />
        <view class="stats-item stats-friends">
          <text class="stats-friends-label">同城萌友</text>
          <text class="stats-friends-num">{{ localFriends }}</text>
          <text class="stats-friends-sep">|</text>
          <text class="stats-friends-label">全国萌友</text>
          <text class="stats-friends-num">{{ allFriends }}</text>
        </view>
        <view class="stats-divider" />
        <view class="stats-item stats-live" v-if="isLive">
          <view class="live-dot" />
          <text class="live-text">直播中</text>
        </view>
      </view>

      <!-- AI定制卡片 -->
      <view class="ai-card" @tap="goToQuiz">
        <view class="ai-card-glow" />
        <view class="ai-card-title">AI 专属定制</view>
        <view class="ai-card-subtitle">填写宠物基础信息，AI智能分析爱宠特征，精准推荐最适合的营养配餐方案</view>
        <view class="ai-card-cta">
          开始定制
          <text class="arrow">›</text>
        </view>
        <text class="ai-card-decor">🤖</text>
      </view>

      <!-- 零食全家桶 -->
      <view class="section-header">
        <view class="section-title-group">
          <text class="section-icon">🎁</text>
          <text class="section-title">零食全家桶</text>
        </view>
      </view>
      <view class="bundle-card" @tap="goToBundle">
        <view class="bundle-imgs" v-if="bundleInfo?.images?.length">
          <text v-for="(emoji, idx) in bundleInfo.images.slice(0, 8)" :key="idx" class="bundle-emoji">{{ emoji }}</text>
        </view>
        <view class="bundle-info">
          <text class="bundle-name">{{ bundleInfo?.name }}</text>
          <text class="bundle-desc">{{ bundleInfo?.desc }}</text>
          <view class="bundle-bottom">
            <view class="bundle-price">
              <text class="price-unit">¥</text>
              <text class="price-int">{{ bundleInfo?.price }}</text>
              <text class="price-original">¥{{ bundleInfo?.originalPrice }}</text>
            </view>
            <view class="btn-primary bundle-btn" @tap.stop="addBundleToCart">
              <text>🛒</text>
              <text>立即选购</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 商品分类 -->
      <view class="section-header">
        <view class="section-title-group">
          <text class="section-icon">🛍️</text>
          <text class="section-title">商品专区</text>
        </view>
      </view>
      <view class="shop-cat-tabs">
        <view class="shop-cat-tab" v-for="cat in categoryTabs" :key="cat.id" @tap="goToShop(cat.name)">
          <text class="shop-cat-icon">{{ cat.icon || '📦' }}</text>
          <text class="shop-cat-name">{{ cat.name }}</text>
        </view>
      </view>

      <!-- 限时特供 -->
      <view class="section-header">
        <view class="section-title-group">
          <text class="section-icon">⚡</text>
          <text class="section-title">限时特供</text>
        </view>
        <view class="countdown">
          <text class="cd-item">{{ countdown.h }}</text>
          <text class="cd-sep">:</text>
          <text class="cd-item">{{ countdown.m }}</text>
          <text class="cd-sep">:</text>
          <text class="cd-item">{{ countdown.s }}</text>
        </view>
      </view>
      <view class="flash-scroll">
        <view class="flash-item" v-for="(item, idx) in flashProducts" :key="item.id" @tap="goToProductDetail(item.id)">
          <view class="flash-img-wrap">
            <image v-if="item.image" class="flash-img" :src="item.image" mode="aspectFill" />
            <text v-else class="flash-emoji">{{ flashEmojis[idx] || '📦' }}</text>
          </view>
          <text class="flash-name">{{ item.name }}</text>
          <view class="flash-price">
            <text class="flash-price-current">¥{{ item.price }}</text>
            <text class="flash-price-original">¥{{ item.originalPrice }}</text>
          </view>
        </view>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

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
  justify-content: center;
}
.brand-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $text;
  display: flex;
  align-items: center;
  gap: 12rpx;
  letter-spacing: 2rpx;
}
.brand-icon {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, $primary, $accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}

/* 内容滚动区域 */
.scroll-content {
  flex: 1;
}

/* Banner */
.banner-section {
  padding: 20rpx 24rpx 0;
  position: relative;
}
.banner-swiper {
  height: 280rpx;
  border-radius: $radius-lg;
  overflow: hidden;
}
.banner-slide {
  height: 100%;
  border-radius: $radius-lg;
  padding: 36rpx 32rpx;
  position: relative;
  overflow: hidden;
}
.banner-content {
  position: relative;
  z-index: 1;
  max-width: 65%;
}
.banner-tag {
  font-size: 20rpx;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.35);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  color: #3d2c1e;
  display: inline-block;
  margin-bottom: 12rpx;
}
.banner-title {
  font-size: 38rpx;
  font-weight: 800;
  color: $text;
  display: block;
  line-height: 1.3;
  margin-bottom: 8rpx;
}
.banner-desc {
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: block;
}
.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $primary;
  background: rgba(255, 255, 255, 0.7);
  padding: 10rpx 24rpx;
  border-radius: 24rpx;

  .arrow {
    font-size: 28rpx;
  }
}
.banner-icon {
  position: absolute;
  right: 28rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 120rpx;
  opacity: 0.8;
}
.banner-dots {
  display: flex;
  justify-content: center;
  gap: 10rpx;
  margin-top: 16rpx;
}
.banner-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #d4c8bc;
  transition: all 0.3s;

  &.active {
    width: 32rpx;
    border-radius: 6rpx;
    background: $primary;
  }
}

/* 信息栏 */
.stats-bar {
  display: flex;
  align-items: center;
  background: $card-bg;
  margin: 16rpx 24rpx;
  padding: 18rpx 24rpx;
  border-radius: $radius;
  box-shadow: $shadow-sm;
  font-size: 24rpx;
  gap: 16rpx;
}
.stats-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.stats-loc-icon {
  font-size: 24rpx;
}
.stats-city {
  color: $text;
  font-weight: 500;
}
.stats-arrow {
  color: $text-secondary;
  font-size: 24rpx;
}
.stats-divider {
  width: 2rpx;
  height: 28rpx;
  background: $border;
}
.stats-friends {
  flex: 1;
  gap: 8rpx;
  font-size: 22rpx;
}
.stats-friends-label {
  color: $text-secondary;
}
.stats-friends-num {
  color: $text;
  font-weight: 600;
}
.stats-friends-sep {
  color: $border;
  margin: 0 4rpx;
}
.stats-live {
  gap: 8rpx;
}
.live-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #e05555;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.live-text {
  color: #e05555;
  font-size: 22rpx;
  font-weight: 600;
}

/* AI 卡片 */
.ai-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  margin: 16rpx 24rpx;
  padding: 36rpx 32rpx;
  border-radius: $radius-lg;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.25);
}
.ai-card-glow {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  top: -60rpx;
  right: -40rpx;
  border-radius: 50%;
}
.ai-card-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12rpx;
}
.ai-card-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 24rpx;
  max-width: 75%;
}
.ai-card-cta {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 14rpx 32rpx;
  border-radius: $radius;
  font-size: 26rpx;
  font-weight: 600;
  backdrop-filter: blur(4px);

  .arrow {
    font-size: 30rpx;
  }
}
.ai-card-decor {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  font-size: 64rpx;
}

/* Section 通用 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx 16rpx;
}
.section-title-group {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.section-icon {
  font-size: 32rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text;
}

/* 零食全家桶 */
.bundle-card {
  background: $card-bg;
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}
.bundle-imgs {
  display: flex;
  gap: 8rpx;
  margin-bottom: 16rpx;
  flex-wrap: wrap;
}
.bundle-emoji {
  font-size: 40rpx;
  background: $primary-light;
  width: 60rpx;
  height: 60rpx;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bundle-info {
  flex: 1;
}
.bundle-name {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  margin-bottom: 8rpx;
}
.bundle-desc {
  font-size: 24rpx;
  color: $text-secondary;
  margin-bottom: 16rpx;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.bundle-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bundle-price {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}
.price-unit {
  font-size: 24rpx;
  font-weight: 700;
  color: $primary;
}
.price-int {
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
  line-height: 1;
}
.price-original {
  font-size: 22rpx;
  color: $text-light;
  text-decoration: line-through;
  margin-left: 8rpx;
}
.bundle-btn {
  font-size: 24rpx;
  padding: 14rpx 28rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

/* 商品分类 Tab */
.shop-cat-tabs {
  display: flex;
  padding: 0 24rpx;
  gap: 16rpx;
  overflow-x: auto;
}
.shop-cat-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $card-bg;
  padding: 24rpx 28rpx;
  border-radius: $radius;
  min-width: 150rpx;
  box-shadow: $shadow-sm;
  transition: all 0.2s;

  &:active {
    transform: scale(0.96);
    background: $primary-light;
  }
}
.shop-cat-icon {
  font-size: 44rpx;
  margin-bottom: 10rpx;
}
.shop-cat-name {
  font-size: 24rpx;
  color: $text-secondary;
  white-space: nowrap;
}

/* 倒计时 */
.countdown {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.cd-item {
  background: $text;
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  min-width: 44rpx;
  text-align: center;
}
.cd-sep {
  color: $text;
  font-weight: 700;
  font-size: 24rpx;
}

/* 限时特供横向滚动 */
.flash-scroll {
  display: flex;
  padding: 0 24rpx;
  gap: 16rpx;
  overflow-x: auto;
}
.flash-item {
  background: $card-bg;
  border-radius: $radius;
  padding: 16rpx;
  min-width: 200rpx;
  width: 200rpx;
  box-shadow: $shadow-sm;
  flex-shrink: 0;

  &:active {
    transform: scale(0.97);
  }
}
.flash-img-wrap {
  width: 168rpx;
  height: 168rpx;
  border-radius: $radius-sm;
  margin-bottom: 12rpx;
  background: $primary-light;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.flash-img {
  width: 100%;
  height: 100%;
}
.flash-emoji {
  font-size: 64rpx;
}
.flash-name {
  font-size: 24rpx;
  color: $text;
  margin-bottom: 8rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flash-price {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}
.flash-price-current {
  font-size: 28rpx;
  font-weight: 700;
  color: $primary;
}
.flash-price-original {
  font-size: 20rpx;
  color: $text-light;
  text-decoration: line-through;
}
</style>
