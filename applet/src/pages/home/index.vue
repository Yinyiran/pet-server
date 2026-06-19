<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"梵优茗宠"}}
</route>

<script setup lang="ts">
import { bannerApi, bundleApi, categoryApi, liveRoomApi, productApi } from '@/api'
import { useCartStore } from '@/store'
import { useUserStore } from '@/store/modules/user'
import { onMounted, onUnmounted, ref } from 'vue'

const cartStore = useCartStore()
const userStore = useUserStore()

/** Banner 轮播 — 每张含独立主题色 */
const bannerList = ref<any[]>([
  {
    tag: '🛒 品质甄选',
    title: '宠物优选商城',
    desc: '零食·主粮·用品，一站式采购爱宠所需',
    btnText: '去逛逛',
    bgColor: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 40%, #ffcc80 100%)',
    tagBg: 'rgba(249, 115, 22, 0.15)',
    tagColor: '#ea580c',
    btnBg: '#f97316',
    icon: '🛍️',
  },
  {
    tag: '🏪 线下体验',
    title: '合作宠物门店',
    desc: '洗澡美容·寄养托管，就近预约服务',
    btnText: '去预约',
    bgColor: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%)',
    tagBg: 'rgba(76, 175, 80, 0.18)',
    tagColor: '#2e7d32',
    btnBg: '#43a047',
    icon: '✂️',
  },
  {
    tag: '🏥 健康守护',
    title: '在线宠物医院',
    desc: '在线问诊·疫苗预约·体检套餐一站搞定',
    btnText: '去预约',
    bgColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 40%, #90caf9 100%)',
    tagBg: 'rgba(30, 136, 229, 0.18)',
    tagColor: '#1565c0',
    btnBg: '#1e88e5',
    icon: '💊',
  },
])
const bannerCurrent = ref(0)
function onBannerChange(e: any) {
  bannerCurrent.value = e.detail.current
}

/** 信息栏 */
const cityName = ref('杭州市')
const localFriends = ref('8,562')
const allFriends = ref('128,936')
const isLive = ref(true) // 设计稿默认显示直播入口

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
  { id: 1, name: '手工零食', icon: '🍪', cat: 'snack' },
  { id: 2, name: '品牌优选', icon: '🏷️', cat: 'brand' },
  { id: 3, name: '服装配饰', icon: '👗', cat: 'clothes' },
  { id: 4, name: '宠物玩具', icon: '🧸', cat: 'toy' },
])

/** 限时特供 */
const flashProducts = ref<any[]>([
  { id: 1, name: '磨牙洁齿棒', price: 19.9, originalPrice: 39.9, image: '' },
  { id: 2, name: '三文鱼冻干', price: 39.9, originalPrice: 59.9, image: '' },
  { id: 3, name: '芝士训练饼干', price: 18.9, originalPrice: 29.9, image: '' },
  { id: 4, name: '牛肉粒零食', price: 32.9, originalPrice: 45.9, image: '' },
])
const flashEmojis = ['🦴', '🐟', '🧀', '🥩']
const countdown = ref({ h: '00', m: '00', s: '00' })

/** 倒计时 */
let countdownTimer: any = null
function startCountdown() {
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
  } else {
    uni.showToast({ title: '商品准备中', icon: 'none' })
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
  } else {
    // 未对接API时也允许加入本地购物车
    cartStore.add({ productId: Date.now(), name: bundleInfo.value.name, image: '', price: bundleInfo.value.price, quantity: 1 })
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
}
function onBannerTap(item: any, idx: number) {
  // 第一张跳商品列表，其他显示提示
  if (idx === 0) {
    goToShop()
  } else if (item.link) {
    uni.navigateTo({ url: item.link })
  } else {
    uni.showToast({ title: idx === 1 ? '查看附近宠物店' : '查看附近宠物医院', icon: 'none' })
  }
}
function openDouyin() {
  uni.showToast({ title: '正在跳转直播间...', icon: 'none' })
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
    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <!-- Banner 轮播 -->
      <view class="banner-section">
        <swiper
          class="banner-swiper"
          autoplay
          circular
          :interval="4000"
          :indicator-dots="false"
          @change="onBannerChange"
        >
          <swiper-item v-for="(item, idx) in bannerList" :key="idx" @tap="onBannerTap(item, idx)">
            <view class="banner-slide" :style="{ background: item.bgColor || 'linear-gradient(135deg, #ff9a56, #f97316)' }">
              <view class="banner-content">
                <view class="banner-tag" :style="{ background: item.tagBg || 'rgba(255,255,255,0.35)', color: item.tagColor || '#3d2c1e' }">
                  {{ item.tag }}
                </view>
                <text class="banner-title">{{ item.title }}</text>
                <text class="banner-desc">{{ item.desc }}</text>
                <view class="banner-btn" :style="{ background: item.btnBg || '#f97316' }">
                  <text>{{ item.btnText || '去逛逛' }}</text>
                  <text class="banner-btn-arrow">›</text>
                </view>
              </view>
              <text class="banner-icon">{{ item.icon || '🛍️' }}</text>
            </view>
          </swiper-item>
        </swiper>
        <!-- 圆点指示器 -->
        <view class="banner-dots">
          <view
            v-for="(_, idx) in bannerList"
            :key="idx"
            class="banner-dot"
            :class="{ active: idx === bannerCurrent }"
          />
        </view>
      </view>

      <!-- 信息栏 -->
      <view class="stats-bar">
        <view class="stats-item" @tap="goToCity">
          <text class="stats-loc-icon">📍</text>
          <text class="stats-city">{{ cityName }}</text>
          <text class="stats-arrow">⌄</text>
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
        <view class="stats-douyin" v-if="isLive" @tap="openDouyin">
          <view class="stats-douyin-icon">
            <text class="douyin-music">♪</text>
          </view>
          <text class="stats-douyin-text">直播中</text>
          <view class="stats-douyin-dot" />
        </view>
      </view>

      <!-- AI定制卡片 -->
      <view class="ai-card" @tap="goToQuiz">
        <view class="ai-card-glow" />
        <view class="ai-card-glow2" />
        <view class="ai-card-title">AI 专属定制</view>
        <view class="ai-card-subtitle">填写宠物基础信息，AI智能分析爱宠特征，精准推荐最适合的营养配餐方案</view>
        <view class="ai-card-cta">
          <text>开始定制</text>
          <text class="ai-card-cta-arrow">›</text>
        </view>
        <text class="ai-card-decor">🤖</text>
      </view>

      <!-- 零食全家桶 -->
      <view class="section-header">
        <view class="section-title-group">
          <view class="section-icon">🎁</view>
          <text class="section-title">零食全家桶</text>
        </view>
      </view>
      <view class="family-bucket" @tap="goToBundle">
        <view class="family-bucket-imgs" v-if="bundleInfo?.images?.length">
          <text v-for="(emoji, idx) in bundleInfo.images.slice(0, 4)" :key="idx" class="family-bucket-imgs-item">{{ emoji }}</text>
        </view>
        <view class="family-bucket-info">
          <text class="family-bucket-name">{{ bundleInfo?.name }}</text>
          <text class="family-bucket-desc">{{ bundleInfo?.desc }}</text>
          <view class="family-bucket-right">
            <view class="family-bucket-price">
              <text class="unit">¥</text>
              <text class="price-num">{{ bundleInfo?.price }}</text>
              <text class="orig">¥{{ bundleInfo?.originalPrice }}</text>
            </view>
            <view class="family-bucket-btn" @tap.stop="addBundleToCart">
              <text class="cart-icon">🛒</text>
              <text>立即选购</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 商品分类 -->
      <view class="section-header">
        <view class="section-title-group">
          <view class="section-icon">🛍️</view>
          <text class="section-title">商品专区</text>
        </view>
      </view>
      <view class="shop-cat-tabs">
        <view
          class="shop-cat-tab"
          v-for="cat in categoryTabs"
          :key="cat.id"
          @tap="goToShop(cat.cat || cat.name)"
        >
          <view class="shop-cat-tab-icon">{{ cat.icon || '📦' }}</view>
          <text class="shop-cat-tab-name">{{ cat.name }}</text>
        </view>
      </view>

      <!-- 限时特供 -->
      <view class="section-header">
        <view class="section-title-group">
          <view class="section-icon">⚡</view>
          <text class="section-title">限时特供</text>
        </view>
        <view class="countdown">
          <text class="countdown-item">{{ countdown.h }}</text>
          <text class="countdown-sep">:</text>
          <text class="countdown-item">{{ countdown.m }}</text>
          <text class="countdown-sep">:</text>
          <text class="countdown-item">{{ countdown.s }}</text>
        </view>
      </view>
      <scroll-view scroll-x class="flash-sale-items" :show-scrollbar="false">
        <view
          class="flash-item"
          v-for="(item, idx) in flashProducts"
          :key="item.id"
          @tap="goToProductDetail(item.id)"
        >
          <view class="flash-item-img">
            <image v-if="item.image" class="flash-img" :src="item.image" mode="aspectFill" />
            <text v-else class="flash-emoji">{{ flashEmojis[idx] || '📦' }}</text>
          </view>
          <text class="flash-item-name">{{ item.name }}</text>
          <view class="flash-item-price">
            <text class="flash-price-current">¥{{ item.price }}</text>
            <text class="flash-price-original">¥{{ item.originalPrice }}</text>
          </view>
        </view>
      </scroll-view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

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

/* ===== Banner ===== */
.banner-section {
  padding: 20rpx 24rpx 0;
  position: relative;
}
.banner-swiper {
  height: 340rpx;
  border-radius: $radius-lg;
  overflow: hidden;
}
.banner-slide {
  height: 100%;
  border-radius: $radius-lg;
  padding: 40rpx 36rpx;
  position: relative;
  overflow: hidden;
}
.banner-content {
  position: relative;
  z-index: 1;
  max-width: 60%;
}
.banner-tag {
  display: inline-flex;
  align-items: center;
  font-size: 20rpx;
  font-weight: 700;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
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
  margin-bottom: 20rpx;
  display: block;
}
.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
  padding: 10rpx 28rpx;
  border-radius: 28rpx;

  &:active {
    transform: scale(0.96);
  }
}
.banner-btn-arrow {
  font-size: 28rpx;
}
.banner-icon {
  position: absolute;
  right: 28rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 136rpx;
  opacity: 0.65;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.08));
  pointer-events: none;
}
.banner-dots {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  padding: 16rpx 0 8rpx;
}
.banner-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background: #d4c8b8;
  transition: all 0.3s ease;

  &.active {
    width: 36rpx;
    background: $primary;
  }
}

/* ===== 信息栏 ===== */
.stats-bar {
  display: flex;
  align-items: center;
  background: $card-bg;
  border-radius: $radius;
  margin: 12rpx 24rpx 16rpx;
  padding: 20rpx 12rpx;
  box-shadow: $shadow-sm;
  gap: 4rpx;
}
.stats-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 12rpx;
  border-radius: $radius-sm;

  &:active {
    background: #f5f1ec;
  }
}
.stats-loc-icon {
  font-size: 24rpx;
  color: $primary;
}
.stats-city {
  color: $text;
  font-size: 24rpx;
  font-weight: 700;
}
.stats-arrow {
  color: $text-light;
  font-size: 24rpx;
}
.stats-divider {
  width: 2rpx;
  height: 40rpx;
  background: $border;
  flex-shrink: 0;
}
.stats-friends {
  flex: 1;
  justify-content: center;
  gap: 4rpx;
  min-width: 0;

  &:active {
    background: transparent;
  }
}
.stats-friends-label {
  font-size: 20rpx;
  color: $text-light;
  white-space: nowrap;
}
.stats-friends-num {
  font-size: 24rpx;
  font-weight: 800;
  color: $accent;
}
.stats-friends-sep {
  font-size: 20rpx;
  color: $border;
  margin: 0 4rpx;
}

/* 抖音直播入口 */
.stats-douyin {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10rpx;
  background: linear-gradient(135deg, #ff0050 0%, #ff2d6d 100%);
  padding: 10rpx 20rpx 10rpx 12rpx;
  border-radius: 28rpx;
  color: #fff;

  &:active {
    background: linear-gradient(135deg, #e00046 0%, #e62860 100%);
  }
}
.stats-douyin-icon {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.douyin-music {
  font-size: 28rpx;
  color: #fff;
}
.stats-douyin-text {
  font-size: 22rpx;
  font-weight: 700;
  white-space: nowrap;
}
.stats-douyin-dot {
  width: 12rpx;
  height: 12rpx;
  background: #fff;
  border-radius: 50%;
  animation: pulse-dot 1.5s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

/* ===== AI 卡片 ===== */
.ai-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  margin: 24rpx 24rpx;
  padding: 40rpx 32rpx;
  border-radius: $radius-lg;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;

  &:active {
    transform: translateY(-4rpx);
    box-shadow: 0 16rpx 48rpx rgba(15, 52, 96, 0.3);
  }
}
.ai-card-glow {
  position: absolute;
  top: -80rpx;
  right: -60rpx;
  width: 240rpx;
  height: 240rpx;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.ai-card-glow2 {
  position: absolute;
  bottom: -60rpx;
  left: -40rpx;
  width: 160rpx;
  height: 160rpx;
  background: radial-gradient(circle, rgba(180, 130, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.ai-card-title {
  font-size: 44rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.3;
  position: relative;
  z-index: 1;
  margin-bottom: 12rpx;
}
.ai-card-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
  margin-bottom: 28rpx;
  line-height: 1.5;
  max-width: 75%;
}
.ai-card-cta {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
  padding: 16rpx 36rpx;
  border-radius: 40rpx;
  position: relative;
  z-index: 1;
}
.ai-card-cta-arrow {
  font-size: 30rpx;
}
.ai-card-decor {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 112rpx;
  opacity: 0.3;
  z-index: 0;
  filter: blur(2rpx);
}

/* ===== Section 通用 ===== */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx 20rpx;
}
.section-title-group {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.section-icon {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, $accent, $primary);
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text;
}

/* ===== 零食全家桶 ===== */
.family-bucket {
  margin: 0 24rpx 24rpx;
  background: linear-gradient(135deg, #fff8e7 0%, #fff3d6 50%, #ffedc8 100%);
  border-radius: $radius-lg;
  padding: 28rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: $shadow-sm;

  &:active {
    transform: translateY(-2rpx);
    box-shadow: $shadow-md;
  }
}
.family-bucket-imgs {
  width: 140rpx;
  height: 160rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  flex-shrink: 0;
  background: linear-gradient(135deg, #ffe0a0, #ffc870);
  border-radius: $radius;
  padding: 12rpx;
}
.family-bucket-imgs-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}
.family-bucket-info {
  flex: 1;
  min-width: 0;
}
.family-bucket-name {
  font-size: 32rpx;
  font-weight: 700;
  color: $text;
  margin-bottom: 8rpx;
  display: block;
}
.family-bucket-desc {
  font-size: 22rpx;
  color: $text-secondary;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.family-bucket-right {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12rpx;
}
.family-bucket-price {
  font-size: 36rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  color: $accent;

  .unit {
    font-size: 24rpx;
    font-weight: 600;
  }
  .orig {
    font-size: 20rpx;
    color: $text-light;
    margin-left: 16rpx;
    text-decoration: line-through;
    font-weight: 400;
  }
}
.family-bucket-btn {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  background: $accent;
  color: #fff;
  padding: 12rpx 28rpx;
  border-radius: 32rpx;
  font-size: 24rpx;
  font-weight: 600;
  white-space: nowrap;

  &:active {
    background: #e55a2a;
  }
}
.cart-icon {
  font-size: 24rpx;
}

/* ===== 商品分类 Tab ===== */
.shop-cat-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin: 0 24rpx 16rpx;
}
.shop-cat-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx 0;
  background: $card-bg;
  border-radius: $radius;
  box-shadow: $shadow-sm;
  border: 4rpx solid transparent;
  transition: all 0.2s;

  &:active {
    transform: scale(0.96);
    border-color: $primary-light;
  }
}
.shop-cat-tab-icon {
  font-size: 48rpx;
}
.shop-cat-tab-name {
  font-size: 24rpx;
  color: $text-secondary;
  white-space: nowrap;
}

/* ===== 倒计时 ===== */
.countdown {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $accent;
}
.countdown-item {
  background: $accent;
  color: #fff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 700;
  min-width: 48rpx;
  text-align: center;
}
.countdown-sep {
  color: $accent;
  font-weight: 700;
}

/* ===== 限时特供 ===== */
.flash-sale-items {
  display: flex;
  gap: 16rpx;
  padding: 0 24rpx 8rpx;
  white-space: nowrap;
}
.flash-item {
  flex: 0 0 calc(33.333% - 12rpx);
  background: $card-bg;
  border-radius: $radius;
  padding: 20rpx;
  text-align: center;
  box-shadow: $shadow-sm;
  display: inline-block;

  &:active {
    transform: scale(0.97);
  }
}
.flash-item-img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  overflow: hidden;
}
.flash-img {
  width: 100%;
  height: 100%;
}
.flash-emoji {
  font-size: 80rpx;
}
.flash-item-name {
  font-size: 24rpx;
  font-weight: 600;
  color: $text;
  margin-bottom: 8rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flash-item-price {
  font-size: 28rpx;
  font-weight: 700;
  color: $accent;
}
.flash-price-current {
  font-size: 28rpx;
  font-weight: 700;
  color: $accent;
}
.flash-price-original {
  font-size: 20rpx;
  color: $text-light;
  text-decoration: line-through;
  margin-left: 8rpx;
  font-weight: 400;
}
</style>
