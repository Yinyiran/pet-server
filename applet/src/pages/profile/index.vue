<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store'
import { userApi } from '@/api'
import { maskPhone } from '@/utils'
import { isLoggedIn, checkLogin } from '@/utils/auth'

const userStore = useUserStore()

/** 宠物列表 */
const petList = ref<any[]>([])
const showPetForm = ref(false)
const petForm = ref({ type: 'cat', name: '', breed: '', weight: '', birthday: '' })
const editingPetId = ref<number | null>(null)

async function loadPets() {
  if (!isLoggedIn()) return
  try { petList.value = await userApi.getPets() || [] } catch (e) { /* */ }
}

function selectPetType(type: string) { petForm.value.type = type }

async function savePet() {
  if (!petForm.value.name || !petForm.value.breed) {
    uni.showToast({ title: '请填写必填项', icon: 'none' }); return
  }
  try {
    if (editingPetId.value) {
      await userApi.updatePet({ id: editingPetId.value, ...petForm.value })
    } else {
      await userApi.createPet(petForm.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    showPetForm.value = false
    loadPets()
  } catch (e) { /* */ }
}

function openPetForm(pet?: any) {
  if (pet) {
    editingPetId.value = pet.id
    petForm.value = { type: pet.type, name: pet.name, breed: pet.breed, weight: String(pet.weight || ''), birthday: pet.birthday || '' }
  } else {
    editingPetId.value = null
    petForm.value = { type: 'cat', name: '', breed: '', weight: '', birthday: '' }
  }
  showPetForm.value = true
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

/** 个人资料编辑 */
const showProfileEdit = ref(false)
const profileForm = ref({ nickName: '', phone: '' })
function openProfileEdit() {
  profileForm.value = { nickName: userStore.profile?.nickName || '', phone: userStore.profile?.phone || '' }
  showProfileEdit.value = true
}
async function saveProfile() {
  try {
    await userStore.updateProfile(profileForm.value)
    uni.showToast({ title: '保存成功', icon: 'success' })
    showProfileEdit.value = false
  } catch (e) { /* */ }
}

/** 头像选择 */
const showAvatarPicker = ref(false)
const avatarOptions = ['🐱','🐶','🐰','🐹','🐼','🐨','🦊','🐯','🐮','🐷','🐸','🐙']
async function selectAvatar(emoji: string) {
  await userStore.updateProfile({ avatar: emoji })
  showAvatarPicker.value = false
}

function navigateTo(url: string) {
  if (!checkLogin()) return
  uni.navigateTo({ url })
}

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
      <view class="user-card card" @tap="openProfileEdit">
        <view class="user-avatar" @tap.stop="showAvatarPicker = true">
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
        <button class="btn-outline edit-btn" @tap.stop="openProfileEdit">编辑</button>
      </view>

      <!-- 宠物档案 -->
      <view class="menu-item pet-menu">
        <text class="menu-icon">🐾</text>
        <text class="menu-label">宠物档案</text>
        <button class="btn-outline add-pet-btn" @tap="openPetForm()">+ 添加宠物</button>
      </view>
      <view class="pet-list" v-if="petList.length">
        <view class="pet-card" v-for="pet in petList" :key="pet.id">
          <text class="pet-emoji">{{ pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐰' }}</text>
          <view class="pet-info">
            <text class="pet-name">{{ pet.name }}</text>
            <text class="pet-breed">{{ pet.breed }} · {{ pet.weight }}kg</text>
          </view>
          <view class="pet-actions">
            <text @tap="openPetForm(pet)">编辑</text>
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

    <!-- 宠物表单弹窗 -->
    <uni-popup v-if="showPetForm" type="bottom" @change="(v: boolean) => showPetForm = v">
      <view class="sheet">
        <view class="sheet-handle" />
        <view class="sheet-title">{{ editingPetId ? '编辑宠物' : '添加宠物' }}</view>
        <view class="form-field">
          <text class="form-label">宠物类型 *</text>
          <view class="type-chips">
            <view class="type-chip" :class="{ active: petForm.type === 'cat' }" @tap="selectPetType('cat')">🐱 猫咪</view>
            <view class="type-chip" :class="{ active: petForm.type === 'dog' }" @tap="selectPetType('dog')">🐶 狗狗</view>
            <view class="type-chip" :class="{ active: petForm.type === 'other' }" @tap="selectPetType('other')">🐰 其他</view>
          </view>
        </view>
        <view class="form-field">
          <text class="form-label">宠物名称 *</text>
          <input class="form-input" v-model="petForm.name" placeholder="给爱宠取个名字" maxlength="10" />
        </view>
        <view class="form-field">
          <text class="form-label">品种 *</text>
          <input class="form-input" v-model="petForm.breed" placeholder="如：英短、泰迪" maxlength="15" />
        </view>
        <view class="form-field">
          <text class="form-label">体重(kg)</text>
          <input class="form-input" v-model="petForm.weight" type="digit" placeholder="如：5.5" />
        </view>
        <view class="form-field">
          <text class="form-label">生日</text>
          <picker mode="date" @change="(e: any) => petForm.birthday = e.detail.value">
            <view class="form-input">{{ petForm.birthday || '请选择日期' }}</view>
          </picker>
        </view>
        <view class="form-actions">
          <button class="btn-outline" @tap="showPetForm = false">取消</button>
          <button class="btn-primary" @tap="savePet">保存</button>
        </view>
      </view>
    </uni-popup>

    <!-- 头像选择弹窗 -->
    <uni-popup v-if="showAvatarPicker" type="bottom" @change="(v: boolean) => showAvatarPicker = v">
      <view class="sheet">
        <view class="sheet-handle" />
        <view class="sheet-title">选择头像</view>
        <view class="avatar-grid">
          <view v-for="a in avatarOptions" :key="a" class="avatar-option" @tap="selectAvatar(a)">{{ a }}</view>
        </view>
      </view>
    </uni-popup>

    <!-- 个人资料编辑弹窗 -->
    <uni-popup v-if="showProfileEdit" type="bottom" @change="(v: boolean) => showProfileEdit = v">
      <view class="sheet">
        <view class="sheet-handle" />
        <view class="sheet-title">编辑个人信息</view>
        <view class="form-field">
          <text class="form-label">昵称</text>
          <input class="form-input" v-model="profileForm.nickName" placeholder="请输入昵称" maxlength="15" />
        </view>
        <view class="form-field">
          <text class="form-label">手机号</text>
          <input class="form-input" v-model="profileForm.phone" type="number" placeholder="请输入手机号" maxlength="11" />
        </view>
        <view class="form-actions">
          <button class="btn-outline" @tap="showProfileEdit = false">取消</button>
          <button class="btn-primary" @tap="saveProfile">保存</button>
        </view>
      </view>
    </uni-popup>
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
.menu-badge { font-size: 22rpx; background: $danger; color: #fff; padding: 2rpx 12rpx; border-radius: 20rpx; }
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

.sheet {
  background: $card-bg; border-radius: 32rpx 32rpx 0 0; padding: 32rpx; max-height: 80vh; overflow-y: auto;
}
.sheet-handle { width: 60rpx; height: 8rpx; background: $border; border-radius: 4rpx; margin: 0 auto 24rpx; }
.sheet-title { font-size: 32rpx; font-weight: 700; text-align: center; margin-bottom: 32rpx; }
.form-field { margin-bottom: 24rpx; }
.form-label { font-size: 26rpx; color: $text-secondary; margin-bottom: 8rpx; display: block; }
.form-input { background: $bg; padding: 20rpx 24rpx; border-radius: $radius; font-size: 28rpx; width: 100%; }
.type-chips { display: flex; gap: 16rpx; }
.type-chip {
  flex: 1; text-align: center; padding: 20rpx; background: $bg; border-radius: $radius; font-size: 26rpx;
  border: 2rpx solid transparent;
  &.active { border-color: $primary; background: $primary-light; }
}
.form-actions { display: flex; gap: 16rpx; margin-top: 32rpx;
  button { flex: 1; }
}

.avatar-grid {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 24rpx; margin-bottom: 32rpx;
}
.avatar-option {
  width: 80rpx; height: 80rpx; display: flex; align-items: center; justify-content: center;
  font-size: 40rpx; background: $bg; border-radius: 50%; margin: 0 auto;
}
</style>
