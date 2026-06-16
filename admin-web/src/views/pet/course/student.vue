<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="课程ID" prop="courseId">
        <el-input v-model="queryParams.courseId" placeholder="课程ID" clearable style="width: 120px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
          <el-option label="正常" value="active" /><el-option label="过期" value="expired" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="用户ID" prop="userId" width="80" align="center" />
      <el-table-column label="课程ID" prop="courseId" width="80" align="center" />
      <el-table-column label="状态" prop="status" width="80">
        <template #default="{ row }"><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '正常' : '过期' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="购买时间" prop="paidAt" width="160" />
      <el-table-column label="到期时间" prop="expireAt" width="160" />
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { listStudent } from '@/api/pet/course'

const route = useRoute()
const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const queryParams = reactive({ pageNum: 1, pageSize: 10, courseId: route.query.courseId || undefined, status: undefined })

function getList() { loading.value = true; listStudent(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.courseId = undefined; queryParams.status = undefined; handleQuery() }
getList()
</script>
