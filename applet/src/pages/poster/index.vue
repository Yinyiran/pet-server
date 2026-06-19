<script setup lang="ts">
import { mealApi } from '@/api'
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'

const petInfo = ref<any>(null)
const constitution = ref<any>(null)
const mealList = ref<any[]>([])
const totalPrice = ref(0)
const loading = ref(true)

let planId = ''

onLoad((options: any) => {
  planId = options?.planId || ''
})

onMounted(async () => {
  await loadPosterData()
})

async function loadPosterData() {
  loading.value = true
  try {
    const quizResult = uni.getStorageSync('quizResult')
    if (quizResult) {
      petInfo.value = quizResult.petInfo
      constitution.value = quizResult.constitution
    }
    const data = await mealApi.getPlans(petInfo.value?.petType)
    if (data) {
      const d = data as any
      mealList.value = d?.meals || (Array.isArray(d) ? d : [])
      totalPrice.value = d?.totalPrice || mealList.value.reduce((s: number, m: any) => s + (m.price || 0), 0)
    }
  } catch (e) {
    console.error('加载配餐方案失败', e)
  } finally {
    loading.value = false
  }
}

function generatePoster() {
  uni.showLoading({ title: '生成海报中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.navigateTo({ url: '/pages/poster-preview/index' })
  }, 1500)
}

function sharePoster() {
  uni.showToast({ title: '请点击右上角分享', icon: 'none' })
}

async function purchaseNow() {
  try {
    await mealApi.createOrder({ planId })
    uni.showToast({ title: '下单成功', icon: 'success' })
    setTimeout(() => uni.switchTab({ url: '/pages/cart/index' }), 1500)
  } catch (e) {
    uni.showToast({ title: '下单失败', icon: 'none' })
  }
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/home/index' }) })
}

const dotColors = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']

const isCat = computed(() => petInfo.value?.petType !== 'dog')
</script>

<template>
  <view class="poster-page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-bar-inner">
        <view class="nav-back" @tap="goBack">
          <view class="back-arrow" />
        </view>
        <text class="nav-title">AI 配餐方案</text>
        <view class="nav-placeholder" />
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-wrap">
      <view class="loading-spinner" />
      <text class="loading-text">正在生成配餐方案...</text>
    </view>

    <scroll-view v-else scroll-y class="poster-scroll">
      <!-- 顶部标题 -->
      <view class="poster-header">
        <view class="poster-label">✨ AI 智能配餐方案</view>
        <view class="poster-subtitle">根据您的爱宠信息，为您定制专属营养配方</view>
      </view>

      <!-- 宠物信息卡片 -->
      <view class="poster-info-card" v-if="petInfo">
        <view class="poster-pet-name">
          <text class="emoji">{{ isCat ? '🐱' : '🐶' }}</text>
          {{ petInfo.petName || petInfo.nickname || '我的爱宠' }}
        </view>
        <view class="poster-info-grid">
          <view class="poster-info-item" v-if="petInfo.petType">
            <text class="key">类型</text><text class="val">{{ isCat ? '猫咪' : '狗狗' }}</text>
          </view>
          <view class="poster-info-item" v-if="petInfo.age || petInfo.dAge">
            <text class="key">年龄</text><text class="val">{{ petInfo.age || petInfo.dAge }}</text>
          </view>
          <view class="poster-info-item" v-if="petInfo.weight">
            <text class="key">体重</text><text class="val">{{ petInfo.weight }}kg</text>
          </view>
          <view class="poster-info-item" v-if="petInfo.gender || petInfo.dGender">
            <text class="key">性别</text><text class="val">{{ petInfo.gender || petInfo.dGender }}</text>
          </view>
        </view>
      </view>

      <!-- 体质分析卡片 -->
      <view class="poster-hero" v-if="constitution">
        <view class="poster-hero-bg" :class="isCat ? 'cat-bg' : 'dog-bg'" />
        <view class="poster-hero-content">
          <view class="constitution-header">
            <view class="constitution-badge">
              <text class="badge-emoji">{{ isCat ? '🐱' : '🐶' }}</text>
              <text class="badge-label">{{ constitution.type || '综合分析' }}</text>
            </view>
          </view>
          <view class="constitution-desc">{{ constitution.desc || '根据您的宠物信息，AI已为您分析出最适合的营养方案。' }}</view>
        </view>
      </view>

      <!-- 配餐方案 -->
      <view class="poster-meals">
        <view class="poster-meals-title">🍽️ 营养方案</view>
        <view class="poster-meals-list">
          <view v-for="(meal, idx) in mealList" :key="meal.id || idx" class="poster-meal-item">
            <view class="poster-meal-dot" :class="dotColors[idx % 6]">
              <text>{{ meal.emoji || '🥘' }}</text>
            </view>
            <view class="poster-meal-info">
              <text class="poster-meal-name">{{ meal.name }}</text>
            </view>
            <text class="poster-meal-gram">{{ meal.gram || meal.price + 'g' }}</text>
          </view>
          <view v-if="!mealList.length" class="empty-meals">暂无配餐数据</view>
        </view>
        <view class="poster-footer">
          <view class="poster-footer-left">
            <view class="poster-brand">梵优茗宠</view>
            <view class="poster-slogan">扫码了解更多专属配餐</view>
          </view>
          <view class="poster-qr">二维码</view>
        </view>
      </view>

      <view style="height: 140rpx" />
    </scroll-view>

    <!-- 底部购买栏 -->
    <view v-if="!loading" class="poster-buy-bar safe-bottom">
      <view class="poster-buy-info">
        <view class="poster-buy-price">¥{{ totalPrice }}<text>/月起</text></view>
      </view>
      <view class="poster-buy-actions">
        <view class="poster-action-btn outline" @tap="generatePoster">生成海报</view>
        <view class="poster-action-btn outline" @tap="sharePoster">分享</view>
        <view class="poster-action-btn primary" @tap="purchaseNow">立即购买</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

.poster-page { min-height: 100vh; background: linear-gradient(180deg, #fdf0e6 0%, $bg 30%); display: flex; flex-direction: column; }

/* 导航栏 */
.nav-bar {
  background: rgba(253, 240, 230, 0.95); backdrop-filter: blur(10px);
  padding-top: var(--status-bar-height, 44px);
}
.nav-bar-inner { display: flex; align-items: center; justify-content: space-between; height: 88rpx; padding: 0 30rpx; }
.nav-back {
  width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.05); border-radius: 50%;
}
.back-arrow { width: 20rpx; height: 20rpx; border-top: 4rpx solid $text; border-left: 4rpx solid $text; transform: rotate(-45deg); }
.nav-title { font-size: 32rpx; font-weight: 600; color: $text; }
.nav-placeholder { width: 60rpx; }

/* 加载 */
.loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 400rpx; }
.loading-spinner { width: 60rpx; height: 60rpx; border: 4rpx solid #f0e6dc; border-top-color: $primary; border-radius: 50%; animation: spin 0.8s linear infinite; }
.loading-text { margin-top: 20rpx; font-size: 28rpx; color: $text-secondary; }
@keyframes spin { to { transform: rotate(360deg); } }

.poster-scroll { flex: 1; padding: 0 32rpx; }

/* 标题 */
.poster-header { text-align: center; padding: 40rpx 0 32rpx; }
.poster-label {
  font-size: 40rpx; font-weight: 800; margin-bottom: 12rpx;
  background: linear-gradient(135deg, #f97316, #f59e0b);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.poster-subtitle { font-size: 24rpx; color: $text-secondary; }

/* 宠物信息卡片 */
.poster-info-card {
  background: $card-bg; border-radius: $radius-lg; padding: 28rpx 32rpx;
  box-shadow: $shadow-sm; margin-bottom: 24rpx;
}
.poster-pet-name { font-size: 36rpx; font-weight: 700; color: $text; display: flex; align-items: center; gap: 12rpx; margin-bottom: 20rpx;
  .emoji { font-size: 48rpx; }
}
.poster-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12rpx 24rpx; }
.poster-info-item { font-size: 26rpx; color: $text-secondary; display: flex; gap: 8rpx; line-height: 1.6;
  .key { width: 96rpx; text-align: right; padding-right: 16rpx; color: $text-light; flex-shrink: 0; }
  .val { color: $text; font-weight: 500; }
}

/* 体质分析卡片 */
.poster-hero { position: relative; border-radius: $radius-lg; overflow: hidden; margin-bottom: 24rpx; box-shadow: $shadow-md; }
.poster-hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
  &.cat-bg { background: linear-gradient(170deg, #fdf2e9 0%, #fdebd0 40%, #fadbd8 70%, #e8daef 100%); }
  &.dog-bg { background: linear-gradient(170deg, #e8f8f5 0%, #d5f5e3 40%, #fcf3cf 70%, #fdebd0 100%); }
}
.poster-hero-content { position: relative; z-index: 1; padding: 32rpx; }
.constitution-header { display: flex; align-items: center; gap: 20rpx; margin-bottom: 20rpx; }
.constitution-badge {
  display: inline-flex; align-items: center; gap: 8rpx;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
  padding: 10rpx 24rpx; border-radius: 40rpx; box-shadow: $shadow-sm;
}
.badge-emoji { font-size: 30rpx; }
.badge-label { font-size: 26rpx; font-weight: 700; color: $primary; }
.constitution-desc { font-size: 26rpx; line-height: 1.65; color: $text; }

/* 配餐方案 */
.poster-meals { background: $card-bg; border-radius: $radius-lg; box-shadow: $shadow-md; padding: 0 8rpx; }
.poster-meals-title { font-size: 30rpx; font-weight: 700; color: $text; display: flex; padding: 20rpx; align-items: center; gap: 12rpx; }
.poster-meals-list { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; }
.poster-meal-item {
  display: flex; align-items: center; width: 48%; gap: 12rpx; margin-top: 10rpx;
  background: $card-bg; border-radius: $radius; padding: 20rpx 24rpx; box-shadow: $shadow-sm;
}
.poster-meal-dot {
  width: 60rpx; height: 60rpx; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 40rpx;
  &.c1 { background: #fff3e0; }
  &.c2 { background: #e8f5e9; }
  &.c3 { background: #e3f2fd; }
  &.c4 { background: #fce4ec; }
  &.c5 { background: #f3e5f5; }
  &.c6 { background: #e0f2f1; }
}
.poster-meal-info { flex: 1; min-width: 0; }
.poster-meal-name { font-size: 26rpx; color: $text; }
.poster-meal-gram { font-size: 24rpx; font-weight: 600; color: $accent; flex-shrink: 0; align-self: flex-start; padding-top: 4rpx; }

.empty-meals { text-align: center; padding: 80rpx 0; color: $text-light; font-size: 28rpx; width: 100%; }

/* 底部品牌 */
.poster-footer { display: flex; align-items: center; justify-content: space-between; padding: 24rpx 12rpx 12rpx; border-top: 2rpx dashed $border; margin-top: 8rpx; width: 100%; }
.poster-footer-left { display: flex; flex-direction: column; gap: 8rpx; }
.poster-brand { font-size: 36rpx; font-weight: 800; color: $text; }
.poster-slogan { font-size: 22rpx; color: $text-light; }
.poster-qr { width: 144rpx; height: 144rpx; border-radius: $radius-sm; border: 3rpx solid $border; display: flex; align-items: center; justify-content: center; font-size: 22rpx; color: $text-light; flex-shrink: 0; }

/* 底部购买栏 */
.poster-buy-bar {
  display: flex; align-items: center; gap: 16rpx; padding: 16rpx 24rpx;
  background: $card-bg; border-top: 2rpx solid $border; box-shadow: 0 -4rpx 24rpx rgba(0,0,0,0.06);
}
.poster-buy-info { flex: 1; min-width: 0; }
.poster-buy-price { font-size: 40rpx; font-weight: 800; color: $accent;
  text { font-size: 24rpx; font-weight: 500; color: $text-light; }
}
.poster-buy-actions { display: flex; align-items: center; gap: 12rpx; flex-shrink: 0; }
.poster-action-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6rpx;
  border-radius: 40rpx; font-size: 24rpx; font-weight: 600; white-space: nowrap;
  padding: 16rpx 24rpx; border: none; transition: transform 0.15s, opacity 0.15s;
  &:active { transform: scale(0.95); }
  &.outline { background: #fff; color: $primary; border: 3rpx solid $primary; }
  &.primary {
    background: linear-gradient(135deg, $primary, $primary-dark); color: #fff;
    box-shadow: 0 8rpx 28rpx rgba(249, 115, 22, 0.35); padding: 20rpx 36rpx;
  }
}
.safe-bottom { padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }
</style>
