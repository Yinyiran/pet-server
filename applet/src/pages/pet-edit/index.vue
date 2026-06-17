<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '@/api'

const petForm = ref({ type: 'cat', name: '', breed: '', weight: '', birthday: '' })
const editingPetId = ref<number | null>(null)
const saving = ref(false)

onLoad((options: any) => {
  if (options?.pet) {
    try {
      const pet = JSON.parse(decodeURIComponent(options.pet))
      editingPetId.value = pet.id
      petForm.value = {
        type: pet.type || 'cat',
        name: pet.name || '',
        breed: pet.breed || '',
        weight: pet.weight ? String(pet.weight) : '',
        birthday: pet.birthday || '',
      }
    } catch (e) { /* ignore */ }
  }
})

function selectPetType(type: string) {
  petForm.value.type = type
}

async function savePet() {
  if (!petForm.value.name || !petForm.value.breed) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }
  saving.value = true
  try {
    if (editingPetId.value) {
      await userApi.updatePet({ id: editingPetId.value, ...petForm.value })
    } else {
      await userApi.createPet(petForm.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    uni.$emit('pet-saved')
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function deletePet() {
  if (!editingPetId.value) return
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该宠物吗？',
    success: async (res) => {
      if (res.confirm) {
        await userApi.deletePet(editingPetId.value!)
        uni.showToast({ title: '已删除', icon: 'success' })
        uni.$emit('pet-saved')
        setTimeout(() => uni.navigateBack(), 500)
      }
    },
  })
}
</script>

<template>
  <view class="page-container">
    <!-- 顶部 -->
    <view class="page-header">
      <view class="back-btn" @tap="uni.navigateBack()">
        <view class="arrow-icon" />
        <text>返回</text>
      </view>
      <text class="page-title">{{ editingPetId ? '编辑宠物' : '添加宠物' }}</text>
      <view v-if="editingPetId" class="delete-btn" @tap="deletePet">
        <text>删除</text>
      </view>
      <view v-else style="width: 80rpx" />
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 宠物类型 -->
      <view class="section">
        <text class="section-title">宠物类型</text>
        <view class="type-chips">
          <view class="type-chip" :class="{ active: petForm.type === 'cat' }" @tap="selectPetType('cat')">
            <text class="chip-emoji">🐱</text>
            <text class="chip-label">猫咪</text>
          </view>
          <view class="type-chip" :class="{ active: petForm.type === 'dog' }" @tap="selectPetType('dog')">
            <text class="chip-emoji">🐶</text>
            <text class="chip-label">狗狗</text>
          </view>
          <view class="type-chip" :class="{ active: petForm.type === 'other' }" @tap="selectPetType('other')">
            <text class="chip-emoji">🐰</text>
            <text class="chip-label">其他</text>
          </view>
        </view>
      </view>

      <!-- 表单 -->
      <view class="section">
        <text class="section-title">基本信息</text>
        <view class="form-card">
          <view class="form-field">
            <text class="form-label">宠物名称 <text class="required">*</text></text>
            <input class="form-input" v-model="petForm.name" placeholder="给爱宠取个名字" maxlength="10" />
          </view>
          <view class="form-field">
            <text class="form-label">品种 <text class="required">*</text></text>
            <input class="form-input" v-model="petForm.breed" placeholder="如：英短、泰迪" maxlength="15" />
          </view>
          <view class="form-field">
            <text class="form-label">体重(kg)</text>
            <input class="form-input" v-model="petForm.weight" type="digit" placeholder="如：5.5" />
          </view>
          <view class="form-field">
            <text class="form-label">生日</text>
            <picker mode="date" @change="(e: any) => petForm.birthday = e.detail.value">
              <view class="form-input" :class="{ placeholder: !petForm.birthday }">
                {{ petForm.birthday || '请选择日期' }}
              </view>
            </picker>
          </view>
        </view>
      </view>

      <view style="height: 120rpx" />
    </scroll-view>

    <!-- 底部保存 -->
    <view class="bottom-bar safe-bottom">
      <button class="btn-save" :loading="saving" @tap="savePet">保存</button>
    </view>
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

.page-header {
  background: $header-gradient;
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 16rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: $primary;
  width: 80rpx;
}
.arrow-icon {
  width: 16rpx;
  height: 16rpx;
  border-top: 4rpx solid $primary;
  border-left: 4rpx solid $primary;
  transform: rotate(-45deg);
}
.page-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text;
}
.delete-btn {
  font-size: 26rpx;
  color: $danger;
  width: 80rpx;
  text-align: right;
}

.scroll-content {
  flex: 1;
}

.section {
  padding: 24rpx 32rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text;
  margin-bottom: 20rpx;
  display: block;
}

.type-chips {
  display: flex;
  gap: 16rpx;
}
.type-chip {
  flex: 1;
  text-align: center;
  padding: 28rpx 16rpx;
  background: $card-bg;
  border-radius: $radius-lg;
  border: 2rpx solid transparent;
  box-shadow: $shadow-sm;
  transition: all $transition;

  &.active {
    border-color: $primary;
    background: $primary-light;
    box-shadow: 0 4rpx 16rpx rgba(249, 115, 22, 0.15);
  }
}
.chip-emoji {
  font-size: 40rpx;
  display: block;
  margin-bottom: 8rpx;
}
.chip-label {
  font-size: 26rpx;
  color: $text-secondary;

  .active & {
    color: $primary;
    font-weight: 600;
  }
}

.form-card {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 8rpx 24rpx;
  box-shadow: $shadow-sm;
}
.form-field {
  padding: 24rpx 0;
  border-bottom: 1rpx solid $border;

  &:last-child {
    border-bottom: none;
  }
}
.form-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-bottom: 12rpx;
  display: block;
}
.required {
  color: $danger;
}
.form-input {
  background: $bg;
  padding: 20rpx 24rpx;
  border-radius: $radius;
  font-size: 28rpx;
  color: $text;
  width: 100%;
  box-sizing: border-box;

  &.placeholder {
    color: $text-light;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 32rpx;
  background: $card-bg;
  border-top: 1rpx solid $border;
}
.btn-save {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  border-radius: $radius-lg;
  border: none;
}

.safe-bottom {
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}
</style>
