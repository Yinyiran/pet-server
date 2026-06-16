<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="商品名/标签" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-input v-model="queryParams.category" placeholder="分类编码" clearable style="width: 120px" />
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
      <el-col :span="1.5"><el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pet:product:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['pet:product:remove']">删除</el-button></el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="主图" prop="imgUrl" width="80" align="center">
        <template #default="{ row }"><span style="font-size:28px">{{ row.imgUrl ? '📷' : '📦' }}</span></template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" min-width="150" show-overflow-tooltip />
      <el-table-column label="售价" prop="price" width="90"><template #default="{ row }">¥{{ row.price }}</template></el-table-column>
      <el-table-column label="原价" prop="originalPrice" width="90"><template #default="{ row }">{{ row.originalPrice ? '¥' + row.originalPrice : '—' }}</template></el-table-column>
      <el-table-column label="库存" prop="stock" width="70" align="center">
        <template #default="{ row }"><el-tag :type="row.stock < 10 ? 'danger' : ''" size="small">{{ row.stock }}</el-tag></template>
      </el-table-column>
      <el-table-column label="销量" prop="sales" width="70" align="center" />
      <el-table-column label="分类" prop="category" width="90" />
      <el-table-column label="特供" prop="isFlash" width="70" align="center">
        <template #default="{ row }"><el-tag v-if="row.isFlash" type="warning" size="small">特供</el-tag></template>
      </el-table-column>
      <el-table-column label="状态" prop="isActive" width="80" align="center">
        <template #default="{ row }"><el-switch v-model="row.isActive" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" v-hasPermi="['pet:product:edit']" /></template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:product:edit']">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:product:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="640px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="商品名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="售价" required><el-input-number v-model="form.price" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="原价"><el-input-number v-model="form.originalPrice" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="form.stock" :min="0" /></el-form-item>
        <el-form-item label="分类"><el-input v-model="form.category" placeholder="分类编码" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="form.tags" placeholder="逗号分隔" /></el-form-item>
        <el-form-item label="主图URL"><el-input v-model="form.imgUrl" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="限时特供"><el-switch v-model="form.isFlash" :active-value="1" :inactive-value="0" /></el-form-item>
        <template v-if="form.isFlash === 1">
          <el-form-item label="特供价"><el-input-number v-model="form.flashPrice" :min="0" :precision="2" /></el-form-item>
          <el-form-item label="特供时段"><el-date-picker v-model="form.flashStart" type="datetime" placeholder="开始" value-format="YYYY-MM-DD HH:mm:ss" /><span style="margin:0 8px">~</span><el-date-picker v-model="form.flashEnd" type="datetime" placeholder="结束" value-format="YYYY-MM-DD HH:mm:ss" /></el-form-item>
        </template>
        <el-form-item label="上架"><el-switch v-model="form.isActive" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listProduct, addProduct, updateProduct, delProduct, toggleProductStatus } from '@/api/pet/product'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const dialogVisible = ref(false), dialogTitle = ref(''), submitLoading = ref(false)
const selectedIds = ref([]), multiple = ref(true)
const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: undefined, category: undefined, isActive: undefined })
const defaultForm = { name: '', price: 0, originalPrice: null, stock: 0, category: '', tags: '', imgUrl: '', description: '', isFlash: 0, flashPrice: null, flashStart: null, flashEnd: null, isActive: 1 }
const form = reactive({ ...defaultForm, id: null })

function getList() { loading.value = true; listProduct(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.keyword = undefined; queryParams.category = undefined; queryParams.isActive = undefined; handleQuery() }
function handleAdd() { Object.assign(form, { ...defaultForm, id: null }); dialogTitle.value = '新增商品'; dialogVisible.value = true }
function handleEdit(row) { Object.assign(form, { ...row }); dialogTitle.value = '编辑商品'; dialogVisible.value = true }
function submitForm() { submitLoading.value = true; const api = form.id ? updateProduct : addProduct; api(form).then(() => { dialogVisible.value = false; getList() }).finally(() => submitLoading.value = false) }
function handleStatusChange(row) { toggleProductStatus(row.id, row.isActive) }
function handleSelectionChange(sel) { selectedIds.value = sel.map(s => s.id); multiple.value = !sel.length }
function handleDelete(row) { const ids = row?.id ? [row.id] : selectedIds.value; if (!ids.length) return; if (confirm('确定删除？')) delProduct(ids.join(',')).then(() => getList()) }
getList()
</script>
