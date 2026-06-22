<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"我的拼团"}}
</route>

<script setup lang="ts">
import { groupApi } from '@/api'
import { onMounted, ref } from 'vue'

const activeTab = ref('all')
const groups = ref<any[]>([])
const loading = ref(false)

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'forming', label: '进行中' },
  { key: 'success', label: '已成团' },
  { key: 'expired', label: '已过期' },
]

function switchTab(key: string) {
  activeTab.value = key
  loadGroups()
}

async function loadGroups() {
  loading.value = true
  try {
    const params: any = { pageNum: 1, pageSize: 50 }
    if (activeTab.value !== 'all') params.status = activeTab.value
    const res: any = await groupApi.getMyGroups(params)
    groups.value = res?.list || []
  } catch {
    groups.value = []
  } finally {
    loading.value = false
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'forming': return '拼团中'
    case 'success': return '已成团'
    case 'expired': return '已过期'
    case 'failed': return '已失败'
    default: return status
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'forming': return '#f97316'
    case 'success': return '#7bc67e'
    case 'expired': case 'failed': return '#e05555'
    default: return '#999'
  }
}

function goDetail(groupNo: string) {
  uni.navigateTo({ url: `/pages/group-detail/index?groupNo=${groupNo}` })
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/profile/index' }) })
}

onMounted(loadGroups)
</script>

<template>
  <view class="page-container">
    <!-- Header -->
    <view class="nav-header">
      <view class="back-btn" @tap="goBack">
        <view class="back-arrow" />
      </view>
      <text class="nav-title">我的拼团</text>
      <view style="width: 64rpx;" />
    </view>

    <!-- Tabs -->
    <view class="tabs-row">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @tap="switchTab(tab.key)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="scroll-content">
      <view v-if="loading" class="loading-state">
        <text>加载中...</text>
      </view>

      <view v-else-if="!groups.length" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无拼团记录</text>
        <text class="empty-hint">去首页看看有什么好物可以拼团吧</text>
      </view>

      <view v-else class="group-list">
        <view
          v-for="group in groups"
          :key="group.groupNo || group.id"
          class="group-item"
          @tap="goDetail(group.groupNo)"
        >
          <view class="gi-left">
            <image
              v-if="group.productImgUrl"
              :src="group.productImgUrl"
              mode="aspectFill"
              class="gi-img"
            />
            <view v-else class="gi-img-placeholder">📦</view>
          </view>
          <view class="gi-center">
            <text class="gi-name">{{ group.productName || '商品' }}</text>
            <view class="gi-meta">
              <text class="gi-price">¥{{ group.groupPrice }}</text>
              <text class="gi-info">{{ group.currentCount }}/{{ group.groupSize }}人</text>
            </view>
          </view>
          <view class="gi-right">
            <text class="gi-status" :style="{ color: getStatusColor(group.status) }">
              {{ getStatusText(group.status) }}
            </text>
            <view v-if="group.status === 'forming'" class="gi-action">去查看</view>
          </view>
        </view>
      </view>

      <view style="height: 40rpx;" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: $bg;
  display: flex;
  flex-direction: column;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  background: $card-bg;
  flex-shrink: 0;
}
.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-arrow {
  width: 18rpx;
  height: 18rpx;
  border-left: 4rpx solid $text;
  border-bottom: 4rpx solid $text;
  transform: rotate(45deg);
  margin-left: 8rpx;
}
.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $text;
}

.tabs-row {
  display: flex;
  background: $card-bg;
  padding: 0 24rpx;
  border-bottom: 1rpx solid $border;
  flex-shrink: 0;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 26rpx;
  color: $text-secondary;
  position: relative;

  &.active {
    color: $primary;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 30%;
      right: 30%;
      height: 4rpx;
      background: $primary;
      border-radius: 2rpx;
    }
  }
}

.scroll-content {
  flex: 1;
}

.group-list {
  padding: 16rpx;
}
.group-item {
  background: $card-bg;
  border-radius: $radius-xl;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.gi-left {
  flex-shrink: 0;
}
.gi-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: $radius;
}
.gi-img-placeholder {
  width: 120rpx;
  height: 120rpx;
  border-radius: $radius;
  background: $bg;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}
.gi-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  overflow: hidden;
}
.gi-name {
  font-size: 26rpx;
  font-weight: 600;
  color: $text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gi-meta {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}
.gi-price {
  font-size: 30rpx;
  font-weight: 700;
  color: $primary;
}
.gi-info {
  font-size: 22rpx;
  color: $text-secondary;
}
.gi-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.gi-status {
  font-size: 24rpx;
  font-weight: 600;
}
.gi-action {
  font-size: 22rpx;
  color: $primary;
  padding: 6rpx 20rpx;
  border: 2rpx solid $primary;
  border-radius: 20rpx;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
  gap: 16rpx;
  color: $text-light;
}
.empty-icon {
  font-size: 80rpx;
}
.empty-text {
  font-size: 28rpx;
  color: $text-secondary;
}
.empty-hint {
  font-size: 24rpx;
  color: $text-light;
}
</style>
