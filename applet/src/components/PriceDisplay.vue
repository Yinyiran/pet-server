<script setup lang="ts">
/**
 * 价格显示组件
 * 统一价格样式：符号 + 整数 + 小数 + 单位
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    price: number | string
    size?: 'sm' | 'md' | 'lg'
    color?: string
    showSymbol?: boolean
    unit?: string
    originalPrice?: number | string
  }>(),
  {
    size: 'md',
    color: '#ea580c',
    showSymbol: true,
    unit: '',
    originalPrice: 0,
  }
)

const priceStr = computed(() => {
  const num = Number(props.price) || 0
  return num.toFixed(2)
})

const intPart = computed(() => priceStr.value.split('.')[0])
const decPart = computed(() => priceStr.value.split('.')[1])
</script>

<template>
  <view class="price-wrap" :class="`size-${size}`">
    <view class="price-current" :style="{ color }">
      <text v-if="showSymbol" class="price-symbol">¥</text>
      <text class="price-int">{{ intPart }}</text>
      <text v-if="decPart && decPart !== '00'" class="price-dec">.{{ decPart }}</text>
      <text v-if="unit" class="price-unit">{{ unit }}</text>
    </view>
    <text v-if="originalPrice" class="price-original">¥{{ Number(originalPrice).toFixed(0) }}</text>
  </view>
</template>

<style lang="scss" scoped>
.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.price-current {
  display: flex;
  align-items: baseline;
  font-weight: 700;
}

.price-symbol {
  font-size: 0.7em;
}

.price-int {
  font-size: 1em;
  line-height: 1;
}

.price-dec {
  font-size: 0.65em;
}

.price-unit {
  font-size: 0.55em;
  font-weight: 400;
  color: #8c7b6e;
  margin-left: 4rpx;
}

.price-original {
  font-size: 0.6em;
  color: #b8a898;
  text-decoration: line-through;
}

.size-sm {
  .price-int {
    font-size: 26rpx;
  }
  .price-symbol {
    font-size: 20rpx;
  }
  .price-dec {
    font-size: 18rpx;
  }
}

.size-md {
  .price-int {
    font-size: 36rpx;
  }
  .price-symbol {
    font-size: 26rpx;
  }
  .price-dec {
    font-size: 24rpx;
  }
}

.size-lg {
  .price-int {
    font-size: 52rpx;
  }
  .price-symbol {
    font-size: 32rpx;
  }
  .price-dec {
    font-size: 30rpx;
  }
}
</style>
