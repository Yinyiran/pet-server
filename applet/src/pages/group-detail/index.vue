<route lang="json">
{"style":{"navigationStyle":"custom","navigationBarTitleText":"拼团详情"}}
</route>

<script setup lang="ts">
import { groupApi } from '@/api'
import { useUserStore } from '@/store/modules/user'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const userStore = useUserStore()

const groupNo = ref('')
const group = ref<any>(null)
const loading = ref(true)
const countdown = ref('')
let timer: any = null

onLoad((options: any) => {
  groupNo.value = options?.groupNo || ''
})

async function loadDetail() {
  if (!groupNo.value) { loading.value = false; return }
  loading.value = true
  try {
    group.value = await groupApi.getDetail(groupNo.value)
    updateCountdown()
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function updateCountdown() {
  if (!group.value || group.value.status !== 'forming') {
    countdown.value = ''
    return
  }
  const expire = new Date(group.value.expireAt).getTime()
  const now = Date.now()
  const diff = expire - now
  if (diff <= 0) {
    countdown.value = '已过期'
    group.value.status = 'expired'
    return
  }
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  countdown.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function startTimer() {
  timer = setInterval(updateCountdown, 1000)
}

const progressPercent = computed(() => {
  if (!group.value) return 0
  return Math.min(100, Math.round((group.value.currentCount / group.value.groupSize) * 100))
})

const remainSlots = computed(() => {
  if (!group.value) return 0
  return Math.max(0, group.value.groupSize - group.value.currentCount)
})

const statusText = computed(() => {
  if (!group.value) return ''
  switch (group.value.status) {
    case 'forming': return '拼团中'
    case 'success': return '拼团成功'
    case 'expired': return '拼团已过期'
    case 'failed': return '拼团失败'
    default: return ''
  }
})

const statusColor = computed(() => {
  if (!group.value) return '#999'
  switch (group.value.status) {
    case 'forming': return '#f97316'
    case 'success': return '#7bc67e'
    case 'expired': case 'failed': return '#e05555'
    default: return '#999'
  }
})

function joinThisGroup() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  groupApi.join({ groupNo: groupNo.value })
    .then((res: any) => {
      uni.showToast({ title: res.isComplete ? '拼团成功！' : '已参加拼团', icon: 'success' })
      loadDetail()
    })
    .catch((e: any) => {
      uni.showToast({ title: e?.message || '参加拼团失败', icon: 'none' })
    })
}

function shareGroup() {
  // #ifdef MP-WEIXIN
  uni.showToast({ title: '请点击右上角分享', icon: 'none' })
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
  // #endif
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/home/index' }) })
}

function goProduct() {
  if (group.value?.productId) {
    uni.navigateTo({ url: `/pages/product/detail?id=${group.value.productId}` })
  }
}

onMounted(() => {
  loadDetail()
  startTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

onShareAppMessage(() => {
  if (!group.value) return { title: '来一起拼团吧', path: '/pages/home/index' }
  const productName = group.value.product?.name || '精选好物'
  return {
    title: `${productName} ${group.value.groupSize}人拼团，还差${remainSlots.value}人成团！`,
    path: `/pages/group-detail/index?groupNo=${groupNo.value}`,
    imageUrl: group.value.product?.imgUrl || '',
  }
})
</script>

<template>
  <view class="group-detail-page">
    <!-- 加载中 -->
    <view v-if="loading" class="loading-page">
      <view class="loading-spinner" />
      <text>加载中...</text>
    </view>

    <template v-else-if="group">
      <scroll-view scroll-y class="detail-scroll">
        <!-- 顶部导航 -->
        <view class="nav-header">
          <view class="back-btn" @tap="goBack">
            <view class="back-arrow" />
          </view>
          <text class="nav-title">拼团详情</text>
          <view class="share-btn" @tap="shareGroup">
            <text>📤</text>
          </view>
        </view>

        <!-- 拼团状态卡片 -->
        <view class="status-card">
          <view class="status-row">
            <text class="status-label" :style="{ color: statusColor }">{{ statusText }}</text>
            <text v-if="countdown && group.status === 'forming'" class="countdown">剩余 {{ countdown }}</text>
          </view>

          <!-- 进度条 -->
          <view class="progress-section">
            <view class="progress-info">
              <text class="progress-current">{{ group.currentCount }}</text>
              <text class="progress-separator">/</text>
              <text class="progress-total">{{ group.groupSize }}人</text>
            </view>
            <view class="progress-bar-bg">
              <view class="progress-bar-fill" :style="{ width: progressPercent + '%' }" />
            </view>
            <text v-if="group.status === 'forming'" class="progress-hint">
              还差 <text class="highlight">{{ remainSlots }}</text> 人即可成团
            </text>
            <text v-else-if="group.status === 'success'" class="progress-hint success">拼团成功！</text>
            <text v-else class="progress-hint">拼团未成功</text>
          </view>
        </view>

        <!-- 参团者列表 -->
        <view class="members-card">
          <text class="card-title">参团成员</text>
          <view class="members-list">
            <view
              v-for="(member, idx) in group.members"
              :key="member.id || idx"
              class="member-item"
            >
              <view class="member-avatar">
                <image v-if="member.avatar" :src="member.avatar" mode="aspectFill" class="avatar-img" />
                <text v-else class="avatar-placeholder">👤</text>
                <view v-if="member.isLeader" class="leader-badge">团长</view>
              </view>
              <text class="member-name">{{ member.nickname || '用户' }}</text>
              <text class="member-status">{{ member.isLeader ? '发起人' : '参团者' }}</text>
            </view>

            <!-- 空位 -->
            <view
              v-for="n in remainSlots"
              :key="'empty-' + n"
              class="member-item empty"
            >
              <view class="member-avatar empty-avatar">
                <text>+</text>
              </view>
              <text class="member-name">虚位以待</text>
              <text class="member-status">等待加入</text>
            </view>
          </view>
        </view>

        <!-- 商品信息 -->
        <view class="product-card" v-if="group.product" @tap="goProduct">
          <image
            v-if="group.product.imgUrl"
            :src="group.product.imgUrl"
            mode="aspectFill"
            class="product-img"
          />
          <view v-else class="product-img-placeholder">📦</view>
          <view class="product-info">
            <text class="product-name">{{ group.product.name }}</text>
            <view class="product-price-row">
              <text class="product-group-price">¥{{ group.groupPrice }}</text>
              <text class="product-original-price">¥{{ group.originalPrice }}</text>
            </view>
          </view>
        </view>

        <view style="height: 160rpx;" />
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="bottom-bar" v-if="group.status === 'forming'">
        <button class="share-btn-bottom" @tap="shareGroup">
          <text>📤 分享给好友</text>
        </button>
        <button class="join-btn-bottom" @tap="joinThisGroup">
          <text>参加拼团 ¥{{ group.groupPrice }}</text>
        </button>
      </view>
      <view class="bottom-bar" v-else-if="group.status === 'success'">
        <view class="success-notice">拼团成功！订单已确认</view>
      </view>
    </template>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text>拼团不存在</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.group-detail-page {
  min-height: 100vh;
  background: $bg;
}

.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 300rpx;
  color: $text-light;
  font-size: 26rpx;
  gap: 16rpx;
}
.loading-spinner {
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid $border;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.detail-scroll {
  height: 100vh;
}

/* Nav */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  background: $card-bg;
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
.share-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

/* Status Card */
.status-card {
  background: $card-bg;
  margin: 16rpx;
  border-radius: $radius-xl;
  padding: 32rpx;
  text-align: center;
}
.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.status-label {
  font-size: 36rpx;
  font-weight: 700;
}
.countdown {
  font-size: 24rpx;
  color: $primary;
  background: $primary-light;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-family: monospace;
}

.progress-section {
  margin-top: 16rpx;
}
.progress-info {
  margin-bottom: 12rpx;
}
.progress-current {
  font-size: 56rpx;
  font-weight: 800;
  color: $primary;
}
.progress-separator {
  font-size: 32rpx;
  color: $text-light;
  margin: 0 8rpx;
}
.progress-total {
  font-size: 32rpx;
  color: $text-secondary;
}
.progress-bar-bg {
  height: 16rpx;
  background: $border;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary, $accent);
  border-radius: 8rpx;
  transition: width 0.3s ease;
}
.progress-hint {
  font-size: 26rpx;
  color: $text-secondary;

  .highlight {
    color: $primary;
    font-weight: 700;
  }
  &.success {
    color: $success;
    font-weight: 600;
  }
}

/* Members */
.members-card {
  background: $card-bg;
  margin: 0 16rpx 16rpx;
  border-radius: $radius-xl;
  padding: 32rpx;
}
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  display: block;
  margin-bottom: 24rpx;
}
.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}
.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(25% - 18rpx);
  gap: 8rpx;

  &.empty {
    opacity: 0.5;
  }
}
.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: visible;
  position: relative;
  background: $bg;
  display: flex;
  align-items: center;
  justify-content: center;

  &.empty-avatar {
    border: 2rpx dashed $text-light;
    font-size: 36rpx;
    color: $text-light;
  }
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.avatar-placeholder {
  font-size: 36rpx;
}
.leader-badge {
  position: absolute;
  bottom: -8rpx;
  left: 50%;
  transform: translateX(-50%);
  background: $primary;
  color: #fff;
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
  white-space: nowrap;
}
.member-name {
  font-size: 22rpx;
  color: $text;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.member-status {
  font-size: 20rpx;
  color: $text-light;
}

/* Product */
.product-card {
  background: $card-bg;
  margin: 0 16rpx 16rpx;
  border-radius: $radius-xl;
  padding: 24rpx;
  display: flex;
  gap: 20rpx;
}
.product-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: $radius;
  flex-shrink: 0;
}
.product-img-placeholder {
  width: 160rpx;
  height: 160rpx;
  border-radius: $radius;
  background: $bg;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  flex-shrink: 0;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12rpx;
}
.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}
.product-group-price {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
}
.product-original-price {
  font-size: 24rpx;
  color: $text-light;
  text-decoration: line-through;
}

/* Bottom Bar */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $card-bg;
  display: flex;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid $border;
  z-index: 100;
}
.share-btn-bottom {
  flex: 1;
  height: 88rpx;
  background: $bg;
  color: $primary;
  border: 2rpx solid $primary;
  border-radius: $radius;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after { border: none; }
}
.join-btn-bottom {
  flex: 1;
  height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff;
  border-radius: $radius;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;

  &::after { border: none; }
}
.success-notice {
  flex: 1;
  height: 88rpx;
  background: $success;
  color: #fff;
  border-radius: $radius;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 300rpx;
  color: $text-light;
  font-size: 28rpx;
}
</style>
