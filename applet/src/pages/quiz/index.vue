<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { mealApi } from '@/api'
import { checkLogin } from '@/utils/auth'

/** 宠物类型 */
const petType = ref<'cat' | 'dog'>('cat')
const currentStep = ref(0)

/** 答题数据 */
const answers = ref<Record<string, any>>({})

/** 猫咪题目 */
const catQuestions = [
  { key: 'breed', label: '猫咪品种', type: 'radio', options: ['英短','美短','布偶','德文卷毛','暹罗','蓝猫','加菲','缅因','阿比西尼亚','其他'] },
  { key: 'breedOther', label: '其他品种', type: 'input', showIf: () => answers.value.breed === '其他' },
  { key: 'nickname', label: '宠物昵称', type: 'input' },
  { key: 'gender', label: '性别', type: 'radio', options: ['公','母'] },
  { key: 'age', label: '年龄段', type: 'radio', options: ['幼猫(0~12月)','成猫(1~7岁)','老年猫(7岁+)'] },
  { key: 'neuter', label: '绝育情况', type: 'radio', options: ['已绝育','未绝育'] },
  { key: 'weight', label: '体重(kg)', type: 'number' },
  { key: 'activity', label: '日常活动量', type: 'radio', options: ['低(大部分时间睡觉)','中(每天少量玩耍)','高(精力旺盛爱跑酷)'] },
  { key: 'mode', label: '饲养模式', type: 'radio', options: ['单宠','多宠'] },
  { key: 'petCount', label: '多宠数量', type: 'number', showIf: () => answers.value.mode === '多宠' },
  { key: 'company', label: '每日陪伴时长', type: 'radio', options: ['无陪伴(整日独处)','少量陪伴(白天独处，夜间短时)','充足陪伴(白天互动，夜间同处)'] },
  { key: 'stomach', label: '肠胃健康', type: 'checkbox', options: ['软便','便秘','频繁呕吐','肠胃健康'] },
  { key: 'skin', label: '皮毛健康', type: 'checkbox', options: ['掉毛重','皮屑瘙痒','毛发干枯','皮肤健康'] },
  { key: 'urinary', label: '泌尿健康', type: 'checkbox', options: ['尿频上火','泪痕重','泌尿健康'] },
  { key: 'joint', label: '关节健康', type: 'checkbox', options: ['关节老化','关节健康'] },
  { key: 'allergy', label: '过敏情况', type: 'checkbox', options: ['肉类过敏','谷物过敏','无过敏'] },
]

/** 狗狗题目 */
const dogQuestions = [
  { key: 'dBreed', label: '狗狗品种', type: 'radio', options: ['泰迪','比熊','吉娃娃','博美','约克夏','马尔济斯','雪纳瑞','柴犬','柯基','其他'] },
  { key: 'dBreedOther', label: '其他品种', type: 'input', showIf: () => answers.value.dBreed === '其他' },
  { key: 'nickname', label: '宠物昵称', type: 'input' },
  { key: 'dGender', label: '性别', type: 'radio', options: ['公','母'] },
  { key: 'dAge', label: '年龄段', type: 'radio', options: ['幼犬(0~12月)','成犬(1~8岁)','老年犬(8岁+)'] },
  { key: 'dNeuter', label: '绝育情况', type: 'radio', options: ['已绝育','未绝育'] },
  { key: 'weight', label: '体重(kg)', type: 'number' },
  { key: 'dActivity', label: '日常活动量', type: 'radio', options: ['低(大部分时间在家)','中(每天短时间活动)','高(每天大量运动)'] },
  { key: 'dMode', label: '饲养模式', type: 'radio', options: ['单宠','多宠'] },
  { key: 'petCount', label: '多宠数量', type: 'number', showIf: () => answers.value.dMode === '多宠' },
  { key: 'dWalk', label: '每周遛弯次数', type: 'radio', options: ['<1次','1~2次','3~5次','每天1次以上'] },
  { key: 'dStomach', label: '肠胃健康', type: 'checkbox', options: ['拉稀','挑食','积食','肠胃健康'] },
  { key: 'dSkin', label: '皮肤健康', type: 'checkbox', options: ['异位性皮炎','季节性脱毛','瘙痒泛红','皮肤健康'] },
  { key: 'dTear', label: '泪痕情况', type: 'checkbox', options: ['顽固泪痕','易上火','无异常'] },
  { key: 'dJoint', label: '关节健康', type: 'checkbox', options: ['髌骨不良','关节老化','关节健康'] },
  { key: 'dMetabolism', label: '代谢情况', type: 'checkbox', options: ['肥胖高血脂','胰腺敏感','代谢正常'] },
  { key: 'dAllergy', label: '过敏情况', type: 'checkbox', options: ['肉类过敏','谷物过敏','无过敏'] },
]

const questions = computed(() => petType.value === 'cat' ? catQuestions : dogQuestions)
const visibleQuestions = computed(() => questions.value.filter(q => !(q as any).showIf || (q as any).showIf()))
const totalSteps = computed(() => visibleQuestions.value.length)
const currentQuestion = computed(() => visibleQuestions.value[currentStep.value])
const progress = computed(() => ((currentStep.value + 1) / totalSteps.value * 100).toFixed(0))
const isLastStep = computed(() => currentStep.value === totalSteps.value - 1)
const submitting = ref(false)

/** 动画 key — 用于强制重新渲染题目区域 */
const animKey = ref(0)

function selectRadio(key: string, value: string) {
  answers.value[key] = value
  // 单选题自动跳转下一题
  if (!isLastStep.value) {
    setTimeout(() => {
      currentStep.value++
      animKey.value++
    }, 350)
  }
}

function toggleCheckbox(key: string, value: string) {
  const arr: string[] = answers.value[key] || []
  const idx = arr.indexOf(value)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(value)
  answers.value[key] = [...arr]
}

function goNext() {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    animKey.value++
  }
}
function goPrev() {
  if (currentStep.value > 0) {
    currentStep.value--
    animKey.value++
  }
}

function switchPetType(type: 'cat' | 'dog') {
  petType.value = type
  currentStep.value = 0
  answers.value = {}
  animKey.value++
}

async function submitQuiz() {
  if (!checkLogin()) return
  submitting.value = true
  try {
    await mealApi.submitQuiz({ petType: petType.value, answers: answers.value })
    uni.showToast({ title: '提交成功', icon: 'success' })
    setTimeout(() => uni.navigateTo({ url: '/pages/poster/index' }), 500)
  } catch (e) {
    console.error(e)
  } finally { submitting.value = false }
}
</script>

<template>
  <view class="quiz-page">
    <!-- 顶部区域 -->
    <view class="quiz-top-area">
      <view class="quiz-back" @tap="uni.navigateBack()">
        <view class="arrow-icon" />
      </view>

      <view class="quiz-page-header">
        <view class="quiz-page-title">AI 宠物配餐</view>
        <view class="quiz-page-subtitle">智能分析爱宠特征，精准推荐最适合的营养配餐方案</view>
      </view>

      <!-- 宠物类型选择 -->
      <view class="quiz-pet-row">
        <view class="quiz-pet-card" :class="{ selected: petType === 'cat' }" @tap="switchPetType('cat')">
          <view class="pet-r-dot" :class="{ checked: petType === 'cat' }" />
          <view class="pet-icon">🐱</view>
          <view class="pet-label">猫猫</view>
        </view>
        <view class="quiz-pet-card" :class="{ selected: petType === 'dog' }" @tap="switchPetType('dog')">
          <view class="pet-r-dot" :class="{ checked: petType === 'dog' }" />
          <view class="pet-icon">🐶</view>
          <view class="pet-label">狗狗</view>
        </view>
      </view>

      <!-- 进度条 -->
      <view class="quiz-progress">
        <view class="quiz-progress-bar">
          <view class="quiz-progress-fill" :style="{ width: progress + '%' }" />
        </view>
        <text class="quiz-progress-text">{{ currentStep + 1 }}/{{ totalSteps }}</text>
      </view>
    </view>

    <!-- 题目区域 -->
    <scroll-view scroll-y class="quiz-scroll">
      <view class="quiz-field" :key="animKey" v-if="currentQuestion">
        <view class="quiz-field-label">
          <view class="q-num">{{ currentStep + 1 }}</view>
          <text>{{ currentQuestion.label }}</text>
          <view class="type-badge" :class="currentQuestion.type === 'radio' ? 'single' : currentQuestion.type === 'checkbox' ? 'multi' : 'fill'">
            {{ currentQuestion.type === 'radio' ? '单选' : currentQuestion.type === 'checkbox' ? '多选' : '填空' }}
          </view>
        </view>

        <!-- 单选题 -->
        <view v-if="currentQuestion.type === 'radio'" class="quiz-radio-group">
          <view
            v-for="opt in currentQuestion.options" :key="opt"
            class="quiz-radio" :class="{ selected: answers[currentQuestion.key] === opt }"
            @tap="selectRadio(currentQuestion.key, opt)"
          >
            <view class="r-dot" :class="{ checked: answers[currentQuestion.key] === opt }" />
            <text>{{ opt }}</text>
          </view>
        </view>

        <!-- 多选题 -->
        <view v-if="currentQuestion.type === 'checkbox'" class="quiz-checkbox-group">
          <view
            v-for="opt in currentQuestion.options" :key="opt"
            class="quiz-checkbox" :class="{ selected: (answers[currentQuestion.key] || []).includes(opt) }"
            @tap="toggleCheckbox(currentQuestion.key, opt)"
          >
            <view class="c-box">{{ (answers[currentQuestion.key] || []).includes(opt) ? '✓' : '' }}</view>
            <text>{{ opt }}</text>
          </view>
        </view>

        <!-- 填空题 -->
        <view v-if="currentQuestion.type === 'input' || currentQuestion.type === 'number'" class="quiz-input-wrap">
          <input
            class="quiz-input"
            :class="{ 'has-value': answers[currentQuestion.key] }"
            v-model="answers[currentQuestion.key]"
            :type="currentQuestion.type === 'number' ? 'digit' : 'text'"
            :placeholder="`请输入${currentQuestion.label}`"
          />
        </view>
      </view>

      <view style="height: 160rpx" />
    </scroll-view>

    <!-- 底部导航 -->
    <view class="quiz-nav safe-bottom">
      <view v-if="currentStep > 0" class="quiz-nav-btn prev" @tap="goPrev">
        <text class="nav-arrow">‹</text> 上一题
      </view>
      <view v-else style="min-width: 160rpx" />
      <text class="quiz-nav-indicator">{{ currentStep + 1 }} / {{ totalSteps }}</text>
      <view v-if="!isLastStep" class="quiz-nav-btn next" @tap="goNext">
        下一题 <text class="nav-arrow">›</text>
      </view>
      <view v-else class="quiz-submit-btn" @tap="submitQuiz">
        {{ submitting ? '提交中...' : '提交，开始AI配餐' }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.quiz-page { display: flex; flex-direction: column; height: 100vh; background: $bg; }

/* 顶部区域 */
.quiz-top-area {
  background: $header-gradient;
  padding: calc(var(--status-bar-height, 44px) + 16rpx) 32rpx 24rpx;
}
.quiz-back { margin-bottom: 16rpx; }
.arrow-icon { width: 20rpx; height: 20rpx; border-top: 4rpx solid $primary; border-left: 4rpx solid $primary; transform: rotate(-45deg); }

/* 标题 */
.quiz-page-header { text-align: center; margin-bottom: 12rpx; }
.quiz-page-title {
  font-size: 52rpx; font-weight: 800; letter-spacing: 1rpx; margin-bottom: 4rpx;
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.quiz-page-subtitle { font-size: 26rpx; color: #a8998a; line-height: 1.6; }

/* 宠物类型选择 — 大图标卡片 */
.quiz-pet-row { display: flex; gap: 24rpx; margin: 28rpx 0; }
.quiz-pet-card {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12rpx;
  padding: 48rpx 32rpx 36rpx; border-radius: $radius;
  border: 3rpx solid $border; background: rgba(255,255,255,0.5); position: relative;
  transition: all 0.25s;
  &.selected { border-color: $primary; background: $primary-light; }
}
.pet-r-dot {
  position: absolute; top: 20rpx; right: 20rpx;
  width: 40rpx; height: 40rpx; border: 3rpx solid #d4c8b8; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  &.checked { border-color: $primary; background: $primary;
    &::after { content: ''; width: 10rpx; height: 10rpx; background: #fff; border-radius: 50%; }
  }
}
.pet-icon { font-size: 104rpx; line-height: 1; transition: transform 0.3s; }
.quiz-pet-card.selected .pet-icon { transform: scale(1.1); }
.pet-label { font-size: 32rpx; font-weight: 700; color: $text; transition: color 0.25s; }
.quiz-pet-card.selected .pet-label { color: $primary-dark; }

/* 进度条 */
.quiz-progress { display: flex; align-items: center; gap: 16rpx; margin-top: 24rpx; }
.quiz-progress-bar { flex: 1; height: 8rpx; background: #e8e3dc; border-radius: 4rpx; overflow: hidden; }
.quiz-progress-fill { height: 100%; background: linear-gradient(90deg, #4facfe, #00f2fe); border-radius: 4rpx; transition: width 0.35s ease; }
.quiz-progress-text { font-size: 22rpx; color: $text-secondary; font-weight: 600; white-space: nowrap; }

/* 题目区域 */
.quiz-scroll { flex: 1; }
.quiz-field {
  margin: 24rpx; padding: 28rpx; background: $card-bg; border-radius: $radius; box-shadow: $shadow-sm;
  animation: quizFadeSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes quizFadeSlideIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.quiz-field-label {
  display: flex; align-items: center; gap: 12rpx; margin-bottom: 20rpx;
  font-size: 28rpx; font-weight: 700; color: $text;
}
.q-num {
  width: 44rpx; height: 44rpx; background: $primary-light; color: $primary;
  font-size: 22rpx; font-weight: 800; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.type-badge {
  font-size: 20rpx; font-weight: 600; padding: 4rpx 14rpx; border-radius: 8rpx; margin-left: auto; flex-shrink: 0;
  &.single { background: #e3f2fd; color: #1565c0; }
  &.multi { background: #fce4ec; color: #c62828; }
  &.fill { background: #e8f5e9; color: #2e7d32; }
}

/* 单选/多选组 */
.quiz-radio-group, .quiz-checkbox-group { display: flex; flex-direction: column; gap: 16rpx; }

.quiz-radio, .quiz-checkbox {
  display: flex; align-items: center; gap: 20rpx; padding: 24rpx 28rpx;
  border: 3rpx solid $border; border-radius: $radius-sm; font-size: 28rpx; color: $text;
  background: #faf8f5; transition: all 0.25s;
  &:active { transform: scale(0.97); }
  &.selected { border-color: $primary; background: $primary-light; color: $primary-dark; }
}

.r-dot {
  width: 32rpx; height: 32rpx; border: 3rpx solid #d4c8b8; border-radius: 50%;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.25s;
  &.checked {
    border-color: $primary; background: $primary;
    &::after { content: ''; width: 10rpx; height: 10rpx; background: #fff; border-radius: 50%; }
  }
}

.c-box {
  width: 32rpx; height: 32rpx; border: 3rpx solid #d4c8b8; border-radius: 6rpx;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  font-size: 20rpx; color: transparent; transition: all 0.25s;
  .selected & { border-color: $primary; background: $primary; color: #fff; }
}

/* 填空题 */
.quiz-input {
  width: 100%; padding: 20rpx 28rpx; font-size: 28rpx; color: $text;
  background: #faf8f5; border: 3rpx solid $border; border-radius: $radius-sm;
  transition: border-color 0.25s;
  &:focus { border-color: $primary; background: #fff; }
  &.has-value { border-color: #b8d8be; background: #f9fdf9; }
}

/* 底部导航 */
.quiz-nav {
  display: flex; align-items: center; justify-content: space-between; gap: 20rpx;
  padding: 20rpx 32rpx; background: $card-bg; border-top: 2rpx solid $border;
}
.quiz-nav-indicator { font-size: 26rpx; font-weight: 600; color: $text-secondary; white-space: nowrap; min-width: 100rpx; text-align: center; }
.quiz-nav-btn {
  display: flex; align-items: center; gap: 8rpx; padding: 22rpx 40rpx;
  font-size: 28rpx; font-weight: 600; border-radius: $radius;
  transition: all 0.25s; color: #fff; background: $primary;
  box-shadow: 0 6rpx 24rpx rgba(249, 115, 22, 0.25);
  &:active { transform: scale(0.96); opacity: 0.9; }
  &.prev { background: #fff; color: $text; border: 3rpx solid $border; box-shadow: none; }
}
.nav-arrow { font-size: 40rpx; line-height: 1; font-weight: 300; }
.quiz-submit-btn {
  display: flex; align-items: center; justify-content: center; padding: 22rpx 40rpx;
  font-size: 28rpx; font-weight: 700; color: #fff; border-radius: $radius;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 8rpx 32rpx rgba(79, 172, 254, 0.3);
  transition: all 0.25s;
  &:active { transform: scale(0.98); opacity: 0.85; }
}
.safe-bottom { padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }
</style>
