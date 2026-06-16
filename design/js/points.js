// ============ 积分系统 — 数据与交互 ============

// ============ 积分配置 ============
const POINTS_CONFIG = {
  consumeRate: 1, // 消费积分倍率：1元=1分
  firstConsumeBonus: 50, // 首次消费额外赠送积分
  inviteBonus: 100, // 邀请新用户获得积分
  rechargeGift: {
    // 充值送积分规则
    100: 10, // 充100送10积分
    200: 25, // 充200送25积分
    500: 80, // 充500送80积分
    1000: 200, // 充1000送200积分
  },
  memberMultiplier: {
    // 会员积分倍率
    silver: 1.1,
    gold: 1.3,
    diamond: 1.5,
  },
  exchangeItems: [
    // 可兑换商品/代金券
    { id: 'voucher_10', type: 'voucher', name: '代金券¥10', points: 100, value: 10, desc: '满99元可用' },
    { id: 'voucher_20', type: 'voucher', name: '代金券¥20', points: 180, value: 20, desc: '满199元可用' },
    { id: 'voucher_50', type: 'voucher', name: '代金券¥50', points: 400, value: 50, desc: '满399元可用' },
    { id: 'product_treat', type: 'product', name: '磨牙洁齿棒x2', points: 200, desc: '精选宠物零食', img: '🦴' },
    { id: 'product_snack', type: 'product', name: '深海鱼冻干', points: 400, desc: '高蛋白美味零食', img: '🐟' },
    { id: 'product_cookie', type: 'product', name: '芝士训练饼干', points: 180, desc: '训练奖励必备', img: '🧀' },
  ],
};

// ============ 用户积分数据 ============
let userPoints = {
  balance: 520, // 当前积分余额
  totalEarned: 720, // 累计获得积分
  totalUsed: 200, // 累计使用积分
  firstConsumeDone: false, // 是否已首次消费
};

// ============ 积分明细日志 ============
let pointsLog = [
  { id: 1, type: 'consume', title: '消费获得', points: 39, orderId: 'OD20260601001', time: '2026-06-01 10:35', balance: 520 },
  { id: 2, type: 'recharge', title: '充值赠送', points: 80, amount: 500, time: '2026-05-28 15:20', balance: 481 },
  { id: 3, type: 'first_consume', title: '首次消费奖励', points: 50, time: '2026-05-25 09:30', balance: 401 },
  { id: 4, type: 'consume', title: '消费获得', points: 89, orderId: 'OD20260520004', time: '2026-05-20 16:50', balance: 351 },
  { id: 5, type: 'exchange', title: '兑换代金券¥10', points: -100, time: '2026-05-18 12:00', balance: 262 },
  { id: 6, type: 'invite', title: '邀请好友奖励', points: 100, time: '2026-05-15 08:20', balance: 362 },
  { id: 7, type: 'register', title: '新用户注册奖励', points: 50, time: '2026-05-10 10:00', balance: 262 },
];

// ============ 获取会员积分倍率 ============
function getMemberPointsMultiplier() {
  const level = userProfile.memberLevel || 'silver';
  return POINTS_CONFIG.memberMultiplier[level] || 1.0;
}

// ============ 计算消费获得积分 ============
function calcConsumePoints(amount) {
  const basePoints = Math.floor(amount * POINTS_CONFIG.consumeRate);
  const multiplier = getMemberPointsMultiplier();
  return Math.floor(basePoints * multiplier);
}

// ============ 添加积分明细记录 ============
function addPointsLog(type, title, points, extra = {}) {
  const log = {
    id: pointsLog.length + 1,
    type,
    title,
    points,
    time: new Date().toLocaleString('zh-CN', { hour12: false }),
    balance: userPoints.balance + points,
    ...extra,
  };
  pointsLog.unshift(log);

  // 更新用户积分
  userPoints.balance += points;
  if (points > 0) {
    userPoints.totalEarned += points;
  } else {
    userPoints.totalUsed += Math.abs(points);
  }

  return log;
}

// ============ 消费获得积分 ============
function earnConsumePoints(orderId, amount) {
  const points = calcConsumePoints(amount);
  addPointsLog('consume', '消费获得', points, { orderId, amount });

  // 首次消费额外奖励
  if (!userPoints.firstConsumeDone) {
    userPoints.firstConsumeDone = true;
    addPointsLog('first_consume', '首次消费奖励', POINTS_CONFIG.firstConsumeBonus);
  }

  renderPointsInfo();
  return points;
}

// ============ 邀请获得积分 ============
function earnInvitePoints(invitedUserName) {
  const points = POINTS_CONFIG.inviteBonus;
  addPointsLog('invite', `邀请好友${invitedUserName}奖励`, points, { invitedUser: invitedUserName });
  renderPointsInfo();
  return points;
}

// ============ 充值获得积分 ============
function earnRechargePoints(amount) {
  // 基础积分
  const basePoints = Math.floor(amount * POINTS_CONFIG.consumeRate);

  // 充值赠送积分
  let giftPoints = 0;
  const rechargeGiftKeys = Object.keys(POINTS_CONFIG.rechargeGift)
    .map(Number)
    .sort((a, b) => b - a);
  for (const threshold of rechargeGiftKeys) {
    if (amount >= threshold) {
      giftPoints = POINTS_CONFIG.rechargeGift[threshold];
      break;
    }
  }

  const totalPoints = basePoints + giftPoints;
  addPointsLog('recharge', '充值赠送', giftPoints, { amount, basePoints });
  renderPointsInfo();
  return totalPoints;
}

// ============ 积分兑换 ============
function exchangeWithPoints(itemId) {
  const item = POINTS_CONFIG.exchangeItems.find((i) => i.id === itemId);
  if (!item) return showToast('兑换商品不存在');

  if (userPoints.balance < item.points) {
    return showToast('积分不足，无法兑换');
  }

  addPointsLog('exchange', `兑换${item.name}`, -item.points, { itemId, itemName: item.name });
  renderPointsInfo();
  renderPointsExchange();

  // 如果积分明细弹窗打开则刷新
  const logOverlay = document.getElementById('pointsLogOverlay');
  if (logOverlay && !logOverlay.classList.contains('hidden')) {
    renderPointsLog();
  }

  showToast(`兑换成功！已扣除${item.points}积分`);
  return true;
}

// ============ 渲染积分信息（菜单项数值 + 内联卡片） ============
function renderPointsInfo() {
  const profilePointsValue = document.getElementById('profilePointsValue');
  if (profilePointsValue) {
    profilePointsValue.textContent = userPoints.balance;
  }
  // 同步更新内联卡片统计数据
  const inlineBalance = document.getElementById('pointsInlineBalance');
  const inlineEarned = document.getElementById('pointsInlineTotalEarned');
  const inlineUsed = document.getElementById('pointsInlineTotalUsed');
  if (inlineBalance) inlineBalance.textContent = userPoints.balance;
  if (inlineEarned) inlineEarned.textContent = userPoints.totalEarned;
  if (inlineUsed) inlineUsed.textContent = userPoints.totalUsed;

  // 同步更新内联卡片倍率信息
  renderInlineMultiplier();
}

// ============ 渲染内联卡片倍率信息 ============
function renderInlineMultiplier() {
  const multiplier = getMemberPointsMultiplier();
  const level = userProfile.memberLevel || 'silver';
  const levelNames = { silver: '银牌会员', gold: '金牌会员', diamond: '黑钻会员' };
  const levelEmojis = { silver: '🥈', gold: '🥇', diamond: '💎' };

  const levelText = (levelEmojis[level] || '🥈') + ' ' + (levelNames[level] || '银牌会员');
  const valText = '×' + multiplier;
  const calcText = '1元 = ' + (1 * multiplier).toFixed(1) + '积分';
  const exampleHTML = '示例：消费100元 → 100×' + multiplier + ' = <strong>' + Math.floor(100 * multiplier) + '积分</strong>';

  const inlineBadgeEl = document.getElementById('pointsInlineMultiplierBadge');
  const inlineValEl = document.getElementById('pointsInlineMultiplierVal');
  const inlineCalcEl = document.getElementById('pointsInlineMultiplierCalc');
  const inlineExampleEl = document.getElementById('pointsInlineMultiplierExample');

  if (inlineBadgeEl) inlineBadgeEl.textContent = levelText;
  if (inlineValEl) inlineValEl.textContent = valText;
  if (inlineCalcEl) inlineCalcEl.textContent = calcText;
  if (inlineExampleEl) inlineExampleEl.innerHTML = exampleHTML;
}

// ============ 渲染会员倍率信息（弹窗内） ============
function renderMultiplierCard() {
  const multiplier = getMemberPointsMultiplier();
  const level = userProfile.memberLevel || 'silver';
  const levelNames = { silver: '银牌会员', gold: '金牌会员', diamond: '黑钻会员' };
  const levelEmojis = { silver: '🥈', gold: '🥇', diamond: '💎' };

  const levelText = (levelEmojis[level] || '🥈') + ' ' + (levelNames[level] || '银牌会员');
  const valText = '×' + multiplier;
  const calcText = '1元 = ' + (1 * multiplier).toFixed(1) + '积分';
  const exampleHTML = '示例：消费100元 → 100×' + multiplier + ' = <strong>' + Math.floor(100 * multiplier) + '积分</strong>';

  const badgeEl = document.getElementById('pointsMultiplierBadge');
  const valEl = document.getElementById('pointsMultiplierVal');
  const calcEl = document.getElementById('pointsMultiplierCalc');
  const exampleEl = document.getElementById('pointsMultiplierExample');

  if (badgeEl) badgeEl.textContent = levelText;
  if (valEl) valEl.textContent = valText;
  if (calcEl) calcEl.textContent = calcText;
  if (exampleEl) exampleEl.innerHTML = exampleHTML;
}

// ============ 渲染积分明细 ============
function renderPointsLog() {
  const logList = document.getElementById('pointsLogList');
  if (!logList) return;

  // 更新弹窗内统计数据
  const balanceEl = document.getElementById('pointsLogBalance');
  const earnedEl = document.getElementById('pointsLogTotalEarned');
  const usedEl = document.getElementById('pointsLogTotalUsed');
  if (balanceEl) balanceEl.textContent = userPoints.balance;
  if (earnedEl) earnedEl.textContent = userPoints.totalEarned;
  if (usedEl) usedEl.textContent = userPoints.totalUsed;

  // 渲染会员倍率卡片
  renderMultiplierCard();

  // 渲染日志列表
  const emptyEl = document.getElementById('pointsLogEmpty');
  if (pointsLog.length === 0) {
    logList.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');

  const typeIcons = {
    consume: '🛒',
    recharge: '💰',
    first_consume: '🎁',
    invite: '👥',
    register: '🎉',
    exchange: '🎁',
  };

  const typeLabels = {
    consume: '消费获得',
    recharge: '充值赠送',
    first_consume: '首次消费奖励',
    invite: '邀请奖励',
    register: '注册奖励',
    exchange: '积分兑换',
  };

  logList.innerHTML = pointsLog
    .map(
      (log) => `
    <div class="points-log-item">
      <div class="points-log-icon">${typeIcons[log.type] || '📋'}</div>
      <div class="points-log-info">
        <div class="points-log-title">${log.title}</div>
        <div class="points-log-time">${log.time}</div>
      </div>
      <div class="points-log-points ${log.points > 0 ? 'positive' : 'negative'}">
        ${log.points > 0 ? '+' : ''}${log.points}
      </div>
    </div>
  `,
    )
    .join('');
}

// ============ 渲染积分兑换商品 ============
function renderPointsExchange() {
  const exchangeList = document.getElementById('pointsExchangeList');
  if (!exchangeList) return;

  exchangeList.innerHTML = POINTS_CONFIG.exchangeItems
    .map(
      (item) => `
    <div class="points-exchange-item ${userPoints.balance < item.points ? 'disabled' : ''}" onclick="${userPoints.balance >= item.points ? `confirmExchange('${item.id}')` : ''}">
      <div class="points-exchange-img">${item.img || '🎁'}</div>
      <div class="points-exchange-info">
        <div class="points-exchange-name">${item.name}</div>
        <div class="points-exchange-desc">${item.desc}</div>
      </div>
      <div class="points-exchange-points">${item.points}积分</div>
    </div>
  `,
    )
    .join('');
}

// ============ 确认兑换 ============
function confirmExchange(itemId) {
  const item = POINTS_CONFIG.exchangeItems.find((i) => i.id === itemId);
  if (!item) return;

  if (userPoints.balance < item.points) {
    return showToast('积分不足，无法兑换');
  }

  // 模拟确认弹窗
  if (confirm(`确认使用${item.points}积分兑换「${item.name}」？`)) {
    exchangeWithPoints(itemId);
  }
}

// ============ 打开积分明细弹窗 ============
function openPointsLogPopup() {
  renderPointsLog();
  const overlay = document.getElementById('pointsLogOverlay');
  if (overlay) overlay.classList.remove('hidden');
}

function closePointsLogPopup(e) {
  if (e && e.target !== e.currentTarget) return;
  const overlay = document.getElementById('pointsLogOverlay');
  if (overlay) overlay.classList.add('hidden');
}

// ============ 打开积分兑换弹窗 ============
function openPointsExchangePopup() {
  const balEl = document.getElementById('pointsExchangeBalance');
  if (balEl) balEl.textContent = userPoints.balance;
  renderPointsExchange();
  const overlay = document.getElementById('pointsExchangeOverlay');
  if (overlay) overlay.classList.remove('hidden');
}

function closePointsExchangePopup(e) {
  if (e && e.target !== e.currentTarget) return;
  const overlay = document.getElementById('pointsExchangeOverlay');
  if (overlay) overlay.classList.add('hidden');
}

// ============ 模拟邀请好友 ============
function simulateInviteFriend() {
  const friendName = '新用户' + Math.floor(Math.random() * 1000);
  const points = earnInvitePoints(friendName);
  showToast(`成功邀请${friendName}，获得${points}积分！`);

  // 如果积分明细弹窗打开则刷新
  const overlay = document.getElementById('pointsLogOverlay');
  if (overlay && !overlay.classList.contains('hidden')) {
    renderPointsLog();
  }
}

// ============ 页面初始化时渲染积分信息 ============
function initPointsSystem() {
  renderPointsInfo();
}

// 在页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
  // 延迟初始化，确保其他组件先加载
  setTimeout(initPointsSystem, 200);
});
