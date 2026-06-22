<template>
  <div class="map-picker">
    <div class="map-toolbar">
      <el-input v-model="searchText" placeholder="搜索地点（如：北京动物园）" clearable @input="onSearch" @clear="searchResults = []"
        prefix-icon="Search" style="flex: 1" />
      <el-button :icon="Location" @click="locateMe" :loading="locating" title="定位到当前位置">定位</el-button>
    </div>
    <!-- 搜索结果下拉 -->
    <div v-if="searchResults.length" class="search-results">
      <div v-for="(item, index) in searchResults" :key="index" class="search-item" @click="selectSearchResult(item)">
        <span class="item-title">{{ item.title }}</span>
        <span class="item-address">{{ item.address }}</span>
      </div>
    </div>
    <!-- 地图容器 -->
    <div ref="mapRef" class="map-container" />
    <!-- 底部信息 -->
    <div class="map-info">
      <div class="info-row" v-if="address">
        <el-icon>
          <Location />
        </el-icon>
        <span class="address-text">{{ address }}</span>
      </div>
      <div class="info-row coords" v-if="modelValue.lng != null && modelValue.lat != null">
        <span>经度: {{ modelValue.lng.toFixed(6) }}</span>
        <span>纬度: {{ modelValue.lat.toFixed(6) }}</span>
        <el-button type="primary" link size="small" @click="copyCoords">复制坐标</el-button>
      </div>
      <div class="info-row" v-if="!address && (modelValue.lng == null)">
        <el-icon style="color: #E6A23C">
          <Warning />
        </el-icon>
        <span style="color: #909399; font-size: 12px">请在地图上点击选取位置，或搜索地点</span>
      </div>
    </div>
    <!-- 加载遮罩 -->
    <div v-if="mapLoading" class="map-loading">
      <el-icon class="is-loading" :size="24">
        <Loading />
      </el-icon>
      <span>地图加载中...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Location, Warning, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lng: null, lat: null })
  }
})

const emit = defineEmits(['update:modelValue', 'address-change'])

const mapRef = ref(null)
const searchText = ref('')
const searchResults = ref([])
const address = ref('')
const locating = ref(false)
const mapLoading = ref(true)

let map = null
let markerLayer = null
let geocoder = null
let searchTimer = null
let scriptLoadPromise = null

// 默认中心（北京）
const DEFAULT_CENTER = { lat: 39.908823, lng: 116.397470 }

/**
 * 动态加载腾讯地图 JavaScript API GL
 */
function loadTMapScript() {
  if (window.TMap) return Promise.resolve(window.TMap)
  if (scriptLoadPromise) return scriptLoadPromise

  const key = import.meta.env.VITE_APP_TENCENT_MAP_KEY
  if (!key || key === 'YOUR_TENCENT_MAP_KEY') {
    return Promise.reject(new Error('请在环境变量 VITE_APP_TENCENT_MAP_KEY 中配置腾讯地图 API Key'))
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.charset = 'utf-8'
    script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${key}&libraries=service`
    script.onload = () => window.TMap ? resolve(window.TMap) : reject(new Error('腾讯地图加载失败'))
    script.onerror = () => reject(new Error('腾讯地图脚本加载失败'))
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}

/**
 * 更新或创建标记点
 */
function updateMarker(lng, lat) {
  if (!map || !window.TMap) return
  const position = new window.TMap.LatLng(lat, lng)

  if (markerLayer) {
    markerLayer.setGeometries([{
      id: 'pick',
      position,
      properties: { icon: 'pick' }
    }])
  } else {
    markerLayer = new window.TMap.MultiMarker({
      map,
      styles: {
        pick: new window.TMap.MarkerStyle({
          width: 30,
          height: 40,
          src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker_red.png',
          anchor: { x: 15, y: 40 }
        })
      },
      geometries: [{ id: 'pick', position, properties: { icon: 'pick' } }]
    })
  }
  map.setCenter(position)
}

/**
 * 逆地址解析（坐标 → 地址）
 */
function reverseGeocode(lng, lat) {
  if (!geocoder) return
  geocoder.getAddress(new window.TMap.LatLng(lat, lng))
    .then(result => {
      if (result && result.status === 0 && result.result) {
        const r = result.result
        address.value = r.address || r.formatted_addresses?.recommend || ''
        emit('address-change', {
          address: address.value,
          province: r.address_component?.province || '',
          city: r.address_component?.city || '',
          district: r.address_component?.district || ''
        })
      }
    })
    .catch(() => { /* 静默处理 */ })
}

/**
 * 初始化地图
 */
async function initMap() {
  try {
    const TMap = await loadTMapScript()
    if (!mapRef.value) return

    const hasValue = props.modelValue?.lng != null && props.modelValue?.lat != null
    const center = hasValue
      ? new TMap.LatLng(props.modelValue.lat, props.modelValue.lng)
      : new TMap.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng)

    map = new TMap.Map(mapRef.value, {
      center,
      zoom: hasValue ? 16 : 10,
      viewMode: '2D',
      draggable: true
    })

    // 初始化标记
    if (hasValue) {
      updateMarker(props.modelValue.lng, props.modelValue.lat)
      // 逆地理解析已有坐标
      geocoder = new TMap.service.Geocoder()
      reverseGeocode(props.modelValue.lng, props.modelValue.lat)
    } else {
      geocoder = new TMap.service.Geocoder()
    }

    // 地图点击事件
    map.on('click', (evt) => {
      const { lng, lat } = evt.latLng
      updateMarker(lng, lat)
      emit('update:modelValue', { lng, lat })
      reverseGeocode(lng, lat)
    })

    mapLoading.value = false
  } catch (err) {
    mapLoading.value = false
    console.error('[MapPicker]', err.message)
    ElMessage.warning(err.message || '地图初始化失败')
  }
}

/**
 * JSONP 调用腾讯地图 WebService API（搜索地点）
 */
function jsonpSearch(keyword) {
  return new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_APP_TENCENT_MAP_KEY
    const cbName = '_tmap_search_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
    const script = document.createElement('script')
    window[cbName] = (data) => {
      resolve(data)
      delete window[cbName]
      script.remove()
    }
    script.onerror = () => {
      reject(new Error('搜索请求失败'))
      delete window[cbName]
      script.remove()
    }
    script.src = `https://apis.map.qq.com/ws/place/v1/search?keyword=${encodeURIComponent(keyword)}&page_size=8&key=${key}&output=jsonp&callback=${cbName}`
    document.head.appendChild(script)
    // 超时处理
    setTimeout(() => {
      if (window[cbName]) {
        reject(new Error('搜索超时'))
        delete window[cbName]
        script.remove()
      }
    }, 8000)
  })
}

/**
 * 地点搜索（防抖）
 */
function onSearch() {
  clearTimeout(searchTimer)
  if (!searchText.value.trim()) {
    searchResults.value = []
    return
  }
  searchTimer = setTimeout(async () => {
    try {
      const result = await jsonpSearch(searchText.value.trim())
      if (result?.status === 0 && Array.isArray(result.data)) {
        searchResults.value = result.data.map(item => ({
          title: item.title,
          address: item.address,
          lng: item.location?.lng,
          lat: item.location?.lat
        }))
      } else {
        searchResults.value = []
      }
    } catch {
      searchResults.value = []
    }
  }, 350)
}

/**
 * 选中搜索结果
 */
function selectSearchResult(item) {
  if (item.lng == null || item.lat == null) return
  searchResults.value = []
  searchText.value = item.title
  updateMarker(item.lng, item.lat)
  if (map) map.setZoom(16)
  address.value = item.address || item.title
  emit('update:modelValue', { lng: item.lng, lat: item.lat })
  emit('address-change', { address: address.value, province: '', city: '', district: '' })
}

/**
 * 浏览器定位
 */
function locateMe() {
  if (!navigator.geolocation) {
    ElMessage.warning('当前浏览器不支持定位功能')
    return
  }
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { longitude: lng, latitude: lat } = pos.coords
      updateMarker(lng, lat)
      if (map) map.setZoom(16)
      emit('update:modelValue', { lng, lat })
      reverseGeocode(lng, lat)
      locating.value = false
    },
    (err) => {
      ElMessage.warning('定位失败: ' + (err.message || '请检查定位权限'))
      locating.value = false
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

/**
 * 复制坐标到剪贴板
 */
function copyCoords() {
  const text = `${props.modelValue.lng}, ${props.modelValue.lat}`
  navigator.clipboard?.writeText(text).then(() => ElMessage.success('坐标已复制'))
}

/**
 * 外部值变化时更新地图标记
 */
watch(() => props.modelValue, (val) => {
  if (!map || !window.TMap) return
  if (val?.lng != null && val?.lat != null) {
    updateMarker(val.lng, val.lat)
  }
}, { deep: true })

onMounted(() => nextTick(initMap))

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  if (markerLayer) { markerLayer.setMap(null); markerLayer = null }
  if (map) { map.destroy(); map = null }
})
</script>

<style scoped>
.map-picker {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.map-toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.map-container {
  width: 100%;
  height: 320px;
  background: #e8eaed;
}

.search-results {
  max-height: 180px;
  overflow-y: auto;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  z-index: 10;
  position: relative;
}

.search-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}

.search-item:hover {
  background: #ecf5ff;
}

.search-item:last-child {
  border-bottom: none;
}

.item-title {
  font-size: 13px;
  color: #303133;
  display: block;
  line-height: 1.4;
}

.item-address {
  font-size: 12px;
  color: #909399;
  display: block;
  line-height: 1.4;
  margin-top: 2px;
}

.map-info {
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
  font-size: 13px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row.coords {
  color: #606266;
  font-size: 12px;
  gap: 12px;
}

.address-text {
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.85);
  color: #909399;
  font-size: 13px;
  z-index: 20;
}
</style>
