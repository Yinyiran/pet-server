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

const showCoopForm = ref(false)
const coopData = ref({ type: '', name: '', contact: '', phone: '', city: '杭州市', address: '', desc: '', wechat: '' })

async function submitCoop() {
  if (!coopData.value.type || !coopData.value.name || !coopData.value.contact || !coopData.value.phone) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }
  try {
    await merchantApi.apply(coopData.value)
    uni.showToast({ title: '提交成功', icon: 'success' })
    showCoopForm.value = false
  } catch (e) {
    console.error(e)
  }
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
      <view class="coop-entry card" @tap="showCoopForm = true">
        <text class="coop-icon">🤝</text>
        <view class="coop-text">
          <text class="coop-title">申请合作入驻</text>
          <text class="coop-desc">宠物店、医院、美容院等商家免费入驻</text>
        </view>
        <text class="coop-arrow">›</text>
      </view>

      <view style="height: 40rpx" />
    </scroll-view>

    <!-- 合作表单弹窗 -->
    <uni-popup ref="coopPopup" type="bottom" :is-mask-click="true" @change="(v: boolean) => showCoopForm = v" v-if="showCoopForm">
      <view class="coop-sheet">
        <view class="sheet-handle" />
        <view class="sheet-title">申请合作入驻</view>
        <view class="form-field">
          <text class="form-label">商户类型 *</text>
          <picker :range="['宠物店','宠物医院','宠物美容','宠物乐园','线下聚会','其他']" @change="(e: any) => coopData.type = e.detail.value">
            <view class="form-input">{{ coopData.type || '请选择' }}</view>
          </picker>
        </view>
        <view class="form-field">
          <text class="form-label">商户名称 *</text>
          <input class="form-input" v-model="coopData.name" placeholder="请输入商户名称" />
        </view>
        <view class="form-field">
          <text class="form-label">联系人 *</text>
          <input class="form-input" v-model="coopData.contact" placeholder="请输入联系人" />
        </view>
        <view class="form-field">
          <text class="form-label">联系电话 *</text>
          <input class="form-input" v-model="coopData.phone" type="number" placeholder="请输入手机号" maxlength="11" />
        </view>
        <view class="form-field">
          <text class="form-label">商户简介</text>
          <textarea class="form-textarea" v-model="coopData.desc" placeholder="简要介绍您的商户" maxlength="200" />
        </view>
        <button class="btn-primary" style="width: 100%; margin-top: 24rpx" @tap="submitCoop">提交申请</button>
      </view>
    </uni-popup>
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

.coop-sheet {
  background: $card-bg;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  max-height: 80vh;
  overflow-y: auto;
}
.sheet-handle {
  width: 60rpx;
  height: 8rpx;
  background: $border;
  border-radius: 4rpx;
  margin: 0 auto 24rpx;
}
.sheet-title {
  font-size: 32rpx;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32rpx;
}
.form-field {
  margin-bottom: 24rpx;
}
.form-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-bottom: 8rpx;
  display: block;
}
.form-input {
  background: $bg;
  padding: 20rpx 24rpx;
  border-radius: $radius;
  font-size: 28rpx;
}
.form-textarea {
  background: $bg;
  padding: 20rpx 24rpx;
  border-radius: $radius;
  font-size: 28rpx;
  width: 100%;
  height: 160rpx;
}
</style>
