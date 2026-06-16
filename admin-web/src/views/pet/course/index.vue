<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="课程名" clearable style="width: 160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="档位" prop="tier">
        <el-select v-model="queryParams.tier" placeholder="全部" clearable style="width: 110px">
          <el-option label="基础" value="basic" /><el-option label="专业" value="pro" /><el-option label="合伙人" value="partner" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pet:course:add']">新增</el-button></el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column label="课程名称" prop="name" min-width="160" show-overflow-tooltip />
      <el-table-column label="档位" prop="tier" width="100">
        <template #default="{ row }"><el-tag :type="row.tier === 'partner' ? 'danger' : row.tier === 'pro' ? 'warning' : ''" size="small">{{ { basic: '基础', pro: '专业', partner: '合伙人' }[row.tier] }}</el-tag></template>
      </el-table-column>
      <el-table-column label="价格" prop="price" width="100"><template #default="{ row }">¥{{ row.price }}</template></el-table-column>
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="上架" prop="isActive" width="70" align="center">
        <template #default="{ row }"><el-tag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '是' : '否' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:course:edit']">编辑</el-button>
          <el-button link type="success" icon="VideoCamera" @click="handleVideo(row)" v-hasPermi="['pet:course:list']">视频</el-button>
          <el-button link type="warning" icon="User" @click="handleStudent(row)" v-hasPermi="['pet:student:list']">学员</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:course:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="640px" destroy-on-close>
      <el-form :model="form" label-width="90px">
        <el-form-item label="课程名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="档位"><el-select v-model="form.tier"><el-option label="基础" value="basic" /><el-option label="专业" value="pro" /><el-option label="合伙人" value="partner" /></el-select></el-form-item>
        <el-form-item label="价格" required><el-input-number v-model="form.price" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="封面图URL"><el-input v-model="form.heroImg" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="上架"><el-switch v-model="form.isActive" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button></template>
    </el-dialog>

    <!-- 视频管理弹窗 -->
    <el-dialog title="视频管理" v-model="videoVisible" width="700px" destroy-on-close>
      <el-button type="primary" size="small" plain @click="addVideoItem" style="margin-bottom:12px">+ 添加视频</el-button>
      <el-table :data="videoList" border size="small">
        <el-table-column label="标题" prop="title" min-width="140">
          <template #default="{ row }"><el-input v-model="row.title" size="small" /></template>
        </el-table-column>
        <el-table-column label="视频URL" prop="videoUrl" min-width="180">
          <template #default="{ row }"><el-input v-model="row.videoUrl" size="small" /></template>
        </el-table-column>
        <el-table-column label="时长(秒)" width="100">
          <template #default="{ row }"><el-input-number v-model="row.duration" :min="0" size="small" controls-position="right" style="width:80px" /></template>
        </el-table-column>
        <el-table-column label="免费" width="70">
          <template #default="{ row }"><el-switch v-model="row.isFree" :active-value="1" :inactive-value="0" /></template>
        </el-table-column>
        <el-table-column label="排序" width="80">
          <template #default="{ row }"><el-input-number v-model="row.sortOrder" :min="0" size="small" controls-position="right" style="width:70px" /></template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template #default="{ row }"><el-button v-if="row.id" link type="danger" size="small" @click="handleDeleteVideo(row)">删</el-button></template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="videoVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveVideos" :loading="videoSaving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { listCourse, addCourse, updateCourse, delCourse, listVideo, addVideo, delVideo } from '@/api/pet/course'

const router = useRouter()
const loading = ref(false), showSearch = ref(true), list = ref([]), total = ref(0)
const dialogVisible = ref(false), dialogTitle = ref(''), submitLoading = ref(false)
const videoVisible = ref(false), videoList = ref([]), videoSaving = ref(false), currentCourseId = ref(null)
const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: undefined, tier: undefined })
const defaultForm = { name: '', tier: 'basic', price: 0, heroImg: '', description: '', sortOrder: 0, isActive: 1 }
const form = reactive({ ...defaultForm, id: null })

function getList() { loading.value = true; listCourse(queryParams).then(res => { list.value = res.data.list; total.value = res.data.total }).finally(() => loading.value = false) }
function handleQuery() { queryParams.pageNum = 1; getList() }
function resetQuery() { queryParams.keyword = undefined; queryParams.tier = undefined; handleQuery() }
function handleAdd() { Object.assign(form, { ...defaultForm, id: null }); dialogTitle.value = '新增课程'; dialogVisible.value = true }
function handleEdit(row) { Object.assign(form, { ...row }); dialogTitle.value = '编辑课程'; dialogVisible.value = true }
function submitForm() { submitLoading.value = true; const api = form.id ? updateCourse : addCourse; api(form).then(() => { dialogVisible.value = false; getList() }).finally(() => submitLoading.value = false) }
function handleDelete(row) { if (confirm('确定删除？')) delCourse(String(row.id)).then(() => getList()) }

function handleVideo(row) { currentCourseId.value = row.id; listVideo(row.id).then(res => { videoList.value = res.data || [] }); videoVisible.value = true }
function addVideoItem() { videoList.value.push({ courseId: currentCourseId.value, title: '', videoUrl: '', duration: 0, isFree: 0, sortOrder: videoList.value.length }) }
function handleDeleteVideo(row) { delVideo(String(row.id)).then(() => listVideo(currentCourseId.value).then(res => { videoList.value = res.data || [] })) }
function saveVideos() {
  videoSaving.value = true
  const promises = videoList.value.filter(v => !v.id).map(v => addVideo(v))
  Promise.all(promises).then(() => { videoVisible.value = false; getList() }).finally(() => videoSaving.value = false)
}

function handleStudent(row) { router.push({ path: '/pet/student', query: { courseId: row.id } }) }
getList()
</script>
