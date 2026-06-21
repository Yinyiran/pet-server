<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="组合包名称" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="isActive">
        <el-select v-model="queryParams.isActive" placeholder="全部" clearable style="width: 100px">
          <el-option label="上架" :value="1" /><el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pet:bundle:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['pet:bundle:remove']">删除</el-button></el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="封面" prop="coverImg" width="80" align="center">
        <template #default="{ row }">
          <el-image v-if="row.coverImg" :src="row.coverImg" fit="cover" style="width:48px;height:48px;border-radius:4px" preview-teleported :preview-src-list="[row.coverImg]" />
          <span v-else style="font-size:28px">📦</span>
        </template>
      </el-table-column>
      <el-table-column label="组合包名称" prop="name" min-width="150" show-overflow-tooltip />
      <el-table-column label="组合价" prop="bundlePrice" width="100"><template #default="{ row }">¥{{ row.bundlePrice }}</template></el-table-column>
      <el-table-column label="原价合计" prop="originalPrice" width="100"><template #default="{ row }">{{ row.originalPrice ? '¥' + row.originalPrice : '—' }}</template></el-table-column>
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="状态" prop="isActive" width="80" align="center">
        <template #default="{ row }"><el-switch v-model="row.isActive" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" v-hasPermi="['pet:bundle:edit']" /></template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" width="160" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:bundle:edit']">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:bundle:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="720px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="封面图">
          <image-upload v-model="form.coverImg" :limit="1" :action="ossUploadUrl" />
        </el-form-item>
        <el-form-item label="组合价" required><el-input-number v-model="form.bundlePrice" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="原价合计"><el-input-number v-model="form.originalPrice" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="上架"><el-switch v-model="form.isActive" :active-value="1" :inactive-value="0" /></el-form-item>

        <el-divider>选品列表</el-divider>
        <el-button type="primary" size="small" plain @click="addItem" style="margin-bottom: 12px">+ 添加商品</el-button>
        <el-table :data="form.items" border size="small">
          <el-table-column label="商品ID" width="120">
            <template #default="{ row }"><el-input-number v-model="row.productId" :min="1" size="small" controls-position="right" style="width:100px" /></template>
          </el-table-column>
          <el-table-column label="数量" width="120">
            <template #default="{ row }"><el-input-number v-model="row.qty" :min="1" size="small" controls-position="right" style="width:100px" /></template>
          </el-table-column>
          <el-table-column label="排序" width="120">
            <template #default="{ row }"><el-input-number v-model="row.sortOrder" :min="0" size="small" controls-position="right" style="width:100px" /></template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ $index }"><el-button link type="danger" size="small" @click="form.items.splice($index, 1)">删除</el-button></template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listBundle, getBundle, addBundle, updateBundle, delBundle, toggleBundleStatus } from '@/api/pet/bundle'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const dialogVisible = ref(false), dialogTitle = ref(''), submitLoading = ref(false)
const selectedIds = ref([]), multiple = ref(true)
const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: undefined, isActive: undefined })
const ossUploadUrl = import.meta.env.VITE_APP_BASE_API + '/common/upload/oss'
const defaultForm = { name: '', coverImg: '', bundlePrice: 0, originalPrice: null, description: '', sortOrder: 0, isActive: 1, items: [] }
const form = reactive({ ...defaultForm, id: null })

function getList() { loading.value = true; listBundle(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.keyword = undefined; queryParams.isActive = undefined; handleQuery() }
function handleAdd() { Object.assign(form, { ...defaultForm, items: [], id: null }); dialogTitle.value = '新增组合包'; dialogVisible.value = true }
function handleEdit(row) { getBundle(row.id).then(res => { Object.assign(form, { ...res.data, items: res.data.items || [] }); dialogTitle.value = '编辑组合包'; dialogVisible.value = true }) }
function submitForm() { submitLoading.value = true; const api = form.id ? updateBundle : addBundle; api(form).then(() => { dialogVisible.value = false; getList() }).finally(() => submitLoading.value = false) }
function handleStatusChange(row) { toggleBundleStatus(row.id, row.isActive) }
function handleSelectionChange(sel) { selectedIds.value = sel.map(s => s.id); multiple.value = !sel.length }
function handleDelete(row) { const ids = row?.id ? [row.id] : selectedIds.value; if (!ids.length) return; if (confirm('确定删除？')) delBundle(ids.join(',')).then(() => getList()) }
function addItem() { form.items.push({ productId: null, qty: 1, sortOrder: form.items.length }) }
getList()
</script>
