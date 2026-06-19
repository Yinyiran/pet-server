<script setup lang="ts">
import { userApi } from '@/api'
import { useUserStore } from '@/store'
import { maskPhone } from '@/utils'
import { checkLogin, isLoggedIn } from '@/utils/auth'
import { onShow } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()

/** 宠物列表 */
const petList = ref<any[]>([])
const commissionBalance = ref('¥0.00')

async function loadPets() {
  if (!isLoggedIn()) return
  try { petList.value = await userApi.getPets() || [] } catch (e) { /* ignore */ }
}

async function loadCommission() {
  if (!isLoggedIn()) return
  try {
    // 尝试从 API 获取分佣余额
    const { commissionApi } = await import('@/api')
    const data = await commissionApi.getAccount()
    if (data?.balance !== undefined) {
      commissionBalance.value = `¥${Number(data.balance).toFixed(2)}`
    }
  } catch (e) { /* use default */ }
}

async function deletePet(id: number) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该宠物吗？',
    success: async (res) => {
      if (res.confirm) {
        await userApi.deletePet(id)
        uni.showToast({ title: '已删除', icon: 'success' })
        loadPets()
      }
    },
  })
}

function addPet() {
  if (!checkLogin()) return
  uni.navigateTo({ url: '/pages/pet-edit/index' })
}

function editPet(pet: any) {
  if (!checkLogin()) return
  const petJson = encodeURIComponent(JSON.stringify(pet))
  uni.navigateTo({ url: `/pages/pet-edit/index?pet=${petJson}` })
}

function openProfileDetail() {
  if (!checkLogin()) return
  uni.navigateTo({ url: '/pages/profile-edit/index' })
}

function openAvatarPicker() {
  if (!checkLogin()) return
  uni.navigateTo({ url: '/pages/avatar-pick/index' })
}

function navigateTo(url: string) {
  if (!checkLogin()) return
  uni.navigateTo({ url })
}

function goToLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}

/** 返回后自动刷新 */
onShow(async () => {
  if (isLoggedIn()) {
    await loadPets()
  }
})

onMounted(async () => {
  if (isLoggedIn()) {
    await userStore.fetchProfile()
    await loadPets()
    await loadCommission()
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
      <view class="profile-wrap">
        <!-- ===== 用户信息卡片 ===== -->
        <view class="profile-user-card" v-if="isLoggedIn()" @tap="openProfileDetail">
          <view class="profile-user-avatar" @tap.stop="openAvatarPicker">
            <text>{{ userStore.avatar || '🐱' }}</text>
          </view>
          <view class="profile-user-info">
            <text class="profile-user-name">{{ userStore.nickName || '毛毛家长' }}</text>
            <text class="profile-user-phone" v-if="userStore.profile?.phone">
              电话：{{ maskPhone(userStore.profile.phone) }}
            </text>
            <view class="profile-user-level">
              <view class="profile-level-tag">
                <text class="level-star">★</text>
                <text>{{ userStore.profile?.level || '梵优合伙人' }}</text>
              </view>
              <text class="profile-member-badge">{{ userStore.profile?.memberLevel || '🥈 银牌会员' }}</text>
            </view>
          </view>
          <view class="profile-user-actions">
            <view class="profile-edit-btn" @tap.stop="navigateTo('/pages/profile-edit/index')">编辑</view>
          </view>
        </view>

        <!-- 未登录状态 -->
        <view class="profile-user-card" v-else @tap="goToLogin">
          <view class="profile-user-avatar">
            <text>👤</text>
          </view>
          <view class="profile-user-info">
            <text class="profile-user-name">点击登录</text>
            <text class="profile-user-phone">登录后享受更多服务</text>
          </view>
          <view class="profile-user-actions">
            <view class="profile-edit-btn">登录</view>
          </view>
        </view>

        <!-- ===== 宠物档案 ===== -->
        <view class="profile-menu-item pet-archive-item">
          <text class="profile-menu-icon">🐾</text>
          <text class="profile-menu-label">宠物档案</text>
          <view class="pet-list-add-btn" @tap="addPet">+ 添加宠物</view>
        </view>
        <!-- 宠物列表 -->
        <view class="pet-list-inline-body" v-if="petList.length">
          <view class="pet-card" v-for="pet in petList" :key="pet.id" @tap="editPet(pet)">
            <view class="pet-card-icon">
              <text>{{ pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐰' }}</text>
            </view>
            <view class="pet-card-info">
              <text class="pet-card-name">{{ pet.name }}</text>
              <view class="pet-card-meta">
                <text class="pet-card-type">{{ pet.breed || '未设置品种' }}</text>
                <text class="pet-card-sep">·</text>
                <text>{{ pet.weight }}kg</text>
              </view>
            </view>
            <view class="pet-card-actions" @tap.stop>
              <text class="pet-card-edit" @tap="editPet(pet)">编辑</text>
              <text class="pet-card-del" @tap="deletePet(pet.id)">删除</text>
            </view>
          </view>
        </view>
        <view class="pet-list-inline-empty" v-else>
          <text>还没有添加宠物，点击上方按钮添加</text>
        </view>

        <!-- ===== 我的积分 ===== -->
        <view class="profile-menu-item" @tap="navigateTo('/pages/points/index')">
          <text class="profile-menu-icon">⭐</text>
          <text class="profile-menu-label">我的积分</text>
          <view class="integral-action-btn" @tap.stop="navigateTo('/pages/points-exchange/index')">🎁 兑换</view>
          <text class="profile-menu-value">{{ userStore.points || 0 }}</text>
          <text class="profile-menu-arrow">›</text>
        </view>

        <!-- ===== 分佣收益 ===== -->
        <view class="profile-menu-item commission-menu-entry" @tap="navigateTo('/pages/commission/index')">
          <text class="profile-menu-icon">💸</text>
          <text class="profile-menu-label">分佣收益</text>
          <view class="integral-action-btn commission-withdraw-btn" @tap.stop="navigateTo('/pages/withdraw/index')">💳 提现</view>
          <text class="commission-menu-value">{{ commissionBalance }}</text>
          <text class="profile-menu-arrow">›</text>
        </view>

        <!-- ===== 我的团队 ===== -->
        <view class="profile-menu-item" @tap="navigateTo('/pages/team/index')">
          <text class="profile-menu-icon">👥</text>
          <text class="profile-menu-label">我的团队</text>
          <text class="profile-menu-badge" v-if="userStore.profile?.inviteCount">{{ userStore.profile.inviteCount }}</text>
          <text class="profile-menu-arrow">›</text>
        </view>

        <!-- ===== 充值管理 ===== -->
        <view class="profile-menu-item" @tap="navigateTo('/pages/recharge/index')">
          <text class="profile-menu-icon">💰</text>
          <text class="profile-menu-label">充值管理</text>
          <text class="profile-menu-arrow">›</text>
        </view>

        <!-- ===== 我的订单 ===== -->
        <view class="profile-menu-item" @tap="navigateTo('/pages/order/index')">
          <text class="profile-menu-icon">📦</text>
          <text class="profile-menu-label">我的订单</text>
          <text class="profile-menu-arrow">›</text>
        </view>
      </view>

      <view style="height: 40rpx" />
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

/* Header */
.header {
  background: $header-gradient;
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 24rpx);
  flex-shrink: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $text;
  display: flex;
  align-items: center;
  gap: 12rpx;
  letter-spacing: 2rpx;
}
.brand-icon {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, $primary, $accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}

/* 内容 */
.scroll-content {
  flex: 1;
}
.profile-wrap {
  padding: 0 24rpx;
}

/* ===== 用户卡片 ===== */
.profile-user-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: linear-gradient(135deg, #fff7ed 0%, #ffe8d6 50%, #ffdabc 100%);
  border-radius: $radius-lg;
  padding: 32rpx;
  margin: 24rpx 0 28rpx;
  box-shadow: $shadow-sm;

  &:active {
    transform: scale(0.99);
  }
}
.profile-user-avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffcc80, #ffab40);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 16rpx rgba(249, 115, 22, 0.25);

  &:active {
    transform: scale(0.93);
  }
}
.profile-user-info {
  flex: 1;
  min-width: 0;
}
.profile-user-name {
  font-size: 34rpx;
  font-weight: 700;
  color: $text;
  display: block;
  margin-bottom: 8rpx;
}
.profile-user-phone {
  font-size: 24rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 12rpx;
}
.profile-user-level {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-wrap: wrap;
}
.profile-level-tag {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  font-size: 22rpx;
  font-weight: 700;
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(249, 115, 22, 0.15);
  color: #ea580c;

  .level-star {
    font-size: 20rpx;
  }
}
.profile-member-badge {
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
  background: #e0e0e0;
  color: #757575;
}
.profile-user-actions {
  flex-shrink: 0;
}
.profile-edit-btn {
  padding: 12rpx 28rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $primary;
  background: rgba(249, 115, 22, 0.12);
  border: 2rpx solid rgba(249, 115, 22, 0.25);
  border-radius: 28rpx;

  &:active {
    background: rgba(249, 115, 22, 0.22);
    transform: scale(0.96);
  }
}

/* ===== 菜单项 ===== */
.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 32rpx;
  background: #faf8f5;
  border-radius: $radius-sm;
  border: 2rpx solid $border;
  margin-bottom: 16rpx;

  &:active {
    background: #f0ebe4;
  }
}
.profile-menu-icon {
  font-size: 44rpx;
  flex-shrink: 0;
  width: 72rpx;
  text-align: center;
}
.profile-menu-label {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: $text;
}
.profile-menu-value {
  font-size: 28rpx;
  font-weight: 700;
  color: $accent;
  flex-shrink: 0;
}
.profile-menu-badge {
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
  background: $primary;
  min-width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  border-radius: 20rpx;
  padding: 0 12rpx;
  flex-shrink: 0;
}
.profile-menu-arrow {
  font-size: 36rpx;
  color: $text-light;
  flex-shrink: 0;
  font-weight: 600;
}

/* 操作按钮（积分兑换 / 分佣提现） */
.integral-action-btn {
  padding: 10rpx 20rpx;
  background: linear-gradient(135deg, $primary, $accent);
  color: #fff;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 24rpx;
  flex-shrink: 0;

  &:active {
    opacity: 0.8;
  }
}
.commission-withdraw-btn {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

/* 分佣入口高亮 */
.commission-menu-entry {
  background: linear-gradient(135deg, #fff7ed 0%, #fff3e0 50%, #ffedd5 100%);
  border-color: rgba(249, 115, 22, 0.2);

  &:active {
    background: linear-gradient(135deg, #ffe8cc 0%, #ffe0b2 50%, #ffd8a8 100%);
  }
}
.commission-menu-value {
  font-size: 28rpx;
  font-weight: 800;
  color: #ea580c;
  flex-shrink: 0;
}

/* ===== 宠物档案 ===== */
.pet-archive-item {
  margin-bottom: 8rpx;

  &:active {
    background: #f0ebe4;
  }
}
.pet-list-add-btn {
  padding: 12rpx 28rpx;
  background: $primary;
  color: #fff;
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: 600;

  &:active {
    opacity: 0.8;
  }
}

/* 宠物列表 inline */
.pet-list-inline-body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 16rpx;
  padding: 0 8rpx;
}
.pet-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: $card-bg;
  border-radius: $radius;
  padding: 24rpx;
  box-shadow: $shadow-sm;

  &:active {
    background: #faf8f5;
  }
}
.pet-card-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-sm;
  background: $primary-light;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  flex-shrink: 0;
}
.pet-card-info {
  flex: 1;
  min-width: 0;
}
.pet-card-name {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  display: block;
  margin-bottom: 6rpx;
}
.pet-card-meta {
  font-size: 24rpx;
  color: $text-secondary;
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.pet-card-type {
  display: inline-block;
  font-size: 20rpx;
  color: $accent;
  background: rgba(251, 146, 60, 0.1);
  padding: 2rpx 12rpx;
  border-radius: 10rpx;
}
.pet-card-sep {
  color: $text-light;
}
.pet-card-actions {
  display: flex;
  gap: 24rpx;
  flex-shrink: 0;
}
.pet-card-edit,
.pet-card-del {
  font-size: 24rpx;
  color: $primary;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(249, 115, 22, 0.08);

  &:active {
    background: rgba(249, 115, 22, 0.18);
  }
}
.pet-card-del {
  color: #e05555;
  background: rgba(224, 85, 85, 0.08);

  &:active {
    background: rgba(224, 85, 85, 0.18);
  }
}

/* 宠物空状态 */
.pet-list-inline-empty {
  text-align: center;
  padding: 48rpx 32rpx;
  color: $text-light;
  font-size: 24rpx;
  background: $card-bg;
  border-radius: $radius-sm;
  margin-bottom: 16rpx;
}
</style>
