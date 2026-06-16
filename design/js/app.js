// ============ 应用初始化 & 全局函数 ============

// ============ 旧版答题弹窗（已弃用，保留结构以防引用） ============

// ============ Toast ============
function showToast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2100);
}

// ============ Tab 切换 ============
function switchTab(tab, el) {
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  document.querySelectorAll('.nav-item-creator').forEach((n) => n.classList.remove('active'));
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  // 确保返回按钮隐藏
  document.getElementById('headerBack').classList.add('hidden');
  // 清除拼团定时器
  if (typeof groupCountdownTimer !== 'undefined' && groupCountdownTimer) {
    clearInterval(groupCountdownTimer);
    groupCountdownTimer = null;
  }
  if (tab === 'creator') {
    el?.classList.add('active');
  } else {
    el?.classList.add('active');
  }
  if (tab === 'home') {
    document.getElementById('homePage').classList.add('active');
  } else if (tab === 'city') {
    document.getElementById('cityPage').classList.add('active');
    renderCityList('all');
  } else if (tab === 'creator') {
    document.getElementById('creatorPage').classList.add('active');
  } else if (tab === 'cart') {
    document.getElementById('cartPage').classList.add('active');
    renderCart();
  } else if (tab === 'profile') {
    document.getElementById('profilePage').classList.add('active');
    renderProfilePage();
  }
  // 确保购买弹窗关闭
  var purchaseOverlay = document.getElementById('purchaseOverlay');
  if (purchaseOverlay) purchaseOverlay.classList.add('hidden');

  // 客服悬浮按钮显隐
  showCSButtonOnHome();
}

// 统一返回处理（header back button）
function handleHeaderBack() {
  if (document.getElementById('detailPage').classList.contains('active')) {
    navigateBackFromDetail();
  } else if (document.getElementById('shopPage').classList.contains('active')) {
    goBackFromShop();
  } else if (document.getElementById('posterPage').classList.contains('active')) {
    goBackFromPoster();
  } else if (document.getElementById('quizPage').classList.contains('active')) {
    goBackFromQuiz();
  }
  // 回到首页后显示客服按钮
  showCSButtonOnHome();
}

// 首页显示客服按钮，其他页隐藏
function showCSButtonOnHome() {
  var csBtn = document.getElementById('csFloatBtn');
  if (!csBtn) return;
  var onHome = document.getElementById('homePage').classList.contains('active');
  csBtn.style.display = onHome ? 'flex' : 'none';
}

// ============ 申请合作 ============
function openCoopForm() {
  document.getElementById('coopOverlay').classList.remove('hidden');
}

function closeCoopForm(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('coopOverlay').classList.add('hidden');
}

function submitCoop() {
  const type = document.getElementById('coopType').value;
  const name = document.getElementById('coopName').value.trim();
  const contact = document.getElementById('coopContact').value.trim();
  const phone = document.getElementById('coopPhone').value.trim();
  const city = document.getElementById('coopCity').value.trim();
  const addr = document.getElementById('coopAddr').value.trim();

  if (!type) return showToast('请选择商户类型');
  if (!name) return showToast('请输入商户名称');
  if (!contact) return showToast('请输入联系人');
  if (!phone) return showToast('请输入联系电话');
  if (!/^1[3-9]\d{9}$/.test(phone)) return showToast('请输入正确的手机号码');
  if (!city) return showToast('请输入所在城市');
  if (!addr) return showToast('请输入详细地址');

  const btn = document.getElementById('coopSubmitBtn');
  btn.disabled = true;
  btn.textContent = '提交中…';

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = '提交申请';
    document.getElementById('coopOverlay').classList.add('hidden');
    showToast('申请已提交，我们将在1-3个工作日内联系您 📩');

    // 清空表单
    document.getElementById('coopType').value = '';
    document.getElementById('coopName').value = '';
    document.getElementById('coopContact').value = '';
    document.getElementById('coopPhone').value = '';
    document.getElementById('coopCity').value = '杭州市';
    document.getElementById('coopAddr').value = '';
    document.getElementById('coopDesc').value = '';
    document.getElementById('coopWechat').value = '';
  }, 1000);
}

// 初始渲染同城列表（切换tab时触发）
renderCityList('all');

// ============ 抖音口令复制 ============
function copyDouyinCode() {
  const code = '梵优茗宠 直播间口令：萌宠666';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        showToast('口令已复制：萌宠666，打开抖音即可进入直播间 🎬');
      })
      .catch(() => {
        fallbackCopy(code);
      });
  } else {
    fallbackCopy(code);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast('口令已复制：萌宠666，打开抖音即可进入直播间 🎬');
  } catch (e) {
    showToast('复制失败，请稍后再试');
  }
  document.body.removeChild(ta);
}

// ============ Banner 轮播 ============
(function initBanner() {
  const track = document.getElementById('bannerTrack');
  const dots = document.querySelectorAll('#bannerDots .banner-dot');
  const totalSlides = 3;
  let current = 0;
  let autoTimer;

  function goTo(index) {
    current = ((index % totalSlides) + totalSlides) % totalSlides;
    track.scrollTo({ left: track.clientWidth * current, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() {
    goTo(current + 1);
  }

  // 监听手动滑动，同步圆点
  let scrollEndTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      const newIdx = Math.round(track.scrollLeft / track.clientWidth);
      if (newIdx >= 0 && newIdx < totalSlides) {
        current = newIdx;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }
      // 手动滑动后重置自动播放
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 3500);
    }, 100);
  });

  // 点击圆点跳转
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 3500);
    });
  });

  // 自动播放
  autoTimer = setInterval(next, 3500);
})();

// ============ 抖音直播间介绍卡片 ============
function openDouyinCard() {
  document.getElementById('douyinOverlay').classList.remove('hidden');
}

function closeDouyinCard(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('douyinOverlay').classList.add('hidden');
}

function copyDouyinId(e) {
  if (e) e.stopPropagation();
  const id = document.getElementById('douyinIdText').textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        showToast('抖音号已复制：' + id);
      })
      .catch(() => {
        fallbackCopyDouyinId(id);
      });
  } else {
    fallbackCopyDouyinId(id);
  }
}

function fallbackCopyDouyinId(text) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    showToast('抖音号已复制：' + text);
  } catch (e) {
    showToast('复制失败：' + text);
  }
  document.body.removeChild(input);
}

// ============ 倒计时 ============
function startCountdown() {
  let total = 3 * 3600 + 22 * 60 + 45;
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');

  function tick() {
    if (total <= 0) {
      total = 12 * 3600;
    }
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    hEl.textContent = String(h).padStart(2, '0');
    mEl.textContent = String(m).padStart(2, '0');
    sEl.textContent = String(s).padStart(2, '0');
    total--;
  }
  tick();
  setInterval(tick, 1000);
}

startCountdown();

// ============ 客服悬浮按钮（拖拽吸附四边） ============
(function initCSFloatBtn() {
  var btn = document.getElementById('csFloatBtn');
  if (!btn) return;

  var container = document.querySelector('.app-container');
  var header = document.querySelector('.header');
  var bottomNav = document.querySelector('.bottom-nav');

  var dragging = false;
  var startX = 0,
    startY = 0;
  var startLeft = 0,
    startTop = 0;
  var btnW = 40,
    btnH = 40;
  var margin = 4;
  var snapAnimTimer = null;

  function getBtnPos() {
    var r = btn.getBoundingClientRect();
    var c = container.getBoundingClientRect();
    return { left: r.left - c.left, top: r.top - c.top };
  }

  function getBounds() {
    var cw = container.clientWidth;
    var ch = container.clientHeight;
    var topB = (header ? header.offsetHeight : 0) + margin;
    var botB = (bottomNav ? bottomNav.offsetHeight : 0) + margin;
    return { minX: margin, maxX: cw - btnW - margin, minY: topB, maxY: ch - botB - btnH - margin };
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  // 初始右下角
  (function initPos() {
    var b = getBounds();
    btn.style.left = b.maxX + 'px';
    btn.style.top = b.maxY + 'px';
    btn.style.right = 'auto';
  })();

  btn.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    dragging = true;
    var p = getBtnPos();
    btn.style.left = p.left + 'px';
    btn.style.top = p.top + 'px';
    btn.style.right = 'auto';
    startLeft = p.left;
    startTop = p.top;
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    btn.classList.add('dragging');
    btn.classList.remove('snapping');
    if (snapAnimTimer) {
      clearTimeout(snapAnimTimer);
      snapAnimTimer = null;
    }
    e.preventDefault();
  });

  btn.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    var dx = e.touches[0].pageX - startX;
    var dy = e.touches[0].pageY - startY;
    var b = getBounds();
    btn.style.left = clamp(startLeft + dx, b.minX, b.maxX) + 'px';
    btn.style.top = clamp(startTop + dy, b.minY, b.maxY) + 'px';
    e.preventDefault();
  });

  btn.addEventListener('touchend', function () {
    if (!dragging) return;
    dragging = false;
    btn.classList.remove('dragging');
    var p = getBtnPos();
    var cw = container.clientWidth;
    var b = getBounds();
    var cx = p.left + btnW / 2;
    var cy = p.top + btnH / 2;
    var dL = cx - b.minX;
    var dR = b.maxX + btnW - cx;
    var dT = cy - b.minY;
    var dB = b.maxY + btnH - cy;
    var minD = Math.min(dL, dR, dT, dB);

    if (minD === dL) {
      btn.style.left = b.minX + 'px';
      btn.style.top = clamp(p.top, b.minY, b.maxY) + 'px';
    } else if (minD === dR) {
      btn.style.left = b.maxX + 'px';
      btn.style.top = clamp(p.top, b.minY, b.maxY) + 'px';
    } else if (minD === dT) {
      btn.style.left = clamp(p.left, b.minX, b.maxX) + 'px';
      btn.style.top = b.minY + 'px';
    } else {
      btn.style.left = clamp(p.left, b.minX, b.maxX) + 'px';
      btn.style.top = b.maxY + 'px';
    }
    btn.style.right = 'auto';
    btn.classList.add('snapping');
    snapAnimTimer = setTimeout(function () {
      btn.classList.remove('snapping');
    }, 400);
  });

  window.addEventListener('resize', function () {
    var p = getBtnPos();
    var b = getBounds();
    btn.style.left = clamp(p.left, b.minX, b.maxX) + 'px';
    btn.style.top = clamp(p.top, b.minY, b.maxY) + 'px';
    btn.style.right = 'auto';
  });
})();

// ============ 客服入口 ============
function openCustomerService() {
  showToast('客服已连接，请描述您遇到的问题');
}
