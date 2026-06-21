<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="直播间名" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="isActive">
        <el-select v-model="queryParams.isActive" placeholder="全部" clearable style="width: 100px">
          <el-option label="启用" :value="1" /><el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pet:liveRoom:add']">新增</el-button></el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="直播间名称" prop="name" min-width="150" show-overflow-tooltip />
      <el-table-column label="平台" prop="platform" width="90" />
      <el-table-column label="房间号" prop="roomId" width="120" />
      <el-table-column label="分享口令" prop="shareCode" width="120" />
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="状态" prop="isActive" width="80" align="center">
        <template #default="{ row }"><el-switch v-model="row.isActive" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" v-hasPermi="['pet:liveRoom:edit']" /></template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:liveRoom:edit']">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:liveRoom:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="560px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="直播间名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="平台"><el-input v-model="form.platform" placeholder="douyin/kuaishou等" /></el-form-item>
        <el-form-item label="房间号"><el-input v-model="form.roomId" /></el-form-item>
        <el-form-item label="分享口令"><el-input v-model="form.shareCode" /></el-form-item>
        <el-form-item label="封面图">
          <image-upload v-model="form.coverImg" :limit="1" :action="ossUploadUrl" />
        </el-form-item>
        <el-form-item label="直播链接"><el-input v-model="form.liveUrl" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="form.isActive" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listLiveRoom, addLiveRoom, updateLiveRoom, delLiveRoom, toggleLiveRoomStatus } from '@/api/pet/liveRoom'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const dialogVisible = ref(false), dialogTitle = ref(''), submitLoading = ref(false)
const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: undefined, isActive: undefined })
const ossUploadUrl = import.meta.env.VITE_APP_BASE_API + '/common/upload/oss'
const defaultForm = { name: '', platform: '', roomId: '', shareCode: '', coverImg: '', liveUrl: '', sortOrder: 0, isActive: 1 }
const form = reactive({ ...defaultForm, id: null })

function getList() { loading.value = true; listLiveRoom(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.keyword = undefined; queryParams.isActive = undefined; handleQuery() }
function handleAdd() { Object.assign(form, { ...defaultForm, id: null }); dialogTitle.value = '新增直播间'; dialogVisible.value = true }
function handleEdit(row) { Object.assign(form, { ...row }); dialogTitle.value = '编辑直播间'; dialogVisible.value = true }
function submitForm() { submitLoading.value = true; const api = form.id ? updateLiveRoom : addLiveRoom; api(form).then(() => { dialogVisible.value = false; getList() }).finally(() => submitLoading.value = false) }
function handleStatusChange(row) { toggleLiveRoomStatus(row.id, row.isActive) }
function handleDelete(row) { if (confirm('确定删除？')) delLiveRoom(String(row.id)).then(() => getList()) }
getList()
</script>
