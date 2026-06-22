<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="商家名/地址" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="全部" clearable style="width: 110px">
          <el-option label="宠物店" value="shop" /><el-option label="宠物医院" value="hospital" /><el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
          <el-option label="正常" value="active" /><el-option label="禁用" value="disabled" /><el-option label="待审" value="pending" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pet:merchant:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="warning" plain icon="Document" @click="goApply" v-hasPermi="['pet:merchant-apply:list']">入驻申请</el-button></el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="封面" prop="imgUrl" width="80" align="center">
        <template #default="{ row }">
          <el-image v-if="row.imgUrl" :src="row.imgUrl" fit="cover" style="width:48px;height:48px;border-radius:4px" preview-teleported :preview-src-list="[row.imgUrl]" />
          <span v-else style="font-size:28px">📦</span>
        </template>
      </el-table-column>
      <el-table-column label="商家名称" prop="name" min-width="140" show-overflow-tooltip />
      <el-table-column label="类型" prop="type" width="90">
        <template #default="{ row }">{{ { shop: '宠物店', hospital: '医院', other: '其他' }[row.type] || row.type }}</template>
      </el-table-column>
      <el-table-column label="评分" prop="score" width="70" align="center"><template #default="{ row }">{{ row.score }}</template></el-table-column>
      <el-table-column label="电话" prop="phone" width="120" />
      <el-table-column label="地址" prop="address" min-width="180" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" width="80" align="center">
        <template #default="{ row }"><el-tag :type="row.status === 'active' ? 'success' : row.status === 'disabled' ? 'danger' : 'warning'" size="small">{{ { active: '正常', disabled: '禁用', pending: '待审' }[row.status] }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:merchant:edit']">编辑</el-button>
          <el-button link :type="row.status === 'active' ? 'danger' : 'success'" @click="handleToggle(row)" v-hasPermi="['pet:merchant:edit']">{{ row.status === 'active' ? '禁用' : '启用' }}</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:merchant:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="720px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="商家名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="form.type" placeholder="选择类型"><el-option label="宠物店" value="shop" /><el-option label="宠物医院" value="hospital" /><el-option label="其他" value="other" /></el-select></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="地址"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="封面图">
          <image-upload v-model="form.imgUrl" :limit="1" :action="ossUploadUrl" />
        </el-form-item>
        <el-form-item label="评分"><el-input-number v-model="form.score" :min="0" :max="5" :step="0.1" :precision="1" /></el-form-item>
        <el-form-item label="地图选点">
          <map-picker v-model="mapLocation" @address-change="onMapAddressChange" />
        </el-form-item>
        <el-form-item label="简介"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="状态"><el-select v-model="form.status"><el-option label="正常" value="active" /><el-option label="禁用" value="disabled" /><el-option label="待审" value="pending" /></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import MapPicker from '@/components/MapPicker/index.vue'
import { useRouter } from 'vue-router'
import { listMerchant, getMerchant, addMerchant, updateMerchant, delMerchant, toggleMerchantStatus } from '@/api/pet/merchant'

const router = useRouter()
const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const dialogVisible = ref(false), dialogTitle = ref(''), submitLoading = ref(false)
const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: undefined, type: undefined, status: undefined })
const ossUploadUrl = import.meta.env.VITE_APP_BASE_API + '/common/upload/oss'
const defaultForm = { name: '', type: 'shop', phone: '', address: '', imgUrl: '', score: 5.0, lng: null, lat: null, description: '', status: 'active' }
const form = reactive({ ...defaultForm, id: null })

const mapLocation = computed({
  get: () => ({ lng: form.lng, lat: form.lat }),
  set: (val) => { form.lng = val.lng; form.lat = val.lat }
})

function onMapAddressChange({ address }) {
  if (address && !form.address) form.address = address
}

function getList() { loading.value = true; listMerchant(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.keyword = undefined; queryParams.type = undefined; queryParams.status = undefined; handleQuery() }
function handleAdd() { Object.assign(form, { ...defaultForm, id: null }); dialogTitle.value = '新增商家'; dialogVisible.value = true }
function handleEdit(row) { Object.assign(form, { ...row }); dialogTitle.value = '编辑商家'; dialogVisible.value = true }
function submitForm() { submitLoading.value = true; const api = form.id ? updateMerchant : addMerchant; api(form).then(() => { dialogVisible.value = false; getList() }).finally(() => submitLoading.value = false) }
function handleToggle(row) { const s = row.status === 'active' ? 'disabled' : 'active'; toggleMerchantStatus(row.id, s).then(() => getList()) }
function handleDelete(row) { if (confirm('确定删除？')) delMerchant(String(row.id)).then(() => getList()) }
function goApply() { router.push('/pet/merchant-apply') }
getList()
</script>
