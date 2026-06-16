<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="手机号/昵称/OpenID" clearable style="width: 180px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="会员等级" prop="memberLevel">
        <el-select v-model="queryParams.memberLevel" placeholder="全部" clearable style="width: 120px">
          <el-option label="银牌" value="silver" />
          <el-option label="金牌" value="gold" />
          <el-option label="黑钻" value="diamond" />
        </el-select>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input v-model="queryParams.city" placeholder="城市" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="状态" prop="isActive">
        <el-select v-model="queryParams.isActive" placeholder="全部" clearable style="width: 100px">
          <el-option label="活跃" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间" style="width: 380px">
        <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始" end-placeholder="结束" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="userList" @sort-change="handleSortChange">
      <el-table-column label="ID" prop="id" width="70" sortable="custom" />
      <el-table-column label="头像" prop="avatar" width="70" align="center">
        <template #default="{ row }">
          <span style="font-size: 24px">{{ row.avatar || '👤' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickname" min-width="100" show-overflow-tooltip />
      <el-table-column label="手机号" prop="phone" width="120" />
      <el-table-column label="城市" prop="city" width="100" />
      <el-table-column label="会员等级" prop="memberLevel" width="100">
        <template #default="{ row }">
          <el-tag :type="row.memberLevel === 'diamond' ? 'danger' : row.memberLevel === 'gold' ? 'warning' : 'info'" size="small">
            {{ row.memberLevel === 'diamond' ? '黑钻' : row.memberLevel === 'gold' ? '金牌' : '银牌' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="积分" prop="points" width="80" sortable="custom" />
      <el-table-column label="余额" prop="balance" width="90" />
      <el-table-column label="累计消费" prop="totalSpent" width="100" sortable="custom" />
      <el-table-column label="状态" prop="isActive" width="80" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.isActive" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" v-hasPermi="['pet:user:edit']" />
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createdAt" width="160" sortable="custom" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleDetail(row)" v-hasPermi="['pet:user:query']">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 用户详情抽屉 -->
    <el-drawer v-model="detailVisible" title="用户详情" size="520px" destroy-on-close>
      <div v-if="detailData" class="user-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="昵称">{{ detailData.user.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ detailData.user.phone }}</el-descriptions-item>
          <el-descriptions-item label="城市">{{ detailData.user.city }}</el-descriptions-item>
          <el-descriptions-item label="会员等级">{{ detailData.user.memberLevel }}</el-descriptions-item>
          <el-descriptions-item label="积分">{{ detailData.user.points }}</el-descriptions-item>
          <el-descriptions-item label="余额">¥{{ detailData.user.balance }}</el-descriptions-item>
          <el-descriptions-item label="累计消费">¥{{ detailData.user.totalSpent }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ detailData.user.createdAt }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">宠物 ({{ detailData.pets?.length || 0 }})</el-divider>
        <el-table :data="detailData.pets || []" size="small" border>
          <el-table-column label="名字" prop="name" />
          <el-table-column label="类型" prop="type" width="60" />
          <el-table-column label="品种" prop="breed" />
          <el-table-column label="体重" prop="weight" width="70" />
        </el-table>

        <el-divider content-position="left">收货地址 ({{ detailData.addresses?.length || 0 }})</el-divider>
        <el-table :data="detailData.addresses || []" size="small" border>
          <el-table-column label="收货人" prop="name" width="80" />
          <el-table-column label="电话" prop="phone" width="110" />
          <el-table-column label="地址" prop="region" show-overflow-tooltip />
          <el-table-column label="默认" prop="isDefault" width="50" align="center">
            <template #default="{ row }">{{ row.isDefault ? '✓' : '' }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listPetUser, getPetUser, togglePetUserStatus } from '@/api/pet/user'

const loading = ref(false)
const showSearch = ref(true)
const userList = ref([])
const total = ref(0)
const dateRange = ref([])
const detailVisible = ref(false)
const detailData = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: undefined,
  memberLevel: undefined,
  city: undefined,
  isActive: undefined,
  params: {}
})

function getList() {
  loading.value = true
  const params = { ...queryParams }
  if (dateRange.value && dateRange.value.length === 2) {
    params.params = { beginTime: dateRange.value[0], endTime: dateRange.value[1] }
  }
  listPetUser(params).then(res => {
    userList.value = res.data.list
    total.value = res.data.total
  }).finally(() => { loading.value = false })
}

function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() {
  dateRange.value = []
  queryParams.keyword = undefined
  queryParams.memberLevel = undefined
  queryParams.city = undefined
  queryParams.isActive = undefined
  handleQuery()
}

function handleStatusChange(row) {
  togglePetUserStatus(row.id, row.isActive).then(() => {
    proxy.$modal.msgSuccess('状态已更新')
  })
}

function handleDetail(row) {
  getPetUser(row.id).then(res => {
    detailData.value = res.data
    detailVisible.value = true
  })
}

function handleSortChange({ prop, order }) {
  queryParams.orderByColumn = prop
  queryParams.isAsc = order === 'ascending' ? 'asc' : 'desc'
  getList()
}

getList()
</script>
