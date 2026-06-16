// ============ 购物车 ============
let cartItems = [
  { emoji: '🦴', name: '鸡肉缠绕磨牙棒', price: 25.9, qty: 2, checked: true, type: 'normal' },
  { emoji: '🐟', name: '深海三文鱼冻干', price: 39.9, qty: 1, checked: true, type: 'normal' },
  { emoji: '🥩', name: '原切牛肉粒', price: 32.9, qty: 1, checked: true, type: 'normal' },
];

// 购物车选中的地址ID（null 表示未选择）
let cartSelectedAddressId = null;

// 初始化购物车角标
updateCartBadge();

function addToCart(emoji, name, price, type) {
  type = type || 'normal';
  const existing = cartItems.find((i) => i.name === name && i.type === type);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ emoji, name, price, qty: 1, checked: true, type });
  }
  updateCartBadge();
  renderCart();
  showToast('已加入购物车');
}

function removeFromCart(name, type) {
  type = type || 'normal';
  cartItems = cartItems.filter((i) => !(i.name === name && i.type === type));
  updateCartBadge();
  renderCart();
}

function updateQty(name, type, delta) {
  type = type || 'normal';
  const item = cartItems.find((i) => i.name === name && i.type === type);
  if (!item) return;

  // 专属定制商品：增加数量时检查总数量不能超过8
  if (type === 'custom' && delta > 0) {
    const customTotal = cartItems.filter((i) => i.type === 'custom').reduce((s, i) => s + i.qty, 0);
    if (customTotal >= 8) {
      showToast('专属定制商品总数量不能超过8份 🔔');
      return;
    }
  }

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(name, type);
    return;
  }
  renderCart();
}

function toggleCheck(checked) {
  cartItems.forEach((i) => (i.checked = checked));
  renderCart();
}

function toggleCheckAll() {
  const el = document.getElementById('cartCheckAll2');
  if (!el) return;
  const checked = el.checked;
  cartItems.forEach((i) => (i.checked = checked));
  renderCart();
}

function updateCartBadge() {
  const total = cartItems.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}

function renderCart() {
  const emptyEl = document.getElementById('cartEmpty');
  const contentEl = document.getElementById('cartContent');
  const itemsEl = document.getElementById('cartItems');
  const bottomEl = document.getElementById('cartBottom');

  if (cartItems.length === 0) {
    emptyEl.style.display = 'flex';
    contentEl.style.display = 'none';
    bottomEl.classList.add('hidden');
    return;
  }

  emptyEl.style.display = 'none';
  contentEl.style.display = 'block';
  bottomEl.classList.remove('hidden');

  // 渲染地址栏
  renderCartAddress();

  const allChecked = cartItems.every((i) => i.checked);
  const checkAllEl = document.getElementById('cartCheckAll2');
  if (checkAllEl) checkAllEl.checked = allChecked;

  const checkedTotal = cartItems.filter((i) => i.checked).reduce((s, i) => s + i.price * i.qty, 0);
  const SHIPPING_FREE = 80;
  const shippingFee = checkedTotal > 0 && checkedTotal < SHIPPING_FREE ? 10 : 0;

  // 运费标签
  const labelEl = document.getElementById('cartShippingLabel');
  if (labelEl) {
    if (checkedTotal === 0) {
      labelEl.innerHTML = '满<span class="shipping-highlight">¥80</span>免运费，运费<span class="shipping-highlight">¥10.00</span>/单';
    } else if (shippingFee === 0) {
      labelEl.innerHTML = '已满<span class="shipping-highlight">¥80</span>，免运费';
    } else {
      const remain = (SHIPPING_FREE - checkedTotal).toFixed(1);
      labelEl.innerHTML = '还差<span class="shipping-highlight">¥' + remain + '</span>享免运费，运费<span class="shipping-highlight">¥10.00</span>';
    }
  }

  // 合计 = 商品金额 + 运费
  const grandTotal = checkedTotal + shippingFee;
  document.getElementById('cartTotalPrice').textContent = grandTotal.toFixed(1);

  const totalQty = cartItems.filter((i) => i.checked).reduce((s, i) => s + i.qty, 0);
  var submitText = totalQty > 0 ? '结算(' + totalQty + ')' : '结算';
  document.getElementById('cartSubmitBtn').textContent = submitText;
  document.getElementById('cartSubmitBtn').disabled = totalQty === 0;

  // 按分类分组渲染
  const normalItems = cartItems.filter((i) => i.type !== 'custom');
  const customItems = cartItems.filter((i) => i.type === 'custom');
  let html = '';

  // 普通商品
  if (normalItems.length > 0) {
    normalItems.forEach((item) => {
      html += renderCartItem(item);
    });
  }

  // 专属定制商品
  if (customItems.length > 0) {
    const customTotal = customItems.reduce((s, i) => s + i.qty, 0);
    var customStatus = '';
    if (customTotal === 8) {
      customStatus = '已满8份';
    } else {
      customStatus = '还需凑' + (8 - customTotal) + '份，当前' + customTotal + '份';
    }
    var tipClass = customTotal === 8 ? 'ok' : 'warn';
    html += '<div class="cart-section-header">';
    html += '<span class="cart-section-title">🐾 专属定制配餐</span>';
    html += '<span class="cart-section-tip ' + tipClass + '">' + customStatus + '</span>';
    html += '</div>';
    customItems.forEach((item) => {
      html += renderCartItem(item);
    });
  }

  itemsEl.innerHTML = html;
}

// 渲染单个购物车商品
function renderCartItem(item) {
  const typeStr = item.type || 'normal';
  var html = '<div class="cart-item">';
  html +=
    '<input type="checkbox" ' + (item.checked ? 'checked' : '') + ' onchange="toggleItemCheck(this, \'' + typeStr + "', '" + item.name + '\')">';
  html += '<div class="cart-item-img">' + item.emoji + '</div>';
  html += '<div class="cart-item-info">';
  html += '<div class="cart-item-name">' + item.name + '</div>';
  html += '<div class="cart-item-price"><span class="unit">¥</span>' + item.price.toFixed(1) + '</div>';
  html += '</div>';
  html += '<div class="cart-qty">';
  html += '<div class="cart-qty-btn" onclick="updateQty(\'' + item.name + "', '" + typeStr + '\', -1)">−</div>';
  html += '<div class="cart-qty-num">' + item.qty + '</div>';
  html += '<div class="cart-qty-btn" onclick="updateQty(\'' + item.name + "', '" + typeStr + '\', 1)">+</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

// 切换单个商品选中状态
function toggleItemCheck(checkbox, type, name) {
  const item = cartItems.find((i) => i.name === name && i.type === type);
  if (item) {
    item.checked = checkbox.checked;
    renderCart();
  }
}

// 零食全家桶：添加8个商品（专属定制，总数量需恰好8份）
function addFamilyBucket() {
  // 先移除旧的专属定制商品
  cartItems = cartItems.filter((i) => i.type !== 'custom');
  const items = [
    { emoji: '🍖', name: '磨牙洁齿棒', price: 10 },
    { emoji: '🐟', name: '三文鱼冻干', price: 10 },
    { emoji: '🧀', name: '芝士训练饼干', price: 10 },
    { emoji: '🥩', name: '原切牛肉粒', price: 10 },
    { emoji: '🍗', name: '鸡肉绕钙奶棒', price: 10 },
    { emoji: '🦴', name: '牛骨头磨牙', price: 10 },
    { emoji: '🐔', name: '冻干鸡肝', price: 10 },
    { emoji: '🥕', name: '蔬菜磨牙圈', price: 10 },
  ];
  items.forEach((i) => addToCart(i.emoji, i.name, i.price, 'custom'));
  showToast('已添加零食全家桶(8件)到购物车 🎉');

  var cartNav = document.querySelector('.nav-item[onclick*="cart"]');
  if (cartNav) switchTab('cart', cartNav);
}

// ============ 购物车地址选择 ============

// 渲染购物车顶部地址栏
function renderCartAddress() {
  const infoEl = document.getElementById('cartAddressInfo');
  if (!infoEl) return;

  // 自动选择默认地址
  if (!cartSelectedAddressId && typeof profileAddresses !== 'undefined' && profileAddresses.length > 0) {
    const defaultAddr = profileAddresses.find((a) => a.isDefault);
    cartSelectedAddressId = defaultAddr ? defaultAddr.id : profileAddresses[0].id;
  }

  if (cartSelectedAddressId && typeof profileAddresses !== 'undefined') {
    const addr = profileAddresses.find((a) => a.id === cartSelectedAddressId);
    if (addr) {
      infoEl.innerHTML = `
        <div class="cart-address-bar-name">${addr.name} <span>${addr.phone}</span></div>
        <div class="cart-address-bar-detail">${addr.region} ${addr.detail}</div>
      `;
      return;
    }
  }

  // 无地址
  cartSelectedAddressId = null;
  infoEl.innerHTML = '<div class="cart-address-bar-text">请选择收货地址</div>';
}

// 从购物车打开地址列表（选择模式）
function openCartAddressList() {
  if (typeof profileAddresses === 'undefined') return;
  window._cartAddressMode = true;
  if (typeof openAddressListPopup === 'function') {
    openAddressListPopup();
  }
}

// 在地址列表中选择地址（供地址卡片点击调用）
function selectCartAddress(id) {
  cartSelectedAddressId = id;
  renderCartAddress();
  if (typeof closeAddressListPopup === 'function') {
    closeAddressListPopup();
  }
  if (typeof renderAddressListPopupBody === 'function') {
    window._cartAddressMode = false;
  }
}

// 提交订单（分单结算）
function submitCart() {
  const checkedItems = cartItems.filter((i) => i.checked);
  if (checkedItems.length === 0) {
    showToast('请选择要结算的商品');
    return;
  }

  const normalItems = checkedItems.filter((i) => i.type !== 'custom');
  const customItems = checkedItems.filter((i) => i.type === 'custom');

  // 专属定制商品数量校验：必须恰好8份
  if (customItems.length > 0) {
    const customTotal = customItems.reduce((s, i) => s + i.qty, 0);
    if (customTotal !== 8) {
      showToast('专属定制商品需恰好8份，当前' + customTotal + '份，请调整后再结算 🔔');
      return;
    }
  }

  // 分单提示
  if (normalItems.length > 0 && customItems.length > 0) {
    showToast('已分成两单结算：普通商品一单，专属定制一单');
  }

  const total = checkedItems.reduce((s, i) => s + i.price * i.qty, 0);
  showToast('正在调起支付，合计 ¥' + total.toFixed(1) + '...');
}
