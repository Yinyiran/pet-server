// ============ 拼团逻辑 ============

function getGroupPrice(basePrice, size) {
  if (groupDiscounts[size]) {
    return (basePrice * (1 - groupDiscounts[size].discount)).toFixed(1);
  }
  var customDiscount = Math.min((size - 1) * 0.01, 0.30);
  return (basePrice * (1 - customDiscount)).toFixed(1);
}

function getCustomDiscountText(size) {
  var pct = Math.min((size - 1), 30);
  return '省' + pct + '%';
}

// ---- 拼团规格选择 ----
function selectGroupSize(size, el) {
  var product = productData[currentProductId];
  if (!product) return;

  currentGroupSize = size;

  document.querySelectorAll('.group-spec-chip').forEach(function (c) { c.classList.remove('active'); });
  if (el) {
    el.classList.add('active');
  } else {
    var chip = document.querySelector('.group-spec-chip[data-size="' + size + '"]');
    if (chip) chip.classList.add('active');
  }

  var isPreset = [2, 3, 5, 10].indexOf(size) !== -1;
  document.getElementById('groupCustomWrap').classList.toggle('hidden', isPreset);

  updateGroupPrices(product.price);

  currentGroupState = activeGroups.find(function (g) { return g.size === size; }) || null;
  renderActiveGroup();

  document.getElementById('dbpCurrent').textContent = '¥' + getGroupPrice(product.price, size);

  document.querySelectorAll('.gdt-row').forEach(function (r) { r.classList.remove('highlight'); });
  var row = document.getElementById('gdtRow' + size);
  if (row) row.classList.add('highlight');
}

// ---- 更新拼团价格表 ----
function updateGroupPrices(basePrice) {
  [2, 3, 5, 10].forEach(function (size) {
    var priceEl = document.getElementById('gdtPrice' + size);
    if (priceEl) priceEl.textContent = '¥' + getGroupPrice(basePrice, size);
  });
}

// ---- 自定义人数 ----
function onCustomGroupSize() {
  var input = document.getElementById('groupCustomInput');
  var val = parseInt(input.value) || 0;
  if (val < 3) val = 3;
  if (val > 310) val = 310;
  input.value = val;

  if (val >= 3) {
    currentGroupSize = val;
    var product = productData[currentProductId];
    document.getElementById('groupCustomDiscount').textContent = getCustomDiscountText(val);
    document.getElementById('dbpCurrent').textContent = '¥' + getGroupPrice(product.price, val);
    currentGroupState = null;
    renderActiveGroup();
  }
}

// ---- 渲染活动拼团 ----
function renderActiveGroup() {
  var section = document.getElementById('groupActiveSection');
  if (!currentGroupState) {
    section.classList.add('hidden');
    document.getElementById('groupInitiateBtn').style.display = 'flex';
    return;
  }

  section.classList.remove('hidden');
  document.getElementById('groupInitiateBtn').style.display = 'none';

  var gs = currentGroupState;
  var product = productData[currentProductId];

  document.getElementById('groupActiveSize').textContent = gs.size + '人团';
  document.getElementById('groupActivePrice').textContent = '¥' + getGroupPrice(product.price, gs.size);
  document.getElementById('groupJoinedCount').textContent = gs.joined;
  document.getElementById('groupTotalCount').textContent = gs.total;

  var avatarContainer = document.getElementById('groupMemberAvatars');
  var placeholderCount = gs.total - gs.joined;
  var avatarsHtml = gs.members.map(function (m) {
    return '<div class="gma-avatar" style="background:' + m.bg + '">' + m.emoji + '</div>';
  }).join('');
  for (var i = 0; i < placeholderCount; i++) {
    avatarsHtml += '<div class="gma-avatar placeholder">?</div>';
  }
  avatarContainer.innerHTML = avatarsHtml;

  updateGroupCountdown();
  if (groupCountdownTimer) clearInterval(groupCountdownTimer);
  groupCountdownTimer = setInterval(function () {
    var remain = gs.countdownEnd - Date.now();
    if (remain <= 0) {
      clearInterval(groupCountdownTimer);
      groupCountdownTimer = null;
      document.getElementById('groupActiveCountdown').textContent = '拼团已结束';
      return;
    }
    var h = Math.floor(remain / 3600000);
    var m = Math.floor((remain % 3600000) / 60000);
    var s = Math.floor((remain % 60000) / 1000);
    document.getElementById('groupActiveCountdown').textContent =
      '剩余 ' + pad(h) + ':' + pad(m) + ':' + pad(s);
  }, 1000);

  document.getElementById('groupActiveJoinBtn').textContent = '立即参团';
  document.getElementById('dbpCurrent').textContent = '¥' + getGroupPrice(product.price, gs.size);
}

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function updateGroupCountdown() {
  if (!currentGroupState) return;
  var remain = currentGroupState.countdownEnd - Date.now();
  if (remain <= 0) {
    document.getElementById('groupActiveCountdown').textContent = '拼团已结束';
    return;
  }
  var h = Math.floor(remain / 3600000);
  var m = Math.floor((remain % 3600000) / 60000);
  var s = Math.floor((remain % 60000) / 1000);
  document.getElementById('groupActiveCountdown').textContent = '剩余 ' + pad(h) + ':' + pad(m) + ':' + pad(s);
}

// ---- 立即参团 ----
function handleGroupJoin() {
  if (!currentGroupState) return;
  var product = productData[currentProductId];
  var gs = currentGroupState;

  gs.members.push({ emoji: '🐾', bg: 'linear-gradient(135deg,#fddb92,#d1fdff)' });
  gs.joined++;

  if (gs.joined >= gs.total) {
    clearInterval(groupCountdownTimer);
    groupCountdownTimer = null;
    currentGroupState = null;
    renderActiveGroup();
    document.getElementById('groupActiveSection').classList.add('hidden');
    document.getElementById('groupInitiateBtn').style.display = 'flex';
    showGroupNotify('success',
      '🎉 拼团成功！',
      '你已成功加入' + gs.size + '人团，以拼团价 <b>¥' + getGroupPrice(product.price, gs.size) + '</b> 购买「' + product.name + '」，订单已生成！'
    );
  } else {
    renderActiveGroup();
    showToast('已加入' + gs.size + '人团，还差' + (gs.total - gs.joined) + '人成团 🤝');
  }
}

// ---- 发起拼团 ----
function initiateGroup() {
  var product = productData[currentProductId];
  if (!product) return;

  var size = currentGroupSize;
  var newGroup = {
    size: size,
    joined: 1,
    total: size,
    countdownEnd: Date.now() + 24 * 3600 * 1000,
    members: [{ emoji: '🐾', bg: 'linear-gradient(135deg,#fddb92,#d1fdff)' }]
  };

  activeGroups.push(newGroup);
  currentGroupState = newGroup;
  updateGroupPrices(product.price);
  renderActiveGroup();

  setTimeout(function () {
    if (newGroup.joined < newGroup.total) {
      var simMembers = [
        { emoji: '🐱', bg: 'linear-gradient(135deg,#ff9a9e,#fad0c4)' },
        { emoji: '🐶', bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
        { emoji: '🐰', bg: 'linear-gradient(135deg,#d4fc79,#96e6a1)' }
      ];
      var joinCount = Math.min(
        Math.floor(Math.random() * 2) + 1,
        newGroup.total - newGroup.joined
      );
      for (var i = 0; i < joinCount; i++) {
        newGroup.members.push(simMembers[i]);
        newGroup.joined++;
      }
      renderActiveGroup();
    }
  }, 2500);

  showToast('已发起' + size + '人拼团，分享给好友一起拼 👥');
}

// ---- 拼团通知弹窗 ----
function showGroupNotify(type, title, desc) {
  document.getElementById('groupNotifyIcon').textContent = type === 'success' ? '🎉' : '😞';
  document.getElementById('groupNotifyTitle').textContent = title;
  document.getElementById('groupNotifyDesc').innerHTML = desc;
  document.getElementById('groupNotifyOverlay').classList.remove('hidden');
  if (type === 'success') {
    showToast('📢 拼团成功通知已推送');
  }
}

function closeGroupNotify() {
  document.getElementById('groupNotifyOverlay').classList.add('hidden');
}
