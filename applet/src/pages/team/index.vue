<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { commissionApi } from '@/api'

const stats = ref({ total: 0, level1: 0, level2: 0 })
const members = ref<any[]>([])
const loading = ref(false)

async function loadTeam() {
  loading.value = true
  try {
    const data = await commissionApi.getInvites() as any
    members.value = Array.isArray(data) ? data : data?.list || data?.rows || []
    stats.value = {
      total: data?.total ?? members.value.length,
      level1: data?.level1 ?? 0,
      level2: data?.level2 ?? 0,
    }
  } catch (e) { /* */ }
  finally { loading.value = false }
}

function inviteFriend() {
  // #ifdef MP-WEIXIN
  // 小程序分享
  // #endif
  uni.showModal({
    title: '邀请好友',
    content: '分享您的专属邀请链接给好友，好友注册后自动成为您的团队成员。',
    confirmText: '复制邀请码',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: 'FANYOU2026',
          success: () => uni.showToast({ title: '已复制邀请码', icon: 'success' }),
        })
      }
    },
  })
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

onMounted(loadTeam)
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">我的团队</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 团队统计 -->
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-num">{{ stats.total }}</text>
          <text class="stat-label">团队总人数</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num">{{ stats.level1 }}</text>
          <text class="stat-label">直推成员</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num">{{ stats.level2 }}</text>
          <text class="stat-label">间推成员</text>
        </view>
      </view>

      <!-- 邀请按钮 -->
      <view class="invite-section">
        <button class="invite-btn" @tap="inviteFriend">
          <text>📤 邀请好友加入</text>
        </button>
        <text class="invite-hint">好友注册后自动成为您的团队成员</text>
      </view>

      <!-- 成员列表 -->
      <view class="section-title">团队成员</view>
      <view class="member-list">
        <view v-for="m in members" :key="m.id" class="member-item">
          <view class="member-avatar">
            <text>{{ m.avatar || '🐾' }}</text>
          </view>
          <view class="member-info">
            <text class="member-name">{{ m.nickName || '用户' + (m.id || '') }}</text>
            <text class="member-date">{{ formatDate(m.joinTime || m.createTime) }}</text>
          </view>
          <view class="member-level">
            <text class="level-badge" :class="m.level === 1 ? 'direct' : 'indirect'">
              {{ m.level === 1 ? '直推' : '间推' }}
            </text>
          </view>
        </view>
        <view v-if="members.length === 0 && !loading" class="empty-state">
          <text class="empty-icon">👥</text>
          <text class="empty-text">还没有团队成员</text>
          <text class="empty-hint">邀请好友加入，一起分享收益</text>
        </view>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-container { min-height: 100vh; background: $bg; display: flex; flex-direction: column; }
.page-header {
  background: $header-gradient; padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  display: flex; align-items: center; justify-content: space-between;
}
.back-btn { display: flex; align-items: center; gap: 8rpx; font-size: 28rpx; color: $primary; width: 80rpx; }
.arrow-icon { width: 16rpx; height: 16rpx; border-top: 4rpx solid $primary; border-left: 4rpx solid $primary; transform: rotate(-45deg); }
.page-title { font-size: 34rpx; font-weight: 700; color: $text; }
.scroll-content { flex: 1; }

.stats-card {
  margin: 24rpx 32rpx; padding: 32rpx 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: $radius-lg; display: flex; align-items: center;
}
.stat-item { flex: 1; text-align: center; }
.stat-num { font-size: 48rpx; font-weight: 700; color: #fff; display: block; }
.stat-label { font-size: 22rpx; color: rgba(255,255,255,0.7); display: block; margin-top: 4rpx; }
.stat-divider { width: 1rpx; height: 60rpx; background: rgba(255,255,255,0.2); }

.invite-section { text-align: center; padding: 24rpx 32rpx; }
.invite-btn {
  width: 100%; height: 88rpx; line-height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff; font-size: 30rpx; font-weight: 700;
  border-radius: $radius-lg; border: none;
}
.invite-hint { font-size: 22rpx; color: $text-light; display: block; margin-top: 12rpx; }

.section-title {
  font-size: 30rpx; font-weight: 700; color: $text; padding: 0 32rpx; margin-bottom: 16rpx;
}

.member-list { margin: 0 32rpx; }
.member-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 24rpx; background: $card-bg; margin-bottom: 2rpx;
  &:first-child { border-radius: $radius-lg $radius-lg 0 0; }
  &:last-child { border-radius: 0 0 $radius-lg $radius-lg; margin-bottom: 0; }
}
.member-avatar {
  width: 72rpx; height: 72rpx; border-radius: 50%;
  background: $primary-light; display: flex; align-items: center; justify-content: center;
  font-size: 36rpx; flex-shrink: 0;
}
.member-info { flex: 1; }
.member-name { font-size: 28rpx; font-weight: 600; color: $text; display: block; }
.member-date { font-size: 22rpx; color: $text-light; }
.level-badge {
  font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 20rpx;
  &.direct { background: #e8f5e9; color: #4caf50; }
  &.indirect { background: #e3f2fd; color: #2196f3; }
}

.empty-state { text-align: center; padding: 80rpx 0; }
.empty-icon { font-size: 60rpx; display: block; margin-bottom: 16rpx; }
.empty-text { font-size: 28rpx; color: $text-secondary; display: block; margin-bottom: 8rpx; }
.empty-hint { font-size: 22rpx; color: $text-light; }
</style>
