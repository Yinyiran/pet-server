<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd()" v-hasPermi="['pet:productCategory:add']">新增顶级分类</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="list" row-key="id" :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="分类名称" prop="name" min-width="160" />
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="排序" prop="sortOrder" width="80" align="center" />
      <el-table-column label="状态" prop="isActive" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.isActive === 1 ? 'success' : 'danger'" size="small">{{ row.isActive === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Plus" @click="handleAdd(row.id)" v-hasPermi="['pet:productCategory:add']">新增</el-button>
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:productCategory:edit']">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:productCategory:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="460px" destroy-on-close>
      <el-form :model="form" label-width="90px">
        <el-form-item label="上级分类">
          <el-tree-select v-model="form.parentId" :data="treeSelectData" :props="{ label: 'name', value: 'id', children: 'children' }" check-strictly placeholder="无(顶级)" clearable style="width:100%" />
        </el-form-item>
        <el-form-item label="分类名称" required>
          <el-input v-model="form.name" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.isActive" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { getCategoryTree, addCategory, updateCategory, delCategory } from '@/api/pet/productCategory'

const loading = ref(false)
const showSearch = ref(true)
const list = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isExpandAll = ref(true)
const refreshTable = ref(true)
const treeSelectData = ref([])

const defaultForm = { parentId: 0, name: '', sortOrder: 0, isActive: 1 }
const form = reactive({ ...defaultForm, id: null })

function getList() {
  loading.value = true
  getCategoryTree().then(res => {
    list.value = res.data || []
    treeSelectData.value = [{ id: 0, name: '顶级分类', children: res.data || [] }]
  }).finally(() => { loading.value = false })
}

function handleAdd(parentId = 0) {
  Object.assign(form, { ...defaultForm, parentId, id: null })
  dialogTitle.value = '新增分类'
  dialogVisible.value = true
}

function handleEdit(row) {
  Object.assign(form, { id: row.id, name: row.name, parentId: row.parentId, sortOrder: row.sortOrder, isActive: row.isActive })
  dialogTitle.value = '编辑分类'
  dialogVisible.value = true
}

function submitForm() {
  submitLoading.value = true
  const api = form.id ? updateCategory : addCategory
  api(form).then(() => {
    dialogVisible.value = false
    getList()
  }).finally(() => { submitLoading.value = false })
}

function handleDelete(row) {
  if (confirm(`确定删除分类【${row.name}】？`)) {
    delCategory(row.id).then(() => getList())
  }
}

function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => { refreshTable.value = true })
}

getList()
</script>
