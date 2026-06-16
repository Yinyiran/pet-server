<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <!-- ===== 配餐方案 ===== -->
      <el-tab-pane label="配餐方案" name="plan">
        <el-form :inline="true" :model="planQuery" class="demo-form-inline">
          <el-form-item label="宠物类型">
            <el-select v-model="planQuery.petType" placeholder="全部" clearable style="width:120px">
              <el-option label="猫" value="cat" /><el-option label="狗" value="dog" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="planQuery.isActive" placeholder="全部" clearable style="width:100px">
              <el-option label="启用" :value="1" /><el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="planQuery.keyword" placeholder="方案名称" clearable @keyup.enter="loadPlans" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadPlans">查询</el-button>
            <el-button type="success" @click="planDialogVisible = true; planForm = {}">新增方案</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="planList" border>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="name" label="方案名称" min-width="120" />
          <el-table-column prop="petType" label="宠物类型" width="90">
            <template #default="{ row }">{{ row.petType === 'cat' ? '猫' : '狗' }}</template>
          </el-table-column>
          <el-table-column prop="tag" label="标签" width="100" />
          <el-table-column prop="monthlyPrice" label="月单价" width="90" />
          <el-table-column prop="isDefault" label="默认" width="60">
            <template #default="{ row }">{{ row.isDefault ? '是' : '否' }}</template>
          </el-table-column>
          <el-table-column prop="isActive" label="状态" width="80">
            <template #default="{ row }"><el-tag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '禁用' }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="sortOrder" label="排序" width="60" />
          <el-table-column label="操作" width="220">
            <template #default="{ row }">
              <el-button link type="primary" @click="showIngredients(row)">食材</el-button>
              <el-button link type="primary" @click="editPlan(row)">编辑</el-button>
              <el-popconfirm title="确定删除?" @confirm="handleDelPlan(row.id)"><template #reference><el-button link type="danger">删除</el-button></template></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="planTotal" :page.sync="planQuery.pageNum" :limit.sync="planQuery.pageSize" @pagination="loadPlans" />
      </el-tab-pane>

      <!-- ===== 答题记录 ===== -->
      <el-tab-pane label="答题记录" name="quiz">
        <el-form :inline="true" :model="quizQuery" class="demo-form-inline">
          <el-form-item label="宠物类型">
            <el-select v-model="quizQuery.petType" placeholder="全部" clearable style="width:120px">
              <el-option label="猫" value="cat" /><el-option label="狗" value="dog" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="quizQuery.constitutionType" placeholder="体质类型" clearable @keyup.enter="loadQuiz" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadQuiz">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="quizList" border>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="userId" label="用户ID" width="80" />
          <el-table-column prop="petType" label="宠物类型" width="90">
            <template #default="{ row }">{{ row.petType === 'cat' ? '猫' : '狗' }}</template>
          </el-table-column>
          <el-table-column prop="constitutionType" label="体质类型" width="120" />
          <el-table-column prop="constitutionDesc" label="体质描述" min-width="200" show-overflow-tooltip />
          <el-table-column prop="createdAt" label="答题时间" width="170" />
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button link type="primary" @click="viewQuizDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="quizTotal" :page.sync="quizQuery.pageNum" :limit.sync="quizQuery.pageSize" @pagination="loadQuiz" />
      </el-tab-pane>

      <!-- ===== 配餐订单 ===== -->
      <el-tab-pane label="配餐订单" name="order">
        <el-form :inline="true" :model="orderQuery" class="demo-form-inline">
          <el-form-item label="状态">
            <el-select v-model="orderQuery.status" placeholder="全部" clearable style="width:120px">
              <el-option label="待支付" value="pending" /><el-option label="已支付" value="paid" /><el-option label="已完成" value="completed" /><el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadOrders">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="orderList" border>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="orderNo" label="订单号" width="180" />
          <el-table-column prop="userId" label="用户ID" width="80" />
          <el-table-column prop="planId" label="方案ID" width="80" />
          <el-table-column prop="mealFreq" label="每日餐次" width="90" />
          <el-table-column prop="mealDays" label="周期天数" width="90" />
          <el-table-column prop="totalPrice" label="总价" width="90" />
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 'paid' ? 'success' : row.status === 'pending' ? 'warning' : 'info'">{{ { pending:'待支付', paid:'已支付', completed:'已完成', cancelled:'已取消' }[row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="下单时间" width="170" />
        </el-table>
        <pagination :total="orderTotal" :page.sync="orderQuery.pageNum" :limit.sync="orderQuery.pageSize" @pagination="loadOrders" />
      </el-tab-pane>
    </el-tabs>

    <!-- 方案编辑弹窗 -->
    <el-dialog v-model="planDialogVisible" :title="planForm.id ? '编辑方案' : '新增方案'" width="650px">
      <el-form :model="planForm" label-width="100px">
        <el-form-item label="方案名称"><el-input v-model="planForm.name" /></el-form-item>
        <el-form-item label="宠物类型">
          <el-select v-model="planForm.petType"><el-option label="猫" value="cat" /><el-option label="狗" value="dog" /></el-select>
        </el-form-item>
        <el-form-item label="标签"><el-input v-model="planForm.tag" /></el-form-item>
        <el-form-item label="月单价"><el-input-number v-model="planForm.monthlyPrice" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="planForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="默认方案"><el-switch v-model="planForm.isDefault" :active-value="1" :inactive-value="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="planForm.isActive" :active-value="1" :inactive-value="0" /></el-form-item>
        <el-form-item label="匹配规则"><el-input v-model="planForm.matchRules" type="textarea" :rows="3" placeholder="JSON格式" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="planDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePlan">保存</el-button>
      </template>
    </el-dialog>

    <!-- 食材弹窗 -->
    <el-dialog v-model="ingredientDialogVisible" title="食材配方" width="600px">
      <el-table :data="ingredientList" border size="small">
        <el-table-column prop="name" label="食材名称" />
        <el-table-column prop="weight" label="用量" width="100" />
        <el-table-column prop="sortOrder" label="排序" width="60" />
      </el-table>
    </el-dialog>

    <!-- 答题详情弹窗 -->
    <el-dialog v-model="quizDetailVisible" title="答题详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ quizDetail.userId }}</el-descriptions-item>
        <el-descriptions-item label="宠物类型">{{ quizDetail.petType === 'cat' ? '猫' : '狗' }}</el-descriptions-item>
        <el-descriptions-item label="体质类型">{{ quizDetail.constitutionType }}</el-descriptions-item>
        <el-descriptions-item label="答题时间">{{ quizDetail.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="体质描述" :span="2">{{ quizDetail.constitutionDesc }}</el-descriptions-item>
      </el-descriptions>
      <div style="margin-top:16px" v-if="quizDetail.answers">
        <h4>答题内容</h4>
        <pre style="background:#f5f7fa;padding:12px;border-radius:4px;max-height:300px;overflow:auto;font-size:13px">{{ typeof quizDetail.answers === 'string' ? quizDetail.answers : JSON.stringify(quizDetail.answers, null, 2) }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { listMealPlan, addMealPlan, updateMealPlan, delMealPlan, getIngredients, listQuizRecord, listMealOrder } from '@/api/pet/meal'

const activeTab = ref('plan')

// ===== 配餐方案 =====
const planQuery = reactive({ petType: '', isActive: '', keyword: '', pageNum: 1, pageSize: 10 })
const planList = ref([])
const planTotal = ref(0)
const planDialogVisible = ref(false)
const planForm = ref({})

function loadPlans() {
  listMealPlan(planQuery).then(res => { planList.value = res.data.list; planTotal.value = res.data.total })
}
function editPlan(row) { planForm.value = { ...row }; planDialogVisible.value = true }
function handleSavePlan() {
  const fn = planForm.value.id ? updateMealPlan : addMealPlan
  fn(planForm.value).then(() => { planDialogVisible.value = false; loadPlans() })
}
function handleDelPlan(id) { delMealPlan(id).then(() => loadPlans()) }

// ===== 食材 =====
const ingredientDialogVisible = ref(false)
const ingredientList = ref([])
function showIngredients(row) {
  getIngredients(row.id).then(res => { ingredientList.value = res.data || []; ingredientDialogVisible.value = true })
}

// ===== 答题记录 =====
const quizQuery = reactive({ petType: '', constitutionType: '', pageNum: 1, pageSize: 10 })
const quizList = ref([])
const quizTotal = ref(0)
const quizDetailVisible = ref(false)
const quizDetail = ref({})

function loadQuiz() {
  listQuizRecord(quizQuery).then(res => { quizList.value = res.data.list; quizTotal.value = res.data.total })
}
function viewQuizDetail(row) { quizDetail.value = row; quizDetailVisible.value = true }

// ===== 配餐订单 =====
const orderQuery = reactive({ status: '', pageNum: 1, pageSize: 10 })
const orderList = ref([])
const orderTotal = ref(0)

function loadOrders() {
  listMealOrder(orderQuery).then(res => { orderList.value = res.data.list; orderTotal.value = res.data.total })
}

watch(activeTab, (v) => {
  if (v === 'plan') loadPlans()
  else if (v === 'quiz') loadQuiz()
  else if (v === 'order') loadOrders()
}, { immediate: true })
</script>
