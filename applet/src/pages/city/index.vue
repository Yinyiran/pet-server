<script setup lang="ts">
import { merchantApi } from '@/api'
import { onMounted, ref } from 'vue'

const currentCity = ref('杭州市')
const activeFilter = ref('all')
const merchantList = ref<any[]>([])
const loading = ref(false)

const filters = [
  { key: 'all', label: '全部', icon: '' },
  { key: 'shop', label: '🏪 宠物店', icon: '' },
  { key: 'hospital', label: '🏥 宠物医院', icon: '' },
  { key: 'beauty', label: '✂️ 宠物美容', icon: '' },
  { key: 'park', label: '🌳 宠物乐园', icon: '' },
  { key: 'party', label: '🎉 线下聚会', icon: '' },
]

/** 分类颜色映射 */
const catColorMap: Record<string, string> = {
  shop: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
  hospital: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
  beauty: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
  park: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
  party: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
  all: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
}

/** 演示数据 */
const demoMerchants: any[] = [
  { id: 1, cat: 'shop', icon: '🛒', name: '宠乐多生活馆', score: '4.9', type: '店铺', desc: '进口主粮、零食、玩具一站式采购，会员享95折', addr: '余杭区文一西路998号', tel: '0571-88886661', dist: '1.2km' },
  { id: 2, cat: 'hospital', icon: '💉', name: '瑞鹏宠物医院(城西院)', score: '4.8', type: '医院', desc: '24小时急诊，配备DR、彩超、生化分析仪等设备', addr: '拱墅区莫干山路688号', tel: '0571-88886663', dist: '2.5km' },
  { id: 3, cat: 'beauty', icon: '🛁', name: '萌宠造型美容工作室', score: '4.8', type: '美容', desc: '韩国宠物美容师驻店，提供造型、SPA、药浴服务', addr: '余杭区荆长路58号', tel: '0571-88886665', dist: '800m' },
  { id: 4, cat: 'park', icon: '🌲', name: '汪汪宠物乐园', score: '4.7', type: '乐园', desc: '占地3000㎡，设有敏捷赛道、游泳池、草坪活动区和宠物咖啡', addr: '余杭区径山镇双溪路1号', tel: '0571-88886667', dist: '5.0km' },
  { id: 5, cat: 'party', icon: '🎪', name: '萌爪线下聚会', score: '4.6', type: '聚会', desc: '每月定期举办宠物交友活动，室内外场地，专业指导', addr: '西湖区紫荆花路100号', tel: '0571-88886668', dist: '3.2km' },
  { id: 6, cat: 'shop', icon: '🐾', name: '爪爪宠物便利店', score: '4.7', type: '店铺', desc: '社区宠物便利店，主营主粮零食及基础用品', addr: '西湖区古墩路388号', tel: '0571-88886662', dist: '1.8km' },
  { id: 7, cat: 'hospital', icon: '🩺', name: '芭比堂动物医院', score: '4.9', type: '医院', desc: '专科诊疗：骨科、眼科、牙科，拥有多名执业兽医师', addr: '上城区望江东路168号', tel: '0571-88886664', dist: '4.1km' },
  { id: 8, cat: 'beauty', icon: '✂️', name: '小爪爪宠物美容', score: '4.6', type: '美容', desc: '专业洗护造型，使用进口洗护产品，宠物友好环境', addr: '西湖区紫荆花路22号', tel: '0571-88886666', dist: '2.0km' },
]

async function loadMerchants() {
  loading.value = true
  try {
    const params: any = {}
    if (activeFilter.value !== 'all') params.type = activeFilter.value
    const data = await merchantApi.getList(params)
    if (data && data.length) {
      merchantList.value = data
    } else {
      // Fallback to demo data
      merchantList.value = activeFilter.value === 'all'
        ? demoMerchants
        : demoMerchants.filter(m => m.cat === activeFilter.value)
    }
  } catch (e) {
    // Use demo data as fallback
    merchantList.value = activeFilter.value === 'all'
      ? demoMerchants
      : demoMerchants.filter(m => m.cat === activeFilter.value)
  } finally {
    loading.value = false
  }
}

function setFilter(key: string) {
  activeFilter.value = key
  loadMerchants()
}

function openCityDetail(merchant: any) {
  // 跳转到商家详情页（暂用 toast 占位）
  uni.showToast({ title: `${merchant.name}详情`, icon: 'none' })
}

function callPhone(tel: string) {
  uni.makePhoneCall({ phoneNumber: tel })
}

function goToCoop() {
  uni.navigateTo({ url: '/pages/coop-apply/index' })
}

onMounted(loadMerchants)
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
      <view class="city-wrap">
        <!-- 城市定位 -->
        <view class="city-header" @tap="uni.showToast({ title: '切换城市', icon: 'none' })">
          <text class="city-header-loc">📍</text>
          <text class="city-header-label">当前城市</text>
          <text class="city-header-name">{{ currentCity }}</text>
          <text class="city-header-arrow">›</text>
        </view>

        <!-- 筛选标签 -->
        <scroll-view scroll-x class="city-filters" :show-scrollbar="false">
          <view
            v-for="f in filters" :key="f.key"
            class="city-filter-chip"
            :class="{ active: activeFilter === f.key }"
            @tap="setFilter(f.key)"
          >
            {{ f.label }}
          </view>
        </scroll-view>

        <!-- 商家列表 -->
        <view class="city-list">
          <view
            class="city-card"
            v-for="item in merchantList"
            :key="item.id"
            @tap="openCityDetail(item)"
          >
            <view class="city-card-img" :class="item.cat || item.cls" :style="{ background: catColorMap[item.cat || item.cls] || catColorMap.all }">
              <text>{{ item.icon || '🏪' }}</text>
            </view>
            <view class="city-card-info">
              <view class="city-card-name-row">
                <text class="city-card-name">{{ item.name }}</text>
                <view class="city-card-enter" @tap.stop="openCityDetail(item)">
                  <text>进店</text>
                  <text class="city-card-enter-arrow">›</text>
                </view>
              </view>
              <view class="city-card-tags">
                <text class="city-card-tag score">{{ item.score || item.tags?.[0]?.replace('分', '') }}分</text>
                <text class="city-card-tag type">{{ item.type || item.tags?.[1] || item.typeLabel }}</text>
              </view>
              <text class="city-card-desc">{{ item.desc }}</text>
              <view class="city-card-addr">
                <view class="city-card-addr-left">
                  <text>📍</text>
                  <text>{{ item.addr }}</text>
                </view>
                <view class="city-card-addr-right">
                  <text class="city-card-dist">{{ item.dist || item.distance }}</text>
                  <view class="city-card-nav" @tap.stop="uni.showToast({ title: '导航功能', icon: 'none' })">
                    <text>🧭</text>
                  </view>
                  <view class="city-card-tel" @tap.stop="callPhone(item.tel)">
                    <text>📞</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="!loading && merchantList.length === 0" class="empty-state">
          <text class="empty-icon">📍</text>
          <text>暂无商家信息</text>
        </view>

        <!-- 合作入驻入口 -->
        <view class="coop-entry" @tap="goToCoop">
          <text class="coop-entry-icon">🤝</text>
          <view class="coop-entry-text">
            <text class="coop-entry-title">申请合作入驻</text>
            <text class="coop-entry-desc">宠物店、医院、美容院等商家免费入驻</text>
          </view>
          <text class="coop-entry-arrow">›</text>
        </view>
      </view>

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
  display: flex; align-items: center; justify-content: center;
}
.brand-title {
  font-size: 40rpx; font-weight: 700; color: $text; display: flex; align-items: center; gap: 12rpx; letter-spacing: 2rpx;
}
.brand-icon {
  width: 56rpx; height: 56rpx; background: linear-gradient(135deg, $primary, $accent);
  border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30rpx;
}

/* 内容 */
.scroll-content { flex: 1; }
.city-wrap { padding: 0 24rpx; }

/* 城市定位 */
.city-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin: 24rpx 0 20rpx;
  padding: 20rpx 28rpx;
  background: $card-bg;
  border-radius: $radius;
  box-shadow: $shadow-sm;
}
.city-header-loc {
  font-size: 28rpx;
  color: $primary;
  flex-shrink: 0;
}
.city-header-label {
  font-size: 26rpx;
  color: $text-secondary;
  flex-shrink: 0;
}
.city-header-name {
  font-size: 28rpx;
  font-weight: 700;
  color: $text;
  flex: 1;
}
.city-header-arrow {
  color: $text-light;
  font-size: 32rpx;
  font-weight: 600;
}

/* 筛选 */
.city-filters {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
  white-space: nowrap;
}
.city-filter-chip {
  flex-shrink: 0;
  padding: 12rpx 28rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $text-secondary;
  background: $card-bg;
  border: 2rpx solid $border;
  border-radius: 32rpx;

  &.active {
    background: $primary;
    color: #fff;
    border-color: $primary;
  }
}

/* 商家列表 */
.city-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.city-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 24rpx;
  display: flex;
  gap: 20rpx;
  box-shadow: $shadow-sm;

  &:active {
    transform: scale(0.99);
  }
}
.city-card-img {
  width: 144rpx;
  height: 144rpx;
  border-radius: $radius-sm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72rpx;

  &.shop { background: linear-gradient(135deg, #fff3e0, #ffe0b2); }
  &.hospital { background: linear-gradient(135deg, #e3f2fd, #bbdefb); }
  &.beauty { background: linear-gradient(135deg, #fce4ec, #f8bbd0); }
  &.park { background: linear-gradient(135deg, #e8f5e9, #c8e6c9); }
  &.party { background: linear-gradient(135deg, #f3e5f5, #e1bee7); }
}
.city-card-info {
  flex: 1;
  min-width: 0;
}
.city-card-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}
.city-card-name {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.city-card-enter {
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx 20rpx;
  background: $primary;
  color: #fff;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 28rpx;
  flex-shrink: 0;

  &:active { opacity: 0.8; }
}
.city-card-enter-arrow {
  font-size: 26rpx;
}
.city-card-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.city-card-tag {
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;

  &.score {
    background: rgba(249, 115, 22, 0.12);
    color: $primary;
  }
  &.type {
    background: #f0ebe4;
    color: $text-secondary;
  }
}
.city-card-desc {
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: 14rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.city-card-addr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 22rpx;
}
.city-card-addr-left {
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: $text-secondary;
  flex: 1;
  overflow: hidden;

  text:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.city-card-addr-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}
.city-card-dist {
  font-size: 22rpx;
  color: $accent;
  font-weight: 600;
}
.city-card-nav,
.city-card-tel {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;

  &:active { transform: scale(0.92); }
}
.city-card-nav {
  background: #e3f2fd;
}
.city-card-tel {
  background: #e8f5e9;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 120rpx 0;
  color: $text-light;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  font-size: 28rpx;
}
.empty-icon {
  font-size: 80rpx;
}

/* 合作入驻入口 */
.coop-entry {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 28rpx;
  padding: 28rpx;
  background: linear-gradient(135deg, #fff7ed 0%, #fff3e0 50%, #ffedd5 100%);
  border-radius: $radius;
  border: 2rpx solid rgba(249, 115, 22, 0.12);

  &:active {
    background: linear-gradient(135deg, #ffe8cc, #ffd8a8);
  }
}
.coop-entry-icon {
  font-size: 52rpx;
}
.coop-entry-text {
  flex: 1;
}
.coop-entry-title {
  font-size: 28rpx;
  font-weight: 700;
  color: $text;
  display: block;
  margin-bottom: 6rpx;
}
.coop-entry-desc {
  font-size: 22rpx;
  color: $text-secondary;
}
.coop-entry-arrow {
  font-size: 36rpx;
  color: $primary;
  font-weight: 700;
}
</style>
