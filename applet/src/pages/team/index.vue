<script setup lang="ts">
import { commissionApi } from '@/api'
import { computed, onMounted, ref } from 'vue'

const stats = ref({ total: 0, views: 0 })
const members = ref<any[]>([])
const loading = ref(false)
const activeTab = ref('total')
const activeLevel = ref('all')

const tabs = [
  { key: 'total', label: '邀请总数' },
  { key: 'views', label: '浏览量' },
]

const levelChips = [
  { key: 'all', label: '全部' },
  { key: '普通用户', label: '普通用户' },
  { key: '梵优合伙人', label: '梵优合伙人' },
  { key: '梵优主理人', label: '梵优主理人' },
]

const filteredMembers = computed(() => {
  if (activeLevel.value === 'all') return members.value
  return members.value.filter((m: any) => m.level === activeLevel.value || m.role === activeLevel.value)
})

async function loadTeam() {
  loading.value = true
  try {
    const data = await commissionApi.getInvites() as any
    members.value = Array.isArray(data) ? data : data?.list || data?.rows || []
    stats.value = {
      total: data?.total ?? members.value.length,
      views: data?.views ?? 0,
    }
  } catch (e) { /* */ }
  finally { loading.value = false }
}

function inviteFriend() {
  uni.showModal({
    title: '🎉 邀请好友',
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

function getAvatar(avatar: string) {
  return avatar || '🐾'
}

function getLevelBadge(m: any) {
  const level = m.level || m.role || '普通用户'
  if (level === '梵优合伙人' || level === 1) return { text: '合伙人', class: 'partner' }
  if (level === '梵优主理人' || level === 2) return { text: '主理人', class: 'manager' }
  return { text: '普通', class: '' }
}

onMounted(loadTeam)
</script>

<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" /><text>返回</text>
      </view>
      <text class="page-title">👥 我的团队</text>
      <view style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 邀请分享卡片 -->
      <view class="share-card">
        <text class="share-title">🎉 邀请好友</text>
        <text class="share-subtitle">好友注册即可获得专属权益，一起给宠物囤好物</text>
        <view class="share-actions">
          <button class="share-btn" @tap="inviteFriend">🔗 分享链接</button>
        </view>
      </view>

      <!-- Tab 切换 -->
      <view class="invite-tabs">
        <view
          v-for="t in tabs"
          :key="t.key"
          class="invite-tab"
          :class="{ active: activeTab === t.key }"
          @tap="activeTab = t.key"
        >
          {{ t.label }}
          <text class="tab-count">{{ activeTab === t.key ? (t.key === 'total' ? stats.total : stats.views) : '' }}</text>
        </view>
      </view>

      <!-- 等级筛选 -->
      <scroll-view scroll-x class="level-filter" :show-scrollbar="false">
        <view
          v-for="chip in levelChips"
          :key="chip.key"
          class="level-chip"
          :class="{ active: activeLevel === chip.key }"
          @tap="activeLevel = chip.key"
        >
          {{ chip.label }}
        </view>
      </scroll-view>

      <!-- 邀请列表 -->
      <view class="invite-list">
        <view v-for="m in filteredMembers" :key="m.id" class="invite-item">
          <view class="item-avatar">
            <text>{{ getAvatar(m.avatar) }}</text>
          </view>
          <view class="item-body">
            <view class="item-row">
              <text class="item-name">{{ m.nickName || '用户' + (m.id || '') }}</text>
              <view class="item-row-right">
                <text class="item-level" :class="getLevelBadge(m).class">{{ getLevelBadge(m).text }}</text>
              </view>
            </view>
            <view class="item-row">
              <text class="item-meta">{{ formatDate(m.joinTime || m.createTime) }}</text>
              <text
                class="item-consume"
                :class="m.consumed ? 'consumed' : 'not-consumed'"
              >
                {{ m.consumed ? '已消费' : '未消费' }}
              </text>
            </view>
          </view>
        </view>
        <view v-if="filteredMembers.length === 0 && !loading" class="invite-empty">
          <text>暂无团队成员</text>
        </view>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>

.page-container { min-height: 100vh; background: $bg; display: flex; flex-direction: column; }

.page-header {
  background: $header-gradient; padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  display: flex; align-items: center; justify-content: space-between;
}
.back-btn { display: flex; align-items: center; gap: 8rpx; font-size: 28rpx; color: $primary; width: 120rpx; }
.arrow-icon { width: 16rpx; height: 16rpx; border-top: 4rpx solid $primary; border-left: 4rpx solid $primary; transform: rotate(-45deg); }
.page-title { font-size: 34rpx; font-weight: 700; color: $text; }
.scroll-content { flex: 1; }

/* 邀请分享卡片 */
.share-card {
  margin: 24rpx 32rpx; padding: 40rpx 32rpx; text-align: center;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%);
  border-radius: $radius-lg; color: #7c2d12;
}
.share-title { font-size: 36rpx; font-weight: 800; display: block; margin-bottom: 8rpx; }
.share-subtitle { font-size: 24rpx; opacity: 0.8; display: block; margin-bottom: 28rpx; }
.share-actions { display: flex; gap: 20rpx; justify-content: center; }
.share-btn {
  padding: 16rpx 40rpx; border-radius: 40rpx;
  font-size: 26rpx; font-weight: 700; border: none;
  background: $primary; color: #fff;
  &:active { background: #ea580c; }
}

/* Tab 切换 — 分段控件 */
.invite-tabs {
  display: flex; margin: 0 32rpx 24rpx; gap: 8rpx;
  background: #f0ebe4; border-radius: $radius-sm; padding: 6rpx;
}
.invite-tab {
  flex: 1; padding: 20rpx 16rpx; text-align: center;
  font-size: 28rpx; font-weight: 600; color: $text-light;
  border-radius: 12rpx; transition: all 0.2s;
  &.active {
    background: #fff; color: $primary;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
  }
}
.tab-count {
  display: inline-block; margin-left: 8rpx; font-size: 32rpx; font-weight: 800;
}
.invite-tab.active .tab-count { color: $primary; }

/* 等级筛选 */
.level-filter {
  margin: 0 32rpx 24rpx; display: flex; gap: 16rpx;
  white-space: nowrap;
}
.level-chip {
  flex-shrink: 0; padding: 8rpx 20rpx; border-radius: 40rpx;
  font-size: 26rpx; color: $text-light; background: #f3f4f6;
  transition: all 0.2s;
  &.active { background: $primary; color: #fff; font-weight: 500; }
  &:active { transform: scale(0.96); }
}

/* 邀请列表 */
.invite-list { margin: 0 32rpx; }
.invite-item {
  display: flex; align-items: center; gap: 20rpx; padding: 20rpx 24rpx;
  background: $card-bg; border-radius: $radius-sm; margin-bottom: 12rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.03);
  &:active { background: #fef3c7; }
}
.item-avatar {
  width: 80rpx; height: 80rpx; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #ffedd5, #fed7aa);
  display: flex; align-items: center; justify-content: center; font-size: 36rpx;
}
.item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8rpx; }
.item-row {
  display: flex; align-items: center; justify-content: space-between;
}
.item-row-right { display: flex; align-items: center; gap: 12rpx; }
.item-name { font-size: 28rpx; font-weight: 600; color: $text; }
.item-meta { font-size: 22rpx; color: $text-light; }
.item-level {
  font-size: 20rpx; font-weight: 600; padding: 2rpx 12rpx; border-radius: 16rpx;
  background: #f0ebe4; color: $text-light; white-space: nowrap;
  &.partner { background: #ffedd5; color: #c2410c; }
  &.manager { background: #fef3c7; color: #b45309; }
}
.item-consume {
  font-size: 20rpx; font-weight: 600; padding: 2rpx 12rpx; border-radius: 16rpx; white-space: nowrap;
  &.consumed { background: #dcfce7; color: #16a34a; }
  &.not-consumed { background: #fee2e2; color: #dc2626; }
}

.invite-empty {
  text-align: center; padding: 64rpx 32rpx; color: $text-light; font-size: 26rpx;
}
</style>
