<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="订单号" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="支付方式" prop="method">
        <el-select v-model="queryParams.method" placeholder="全部" clearable style="width: 110px">
          <el-option label="微信" value="wechat" /><el-option label="支付宝" value="alipay" /><el-option label="余额" value="balance" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
          <el-option label="待支付" value="pending" /><el-option label="成功" value="success" /><el-option label="失败" value="failed" /><el-option label="已退款" value="refunded" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="订单号" prop="orderNo" width="180" />
      <el-table-column label="支付方式" prop="method" width="100">
        <template #default="{ row }">{{ { wechat: '微信', alipay: '支付宝', balance: '余额' }[row.method] || row.method }}</template>
      </el-table-column>
      <el-table-column label="支付金额" prop="amount" width="110"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
      <el-table-column label="流水号" prop="transactionId" width="180" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template #default="{ row }"><el-tag :type="row.status === 'success' ? 'success' : row.status === 'failed' ? 'danger' : 'warning'" size="small">{{ { pending: '待支付', success: '成功', failed: '失败', refunded: '已退款' }[row.status] }}</el-tag></template>
      </el-table-column>
      <el-table-column label="支付时间" prop="paidAt" width="160" />
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listPayment } from '@/api/pet/order'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const queryParams = reactive({ pageNum: 1, pageSize: 10, orderNo: undefined, method: undefined, status: undefined })

function getList() { loading.value = true; listPayment(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.orderNo = undefined; queryParams.method = undefined; queryParams.status = undefined; handleQuery() }
getList()
</script>
