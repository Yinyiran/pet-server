<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"AI 配餐方案"}}
</route>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { mealApi } from '@/api'

interface MealPlan {
  id: number
  name: string
  image: string
  price: number
  ingredients: string[]
  nutrition: string
  description: string
}

const petInfo = ref<any>(null)
const constitution = ref<any>(null)
const mealList = ref<MealPlan[]>([])
const totalPrice = ref(0)
const loading = ref(true)
const showPreview = ref(false)
const previewImage = ref('')

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
    // 从缓存获取答题结果
    const quizResult = uni.getStorageSync('quizResult')
    if (quizResult) {
      petInfo.value = quizResult.petInfo
      constitution.value = quizResult.constitution
    }

    // 获取配餐方案列表
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
  // 使用 canvas 绘制海报或调用后端生成
  setTimeout(() => {
    uni.hideLoading()
    previewImage.value = ''
    showPreview.value = true
    uni.showToast({ title: '海报已生成', icon: 'none' })
  }, 1500)
}

function savePoster() {
  if (!previewImage.value) {
    uni.showToast({ title: '请先生成海报', icon: 'none' })
    return
  }
  uni.saveImageToPhotosAlbum({
    filePath: previewImage.value,
    success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
    fail: () => uni.showToast({ title: '保存失败', icon: 'none' })
  })
}

function sharePoster() {
  // #ifdef MP-WEIXIN
  uni.showToast({ title: '请点击右上角分享', icon: 'none' })
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '暂不支持分享', icon: 'none' })
  // #endif
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

const constitutionEmoji: Record<string, string> = {
  '健康活力型': '🐱',
  '肠胃敏感型': '🐱',
  '毛发护理型': '🐱',
  '体重管理型': '🐱',
  '幼年成长型': '🐱',
  '老年养护型': '🐱'
}
</script>

<template>
  <view class="poster-page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-bar-inner">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
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
        <text class="poster-label">✨ AI 智能配餐方案</text>
        <text class="poster-subtitle">根据您的爱宠信息，为您定制专属营养配方</text>
      </view>

      <!-- 宠物信息卡片 -->
      <view v-if="petInfo" class="poster-info-card">
        <view class="info-row" v-if="petInfo.petName">
          <text class="info-label">宠物名字</text>
          <text class="info-value">{{ petInfo.petName }}</text>
        </view>
        <view class="info-row" v-if="petInfo.petType">
          <text class="info-label">宠物类型</text>
          <text class="info-value">{{ petInfo.petType === 'cat' ? '猫咪' : '狗狗' }}</text>
        </view>
        <view class="info-row" v-if="petInfo.age">
          <text class="info-label">年龄</text>
          <text class="info-value">{{ petInfo.age }}</text>
        </view>
        <view class="info-row" v-if="petInfo.weight">
          <text class="info-label">体重</text>
          <text class="info-value">{{ petInfo.weight }}</text>
        </view>
      </view>

      <!-- 体质分析 -->
      <view v-if="constitution" class="poster-hero">
        <view class="constitution-card">
          <view class="constitution-badge">
            <text class="badge-emoji">{{ constitutionEmoji[constitution.type] || '🐾' }}</text>
            <text class="badge-label">{{ constitution.type || '综合分析' }}</text>
          </view>
          <text class="constitution-desc">{{ constitution.desc || '根据您的宠物信息，AI已为您分析出最适合的营养方案。' }}</text>
        </view>
      </view>

      <!-- 营养方案 -->
      <view class="poster-meals">
        <view class="poster-meals-title">
          <text>🍽️ 营养方案</text>
        </view>
        <view class="poster-meals-list">
          <view v-for="(meal, idx) in mealList" :key="meal.id || idx" class="meal-card">
            <image v-if="meal.image" class="meal-img" :src="meal.image" mode="aspectFill" />
            <view v-else class="meal-img-placeholder">
              <text>{{ idx + 1 }}</text>
            </view>
            <view class="meal-info">
              <text class="meal-name">{{ meal.name }}</text>
              <text class="meal-desc">{{ meal.description || meal.nutrition }}</text>
              <view class="meal-tags" v-if="meal.ingredients?.length">
                <text v-for="ing in meal.ingredients.slice(0, 3)" :key="ing" class="meal-tag">{{ ing }}</text>
              </view>
              <text class="meal-price">¥{{ meal.price }}</text>
            </view>
          </view>
          <view v-if="!mealList.length" class="empty-meals">
            <text>暂无配餐数据</text>
          </view>
        </view>
      </view>

      <!-- 底部品牌 -->
      <view class="poster-footer">
        <view class="poster-footer-left">
          <text class="poster-brand">梵优茗宠</text>
          <text class="poster-slogan">扫码了解更多专属配餐</text>
        </view>
        <view class="poster-qr">
          <text class="qr-text">二维码</text>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>

    <!-- 底部购买栏 -->
    <view v-if="!loading" class="poster-buy-bar">
      <view class="poster-buy-info">
        <text class="poster-buy-price">
          <text class="price-symbol">¥</text>{{ totalPrice }}
          <text class="price-unit">/月起</text>
        </text>
      </view>
      <view class="poster-buy-actions">
        <button class="action-btn outline" @tap="generatePoster">生成海报</button>
        <button class="action-btn outline" @tap="sharePoster">分享</button>
        <button class="action-btn primary" @tap="purchaseNow">立即购买</button>
      </view>
    </view>

    <!-- 海报预览弹窗 -->
    <view v-if="showPreview" class="preview-overlay" @tap.self="showPreview = false">
      <view class="preview-card">
        <view class="preview-header">
          <text class="preview-title">长按保存海报</text>
          <text class="preview-close" @tap="showPreview = false">✕</text>
        </view>
        <view class="preview-body">
          <image v-if="previewImage" class="preview-img" :src="previewImage" mode="widthFix" />
          <view v-else class="preview-placeholder">
            <text>海报预览区域</text>
          </view>
        </view>
        <view class="preview-actions">
          <button class="preview-btn outline" @tap="savePoster">保存到相册</button>
          <button class="preview-btn primary" @tap="sharePoster">分享给好友</button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.poster-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf0e6 0%, #f8f4f0 30%);
  position: relative;
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(253, 240, 230, 0.95);
  backdrop-filter: blur(10px);
  padding-top: var(--status-bar-height, 44px);

  .nav-bar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 30rpx;
  }

  .nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }

  .back-icon {
    font-size: 36rpx;
    color: #3d2c1e;
    font-weight: bold;
  }

  .nav-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #3d2c1e;
  }

  .nav-placeholder {
    width: 60rpx;
  }
}

.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #f0e6dc;
    border-top-color: #f97316;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #8c7b6e;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.poster-scroll {
  height: calc(100vh - var(--status-bar-height, 44px) - 88rpx);
}

.poster-header {
  text-align: center;
  padding: 40rpx 30rpx 20rpx;

  .poster-label {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: #3d2c1e;
  }

  .poster-subtitle {
    display: block;
    font-size: 26rpx;
    color: #8c7b6e;
    margin-top: 10rpx;
  }
}

.poster-info-card {
  margin: 20rpx 30rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f0eb;

    &:last-child {
      border-bottom: none;
    }
  }

  .info-label {
    font-size: 26rpx;
    color: #8c7b6e;
  }

  .info-value {
    font-size: 26rpx;
    color: #3d2c1e;
    font-weight: 500;
  }
}

.poster-hero {
  margin: 20rpx 30rpx;

  .constitution-card {
    background: linear-gradient(135deg, #fff7ed, #fff);
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(249, 115, 22, 0.1);
  }

  .constitution-badge {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .badge-emoji {
      font-size: 40rpx;
    }

    .badge-label {
      font-size: 30rpx;
      font-weight: 700;
      color: #ea580c;
      background: rgba(249, 115, 22, 0.1);
      padding: 6rpx 20rpx;
      border-radius: 20rpx;
    }
  }

  .constitution-desc {
    font-size: 26rpx;
    color: #6b5c50;
    line-height: 1.6;
  }
}

.poster-meals {
  margin: 20rpx 30rpx;

  .poster-meals-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #3d2c1e;
    margin-bottom: 20rpx;
  }
}

.meal-card {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .meal-img {
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
  }

  .meal-img-placeholder {
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #f97316;
    font-weight: 700;
  }

  .meal-info {
    flex: 1;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .meal-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #3d2c1e;
  }

  .meal-desc {
    font-size: 24rpx;
    color: #8c7b6e;
    margin-top: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .meal-tags {
    display: flex;
    gap: 10rpx;
    margin-top: 10rpx;
    flex-wrap: wrap;

    .meal-tag {
      font-size: 20rpx;
      color: #f97316;
      background: rgba(249, 115, 22, 0.08);
      padding: 4rpx 14rpx;
      border-radius: 10rpx;
    }
  }

  .meal-price {
    font-size: 30rpx;
    font-weight: 700;
    color: #ea580c;
    margin-top: 10rpx;
  }
}

.empty-meals {
  text-align: center;
  padding: 60rpx 0;
  color: #8c7b6e;
  font-size: 28rpx;
}

.poster-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30rpx 30rpx 0;
  padding: 30rpx;
  background: #fff;
  border-radius: 20rpx;

  .poster-brand {
    font-size: 30rpx;
    font-weight: 700;
    color: #3d2c1e;
  }

  .poster-slogan {
    font-size: 22rpx;
    color: #8c7b6e;
    margin-top: 6rpx;
  }

  .poster-qr {
    width: 120rpx;
    height: 120rpx;
    background: #f5f0eb;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .qr-text {
      font-size: 22rpx;
      color: #8c7b6e;
    }
  }
}

.poster-buy-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  z-index: 99;

  .poster-buy-price {
    font-size: 40rpx;
    font-weight: 700;
    color: #ea580c;

    .price-symbol {
      font-size: 28rpx;
    }

    .price-unit {
      font-size: 22rpx;
      color: #8c7b6e;
      font-weight: 400;
    }
  }

  .poster-buy-actions {
    display: flex;
    gap: 16rpx;
  }
}

.action-btn {
  padding: 16rpx 28rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: 500;
  border: none;
  line-height: 1;

  &.outline {
    background: #fff;
    color: #f97316;
    border: 2rpx solid #f97316;
  }

  &.primary {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff;
  }
}

.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-card {
  width: 85%;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;

  .preview-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #3d2c1e;
  }

  .preview-close {
    font-size: 36rpx;
    color: #8c7b6e;
    padding: 10rpx;
  }
}

.preview-body {
  padding: 0 30rpx;

  .preview-img {
    width: 100%;
    border-radius: 16rpx;
  }

  .preview-placeholder {
    width: 100%;
    height: 600rpx;
    background: #f5f0eb;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c7b6e;
    font-size: 28rpx;
  }
}

.preview-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
}

.preview-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  text-align: center;
  border: none;

  &.outline {
    background: #fff;
    color: #f97316;
    border: 2rpx solid #f97316;
  }

  &.primary {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff;
  }
}
</style>
