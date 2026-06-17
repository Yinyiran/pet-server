<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { courseApi } from '@/api'

const courseKey = ref('')
const course = ref<any>(null)
const loading = ref(true)
const purchasing = ref(false)

const courseMap: Record<string, any> = {
  basic: {
    key: 'basic', icon: '📱', tag: '入门首选', name: '线上录播课',
    features: ['32节录播视频', '社群答疑', '1年回看权限', '电子教材', '基础认证'],
    price: 399, color: '#4f46e5',
    desc: '适合零基础入门宠物行业。系统学习宠物营养、护理、营销等基础知识，快速建立行业认知。',
  },
  pro: {
    key: 'pro', icon: '👨‍🏫', tag: '🔥 热门推荐', name: '梵优合伙人',
    features: ['1v1导师指导', '90天实操陪跑', '供货渠道对接', '流量扶持', '🟢 分销资格 佣金9%', '线下沙龙'],
    price: 2999, color: '#f97316',
    desc: '最受欢迎的全能课程。导师手把手带你从选品、获客到成交，90天内掌握宠物副业完整链路。',
  },
  partner: {
    key: 'partner', icon: '💎', tag: '👑 高阶权益', name: '梵优主理人',
    features: ['全年导师陪跑', '区域代理权', '分红权益', '私董会席位', '🟢 分销资格 佣金15%', '品牌联名', '年度峰会'],
    price: 5999, color: '#b91c1c',
    desc: '面向有经验的创业者。享受最高佣金比例和区域独家权益，加入核心私董圈层。',
  },
}

onLoad((options: any) => {
  courseKey.value = options?.key || 'basic'
  loadCourse()
})

async function loadCourse() {
  loading.value = true
  try {
    const list = await courseApi.getList()
    const found = (list || []).find((c: any) => c.level === courseKey.value)
    course.value = found || courseMap[courseKey.value]
  } catch (e) {
    course.value = courseMap[courseKey.value]
  } finally {
    loading.value = false
  }
}

async function buyCourse() {
  if (!course.value) return
  purchasing.value = true
  try {
    await courseApi.purchase(course.value.id)
    uni.showToast({ title: '报名成功！', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e) {
    console.error(e)
  } finally {
    purchasing.value = false
  }
}

function contactService() {
  uni.showModal({
    title: '课程咨询',
    content: '添加导师微信：fanyou_pet\n了解课程详情和优惠政策',
    confirmText: '复制微信号',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: 'fanyou_pet',
          success: () => uni.showToast({ title: '已复制', icon: 'success' }),
        })
      }
    },
  })
}
</script>

<template>
  <view class="page-container" v-if="course">
    <!-- 顶部导航 -->
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" />
        <text>返回</text>
      </view>
      <text class="page-title">课程详情</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 课程封面 -->
      <view class="cover-card" :style="{ background: `linear-gradient(135deg, ${course.color || '#f97316'}, ${course.color}cc)` }">
        <text class="cover-icon">{{ course.icon }}</text>
        <view class="cover-tag">{{ course.tag }}</view>
        <text class="cover-name">{{ course.name }}</text>
        <text class="cover-desc">{{ course.desc }}</text>
      </view>

      <!-- 价格信息 -->
      <view class="price-section">
        <view class="price-box">
          <text class="price-label">课程价格</text>
          <view class="price-value">
            <text class="unit">¥</text>{{ course.price?.toLocaleString() }}
          </view>
        </view>
        <view class="consult-btn" @tap="contactService">
          <text>咨询优惠</text>
          <text class="consult-arrow">›</text>
        </view>
      </view>

      <!-- 课程权益 -->
      <view class="section">
        <text class="section-title">课程权益</text>
        <view class="benefits-card">
          <view v-for="(f, i) in course.features" :key="i" class="benefit-item">
            <view class="benefit-check">✓</view>
            <text class="benefit-text">{{ f }}</text>
          </view>
        </view>
      </view>

      <!-- 课程说明 -->
      <view class="section">
        <text class="section-title">课程说明</text>
        <view class="desc-card">
          <text class="desc-text">{{ course.desc }}</text>
          <view class="desc-divider" />
          <view class="desc-info">
            <view class="info-row">
              <text class="info-label">学习方式</text>
              <text class="info-value">线上 + 实操</text>
            </view>
            <view class="info-row">
              <text class="info-label">有效期</text>
              <text class="info-value">永久有效</text>
            </view>
            <view class="info-row">
              <text class="info-label">适合人群</text>
              <text class="info-value">零基础 / 从业者 / 创业者</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 120rpx" />
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-bottom">
      <button class="btn-contact" @tap="contactService">咨询</button>
      <button class="btn-buy" :loading="purchasing" @tap="buyCourse">
        立即报名 ¥{{ course.price?.toLocaleString() }}
      </button>
    </view>
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

.page-header {
  background: $header-gradient;
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: $primary;
  width: 80rpx;
}
.arrow-icon {
  width: 16rpx;
  height: 16rpx;
  border-top: 4rpx solid $primary;
  border-left: 4rpx solid $primary;
  transform: rotate(-45deg);
}
.page-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text;
}

.scroll-content { flex: 1; }

.cover-card {
  margin: 24rpx 32rpx;
  padding: 40rpx 32rpx;
  border-radius: $radius-lg;
  position: relative;
  overflow: hidden;
}
.cover-icon {
  position: absolute;
  right: 24rpx;
  top: 20rpx;
  font-size: 72rpx;
  opacity: 0.25;
}
.cover-tag {
  display: inline-block;
  font-size: 22rpx;
  background: rgba(255,255,255,0.2);
  color: #fff;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
}
.cover-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  display: block;
  margin-bottom: 12rpx;
}
.cover-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
}

.price-section {
  margin: 0 32rpx 8rpx;
  display: flex;
  align-items: center;
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: $shadow-sm;
}
.price-box { flex: 1; }
.price-label { font-size: 24rpx; color: $text-secondary; display: block; }
.price-value {
  font-size: 48rpx;
  font-weight: 700;
  color: $primary;
  .unit { font-size: 28rpx; }
}
.consult-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 26rpx;
  color: $primary;
  background: $primary-light;
  padding: 12rpx 20rpx;
  border-radius: 30rpx;
}
.consult-arrow { font-size: 32rpx; }

.section { padding: 24rpx 32rpx; }
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  margin-bottom: 16rpx;
  display: block;
}

.benefits-card {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 20rpx 24rpx;
  box-shadow: $shadow-sm;
}
.benefit-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border;

  &:last-child { border-bottom: none; }
}
.benefit-check {
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
  flex-shrink: 0;
}
.benefit-text {
  font-size: 28rpx;
  color: $text;
}

.desc-card {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: $shadow-sm;
}
.desc-text {
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.7;
  display: block;
}
.desc-divider {
  height: 1rpx;
  background: $border;
  margin: 24rpx 0;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
}
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text; font-weight: 500; }

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 32rpx;
  background: $card-bg;
  border-top: 1rpx solid $border;
  display: flex;
  gap: 16rpx;
}
.btn-contact {
  flex: 0 0 180rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: $card-bg;
  border: 2rpx solid $primary;
  color: $primary;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: $radius-lg;
}
.btn-buy {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  border-radius: $radius-lg;
  border: none;
}

.safe-bottom {
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}
</style>
