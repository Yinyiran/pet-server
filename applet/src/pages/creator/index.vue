<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { courseApi } from '@/api'

const courseList = ref<any[]>([])

const courses = [
  {
    key: 'basic',
    icon: '🎬',
    tag: '入门首选',
    name: '线上录播课',
    features: ['32节视频', '社群答疑', '1年回看'],
    price: 399,
    cls: 'basic',
  },
  {
    key: 'pro',
    icon: '👨‍🏫',
    tag: '🔥 热门推荐',
    name: '梵优合伙人',
    features: ['1v1指导', '90天陪跑', '供货对接', '流量扶持', '🟢 分销资格 佣金9%'],
    price: 2999,
    cls: 'pro',
  },
  {
    key: 'partner',
    icon: '💎',
    tag: '👑 高阶权益',
    name: '梵优主理人',
    features: ['全年陪跑', '区域代理', '分红权益', '私董会', '🟢 分销资格 佣金15%'],
    price: 5999,
    cls: 'partner',
  },
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
    <!-- Header -->
    <view class="header">
      <view class="header-inner">
        <view class="brand-title">
          <view class="brand-icon">🐾</view>
          <text>梵优茗宠</text>
        </view>
      </view>
    </view>

    <!-- 主内容 -->
    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <view class="creator-wrap">
        <!-- 项目介绍 Hero -->
        <view class="creator-hero">
          <view class="creator-hero-glow" />
          <view class="creator-hero-glow2" />
          <view class="creator-hero-glow3" />
          <text class="creator-hero-decor">🚀</text>
          <view class="creator-hero-tag">✨ 轻创业项目</view>
          <view class="creator-hero-title">宠物赛道轻创\n陪跑计划</view>
          <view class="creator-hero-desc">零基础也能入局宠物行业。从选品、获客到成交，手把手带你搭建宠物副业体系。</view>
          <view class="creator-hero-stats">
            <view class="creator-hero-stat">
              <text class="creator-hero-stat-num">3000+</text>
              <text class="creator-hero-stat-label">已加入学员</text>
            </view>
            <view class="creator-hero-stat">
              <text class="creator-hero-stat-num">98%</text>
              <text class="creator-hero-stat-label">好评率</text>
            </view>
            <view class="creator-hero-stat">
              <text class="creator-hero-stat-num">1v1</text>
              <text class="creator-hero-stat-label">导师陪跑</text>
            </view>
          </view>
        </view>

        <!-- 三档课程 -->
        <view class="course-cards">
          <view
            v-for="item in courses"
            :key="item.key"
            class="course-card"
            :class="item.cls"
            @tap="openDetail(item.key)"
          >
            <view class="course-card-icon">
              <text>{{ item.icon }}</text>
            </view>
            <view class="course-card-info">
              <text class="course-card-tag">{{ item.tag }}</text>
              <text class="course-card-name">{{ item.name }}</text>
              <view class="course-card-features">
                <text v-for="(feat, fi) in item.features" :key="fi" class="course-card-feature">{{ feat }}</text>
              </view>
              <view class="course-card-price">
                <text class="unit">¥</text>
                <text>{{ item.price.toLocaleString() }}</text>
              </view>
            </view>
            <text class="course-card-arrow">›</text>
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
.header-inner { display: flex; align-items: center; justify-content: center; }
.brand-title { font-size: 40rpx; font-weight: 700; color: $text; display: flex; align-items: center; gap: 12rpx; letter-spacing: 2rpx; }
.brand-icon { width: 56rpx; height: 56rpx; background: linear-gradient(135deg, $primary, $accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30rpx; }

/* 内容 */
.scroll-content { flex: 1; }
.creator-wrap { padding: 0 24rpx; }

/* ===== Hero ===== */
.creator-hero {
  margin: 24rpx 0 28rpx;
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 30%, #0f3460 70%, #1a1a2e 100%);
  border-radius: $radius-lg;
  padding: 56rpx 32rpx 48rpx;
  position: relative;
  overflow: hidden;
  color: #fff;
}
.creator-hero-glow {
  position: absolute;
  top: -60rpx;
  right: -40rpx;
  width: 360rpx;
  height: 360rpx;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
}
.creator-hero-glow2 {
  position: absolute;
  bottom: -80rpx;
  left: -60rpx;
  width: 300rpx;
  height: 300rpx;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.18) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
}
.creator-hero-glow3 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400rpx;
  height: 400rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.creator-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  font-size: 20rpx;
  font-weight: 700;
  padding: 6rpx 20rpx;
  border-radius: 24rpx;
  margin-bottom: 28rpx;
  position: relative;
  z-index: 1;
}
.creator-hero-title {
  font-size: 44rpx;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 16rpx;
  position: relative;
  z-index: 1;
  white-space: pre-line;
}
.creator-hero-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
  position: relative;
  z-index: 1;
  margin-bottom: 32rpx;
}
.creator-hero-stats {
  display: flex;
  gap: 20rpx;
  position: relative;
  z-index: 1;
}
.creator-hero-stat {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-sm;
  padding: 20rpx 16rpx;
  text-align: center;
}
.creator-hero-stat-num {
  font-size: 40rpx;
  font-weight: 800;
  color: $accent;
  line-height: 1.1;
  display: block;
}
.creator-hero-stat-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 4rpx;
}
.creator-hero-decor {
  position: absolute;
  right: 20rpx;
  top: 36rpx;
  font-size: 160rpx;
  opacity: 0.12;
  pointer-events: none;
}

/* ===== 课程卡片 ===== */
.course-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.course-card {
  border-radius: $radius;
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: $shadow-sm;

  &:active {
    transform: scale(0.98);
  }

  &.basic {
    background: linear-gradient(135deg, #f0f7ff 0%, #e3f0ff 100%);
    border: 3rpx solid #b3d4ff;
  }
  &.pro {
    background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
    border: 3rpx solid #ffd54f;
  }
  &.partner {
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    border: 3rpx solid #ce93d8;
  }
}
.course-card-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52rpx;
  flex-shrink: 0;
}
.course-card.basic .course-card-icon { background: linear-gradient(135deg, #bbdefb, #90caf9); }
.course-card.pro .course-card-icon { background: linear-gradient(135deg, #ffe082, #ffd54f); }
.course-card.partner .course-card-icon { background: linear-gradient(135deg, #ce93d8, #ba68c8); }

.course-card-info {
  flex: 1;
  min-width: 0;
}
.course-card-tag {
  font-size: 20rpx;
  font-weight: 700;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  display: inline-block;
  margin-bottom: 12rpx;
}
.course-card.basic .course-card-tag { background: rgba(25, 118, 210, 0.12); color: #1565c0; }
.course-card.pro .course-card-tag { background: rgba(249, 115, 22, 0.15); color: #e65100; }
.course-card.partner .course-card-tag { background: rgba(156, 39, 176, 0.12); color: #7b1fa2; }

.course-card-name {
  font-size: 32rpx;
  font-weight: 700;
  color: $text;
  display: block;
  margin-bottom: 12rpx;
}
.course-card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 16rpx;
}
.course-card-feature {
  font-size: 20rpx;
  color: $text-secondary;
  background: rgba(255, 255, 255, 0.5);
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
}
.course-card-price {
  font-size: 36rpx;
  font-weight: 800;
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}
.course-card.basic .course-card-price { color: #1565c0; }
.course-card.pro .course-card-price { color: #e65100; }
.course-card.partner .course-card-price { color: #7b1fa2; }

.course-card-price .unit {
  font-size: 24rpx;
  font-weight: 600;
}
.course-card-arrow {
  font-size: 40rpx;
  color: $text-light;
  flex-shrink: 0;
  font-weight: 600;
}
</style>
