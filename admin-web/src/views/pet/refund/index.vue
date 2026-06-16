<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="订单号" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="全部" clearable style="width: 100px">
          <el-option label="退款" value="refund" /><el-option label="换货" value="exchange" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
          <el-option label="待处理" value="pending" /><el-option label="已通过" value="approved" /><el-option label="已拒绝" value="rejected" /><el-option label="已完成" value="completed" />
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
      <el-table-column label="用户ID" prop="userId" width="80" align="center" />
      <el-table-column label="类型" prop="type" width="80">
        <template #default="{ row }"><el-tag :type="row.type === 'refund' ? 'danger' : 'warning'" size="small">{{ row.type === 'refund' ? '退款' : '换货' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="原因" prop="reason" min-width="160" show-overflow-tooltip />
      <el-table-column label="退款金额" prop="refundAmount" width="100"><template #default="{ row }">{{ row.refundAmount ? '¥' + row.refundAmount : '—' }}</template></el-table-column>
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template #default="{ row }"><el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : row.status === 'completed' ? 'info' : 'warning'" size="small">{{ { pending: '待处理', approved: '已通过', rejected: '已拒绝', completed: '已完成' }[row.status] }}</el-tag></template>
      </el-table-column>
      <el-table-column label="申请时间" prop="createdAt" width="160" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
          <el-button link type="success" v-if="row.status === 'pending'" @click="handleAudit(row, 'approved')">通过</el-button>
          <el-button link type="danger" v-if="row.status === 'pending'" @click="handleAudit(row, 'rejected')">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 详情弹窗 -->
    <el-dialog title="售后详情" v-model="detailVisible" width="560px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detail.userId }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detail.type === 'refund' ? '退款' : '换货' }}</el-descriptions-item>
        <el-descriptions-item label="退款金额">{{ detail.refundAmount ? '¥' + detail.refundAmount : '—' }}</el-descriptions-item>
        <el-descriptions-item label="原因" :span="2">{{ detail.reason }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ { pending: '待处理', approved: '已通过', rejected: '已拒绝', completed: '已完成' }[detail.status] }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detail.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="审核备注" :span="2">{{ detail.remark }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button @click="detailVisible = false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listRefund, auditRefund } from '@/api/pet/refund'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const detailVisible = ref(false)
const detail = reactive({})
const queryParams = reactive({ pageNum: 1, pageSize: 10, orderNo: undefined, type: undefined, status: undefined })

function getList() { loading.value = true; listRefund(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.orderNo = undefined; queryParams.type = undefined; queryParams.status = undefined; handleQuery() }
function handleDetail(row) { Object.assign(detail, row); detailVisible.value = true }
function handleAudit(row, status) { const msg = status === 'approved' ? '确定通过此售后申请？' : '确定拒绝此售后申请？'; if (confirm(msg)) auditRefund(row.id, { status }).then(() => getList()) }
getList()
</script>
