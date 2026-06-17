<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { merchantApi } from '@/api'

const currentCity = ref('杭州市')
const activeFilter = ref('all')
const merchantList = ref<any[]>([])
const loading = ref(false)

const filters = [
  { key: 'all', label: '全部', icon: '' },
  { key: 'shop', label: '宠物店', icon: '🏪' },
  { key: 'hospital', label: '宠物医院', icon: '🏥' },
  { key: 'beauty', label: '宠物美容', icon: '✂️' },
  { key: 'park', label: '宠物乐园', icon: '🌳' },
  { key: 'party', label: '线下聚会', icon: '🎉' },
]

async function loadMerchants() {
  loading.value = true
  try {
    const params: any = {}
    if (activeFilter.value !== 'all') params.type = activeFilter.value
    merchantList.value = await merchantApi.getList(params) || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function setFilter(key: string) {
  activeFilter.value = key
  loadMerchants()
}

onMounted(loadMerchants)
</script>

<template>
  <view class="page-container">
    <view class="header">
      <view class="header-inner">
        <text class="brand-title">🐾 同城服务</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 城市定位 -->
      <view class="city-bar">
        <text>📍 当前城市</text>
        <text class="city-name">{{ currentCity }}</text>
        <text class="city-arrow">›</text>
      </view>

      <!-- 筛选标签 -->
      <view class="filter-row">
        <view
          v-for="f in filters" :key="f.key"
          class="filter-chip" :class="{ active: activeFilter === f.key }"
          @tap="setFilter(f.key)"
        >
          {{ f.icon }} {{ f.label }}
        </view>
      </view>

      <!-- 商家列表 -->
      <view class="merchant-list">
        <view class="merchant-card card" v-for="item in merchantList" :key="item.id">
          <view class="merchant-name">{{ item.name }}</view>
          <view class="merchant-meta">
            <text>{{ item.typeLabel }}</text>
            <text>{{ item.distance }}</text>
          </view>
          <view class="merchant-desc text-ellipsis-2">{{ item.desc }}</view>
        </view>
        <view v-if="!loading && merchantList.length === 0" class="empty-state">
          <text>暂无商家信息</text>
        </view>
      </view>

      <!-- 合作入驻入口 -->
      <view class="coop-entry card" @tap="uni.navigateTo({ url: '/pages/coop-apply/index' })">
        <text class="coop-icon">🤝</text>
        <view class="coop-text">
          <text class="coop-title">申请合作入驻</text>
          <text class="coop-desc">宠物店、医院、美容院等商家免费入驻</text>
        </view>
        <text class="coop-arrow">›</text>
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

.city-bar {
  display: flex;
  align-items: center;
  background: $card-bg;
  margin: 16rpx 24rpx;
  padding: 20rpx 24rpx;
  border-radius: $radius;
  font-size: 28rpx;
  color: $text-secondary;
  gap: 12rpx;
}
.city-name { font-weight: 700; color: $text; }
.city-arrow { margin-left: auto; font-size: 32rpx; color: $text-light; }

.filter-row {
  display: flex;
  padding: 0 24rpx;
  gap: 12rpx;
  overflow-x: auto;
  margin-bottom: 16rpx;
}
.filter-chip {
  background: $card-bg;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: $text-secondary;
  white-space: nowrap;
  &.active {
    background: $primary;
    color: #fff;
  }
}

.merchant-card {
  .merchant-name { font-size: 30rpx; font-weight: 700; margin-bottom: 8rpx; }
  .merchant-meta { display: flex; gap: 16rpx; font-size: 24rpx; color: $text-secondary; margin-bottom: 8rpx; }
  .merchant-desc { font-size: 24rpx; color: $text-secondary; }
}

.empty-state {
  text-align: center;
  padding: 80rpx 0;
  color: $text-light;
}

.coop-entry {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.coop-icon { font-size: 48rpx; }
.coop-text { flex: 1; }
.coop-title { font-size: 28rpx; font-weight: 600; display: block; }
.coop-desc { font-size: 22rpx; color: $text-secondary; }
.coop-arrow { font-size: 32rpx; color: $text-light; }
</style>
