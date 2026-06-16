<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="分佣等级" name="tier" />
      <el-tab-pane label="分佣账户" name="account" />
      <el-tab-pane label="佣金流水" name="log" />
      <el-tab-pane label="邀请关系" name="invite" />
      <el-tab-pane label="提现审核" name="withdraw" />
    </el-tabs>

    <!-- 分佣等级 -->
    <div v-if="activeTab === 'tier'">
      <el-button type="primary" plain icon="Plus" @click="tierDialogVisible = true" style="margin-bottom:12px" v-hasPermi="['pet:commission:tier']">新增等级</el-button>
      <el-table :data="tierList" v-loading="tierLoading" border>
        <el-table-column label="ID" prop="id" width="60" /><el-table-column label="等级名" prop="name" width="120" /><el-table-column label="等级序号" prop="level" width="80" />
        <el-table-column label="佣金率%" prop="commissionRate" width="90" /><el-table-column label="升级条件" prop="upgradeCondition" min-width="150" show-overflow-tooltip />
        <el-table-column label="主题色" prop="color" width="80" /><el-table-column label="启用" prop="isActive" width="70"><template #default="{ row }">{{ row.isActive ? '是' : '否' }}</template></el-table-column>
        <el-table-column label="操作" width="80"><template #default="{ row }"><el-button link type="primary" @click="editTier(row)" v-hasPermi="['pet:commission:tier']">编辑</el-button></template></el-table-column>
      </el-table>
    </div>

    <!-- 分佣账户 -->
    <div v-if="activeTab === 'account'">
      <el-table :data="accountList" v-loading="accountLoading" border>
        <el-table-column label="用户ID" prop="userId" width="80" /><el-table-column label="等级ID" prop="tierId" width="70" />
        <el-table-column label="累计收益" prop="totalEarned" width="110"><template #default="{ row }">¥{{ row.totalEarned }}</template></el-table-column>
        <el-table-column label="待结算" prop="pendingAmount" width="100"><template #default="{ row }">¥{{ row.pendingAmount }}</template></el-table-column>
        <el-table-column label="可提现" prop="availableBalance" width="100"><template #default="{ row }">¥{{ row.availableBalance }}</template></el-table-column>
        <el-table-column label="冻结" prop="frozenAmount" width="90"><template #default="{ row }">¥{{ row.frozenAmount }}</template></el-table-column>
        <el-table-column label="邀请数" prop="inviteCount" width="70" /><el-table-column label="本月收益" prop="thisMonthEarned" width="100"><template #default="{ row }">¥{{ row.thisMonthEarned }}</template></el-table-column>
      </el-table>
      <pagination v-show="accountTotal > 0" :total="accountTotal" v-model:page="accountQuery.pageNum" v-model:limit="accountQuery.pageSize" @pagination="loadAccounts" />
    </div>

    <!-- 佣金流水 -->
    <div v-if="activeTab === 'log'">
      <el-table :data="logList" v-loading="logLoading" border>
        <el-table-column label="流水号" prop="logNo" width="180" /><el-table-column label="受益人" prop="userId" width="80" />
        <el-table-column label="来源用户" prop="fromUserId" width="80" /><el-table-column label="类型" prop="type" width="80" />
        <el-table-column label="标题" prop="title" min-width="140" show-overflow-tooltip /><el-table-column label="金额" prop="amount" width="100"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
        <el-table-column label="层级" prop="commissionLevel" width="60" /><el-table-column label="状态" prop="status" width="80"><template #default="{ row }"><el-tag :type="row.status === 'settled' ? 'success' : 'warning'" size="small">{{ row.status === 'settled' ? '已结算' : '待结算' }}</el-tag></template></el-table-column>
        <el-table-column label="时间" prop="createdAt" width="160" />
      </el-table>
      <pagination v-show="logTotal > 0" :total="logTotal" v-model:page="logQuery.pageNum" v-model:limit="logQuery.pageSize" @pagination="loadLogs" />
    </div>

    <!-- 邀请关系 -->
    <div v-if="activeTab === 'invite'">
      <el-table :data="inviteList" v-loading="inviteLoading" border>
        <el-table-column label="ID" prop="id" width="60" /><el-table-column label="邀请人" prop="parentId" width="80" />
        <el-table-column label="被邀请人" prop="userId" width="80" /><el-table-column label="深度" prop="levelDepth" width="60" />
        <el-table-column label="状态" prop="status" width="80" /><el-table-column label="邀请时间" prop="createdAt" width="160" />
      </el-table>
      <pagination v-show="inviteTotal > 0" :total="inviteTotal" v-model:page="inviteQuery.pageNum" v-model:limit="inviteQuery.pageSize" @pagination="loadInvites" />
    </div>

    <!-- 提现审核 -->
    <div v-if="activeTab === 'withdraw'">
      <el-table :data="withdrawList" v-loading="withdrawLoading" border>
        <el-table-column label="单号" prop="withdrawNo" width="180" /><el-table-column label="用户ID" prop="userId" width="80" />
        <el-table-column label="金额" prop="amount" width="100"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
        <el-table-column label="方式" prop="method" width="80" /><el-table-column label="状态" prop="status" width="90"><template #default="{ row }"><el-tag :type="row.status === 'completed' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'" size="small">{{ { pending: '待审', approved: '通过', rejected: '拒绝', completed: '完成' }[row.status] }}</el-tag></template></el-table-column>
        <el-table-column label="备注" prop="auditRemark" min-width="120" show-overflow-tooltip /><el-table-column label="申请时间" prop="appliedAt" width="160" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }"><template v-if="row.status === 'pending'"><el-button link type="success" @click="handleAuditWithdraw(row, 'approved')">通过</el-button><el-button link type="danger" @click="handleAuditWithdraw(row, 'rejected')">拒绝</el-button></template></template>
        </el-table-column>
      </el-table>
      <pagination v-show="withdrawTotal > 0" :total="withdrawTotal" v-model:page="withdrawQuery.pageNum" v-model:limit="withdrawQuery.pageSize" @pagination="loadWithdraws" />
    </div>

    <!-- 等级弹窗 -->
    <el-dialog title="分佣等级" v-model="tierDialogVisible" width="520px" destroy-on-close>
      <el-form :model="tierForm" label-width="100px">
        <el-form-item label="等级名" required><el-input v-model="tierForm.name" /></el-form-item>
        <el-form-item label="等级序号"><el-input-number v-model="tierForm.level" :min="0" /></el-form-item>
        <el-form-item label="佣金率%"><el-input-number v-model="tierForm.commissionRate" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="升级条件"><el-input v-model="tierForm.upgradeCondition" /></el-form-item>
        <el-form-item label="主题色"><el-input v-model="tierForm.color" style="width:120px" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="tierForm.isActive" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="tierDialogVisible = false">取消</el-button><el-button type="primary" @click="submitTier">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listTier, addTier, updateTier, listAccount, listLog, listInvite, listWithdraw, auditWithdraw } from '@/api/pet/commission'

const activeTab = ref('tier')
const tierList = ref([]), tierLoading = ref(false), tierDialogVisible = ref(false)
const tierForm = reactive({ name: '', level: 0, commissionRate: 0, upgradeCondition: '', color: '', isActive: 1, id: null })

const accountList = ref([]), accountTotal = ref(0), accountLoading = ref(false), accountQuery = reactive({ pageNum: 1, pageSize: 10 })
const logList = ref([]), logTotal = ref(0), logLoading = ref(false), logQuery = reactive({ pageNum: 1, pageSize: 10 })
const inviteList = ref([]), inviteTotal = ref(0), inviteLoading = ref(false), inviteQuery = reactive({ pageNum: 1, pageSize: 10 })
const withdrawList = ref([]), withdrawTotal = ref(0), withdrawLoading = ref(false), withdrawQuery = reactive({ pageNum: 1, pageSize: 10 })

function loadTiers() { tierLoading.value = true; listTier().then(res => { tierList.value = res.data || [] }).finally(() => tierLoading.value = false) }
function editTier(row) { Object.assign(tierForm, row); tierDialogVisible.value = true }
function submitTier() { const api = tierForm.id ? updateTier : addTier; api(tierForm).then(() => { tierDialogVisible.value = false; loadTiers() }) }

function loadAccounts() { accountLoading.value = true; listAccount(accountQuery).then(res => { accountList.value = res.data.list; accountTotal.value = res.data.total }).finally(() => accountLoading.value = false) }
function loadLogs() { logLoading.value = true; listLog(logQuery).then(res => { logList.value = res.data.list; logTotal.value = res.data.total }).finally(() => logLoading.value = false) }
function loadInvites() { inviteLoading.value = true; listInvite(inviteQuery).then(res => { inviteList.value = res.data.list; inviteTotal.value = res.data.total }).finally(() => inviteLoading.value = false) }
function loadWithdraws() { withdrawLoading.value = true; listWithdraw(withdrawQuery).then(res => { withdrawList.value = res.data.list; withdrawTotal.value = res.data.total }).finally(() => withdrawLoading.value = false) }
function handleAuditWithdraw(row, status) { auditWithdraw(row.id, { status }).then(() => loadWithdraws()) }

function handleTabChange(tab) { if (tab === 'tier') loadTiers(); else if (tab === 'account') loadAccounts(); else if (tab === 'log') loadLogs(); else if (tab === 'invite') loadInvites(); else if (tab === 'withdraw') loadWithdraws() }
loadTiers()
</script>
