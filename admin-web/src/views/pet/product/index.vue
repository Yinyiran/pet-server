<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="商品名/标签" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-tree-select v-model="queryParams.category" :data="categoryTree" :props="{ label: 'name', value: 'id', children: 'children' }" placeholder="全部分类" clearable check-strictly filterable style="width: 160px" />
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
        <template #default="{ row }">
          <el-image v-if="row.imgUrl" :src="row.imgUrl" :preview-src-list="[row.imgUrl]" fit="cover" style="width:48px;height:48px;border-radius:4px" preview-teleported />
          <span v-else style="font-size:28px">📦</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" min-width="150" show-overflow-tooltip />
      <el-table-column label="售价" prop="price" width="90"><template #default="{ row }">¥{{ row.price }}</template></el-table-column>
      <el-table-column label="原价" prop="originalPrice" width="90"><template #default="{ row }">{{ row.originalPrice ? '¥' + row.originalPrice : '—' }}</template></el-table-column>
      <el-table-column label="库存" prop="stock" width="70" align="center">
        <template #default="{ row }"><el-tag :type="row.stock < 10 ? 'danger' : ''" size="small">{{ row.stock }}</el-tag></template>
      </el-table-column>
      <el-table-column label="销量" prop="sales" width="70" align="center" />
      <el-table-column label="分类" prop="category" width="140">
        <template #default="{ row }">
          <template v-if="row.category">
            <el-tag v-for="cid in String(row.category).split(',').filter(Boolean)" :key="cid" size="small" style="margin:2px">{{ categoryNameMap[cid] || cid }}</el-tag>
          </template>
          <span v-else>—</span>
        </template>
      </el-table-column>
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="800px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="商品名称" prop="name"><el-input v-model="form.name" placeholder="请输入商品名称" /></el-form-item>
        <el-form-item label="售价" prop="price"><el-input-number v-model="form.price" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="原价" prop="originalPrice"><el-input-number v-model="form.originalPrice" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="库存" prop="stock"><el-input-number v-model="form.stock" :min="0" /></el-form-item>
        <el-form-item label="分类" prop="categoryList">
          <el-tree-select v-model="form.categoryList" :data="categoryTree" :props="{ label: 'name', value: 'id', children: 'children' }" placeholder="请选择分类" clearable check-strictly filterable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" style="width: 100%" />
        </el-form-item>
        <el-form-item label="标签" prop="tagList">
          <el-select v-model="form.tagList" multiple filterable allow-create default-first-option placeholder="搜索或输入标签后回车" style="width: 100%">
            <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品主图" prop="gallery">
          <image-upload v-model="form.gallery" :limit="9" :action="ossUploadUrl" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <editor v-model="form.description" :min-height="300" />
        </el-form-item>
        <el-form-item label="限时特供"><el-switch v-model="form.isFlash" :active-value="1" :inactive-value="0" /></el-form-item>
        <template v-if="form.isFlash === 1">
          <el-form-item label="特供价" prop="flashPrice"><el-input-number v-model="form.flashPrice" :min="0" :precision="2" /></el-form-item>
          <el-form-item label="特供时段"><el-date-picker v-model="form.flashStart" type="datetime" placeholder="开始" value-format="YYYY-MM-DD HH:mm:ss" /><span style="margin:0 8px">~</span><el-date-picker v-model="form.flashEnd" type="datetime" placeholder="结束" value-format="YYYY-MM-DD HH:mm:ss" /></el-form-item>
        </template>
        <el-form-item label="上架"><el-switch v-model="form.isActive" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { listProduct, addProduct, updateProduct, delProduct, toggleProductStatus, getProductTags } from '@/api/pet/product'
import { getCategoryTree } from '@/api/pet/productCategory'

const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const dialogVisible = ref(false), dialogTitle = ref(''), submitLoading = ref(false)
const selectedIds = ref([]), multiple = ref(true)
const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: undefined, category: undefined, isActive: undefined })
// OSS 上传地址
const ossUploadUrl = import.meta.env.VITE_APP_BASE_API + '/common/upload/oss'
const formRef = ref(null)
const defaultForm = { name: '', price: 0, originalPrice: null, stock: 0, categoryList: [], tagList: [], imgUrl: '', gallery: '', description: '', isFlash: 0, flashPrice: null, flashStart: null, flashEnd: null, isActive: 1 }
const form = reactive({ ...defaultForm, id: null })

// 分类数据
const categoryTree = ref([])
const categoryNameMap = reactive({}) // id -> name 映射，用于列表显示

// 标签数据
const tagOptions = ref([])

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入售价', trigger: 'change' }],
  categoryList: [{ required: true, type: 'array', message: '请选择商品分类', trigger: 'change' }],
  gallery: [{ required: true, message: '请上传至少一张商品主图', trigger: 'change' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  flashPrice: [{ required: true, message: '请输入特供价', trigger: 'change' }],
}

// 加载分类树
function loadCategoryTree() {
  getCategoryTree().then(res => {
    categoryTree.value = res.data || []
    // 构建 id -> name 映射（递归遍历树）
    const map = {}
    function walk(nodes) {
      nodes.forEach(n => {
        map[n.id] = n.name
        if (n.children?.length) walk(n.children)
      })
    }
    walk(categoryTree.value)
    Object.assign(categoryNameMap, map)
  })
}

// 加载已有标签
function loadTags() {
  getProductTags().then(res => {
    tagOptions.value = res.data || []
  })
}

function getList() { loading.value = true; listProduct(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.keyword = undefined; queryParams.category = undefined; queryParams.isActive = undefined; handleQuery() }

function handleAdd() {
  Object.assign(form, { ...defaultForm, tagList: [], categoryList: [], id: null })
  dialogTitle.value = '新增商品'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function handleEdit(row) {
  Object.assign(form, { ...row })
  // 数值字段转 Number，避免 el-input-number 报类型错误
  if (row.price != null && row.price !== '') form.price = Number(row.price)
  if (row.originalPrice != null && row.originalPrice !== '') form.originalPrice = Number(row.originalPrice)
  if (row.flashPrice != null && row.flashPrice !== '') form.flashPrice = Number(row.flashPrice)
  if (row.stock != null && row.stock !== '') form.stock = Number(row.stock)
  // 将 gallery JSON 数组或逗号分隔字符串转为 ImageUpload 可用的字符串
  if (Array.isArray(row.gallery)) {
    form.gallery = row.gallery.join(',')
  } else if (!row.gallery) {
    form.gallery = row.imgUrl || ''
  }
  // 将 tags 字符串转为 tagList 数组
  form.tagList = row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : []
  // 将 category 逗号分隔字符串转为 categoryList 数组（数字类型）
  form.categoryList = row.category ? String(row.category).split(',').filter(Boolean).map(Number) : []
  dialogTitle.value = '编辑商品'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function submitForm() {
  formRef.value.validate(valid => {
    if (!valid) return
    // 从 gallery 提取第一张图作为 imgUrl
    const galleryArr = form.gallery ? form.gallery.split(',').filter(Boolean) : []
    const submitData = { ...form }
    submitData.imgUrl = galleryArr.length ? galleryArr[0] : ''
    submitData.gallery = galleryArr.length ? galleryArr : null
    // tagList 数组转回逗号分隔字符串
    submitData.tags = form.tagList?.length ? form.tagList.join(',') : ''
    // categoryList 数组转回逗号分隔字符串
    submitData.category = form.categoryList?.length ? form.categoryList.join(',') : ''
    delete submitData.tagList
    delete submitData.categoryList
    submitLoading.value = true
    const api = form.id ? updateProduct : addProduct
    api(submitData).then(() => { dialogVisible.value = false; getList(); loadTags() }).finally(() => submitLoading.value = false)
  })
}

function handleStatusChange(row) { toggleProductStatus(row.id, row.isActive) }
function handleSelectionChange(sel) { selectedIds.value = sel.map(s => s.id); multiple.value = !sel.length }
function handleDelete(row) { const ids = row?.id ? [row.id] : selectedIds.value; if (!ids.length) return; if (confirm('确定删除？')) delProduct(ids.join(',')).then(() => getList()) }

// 初始化
loadCategoryTree()
loadTags()
getList()
</script>
