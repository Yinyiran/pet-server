/**
 * 公共组件统一导出
 * 使用 easycom 规则也可自动引入（pages.json 已配置 autoscan: true）
 */
export { default as NavBar } from './NavBar.vue'
export { default as EmptyState } from './EmptyState.vue'
export { default as PriceDisplay } from './PriceDisplay.vue'
export { default as ProductCard } from './ProductCard.vue'
export { default as LoadingState } from './LoadingState.vue'
export { default as LoadMore } from './LoadMore.vue'

export type { ProductItem } from '@/types'
