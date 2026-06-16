<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="商户名/联系人/电话" clearable style="width: 180px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
          <el-option label="待审核" value="pending" /><el-option label="已通过" value="approved" /><el-option label="已拒绝" value="rejected" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="商户名称" prop="name" min-width="140" show-overflow-tooltip />
      <el-table-column label="类型" prop="merchantType" width="90" />
      <el-table-column label="联系人" prop="contact" width="90" />
      <el-table-column label="电话" prop="phone" width="120" />
      <el-table-column label="城市" prop="city" width="80" />
      <el-table-column label="地址" prop="address" min-width="160" show-overflow-tooltip />
      <el-table-column label="微信" prop="wechat" width="100" />
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template #default="{ row }"><el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'" size="small">{{ { pending: '待审核', approved: '已通过', rejected: '已拒绝' }[row.status] }}</el-tag></template>
      </el-table-column>
      <el-table-column label="申请时间" prop="createdAt" width="160" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
          <template v-if="row.status === 'pending'">
            <el-button link type="success" @click="handleReview(row, 'approved')">通过</el-button>
            <el-button link type="danger" @click="handleReview(row, 'rejected')">拒绝</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 详情弹窗 -->
    <el-dialog title="申请详情" v-model="detailVisible" width="560px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商户名称">{{ detail.name }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detail.merchantType }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ detail.contact }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ detail.phone }}</el-descriptions-item>
        <el-descriptions-item label="城市">{{ detail.city }}</el-descriptions-item>
        <el-descriptions-item label="微信">{{ detail.wechat }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ detail.address }}</el-descriptions-item>
        <el-descriptions-item label="申请说明" :span="2">{{ detail.description }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ { pending: '待审核', approved: '已通过', rejected: '已拒绝' }[detail.status] }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detail.createdAt }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <template v-if="detail.status === 'pending'">
          <el-button type="success" @click="handleReview(detail, 'approved'); detailVisible = false">通过</el-button>
          <el-button type="danger" @click="handleReview(detail, 'rejected'); detailVisible = false">拒绝</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listApply, reviewApply } from '@/api/pet/merchant'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const detailVisible = ref(false)
const detail = reactive({})
const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: undefined, status: undefined })

function getList() { loading.value = true; listApply(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.keyword = undefined; queryParams.status = undefined; handleQuery() }
function handleDetail(row) { Object.assign(detail, row); detailVisible.value = true }
function handleReview(row, status) { reviewApply(row.id, status).then(() => getList()) }
getList()
</script>
