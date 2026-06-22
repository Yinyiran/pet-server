<script setup lang="ts">
import { merchantProductApi, categoryApi } from '@/api'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const productId = ref(0)
const isEdit = computed(() => productId.value > 0)
const loading = ref(false)
const submitting = ref(false)

const form = ref({
  name: '',
  price: '',
  originalPrice: '',
  stock: '',
  category: '',
  tags: '',
  imgUrl: '',
  gallery: null as string[] | null,
  description: '',
  isActive: 1,
})

const images = ref<string[]>([])
const categories = ref<any[]>([])
const tagInput = ref('')

/** 加载分类 */
async function loadCategories() {
  try {
    const tree = await categoryApi.getTree()
    if (tree?.length) categories.value = flattenTree(tree)
  } catch (e) { /* ignore */ }
}

function flattenTree(nodes: any[], result: any[] = []): any[] {
  nodes.forEach(n => {
    result.push(n)
    if (n.children?.length) flattenTree(n.children, result)
  })
  return result
}

/** 加载商品详情（编辑模式） */
async function loadProduct() {
  if (!productId.value) return
  loading.value = true
  try {
    const data = await merchantProductApi.getDetail(productId.value)
    if (data) {
      form.value = {
        name: data.name || '',
        price: String(data.price || ''),
        originalPrice: data.originalPrice ? String(data.originalPrice) : '',
        stock: String(data.stock || 0),
        category: data.category || '',
        tags: data.tags || '',
        imgUrl: data.imgUrl || '',
        gallery: Array.isArray(data.gallery) ? data.gallery : (data.gallery ? String(data.gallery).split(',') : []),
        description: data.description || '',
        isActive: data.isActive ?? 1,
      }
      images.value = form.value.gallery || (data.imgUrl ? [data.imgUrl] : [])
    }
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

/** 选择图片 */
function chooseImages() {
  const remaining = 9 - images.value.length
  if (remaining <= 0) {
    uni.showToast({ title: '最多9张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: remaining,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      uni.showLoading({ title: '上传中...' })
      for (const tempPath of res.tempFilePaths) {
        try {
          const url = await uploadImage(tempPath)
          if (url) images.value.push(url)
        } catch (e) { /* skip */ }
      }
      uni.hideLoading()
    },
  })
}

function removeImage(idx: number) {
  images.value.splice(idx, 1)
}

/** 上传图片到 OSS */
function uploadImage(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token') || ''
    uni.uploadFile({
      url: `${BASE_URL}/common/upload/oss`,
      filePath,
      name: 'file',
      header: { Authorization: `Bearer ${token}` },
      success: (res: any) => {
        try {
          const data = JSON.parse(res.data)
          resolve(data.url || data.data?.url || '')
        } catch { resolve('') }
      },
      fail: reject,
    })
  })
}

/** 添加标签 */
function addTag() {
  const tag = tagInput.value.trim()
  if (!tag) return
  const current = form.value.tags ? form.value.tags.split(',') : []
  if (!current.includes(tag)) {
    current.push(tag)
    form.value.tags = current.join(',')
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  const current = form.value.tags ? form.value.tags.split(',').filter(t => t !== tag) : []
  form.value.tags = current.join(',')
}

/** 切换分类 */
function toggleCategory(id: any) {
  const current = form.value.category ? form.value.category.split(',').map(String) : []
  const idStr = String(id)
  const idx = current.indexOf(idStr)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(idStr)
  form.value.category = current.join(',')
}

function isSelectedCategory(id: any): boolean {
  const current = form.value.category ? form.value.category.split(',') : []
  return current.includes(String(id))
}

/** 提交表单 */
async function submitForm() {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' }); return
  }
  if (!form.value.price || Number(form.value.price) <= 0) {
    uni.showToast({ title: '请输入售价', icon: 'none' }); return
  }
  if (!images.value.length) {
    uni.showToast({ title: '请上传至少一张商品图片', icon: 'none' }); return
  }

  submitting.value = true
  try {
    const submitData: any = {
      name: form.value.name.trim(),
      price: Number(form.value.price),
      originalPrice: form.value.originalPrice ? Number(form.value.originalPrice) : null,
      stock: form.value.stock ? Number(form.value.stock) : 0,
      category: form.value.category || null,
      tags: form.value.tags || null,
      imgUrl: images.value[0] || '',
      gallery: images.value.length ? images.value : null,
      description: form.value.description || null,
      isActive: form.value.isActive,
    }

    if (isEdit.value) {
      submitData.id = productId.value
      await merchantProductApi.update(submitData)
      uni.showToast({ title: '更新成功', icon: 'success' })
    } else {
      await merchantProductApi.create(submitData)
      uni.showToast({ title: '新增成功', icon: 'success' })
    }

    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e: any) {
    uni.showToast({ title: e.message || '操作失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function goBack() {
  uni.navigateBack()
}

onLoad((options: any) => {
  if (options?.id) {
    productId.value = Number(options.id)
  }
})

loadCategories()
if (productId.value) loadProduct()
</script>

<template>
  <view class="page-container">
    <!-- Header -->
    <view class="header">
      <view class="header-inner">
        <view class="header-back" @tap="goBack">
          <view class="back-arrow" />
        </view>
        <text class="header-title">{{ isEdit ? '编辑商品' : '新增商品' }}</text>
        <view class="header-placeholder" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <view v-if="loading" class="loading-wrap">
        <view class="loading-spinner" />
        <text>加载中...</text>
      </view>

      <view v-else class="form-wrap">
        <!-- 商品图片 -->
        <view class="form-section">
          <text class="section-title">商品图片</text>
          <view class="image-grid">
            <view class="img-item" v-for="(img, idx) in images" :key="idx">
              <image class="img-thumb" :src="img" mode="aspectFill" />
              <view class="img-remove" @tap="removeImage(idx)">✕</view>
            </view>
            <view v-if="images.length < 9" class="img-add" @tap="chooseImages">
              <text class="add-icon">+</text>
              <text class="add-text">添加</text>
            </view>
          </view>
        </view>

        <!-- 基本信息 -->
        <view class="form-section">
          <text class="section-title">基本信息</text>
          <view class="form-field">
            <text class="field-label">商品名称 *</text>
            <input class="field-input" v-model="form.name" placeholder="请输入商品名称" />
          </view>
          <view class="form-row">
            <view class="form-field half">
              <text class="field-label">售价 *</text>
              <input class="field-input" v-model="form.price" type="digit" placeholder="0.00" />
            </view>
            <view class="form-field half">
              <text class="field-label">原价</text>
              <input class="field-input" v-model="form.originalPrice" type="digit" placeholder="0.00" />
            </view>
          </view>
          <view class="form-field">
            <text class="field-label">库存</text>
            <input class="field-input" v-model="form.stock" type="number" placeholder="0" />
          </view>
        </view>

        <!-- 分类 -->
        <view class="form-section" v-if="categories.length">
          <text class="section-title">商品分类</text>
          <view class="tag-grid">
            <view
              v-for="cat in categories" :key="cat.id"
              class="tag-chip" :class="{ active: isSelectedCategory(cat.id) }"
              @tap="toggleCategory(cat.id)"
            >
              {{ cat.name }}
            </view>
          </view>
        </view>

        <!-- 标签 -->
        <view class="form-section">
          <text class="section-title">标签</text>
          <view class="tag-input-row">
            <input class="tag-input" v-model="tagInput" placeholder="输入标签后点添加" @confirm="addTag" />
            <view class="tag-add-btn" @tap="addTag">添加</view>
          </view>
          <view class="tag-list" v-if="form.tags">
            <view class="tag-item" v-for="tag in form.tags.split(',').filter(Boolean)" :key="tag">
              <text>{{ tag }}</text>
              <text class="tag-del" @tap="removeTag(tag)">✕</text>
            </view>
          </view>
        </view>

        <!-- 描述 -->
        <view class="form-section">
          <text class="section-title">商品描述</text>
          <textarea
            class="field-textarea"
            v-model="form.description"
            placeholder="请输入商品描述..."
            :maxlength="5000"
            auto-height
          />
        </view>

        <!-- 上架开关 -->
        <view class="form-section switch-section">
          <text class="section-title">上架状态</text>
          <switch :checked="form.isActive === 1" @change="(e: any) => form.isActive = e.detail.value ? 1 : 0" color="#f97316" />
        </view>
      </view>

      <view style="height: 140rpx" />
    </scroll-view>

    <!-- 底部提交 -->
    <view class="bottom-bar">
      <view class="submit-btn" :class="{ disabled: submitting }" @tap="submitForm">
        {{ submitting ? '提交中...' : (isEdit ? '保存修改' : '立即发布') }}
      </view>
    </view>
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
}
.header-inner { display: flex; align-items: center; justify-content: space-between; }
.header-back {
  width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: rgba(255,255,255,0.5);
}
.back-arrow {
  width: 18rpx; height: 18rpx; border-left: 4rpx solid $text; border-bottom: 4rpx solid $text;
  transform: rotate(45deg); margin-left: 6rpx;
}
.header-title { font-size: 36rpx; font-weight: 700; color: $text; }
.header-placeholder { width: 56rpx; }

/* Scroll */
.scroll-content { flex: 1; }
.form-wrap { padding: 24rpx; }

/* Section */
.form-section {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: $shadow-sm;
}
.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: $text;
  display: block;
  margin-bottom: 20rpx;
}

/* Image grid */
.image-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.img-item {
  width: 160rpx; height: 160rpx; border-radius: $radius; overflow: hidden; position: relative;
}
.img-thumb { width: 100%; height: 100%; }
.img-remove {
  position: absolute; top: 4rpx; right: 4rpx; width: 36rpx; height: 36rpx;
  background: rgba(0,0,0,0.5); color: #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 20rpx;
}
.img-add {
  width: 160rpx; height: 160rpx; border-radius: $radius; border: 3rpx dashed $border;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8rpx;
  &:active { background: $bg; }
}
.add-icon { font-size: 48rpx; color: $text-light; line-height: 1; }
.add-text { font-size: 22rpx; color: $text-light; }

/* Fields */
.form-field { margin-bottom: 16rpx; }
.form-field:last-child { margin-bottom: 0; }
.field-label { font-size: 24rpx; color: $text-secondary; display: block; margin-bottom: 8rpx; }
.field-input {
  width: 100%; padding: 18rpx 24rpx; background: $bg; border-radius: $radius-sm;
  font-size: 28rpx; color: $text; border: none;
}
.field-textarea {
  width: 100%; min-height: 180rpx; padding: 18rpx 24rpx; background: $bg;
  border-radius: $radius-sm; font-size: 26rpx; color: $text; line-height: 1.6;
}
.form-row { display: flex; gap: 16rpx; }
.form-field.half { flex: 1; }

/* Tags */
.tag-grid { display: flex; flex-wrap: wrap; gap: 12rpx; }
.tag-chip {
  padding: 10rpx 24rpx; border-radius: 24rpx; font-size: 24rpx; font-weight: 500;
  color: $text-secondary; background: $bg; border: 2rpx solid $border;
  &:active { opacity: 0.8; }
  &.active { background: $primary; color: #fff; border-color: $primary; }
}
.tag-input-row { display: flex; gap: 12rpx; margin-bottom: 16rpx; }
.tag-input {
  flex: 1; padding: 16rpx 24rpx; background: $bg; border-radius: $radius-sm;
  font-size: 26rpx; color: $text;
}
.tag-add-btn {
  padding: 16rpx 28rpx; background: $primary; color: #fff; border-radius: $radius-sm;
  font-size: 24rpx; font-weight: 600; flex-shrink: 0;
  &:active { opacity: 0.8; }
}
.tag-list { display: flex; flex-wrap: wrap; gap: 12rpx; }
.tag-item {
  display: inline-flex; align-items: center; gap: 8rpx; padding: 8rpx 20rpx;
  background: rgba(249,115,22,0.1); border-radius: 20rpx; font-size: 24rpx; color: $primary;
}
.tag-del { font-size: 20rpx; color: $text-light; }

/* Switch section */
.switch-section {
  display: flex; align-items: center; justify-content: space-between;
  .section-title { margin-bottom: 0; }
}

/* Loading */
.loading-wrap { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; color: $text-light; font-size: 24rpx; gap: 12rpx; }
.loading-spinner { width: 40rpx; height: 40rpx; border: 3rpx solid $border; border-top-color: $primary; border-radius: 50%; animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Bottom bar */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom, 0) + 20rpx);
  background: $card-bg; box-shadow: 0 -2px 12px rgba(0,0,0,0.06); z-index: 100;
}
.submit-btn {
  background: linear-gradient(135deg, $primary, $accent);
  color: #fff; text-align: center; padding: 24rpx; border-radius: 40rpx;
  font-size: 30rpx; font-weight: 700;
  box-shadow: 0 4rpx 16rpx rgba(249,115,22,0.35);
  &:active { opacity: 0.85; transform: scale(0.98); }
  &.disabled { opacity: 0.5; }
}
</style>
