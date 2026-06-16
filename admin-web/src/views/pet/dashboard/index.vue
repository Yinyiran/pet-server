<template>
  <div class="app-container">
    <!-- 核心指标卡片 -->
    <el-row :gutter="16" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover"><div class="stat-item"><div class="stat-label">今日新增用户</div><div class="stat-value text-primary">{{ overview.todayNewUsers }}</div></div></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"><div class="stat-item"><div class="stat-label">今日订单数</div><div class="stat-value text-success">{{ overview.todayOrders }}</div></div></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"><div class="stat-item"><div class="stat-label">今日GMV(元)</div><div class="stat-value text-warning">{{ overview.todayGmv }}</div></div></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"><div class="stat-item"><div class="stat-label">今日佣金(元)</div><div class="stat-value text-danger">{{ overview.todayCommission }}</div></div></el-card>
      </el-col>
    </el-row>

    <!-- 待审核 -->
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="8">
        <el-card shadow="hover"><div class="stat-item"><div class="stat-label">待审核入驻</div><div class="stat-value">{{ overview.pendingMerchant }}</div></div></el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"><div class="stat-item"><div class="stat-label">待审核提现</div><div class="stat-value">{{ overview.pendingWithdraw }}</div></div></el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"><div class="stat-item"><div class="stat-label">待处理售后</div><div class="stat-value">{{ overview.pendingRefund }}</div></div></el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>订单趋势（近7天）</span></template>
          <div ref="orderChartRef" style="height:320px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>用户增长趋势（近7天）</span></template>
          <div ref="userChartRef" style="height:320px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热销商品 -->
    <el-row style="margin-top:16px">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header><span>热销商品 TOP 10</span></template>
          <el-table :data="topProducts" border size="small">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="totalSold" label="总销量" width="100" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getOverview, getTrend, getUserTrend, getTopProducts } from '@/api/pet/dashboard'

const overview = reactive({
  todayNewUsers: 0, todayOrders: 0, todayGmv: 0, todayCommission: 0,
  pendingMerchant: 0, pendingWithdraw: 0, pendingRefund: 0,
})
const topProducts = ref([])
const orderChartRef = ref(null)
const userChartRef = ref(null)

onMounted(() => {
  loadOverview()
  loadTrend()
  loadUserTrend()
  loadTopProducts()
})

function loadOverview() {
  getOverview().then(res => { Object.assign(overview, res.data) })
}

function loadTrend() {
  getTrend(7).then(res => {
    const data = res.data || []
    const chart = echarts.init(orderChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.map(d => d.date) },
      yAxis: [
        { type: 'value', name: '订单数' },
        { type: 'value', name: 'GMV(元)' },
      ],
      series: [
        { name: '订单数', type: 'bar', data: data.map(d => d.orderCount) },
        { name: 'GMV', type: 'line', yAxisIndex: 1, data: data.map(d => d.gmv), smooth: true },
      ],
      grid: { left: 50, right: 50 },
    })
  })
}

function loadUserTrend() {
  getUserTrend(7).then(res => {
    const data = res.data || []
    const chart = echarts.init(userChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.map(d => d.date) },
      yAxis: { type: 'value', name: '新增用户' },
      series: [
        { name: '新增用户', type: 'line', data: data.map(d => d.userCount), smooth: true, areaStyle: { opacity: 0.3 } },
      ],
      grid: { left: 50, right: 20 },
    })
  })
}

function loadTopProducts() {
  getTopProducts(10).then(res => { topProducts.value = res.data || [] })
}
</script>

<style scoped>
.stat-item { text-align: center; padding: 10px 0; }
.stat-label { font-size: 14px; color: #909399; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.text-primary { color: #409eff; }
.text-success { color: #67c23a; }
.text-warning { color: #e6a23c; }
.text-danger { color: #f56c6c; }
</style>
