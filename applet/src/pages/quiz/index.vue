<script setup lang="ts">
import { ref, computed } from 'vue'
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
  { key: 'company', label: '每日陪伴时长', type: 'radio', options: ['无陪伴(整日独处)','少量陪伴(白天独处)','充足陪伴(白天互动)'] },
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

function selectRadio(key: string, value: string) { answers.value[key] = value }
function toggleCheckbox(key: string, value: string) {
  const arr: string[] = answers.value[key] || []
  const idx = arr.indexOf(value)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(value)
  answers.value[key] = [...arr]
}

function goNext() {
  if (currentStep.value < totalSteps.value - 1) currentStep.value++
}
function goPrev() {
  if (currentStep.value > 0) currentStep.value--
}

const isLastStep = computed(() => currentStep.value === totalSteps.value - 1)
const submitting = ref(false)

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
  <view class="page-container">
    <view class="quiz-header">
      <view class="back-btn" @tap="uni.navigateBack()"><text>‹ 返回</text></view>
      <text class="quiz-title">AI 宠物配餐</text>
      <text class="quiz-subtitle">智能分析爱宠特征，精准推荐营养方案</text>

      <!-- 宠物类型选择 -->
      <view class="pet-type-row">
        <view class="pet-type-btn" :class="{ active: petType === 'cat' }" @tap="petType = 'cat'; currentStep = 0; answers = {}">
          <text>🐱 猫猫</text>
        </view>
        <view class="pet-type-btn" :class="{ active: petType === 'dog' }" @tap="petType = 'dog'; currentStep = 0; answers = {}">
          <text>🐶 狗狗</text>
        </view>
      </view>

      <!-- 进度条 -->
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progress + '%' }" />
      </view>
      <text class="progress-text">{{ currentStep + 1 }}/{{ totalSteps }}</text>
    </view>

    <!-- 题目区域 -->
    <view class="quiz-body" v-if="currentQuestion">
      <view class="question-label">
        <text class="q-num">{{ currentStep + 1 }}</text>
        <text>{{ currentQuestion.label }}</text>
        <text class="type-badge" :class="currentQuestion.type">{{ currentQuestion.type === 'radio' ? '单选' : currentQuestion.type === 'checkbox' ? '多选' : '填空' }}</text>
      </view>

      <!-- 单选题 -->
      <view v-if="currentQuestion.type === 'radio'" class="options-list">
        <view v-for="opt in currentQuestion.options" :key="opt" class="radio-item" :class="{ active: answers[currentQuestion.key] === opt }" @tap="selectRadio(currentQuestion.key, opt)">
          <view class="r-dot" :class="{ checked: answers[currentQuestion.key] === opt }" />
          <text>{{ opt }}</text>
        </view>
      </view>

      <!-- 多选题 -->
      <view v-if="currentQuestion.type === 'checkbox'" class="options-list">
        <view v-for="opt in currentQuestion.options" :key="opt" class="checkbox-item" :class="{ active: (answers[currentQuestion.key] || []).includes(opt) }" @tap="toggleCheckbox(currentQuestion.key, opt)">
          <view class="c-box">{{ (answers[currentQuestion.key] || []).includes(opt) ? '✓' : '' }}</view>
          <text>{{ opt }}</text>
        </view>
      </view>

      <!-- 填空题 -->
      <view v-if="currentQuestion.type === 'input' || currentQuestion.type === 'number'" class="input-wrap">
        <input class="quiz-input" v-model="answers[currentQuestion.key]" :type="currentQuestion.type === 'number' ? 'digit' : 'text'" :placeholder="`请输入${currentQuestion.label}`" />
      </view>
    </view>

    <!-- 导航按钮 -->
    <view class="quiz-nav safe-bottom">
      <button v-if="currentStep > 0" class="btn-outline" @tap="goPrev">‹ 上一题</button>
      <view v-else style="flex:1" />
      <button v-if="!isLastStep" class="btn-primary" @tap="goNext">下一题 ›</button>
      <button v-else class="btn-primary" @tap="submitQuiz" :loading="submitting">提交，开始AI配餐</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.quiz-header {
  background: $header-gradient; padding: 24rpx 32rpx;
}
.back-btn { font-size: 28rpx; color: $primary; margin-bottom: 16rpx; }
.quiz-title { font-size: 36rpx; font-weight: 700; display: block; }
.quiz-subtitle { font-size: 24rpx; color: $text-secondary; display: block; margin-bottom: 20rpx; }

.pet-type-row { display: flex; gap: 16rpx; margin-bottom: 20rpx; }
.pet-type-btn {
  flex: 1; text-align: center; padding: 20rpx; background: $card-bg; border-radius: $radius;
  font-size: 28rpx; border: 2rpx solid transparent;
  &.active { border-color: $primary; background: $primary-light; }
}

.progress-bar { height: 8rpx; background: $border; border-radius: 4rpx; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, $primary, $accent); transition: width 0.3s; }
.progress-text { font-size: 22rpx; color: $text-light; text-align: right; display: block; margin-top: 8rpx; }

.quiz-body { flex: 1; padding: 32rpx; overflow-y: auto; }

.question-label {
  display: flex; align-items: center; gap: 12rpx; margin-bottom: 32rpx; font-size: 32rpx; font-weight: 700;
}
.q-num {
  width: 48rpx; height: 48rpx; background: $primary; color: #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 24rpx;
}
.type-badge {
  font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 6rpx; margin-left: auto;
  &.radio { background: #e8f5e9; color: #4caf50; }
  &.checkbox { background: #fff3e0; color: #ff9800; }
  &.input, &.number { background: #e3f2fd; color: #2196f3; }
}

.options-list { display: flex; flex-direction: column; gap: 16rpx; }
.radio-item, .checkbox-item {
  display: flex; align-items: center; gap: 16rpx; padding: 24rpx;
  background: $card-bg; border-radius: $radius; border: 2rpx solid $border;
  font-size: 28rpx;
  &.active { border-color: $primary; background: $primary-light; }
}
.r-dot {
  width: 32rpx; height: 32rpx; border: 2rpx solid $border; border-radius: 50%;
  &.checked { border-color: $primary; background: $primary; box-shadow: inset 0 0 0 6rpx #fff; }
}
.c-box {
  width: 32rpx; height: 32rpx; border: 2rpx solid $border; border-radius: 6rpx;
  display: flex; align-items: center; justify-content: center; font-size: 20rpx; color: #fff;
  .active & { background: $primary; border-color: $primary; }
}

.input-wrap { }
.quiz-input {
  background: $card-bg; border: 2rpx solid $border; padding: 24rpx; border-radius: $radius;
  font-size: 28rpx; width: 100%;
}

.quiz-nav {
  display: flex; gap: 16rpx; padding: 20rpx 32rpx; background: $card-bg; border-top: 1rpx solid $border;
  button { min-width: 200rpx; }
}
</style>
