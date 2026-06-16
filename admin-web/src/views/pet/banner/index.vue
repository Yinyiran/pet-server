<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="Banner标题" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="isActive">
        <el-select v-model="queryParams.isActive" placeholder="全部" clearable style="width: 100px">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pet:banner:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['pet:banner:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="预览" prop="bgImg" width="140" align="center">
        <template #default="{ row }">
          <div :style="{ width: '120px', height: '60px', borderRadius: '6px', background: row.bgColor || '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'#666', overflow:'hidden' }">
            <img v-if="row.bgImg" :src="row.bgImg" style="width:100%;height:100%;object-fit:cover" />
            <span v-else>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="120" show-overflow-tooltip />
      <el-table-column label="跳转类型" prop="linkType" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ { product:'商品', merchant:'商家', page:'页面', url:'外链', none:'无' }[row.linkType] || row.linkType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="状态" prop="isActive" width="80" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.isActive" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" v-hasPermi="['pet:banner:edit']" />
        </template>
      </el-table-column>
      <el-table-column label="展示时段" min-width="160">
        <template #default="{ row }">
          {{ row.validFrom || '不限' }} ~ {{ row.validUntil || '不限' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:banner:edit']">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:banner:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="580px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="主标题" required>
          <el-input v-model="form.title" placeholder="Banner主标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subtitle" placeholder="Banner副标题" />
        </el-form-item>
        <el-form-item label="背景图URL">
          <el-input v-model="form.bgImg" placeholder="背景图URL" />
        </el-form-item>
        <el-form-item label="兜底背景色">
          <el-color-picker v-model="form.bgColor" />
        </el-form-item>
        <el-form-item label="按钮文字">
          <el-input v-model="form.btnText" placeholder="如: 去逛逛" style="width:200px" />
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-select v-model="form.linkType" style="width:150px">
            <el-option label="无" value="none" />
            <el-option label="商品" value="product" />
            <el-option label="商家" value="merchant" />
            <el-option label="页面路径" value="page" />
            <el-option label="外链URL" value="url" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转目标" v-if="form.linkType !== 'none'">
          <el-input v-model="form.linkValue" placeholder="商品ID/商家ID/路径/URL" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="展示开始">
          <el-date-picker v-model="form.validFrom" type="datetime" placeholder="不限" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="展示结束">
          <el-date-picker v-model="form.validUntil" type="datetime" placeholder="不限" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="启用">
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
import { ref, reactive } from 'vue'
import { listBanner, addBanner, updateBanner, delBanner } from '@/api/pet/banner'

const loading = ref(false)
const showSearch = ref(true)
const list = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const selectedIds = ref([])
const multiple = ref(true)

const queryParams = reactive({ pageNum: 1, pageSize: 10, title: undefined, isActive: undefined })
const defaultForm = { title: '', subtitle: '', bgImg: '', bgColor: '#f0f0f0', btnText: '', btnColor: '', linkType: 'none', linkValue: '', sortOrder: 0, isActive: 1, validFrom: null, validUntil: null }
const form = reactive({ ...defaultForm, id: null })

function getList() {
  loading.value = true
  listBanner(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => { loading.value = false })
}

function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.title = undefined; queryParams.isActive = undefined; handleQuery() }

function handleAdd() {
  Object.assign(form, { ...defaultForm, id: null })
  dialogTitle.value = '新增Banner'
  dialogVisible.value = true
}

function handleEdit(row) {
  Object.assign(form, { ...row })
  dialogTitle.value = '编辑Banner'
  dialogVisible.value = true
}

function submitForm() {
  submitLoading.value = true
  const api = form.id ? updateBanner : addBanner
  api(form).then(() => { dialogVisible.value = false; getList() }).finally(() => { submitLoading.value = false })
}

function handleStatusChange(row) {
  updateBanner(row).then(() => {})
}

function handleSelectionChange(selection) {
  selectedIds.value = selection.map(s => s.id)
  multiple.value = !selection.length
}

function handleDelete(row) {
  const ids = row?.id ? [row.id] : selectedIds.value
  if (!ids.length) return
  if (confirm('确定删除选中的Banner？')) {
    delBanner(ids.join(',')).then(() => getList())
  }
}

getList()
</script>
