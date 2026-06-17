import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/request'

export interface CartItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  originalPrice: number
  quantity: number
  checked: boolean
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const totalCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const checkedCount = computed(() => items.value.filter(i => i.checked).reduce((sum, i) => sum + i.quantity, 0))
  const checkedTotal = computed(() => items.value.filter(i => i.checked).reduce((sum, i) => sum + i.price * i.quantity, 0))
  const isAllChecked = computed(() => items.value.length > 0 && items.value.every(i => i.checked))

  /** 获取购物车列表 */
  async function fetchCart() {
    try {
      const data = await http.get<CartItem[]>('/app/order/cart/list')
      items.value = data.map(i => ({ ...i, checked: true }))
    } catch (e) {
      console.error('fetchCart error:', e)
    }
  }

  /** 加入购物车 */
  async function addToCart(productId: number, quantity = 1) {
    await http.post('/app/order/cart', { productId, quantity })
    uni.showToast({ title: '已加入购物车', icon: 'success' })
    await fetchCart()
  }

  /** 更新数量 */
  async function updateQuantity(id: number, quantity: number) {
    await http.put('/app/order/cart', { id, quantity })
    await fetchCart()
  }

  /** 删除 */
  async function removeItems(ids: string) {
    await http.put('/app/order/cart/remove', { ids })
    await fetchCart()
  }

  /** 全选/取消 */
  function toggleAll(checked: boolean) {
    items.value.forEach(i => (i.checked = checked))
  }

  /** 单项切换 */
  function toggleItem(id: number) {
    const item = items.value.find(i => i.id === id)
    if (item) item.checked = !item.checked
  }

  return {
    items, totalCount, checkedCount, checkedTotal, isAllChecked,
    fetchCart, addToCart, updateQuantity, removeItems, toggleAll, toggleItem,
  }
})
