import http from '@/utils/request'

/** Banner */
export const bannerApi = {
  getActive: () => http.get('/app/banner/active'),
}

/** 商品分类 */
export const categoryApi = {
  getTree: () => http.get('/app/product-category/tree'),
}

/** 商品 */
export const productApi = {
  getList: (params: { category?: string; keyword?: string; source?: string; pageNum?: number; pageSize?: number }) =>
    http.get('/app/product/list', params),
  getDetail: (id: number) => http.get(`/app/product/${id}`),
  getFlash: () => http.get('/app/product/flash/list'),
}

/** 商家商品管理（商家中心） */
export const merchantProductApi = {
  getList: (params?: any) => http.get('/app/merchant/product/list', params),
  getDetail: (id: number) => http.get(`/app/merchant/product/${id}`),
  create: (data: any) => http.post('/app/merchant/product', data),
  update: (data: any) => http.put('/app/merchant/product', data),
  remove: (ids: string) => http.delete(`/app/merchant/product/${ids}`),
  toggleStatus: (id: number, isActive: number) => http.put(`/app/merchant/product/${id}/status`, { isActive }),
}

/** 组合包 */
export const bundleApi = {
  getList: () => http.get('/app/bundle/list'),
  getDetail: (id: number) => http.get(`/app/bundle/${id}`),
}

/** 同城商家 */
export const merchantApi = {
  getList: (params?: { type?: string; keyword?: string; pageNum?: number; pageSize?: number }) =>
    http.get('/app/merchant/list', params),
  getDetail: (id: number) => http.get(`/app/merchant/${id}`),
  apply: (data: any) => http.post('/app/merchant/apply', data),
}

/** 购物车 */
export const cartApi = {
  getList: () => http.get('/app/order/cart/list'),
  add: (data: { productId: number; quantity: number }) => http.post('/app/order/cart', data),
  update: (data: { id: number; quantity: number }) => http.put('/app/order/cart', data),
  remove: (ids: string) => http.put('/app/order/cart/remove', { ids }),
}

/** 订单 */
export const orderApi = {
  create: (data: any) => http.post('/app/order', data),
  getList: (params?: any) => http.get('/app/order/list', params),
  getDetail: (id: number) => http.get(`/app/order/${id}`),
  confirmReceive: (id: number) => http.put(`/app/order/${id}/receive`),
  cancel: (id: number) => http.put(`/app/order/${id}/cancel`),
}

/** 配餐 */
export const mealApi = {
  submitQuiz: (data: any) => http.post('/app/meal/quiz', data),
  getQuizRecords: () => http.get('/app/meal/quiz'),
  getPlans: (petType?: string) => http.get('/app/meal/plans', { petType }),
  createOrder: (data: any) => http.post('/app/meal/order', data),
  getOrders: () => http.get('/app/meal/orders'),
}

/** 课程 */
export const courseApi = {
  getList: (params?: any) => http.get('/app/course/list', params),
  getDetail: (id: number) => http.get(`/app/course/${id}`),
  purchase: (id: number) => http.post(`/app/course/${id}/purchase`),
  getMyCourses: () => http.get('/app/course/my/list'),
}

/** 分佣 */
export const commissionApi = {
  getAccount: () => http.get('/app/commission/account'),
  getLogs: (params?: any) => http.get('/app/commission/logs', params),
  getInvites: () => http.get('/app/commission/invites'),
  withdraw: (data: any) => http.post('/app/commission/withdraw', data),
}

/** 财务 */
export const financeApi = {
  getPoints: () => http.get('/app/finance/points'),
  getRecharges: () => http.get('/app/finance/recharges'),
  getConsumptions: () => http.get('/app/finance/consumptions'),
  signIn: () => http.get('/app/finance/sign-in'),
}

/** 售后 */
export const refundApi = {
  submit: (data: any) => http.post('/app/refund', data),
  getList: (params?: any) => http.get('/app/refund/list', params),
  getDetail: (id: number) => http.get(`/app/refund/${id}`),
}

/** 直播间 */
export const liveRoomApi = {
  getList: () => http.get('/app/live-room/list'),
}

/** 拼团 */
export const groupApi = {
  start: (data: { productId: number; groupSize: number }) => http.post('/app/group/start', data),
  join: (data: { groupNo: string }) => http.post('/app/group/join', data),
  getDetail: (groupNo: string) => http.get(`/app/group/${groupNo}`),
  getProductGroups: (productId: number) => http.get(`/app/group/product/${productId}`),
  getMyGroups: (params?: { status?: string; pageNum?: number; pageSize?: number }) => http.get('/app/group/my/list', params),
}

/** 用户 */
export const userApi = {
  wxLogin: (code: string) => http.post('/app/user/wxLogin', { code }),
  getProfile: () => http.get('/app/user/profile'),
  updateProfile: (data: any) => http.put('/app/user/profile', data),
  getAddresses: () => http.get('/app/user/address'),
  createAddress: (data: any) => http.post('/app/user/address', data),
  updateAddress: (data: any) => http.put('/app/user/address', data),
  deleteAddress: (id: number) => http.delete(`/app/user/address/${id}`),
  getPets: () => http.get('/app/user/pet'),
  createPet: (data: any) => http.post('/app/user/pet', data),
  updatePet: (data: any) => http.put('/app/user/pet', data),
  deletePet: (id: number) => http.delete(`/app/user/pet/${id}`),
}
