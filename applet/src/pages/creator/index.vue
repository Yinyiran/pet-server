<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { courseApi } from '@/api'

const courseList = ref<any[]>([])

const courses = [
  { key: 'basic', icon: '📱', tag: '入门首选', name: '线上录播课', features: ['32节视频', '社群答疑', '1年回看'], price: 399 },
  { key: 'pro', icon: '👨‍🏫', tag: '🔥 热门推荐', name: '梵优合伙人', features: ['1v1指导', '90天陪跑', '供货对接', '流量扶持', '🟢 分销资格 佣金9%'], price: 2999 },
  { key: 'partner', icon: '💎', tag: '👑 高阶权益', name: '梵优主理人', features: ['全年陪跑', '区域代理', '分红权益', '私董会', '🟢 分销资格 佣金15%'], price: 5999 },
]

function openDetail(key: string) {
  uni.navigateTo({ url: `/pages/course-detail/index?key=${key}` })
}

onMounted(async () => {
  try {
    courseList.value = await courseApi.getList() || []
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <view class="page-container">
    <view class="header">
      <view class="header-inner">
        <text class="brand-title">⚡ 轻创课程</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 项目介绍 -->
      <view class="hero-card">
        <text class="hero-decor">🚀</text>
        <view class="hero-tag">✨ 轻创业项目</view>
        <view class="hero-title">宠物赛道轻创\n陪跑计划</view>
        <view class="hero-desc">零基础也能入局宠物行业。从选品、获客到成交，手把手带你搭建宠物副业体系。</view>
        <view class="hero-stats">
          <view class="hero-stat">
            <text class="stat-num">3000+</text>
            <text class="stat-label">已加入学员</text>
          </view>
          <view class="hero-stat">
            <text class="stat-num">98%</text>
            <text class="stat-label">好评率</text>
          </view>
          <view class="hero-stat">
            <text class="stat-num">1v1</text>
            <text class="stat-label">导师陪跑</text>
          </view>
        </view>
      </view>

      <!-- 课程卡片 -->
      <view class="course-cards">
        <view
          v-for="c in courses" :key="c.key"
          class="course-card" :class="c.key"
          @tap="openDetail(c.key)"
        >
          <text class="course-icon">{{ c.icon }}</text>
          <view class="course-info">
            <text class="course-tag">{{ c.tag }}</text>
            <text class="course-name">{{ c.name }}</text>
            <view class="course-features">
              <text v-for="f in c.features" :key="f" class="course-feature">{{ f }}</text>
            </view>
            <view class="course-price">
              <text class="unit">¥</text>{{ c.price.toLocaleString() }}
            </view>
          </view>
          <text class="course-arrow">›</text>
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
}
.header-inner { display: flex; align-items: center; justify-content: center; }
.brand-title { font-size: 36rpx; font-weight: 700; color: $text; }

.hero-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  margin: 20rpx 24rpx;
  padding: 40rpx 32rpx;
  border-radius: $radius-lg;
  position: relative;
  overflow: hidden;
}
.hero-decor { position: absolute; right: 24rpx; top: 20rpx; font-size: 60rpx; }
.hero-tag { font-size: 22rpx; color: rgba(255,255,255,0.8); margin-bottom: 16rpx; }
.hero-title { font-size: 40rpx; font-weight: 700; color: #fff; line-height: 1.4; margin-bottom: 16rpx; }
.hero-desc { font-size: 24rpx; color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 24rpx; }
.hero-stats { display: flex; gap: 32rpx; }
.hero-stat { text-align: center; }
.stat-num { display: block; font-size: 36rpx; font-weight: 700; color: #fff; }
.stat-label { font-size: 22rpx; color: rgba(255,255,255,0.7); }

.course-cards { padding: 0 24rpx; }
.course-card {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  box-shadow: $shadow-sm;
}
.course-icon { font-size: 48rpx; flex-shrink: 0; }
.course-info { flex: 1; }
.course-tag {
  font-size: 22rpx;
  background: $primary-light;
  color: $primary;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  display: inline-block;
  margin-bottom: 8rpx;
}
.course-name { font-size: 30rpx; font-weight: 700; display: block; margin-bottom: 12rpx; }
.course-features { display: flex; flex-wrap: wrap; gap: 8rpx; margin-bottom: 12rpx; }
.course-feature {
  font-size: 22rpx;
  background: $bg;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  color: $text-secondary;
}
.course-price { font-size: 36rpx; font-weight: 700; color: $primary;
  .unit { font-size: 24rpx; }
}
.course-arrow { font-size: 36rpx; color: $text-light; flex-shrink: 0; }
</style>
