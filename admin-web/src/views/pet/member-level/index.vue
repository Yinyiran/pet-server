<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['pet:memberLevel:add']">新增等级</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list" border>
      <el-table-column label="等级标识" prop="levelKey" width="120" />
      <el-table-column label="等级名称" prop="name" width="120" />
      <el-table-column label="升级门槛" prop="threshold" width="120">
        <template #default="{ row }">¥{{ row.threshold }}</template>
      </el-table-column>
      <el-table-column label="下一档门槛" prop="nextThreshold" width="120">
        <template #default="{ row }">{{ row.nextThreshold ? '¥' + row.nextThreshold : '—' }}</template>
      </el-table-column>
      <el-table-column label="积分倍率" prop="pointsRate" width="90" align="center" />
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="权益配置" prop="privileges" min-width="200">
        <template #default="{ row }">
          <el-tag v-for="(v, k) in (row.privileges || {})" :key="k" size="small" style="margin:2px">{{ k }}: {{ v }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)" v-hasPermi="['pet:memberLevel:edit']">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)" v-hasPermi="['pet:memberLevel:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" destroy-on-close>
      <el-form :model="form" label-width="100px" ref="formRef">
        <el-form-item label="等级标识" prop="levelKey">
          <el-input v-model="form.levelKey" placeholder="如 silver/gold/diamond" :disabled="!!form._edit" />
        </el-form-item>
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="如 银牌会员" />
        </el-form-item>
        <el-form-item label="升级门槛" prop="threshold">
          <el-input-number v-model="form.threshold" :min="0" :precision="2" style="width:200px" />
        </el-form-item>
        <el-form-item label="下一档门槛" prop="nextThreshold">
          <el-input-number v-model="form.nextThreshold" :min="0" :precision="2" style="width:200px" />
        </el-form-item>
        <el-form-item label="积分倍率" prop="pointsRate">
          <el-input-number v-model="form.pointsRate" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" />
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
import { listMemberLevel, addMemberLevel, updateMemberLevel, delMemberLevel } from '@/api/pet/memberLevel'

const loading = ref(false)
const showSearch = ref(true)
const list = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)

const defaultForm = { levelKey: '', name: '', threshold: 0, nextThreshold: null, pointsRate: 1, sortOrder: 0 }
const form = reactive({ ...defaultForm, _edit: false })

function getList() {
  loading.value = true
  listMemberLevel().then(res => { list.value = res.data || [] }).finally(() => { loading.value = false })
}

function handleAdd() {
  Object.assign(form, { ...defaultForm, _edit: false })
  dialogTitle.value = '新增会员等级'
  dialogVisible.value = true
}

function handleEdit(row) {
  Object.assign(form, { ...row, _edit: true })
  dialogTitle.value = '编辑会员等级'
  dialogVisible.value = true
}

function submitForm() {
  submitLoading.value = true
  const { _edit, ...data } = form
  const api = _edit ? updateMemberLevel : addMemberLevel
  api(data).then(() => {
    dialogVisible.value = false
    getList()
  }).finally(() => { submitLoading.value = false })
}

function handleDelete(row) {
  if (confirm('确定删除该等级？')) {
    delMemberLevel(row.levelKey).then(() => getList())
  }
}

getList()
</script>
