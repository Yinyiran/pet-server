<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { userApi } from '@/api'
import { maskPhone } from '@/utils'
import { isLoggedIn, checkLogin } from '@/utils/auth'

const userStore = useUserStore()

/** 宠物列表 */
const petList = ref<any[]>([])

async function loadPets() {
  if (!isLoggedIn()) return
  try { petList.value = await userApi.getPets() || [] } catch (e) { /* */ }
}

async function deletePet(id: number) {
  uni.showModal({
    title: '确认删除', content: '确定要删除该宠物吗？',
    success: async (res) => {
      if (res.confirm) {
        await userApi.deletePet(id)
        uni.showToast({ title: '已删除', icon: 'success' })
        loadPets()
      }
    }
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

function navigateTo(url: string) {
  if (!checkLogin()) return
  uni.navigateTo({ url })
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
  }
})
</script>

<template>
  <view class="page-container">
    <view class="header">
      <view class="header-inner"><text class="brand-title">🐾 我的</text></view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 用户信息卡片 -->
      <view class="user-card card" @tap="navigateTo('/pages/profile-edit/index')">
        <view class="user-avatar" @tap.stop="navigateTo('/pages/avatar-pick/index')">
          <text>{{ userStore.avatar }}</text>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userStore.nickName }}</text>
          <text class="user-phone" v-if="userStore.profile?.phone">{{ maskPhone(userStore.profile.phone) }}</text>
          <view class="user-tags">
            <text class="level-tag">{{ userStore.profile?.level || '普通用户' }}</text>
            <text class="member-badge">{{ userStore.profile?.memberLevel || '🥈 银牌会员' }}</text>
          </view>
        </view>
        <button class="btn-outline edit-btn" @tap.stop="navigateTo('/pages/profile-edit/index')">编辑</button>
      </view>

      <!-- 宠物档案 -->
      <view class="menu-item pet-menu">
        <text class="menu-icon">🐾</text>
        <text class="menu-label">宠物档案</text>
        <button class="btn-outline add-pet-btn" @tap="addPet">+ 添加宠物</button>
      </view>
      <view class="pet-list" v-if="petList.length">
        <view class="pet-card" v-for="pet in petList" :key="pet.id">
          <text class="pet-emoji">{{ pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐰' }}</text>
          <view class="pet-info">
            <text class="pet-name">{{ pet.name }}</text>
            <text class="pet-breed">{{ pet.breed }} · {{ pet.weight }}kg</text>
          </view>
          <view class="pet-actions">
            <text @tap="editPet(pet)">编辑</text>
            <text @tap="deletePet(pet.id)">删除</text>
          </view>
        </view>
      </view>
      <view v-else class="pet-empty"><text>还没有添加宠物</text></view>

      <!-- 菜单列表 -->
      <view class="menu-item" @tap="navigateTo('/pages/quiz/index')">
        <text class="menu-icon">⭐</text><text class="menu-label">我的积分</text>
        <text class="menu-value">{{ userStore.points }}</text><text class="menu-arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">💸</text><text class="menu-label">分佣收益</text>
        <text class="menu-value">¥0.00</text><text class="menu-arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">👥</text><text class="menu-label">我的团队</text>
        <text class="menu-value">{{ userStore.profile?.inviteCount || 0 }}</text><text class="menu-arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">💰</text><text class="menu-label">充值管理</text><text class="menu-arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">📦</text><text class="menu-label">我的订单</text><text class="menu-arrow">›</text>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.header { background: $header-gradient; padding: 24rpx 32rpx; }
.header-inner { display: flex; align-items: center; justify-content: center; }
.brand-title { font-size: 36rpx; font-weight: 700; color: $text; }

.user-card {
  display: flex; align-items: center; gap: 20rpx;
}
.user-avatar {
  width: 100rpx; height: 100rpx; border-radius: 50%;
  background: $primary-light; display: flex; align-items: center; justify-content: center; font-size: 48rpx;
}
.user-info { flex: 1; }
.user-name { font-size: 32rpx; font-weight: 700; display: block; }
.user-phone { font-size: 24rpx; color: $text-secondary; display: block; margin: 4rpx 0; }
.user-tags { display: flex; gap: 8rpx; margin-top: 8rpx; }
.level-tag {
  font-size: 20rpx; background: linear-gradient(135deg, $primary, $accent); color: #fff;
  padding: 4rpx 12rpx; border-radius: 20rpx;
}
.member-badge { font-size: 20rpx; background: $bg; padding: 4rpx 12rpx; border-radius: 20rpx; }
.edit-btn { font-size: 22rpx; padding: 8rpx 20rpx; }

.menu-item {
  display: flex; align-items: center; background: $card-bg; margin: 0 24rpx 2rpx;
  padding: 28rpx 24rpx; gap: 16rpx;
  &:first-of-type { border-radius: $radius-lg $radius-lg 0 0; margin-top: 20rpx; }
  &:last-of-type { border-radius: 0 0 $radius-lg $radius-lg; margin-bottom: 20rpx; }
}
.pet-menu { border-radius: $radius-lg $radius-lg 0 0 !important; margin-top: 20rpx; }
.menu-icon { font-size: 32rpx; }
.menu-label { flex: 1; font-size: 28rpx; }
.menu-value { font-size: 26rpx; color: $primary; font-weight: 600; }
.menu-arrow { font-size: 28rpx; color: $text-light; }
.add-pet-btn { font-size: 22rpx; padding: 8rpx 16rpx; }

.pet-list { background: $card-bg; margin: 0 24rpx 2rpx; padding: 0 24rpx; }
.pet-card {
  display: flex; align-items: center; padding: 20rpx 0; border-top: 1rpx solid $border; gap: 16rpx;
}
.pet-emoji { font-size: 40rpx; }
.pet-info { flex: 1; }
.pet-name { font-size: 28rpx; font-weight: 600; display: block; }
.pet-breed { font-size: 22rpx; color: $text-secondary; }
.pet-actions { display: flex; gap: 24rpx; font-size: 24rpx; color: $primary; }
.pet-empty { background: $card-bg; margin: 0 24rpx; padding: 40rpx; text-align: center; color: $text-light; border-radius: 0 0 $radius-lg $radius-lg; }
</style>
