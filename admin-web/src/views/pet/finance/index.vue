<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <!-- ===== 积分流水 ===== -->
      <el-tab-pane label="积分流水" name="points">
        <el-form :inline="true" :model="pointsQuery" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select v-model="pointsQuery.type" placeholder="全部" clearable style="width:120px">
              <el-option label="获得" value="earn" /><el-option label="消耗" value="spend" /><el-option label="过期" value="expire" />
            </el-select>
          </el-form-item>
          <el-form-item label="来源">
            <el-select v-model="pointsQuery.source" placeholder="全部" clearable style="width:120px">
              <el-option label="订单" value="order" /><el-option label="签到" value="sign_in" /><el-option label="活动" value="activity" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="pointsQuery.startDate" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" style="width:140px" />
            <el-date-picker v-model="pointsQuery.endDate" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" style="width:140px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadPoints">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="pointsList" border>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="userId" label="用户ID" width="80" />
          <el-table-column prop="type" label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="row.type === 'earn' ? 'success' : row.type === 'spend' ? 'warning' : 'info'">{{ { earn:'获得', spend:'消耗', expire:'过期' }[row.type] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="来源" width="90" />
          <el-table-column prop="changeValue" label="变动值" width="90">
            <template #default="{ row }"><span :style="{ color: row.changeValue > 0 ? '#67c23a' : '#f56c6c' }">{{ row.changeValue > 0 ? '+' : '' }}{{ row.changeValue }}</span></template>
          </el-table-column>
          <el-table-column prop="balanceAfter" label="变动后余额" width="100" />
          <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
          <el-table-column prop="createdAt" label="时间" width="170" />
        </el-table>
        <pagination :total="pointsTotal" :page.sync="pointsQuery.pageNum" :limit.sync="pointsQuery.pageSize" @pagination="loadPoints" />
      </el-tab-pane>

      <!-- ===== 充值记录 ===== -->
      <el-tab-pane label="充值记录" name="recharge">
        <el-form :inline="true" :model="rechargeQuery" class="demo-form-inline">
          <el-form-item label="充值方式">
            <el-select v-model="rechargeQuery.method" placeholder="全部" clearable style="width:120px">
              <el-option label="微信" value="wechat" /><el-option label="余额" value="balance" /><el-option label="银行卡" value="card" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="rechargeQuery.status" placeholder="全部" clearable style="width:100px">
              <el-option label="待支付" value="pending" /><el-option label="成功" value="success" /><el-option label="失败" value="failed" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadRecharge">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="rechargeList" border>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="rechargeNo" label="充值单号" width="180" />
          <el-table-column prop="userId" label="用户ID" width="80" />
          <el-table-column prop="method" label="充值方式" width="90">
            <template #default="{ row }">{{ { wechat:'微信', balance:'余额', card:'银行卡' }[row.method] || row.method }}</template>
          </el-table-column>
          <el-table-column prop="amount" label="充值金额" width="100" />
          <el-table-column prop="giftAmount" label="赠送金额" width="100" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }"><el-tag :type="row.status === 'success' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">{{ { pending:'待支付', success:'成功', failed:'失败' }[row.status] }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="transactionId" label="交易号" min-width="160" show-overflow-tooltip />
          <el-table-column prop="createdAt" label="充值时间" width="170" />
        </el-table>
        <pagination :total="rechargeTotal" :page.sync="rechargeQuery.pageNum" :limit.sync="rechargeQuery.pageSize" @pagination="loadRecharge" />
      </el-tab-pane>

      <!-- ===== 消费流水 ===== -->
      <el-tab-pane label="消费流水" name="consumption">
        <el-form :inline="true" :model="consumptionQuery" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select v-model="consumptionQuery.type" placeholder="全部" clearable style="width:120px">
              <el-option label="商品购买" value="purchase" /><el-option label="退款" value="refund" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="consumptionQuery.status" placeholder="全部" clearable style="width:100px">
              <el-option label="成功" value="success" /><el-option label="已退款" value="refunded" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadConsumption">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="consumptionList" border>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="logNo" label="流水号" width="180" />
          <el-table-column prop="userId" label="用户ID" width="80" />
          <el-table-column prop="type" label="类型" width="90">
            <template #default="{ row }">{{ row.type === 'purchase' ? '商品购买' : '退款' }}</template>
          </el-table-column>
          <el-table-column prop="itemSummary" label="商品摘要" min-width="180" show-overflow-tooltip />
          <el-table-column prop="totalAmount" label="总金额" width="90" />
          <el-table-column prop="balancePay" label="余额支付" width="90" />
          <el-table-column prop="wechatPay" label="微信支付" width="90" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }"><el-tag :type="row.status === 'success' ? 'success' : 'warning'">{{ row.status === 'success' ? '成功' : '已退款' }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="createdAt" label="消费时间" width="170" />
        </el-table>
        <pagination :total="consumptionTotal" :page.sync="consumptionQuery.pageNum" :limit.sync="consumptionQuery.pageSize" @pagination="loadConsumption" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { listPointsLog, listRechargeLog, listConsumptionLog } from '@/api/pet/finance'

const activeTab = ref('points')

// ===== 积分流水 =====
const pointsQuery = reactive({ type: '', source: '', startDate: '', endDate: '', pageNum: 1, pageSize: 10 })
const pointsList = ref([])
const pointsTotal = ref(0)
function loadPoints() { listPointsLog(pointsQuery).then(res => { pointsList.value = res.data.list; pointsTotal.value = res.data.total }) }

// ===== 充值记录 =====
const rechargeQuery = reactive({ method: '', status: '', pageNum: 1, pageSize: 10 })
const rechargeList = ref([])
const rechargeTotal = ref(0)
function loadRecharge() { listRechargeLog(rechargeQuery).then(res => { rechargeList.value = res.data.list; rechargeTotal.value = res.data.total }) }

// ===== 消费流水 =====
const consumptionQuery = reactive({ type: '', status: '', pageNum: 1, pageSize: 10 })
const consumptionList = ref([])
const consumptionTotal = ref(0)
function loadConsumption() { listConsumptionLog(consumptionQuery).then(res => { consumptionList.value = res.data.list; consumptionTotal.value = res.data.total }) }

watch(activeTab, (v) => {
  if (v === 'points') loadPoints()
  else if (v === 'recharge') loadRecharge()
  else if (v === 'consumption') loadConsumption()
}, { immediate: true })
</script>
