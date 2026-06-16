<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.status" @tab-change="handleQuery">
      <el-tab-pane label="全部" name="" /><el-tab-pane label="待付款" name="pending" /><el-tab-pane label="已付款" name="paid" />
      <el-tab-pane label="已发货" name="shipped" /><el-tab-pane label="已完成" name="received" /><el-tab-pane label="已取消" name="cancelled" />
    </el-tabs>

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="订单号" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="订单号" prop="orderNo" width="180" />
      <el-table-column label="用户ID" prop="userId" width="80" align="center" />
      <el-table-column label="订单金额" prop="totalAmount" width="110"><template #default="{ row }">¥{{ row.totalAmount }}</template></el-table-column>
      <el-table-column label="优惠" prop="discountAmount" width="80"><template #default="{ row }">¥{{ row.discountAmount }}</template></el-table-column>
      <el-table-column label="状态" prop="status" width="100" align="center">
        <template #default="{ row }"><el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column label="物流" prop="logisticsNo" width="160" show-overflow-tooltip />
      <el-table-column label="下单时间" prop="createdAt" width="160" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleDetail(row)" v-hasPermi="['pet:order:query']">详情</el-button>
          <el-button link type="success" v-if="row.status === 'paid'" @click="handleShip(row)" v-hasPermi="['pet:order:edit']">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 订单详情弹窗 -->
    <el-dialog title="订单详情" v-model="detailVisible" width="700px" destroy-on-close>
      <el-descriptions :column="2" border v-if="detail.id">
        <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusText(detail.status) }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detail.userId }}</el-descriptions-item>
        <el-descriptions-item label="地址ID">{{ detail.addressId }}</el-descriptions-item>
        <el-descriptions-item label="订单总额">¥{{ detail.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">¥{{ detail.discountAmount }}</el-descriptions-item>
        <el-descriptions-item label="物流公司">{{ detail.logisticsCompany }}</el-descriptions-item>
        <el-descriptions-item label="物流单号">{{ detail.logisticsNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ detail.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ detail.paidAt }}</el-descriptions-item>
      </el-descriptions>
      <el-divider>订单商品</el-divider>
      <el-table :data="detail.items || []" border size="small">
        <el-table-column label="商品名" prop="productName" /><el-table-column label="单价" prop="price" width="90"><template #default="{ row }">¥{{ row.price }}</template></el-table-column>
        <el-table-column label="数量" prop="qty" width="70" /><el-table-column label="小计" prop="subtotal" width="90"><template #default="{ row }">¥{{ row.subtotal }}</template></el-table-column>
      </el-table>
      <template #footer><el-button @click="detailVisible = false">关闭</el-button></template>
    </el-dialog>

    <!-- 发货弹窗 -->
    <el-dialog title="订单发货" v-model="shipVisible" width="460px" destroy-on-close>
      <el-form :model="shipForm" label-width="90px">
        <el-form-item label="物流公司"><el-input v-model="shipForm.logisticsCompany" /></el-form-item>
        <el-form-item label="物流单号"><el-input v-model="shipForm.logisticsNo" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="shipVisible = false">取消</el-button><el-button type="primary" @click="submitShip" :loading="shipLoading">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listOrder, getOrder, shipOrder } from '@/api/pet/order'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const detailVisible = ref(false), shipVisible = ref(false), shipLoading = ref(false)
const detail = reactive({}), shipForm = reactive({ logisticsCompany: '', logisticsNo: '', orderId: null })
const queryParams = reactive({ pageNum: 1, pageSize: 10, orderNo: undefined, status: '' })

const statusMap = { pending: '待付款', paid: '已付款', shipped: '已发货', received: '已完成', cancelled: '已取消', refunding: '退款中' }
const statusTypeMap = { pending: 'warning', paid: 'primary', shipped: 'info', received: 'success', cancelled: 'info', refunding: 'danger' }
function statusText(s) { return statusMap[s] || s }
function statusType(s) { return statusTypeMap[s] || '' }

function getList() { loading.value = true; const q = { ...queryParams }; if (!q.status) delete q.status; listOrder(q).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.orderNo = undefined; queryParams.status = ''; handleQuery() }
function handleDetail(row) { getOrder(row.id).then(res => { Object.assign(detail, res.data); detailVisible.value = true }) }
function handleShip(row) { Object.assign(shipForm, { logisticsCompany: '', logisticsNo: '', orderId: row.id }); shipVisible.value = true }
function submitShip() { shipLoading.value = true; shipOrder(shipForm.orderId, { logisticsCompany: shipForm.logisticsCompany, logisticsNo: shipForm.logisticsNo }).then(() => { shipVisible.value = false; getList() }).finally(() => shipLoading.value = false) }
getList()
</script>
