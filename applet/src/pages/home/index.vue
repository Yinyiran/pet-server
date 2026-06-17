<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bannerApi, bundleApi, categoryApi, productApi } from '@/api'
import { useCartStore } from '@/store'

const cartStore = useCartStore()

/** Banner 轮播 */
const bannerList = ref<any[]>([])
const bannerCurrent = ref(0)
function onBannerChange(e: any) {
  bannerCurrent.value = e.detail.current
}

/** 零食全家桶 */
const bundleInfo = ref<any>(null)

/** 商品分类 tabs */
const categoryTabs = ref<any[]>([])

/** 限时特供 */
const flashProducts = ref<any[]>([])
const countdown = ref({ h: '00', m: '00', s: '00' })

/** 倒计时 */
let countdownTimer: any = null
function startCountdown() {
  let total = 8 * 3600 // 8小时倒计时
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
    const [banners, bundles, categories, flash] = await Promise.allSettled([
      bannerApi.getActive(),
      bundleApi.getList(),
      categoryApi.getTree(),
      productApi.getFlash(),
    ])
    if (banners.status === 'fulfilled') bannerList.value = banners.value || []
    if (bundles.status === 'fulfilled') bundleInfo.value = (bundles.value || [])[0] || null
    if (categories.status === 'fulfilled') categoryTabs.value = categories.value || []
    if (flash.status === 'fulfilled') flashProducts.value = flash.value || []
  } catch (e) {
    console.error('Home load error:', e)
  }
  startCountdown()
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
</script>

<template>
  <view class="page-container">
    <!-- Header -->
    <view class="header">
      <view class="header-inner">
        <view class="brand-title">
          <text class="brand-icon">🐾</text>
          <text>梵优茗宠</text>
        </view>
      </view>
    </view>

    <!-- 主内容滚动 -->
    <scroll-view scroll-y class="scroll-content">
      <!-- Banner 轮播 -->
      <view class="banner-section" v-if="bannerList.length">
        <swiper class="banner-swiper" autoplay circular indicator-dots=false @change="onBannerChange">
          <swiper-item v-for="(item, idx) in bannerList" :key="idx" @tap="goToShop()">
            <view class="banner-slide" :style="{ background: item.bgColor || 'linear-gradient(135deg, #ff9a56, #f97316)' }">
              <view class="banner-content">
                <text class="banner-tag">{{ item.tag || '🛒 品质甄选' }}</text>
                <text class="banner-title">{{ item.title || '宠物优选商城' }}</text>
                <text class="banner-desc">{{ item.desc || '零食·主粮·用品，一站式采购' }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 信息栏 -->
      <view class="stats-bar">
        <view class="stats-item">
          <text class="stats-city">📍 杭州市</text>
        </view>
        <view class="stats-divider" />
        <view class="stats-item stats-friends">
          <text>同城萌友 8,562 | 全国萌友 128,936</text>
        </view>
      </view>

      <!-- AI定制卡片 -->
      <view class="ai-card" @tap="goToQuiz">
        <view class="ai-card-title">AI 专属定制</view>
        <view class="ai-card-subtitle">填写宠物基础信息，AI智能分析，精准推荐营养配餐方案</view>
        <view class="ai-card-cta">开始定制 →</view>
        <text class="ai-card-decor">🤖</text>
      </view>

      <!-- 零食全家桶 -->
      <view class="section-header">
        <text class="section-title">🎁 零食全家桶</text>
      </view>
      <view class="bundle-card" v-if="bundleInfo" @tap="goToProductDetail(bundleInfo.id)">
        <view class="bundle-name">{{ bundleInfo.name || '超值零食全家桶' }}</view>
        <view class="bundle-desc">{{ bundleInfo.desc || '精选8大爆款，一次满足爱宠所有口味' }}</view>
        <view class="bundle-bottom">
          <text class="price-current"><text class="unit">¥</text>{{ bundleInfo.price || 80 }}</text>
          <text class="price-original">¥{{ bundleInfo.originalPrice || 168 }}</text>
          <view class="btn-primary bundle-btn">立即选购</view>
        </view>
      </view>

      <!-- 商品分类 -->
      <view class="section-header">
        <text class="section-title">🛍️ 商品专区</text>
      </view>
      <view class="category-tabs">
        <view class="category-tab" v-for="cat in categoryTabs" :key="cat.id" @tap="goToShop(cat.name)">
          <text class="category-icon">{{ cat.icon || '📦' }}</text>
          <text class="category-name">{{ cat.name }}</text>
        </view>
      </view>

      <!-- 限时特供 -->
      <view class="section-header">
        <text class="section-title">⚡ 限时特供</text>
        <view class="countdown">
          <text class="cd-item">{{ countdown.h }}</text>
          <text class="cd-sep">:</text>
          <text class="cd-item">{{ countdown.m }}</text>
          <text class="cd-sep">:</text>
          <text class="cd-item">{{ countdown.s }}</text>
        </view>
      </view>
      <view class="flash-grid">
        <view class="flash-item" v-for="item in flashProducts" :key="item.id" @tap="goToProductDetail(item.id)">
          <image class="flash-img" :src="item.image || '/static/logo.png'" mode="aspectFill" />
          <text class="flash-name text-ellipsis">{{ item.name }}</text>
          <view class="flash-price">
            <text class="price-current"><text class="unit">¥</text>{{ item.price }}</text>
            <text class="price-original">¥{{ item.originalPrice }}</text>
          </view>
        </view>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.header {
  background: $header-gradient;
  padding: 24rpx 32rpx;
  flex-shrink: 0;
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
}
.brand-icon {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, $primary, $accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.banner-section {
  padding: 20rpx 24rpx 0;
}
.banner-swiper {
  height: 260rpx;
  border-radius: $radius-lg;
  overflow: hidden;
}
.banner-slide {
  height: 100%;
  border-radius: $radius-lg;
  padding: 32rpx;
  display: flex;
  align-items: center;
}
.banner-content {
  flex: 1;
}
.banner-tag {
  font-size: 22rpx;
  background: rgba(255,255,255,0.3);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  color: #fff;
  display: inline-block;
  margin-bottom: 12rpx;
}
.banner-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}
.banner-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.85);
}

.stats-bar {
  display: flex;
  align-items: center;
  background: $card-bg;
  margin: 16rpx 24rpx;
  padding: 16rpx 24rpx;
  border-radius: $radius;
  box-shadow: $shadow-sm;
  font-size: 24rpx;
  color: $text-secondary;
  gap: 16rpx;
}
.stats-divider {
  width: 2rpx;
  height: 28rpx;
  background: $border;
}

.ai-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  margin: 16rpx 24rpx;
  padding: 32rpx;
  border-radius: $radius-lg;
  position: relative;
  overflow: hidden;
}
.ai-card-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12rpx;
}
.ai-card-subtitle {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
  line-height: 1.6;
  margin-bottom: 20rpx;
}
.ai-card-cta {
  display: inline-block;
  background: rgba(255,255,255,0.25);
  color: #fff;
  padding: 12rpx 28rpx;
  border-radius: $radius;
  font-size: 26rpx;
  font-weight: 600;
}
.ai-card-decor {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  font-size: 60rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx 12rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text;
}

.bundle-card {
  background: $card-bg;
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}
.bundle-name {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}
.bundle-desc {
  font-size: 24rpx;
  color: $text-secondary;
  margin-bottom: 16rpx;
  line-height: 1.6;
}
.bundle-bottom {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.bundle-btn {
  margin-left: auto;
  font-size: 24rpx;
  padding: 12rpx 24rpx;
}

.category-tabs {
  display: flex;
  padding: 0 24rpx;
  gap: 16rpx;
  overflow-x: auto;
}
.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $card-bg;
  padding: 20rpx 24rpx;
  border-radius: $radius;
  min-width: 140rpx;
  box-shadow: $shadow-sm;
}
.category-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}
.category-name {
  font-size: 24rpx;
  color: $text-secondary;
}

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
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
}
.cd-sep {
  color: $text;
  font-weight: 700;
}

.flash-grid {
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
  box-shadow: $shadow-sm;
}
.flash-img {
  width: 168rpx;
  height: 168rpx;
  border-radius: $radius-sm;
  margin-bottom: 12rpx;
}
.flash-name {
  font-size: 24rpx;
  margin-bottom: 8rpx;
  display: block;
}
.flash-price {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}
</style>
