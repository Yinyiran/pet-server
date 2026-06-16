// ============ 详情页导航 & 渲染主控 ============

function openProductDetail(productId) {
  var product = productData[productId];
  if (!product) return;

  currentProductId = productId;
  currentGroupSize = 5;
  currentGroupState = activeGroups.find(function (g) { return g.size === 5; }) || null;

  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  document.getElementById('detailPage').classList.add('active');

  document.getElementById('headerBack').classList.remove('hidden');
  document.getElementById('headerBack').onclick = navigateBackFromDetail;

  renderProductDetail(product);
}

function renderProductDetail(product) {
  // 图片轮播
  var track = document.getElementById('detailGalleryTrack');
  var dots = document.getElementById('detailGalleryDots');
  track.innerHTML = product.images.map(function (img) {
    return '<div class="detail-gallery-slide ' + img.bg + '">' + img.emoji + '</div>';
  }).join('');
  dots.innerHTML = product.images.map(function (_, i) {
    return '<div class="detail-gallery-dot' + (i === 0 ? ' active' : '') + '" onclick="goToGallerySlide(' + i + ')"></div>';
  }).join('');

  // 视频
  document.getElementById('detailVideoWrap').classList.toggle('hidden', !product.hasVideo);

  // 基础信息
  document.getElementById('detailPrice').textContent = product.price.toFixed(1);
  document.getElementById('detailPriceOriginal').textContent = '¥' + product.originalPrice.toFixed(1);
  var tagEl = document.getElementById('detailTag');
  tagEl.textContent = product.tagText;
  tagEl.className = 'detail-tag ' + product.tag;
  document.getElementById('detailName').textContent = product.name;
  document.getElementById('detailSold').textContent = product.sold;

  // 详情描述
  document.getElementById('detailDescContent').innerHTML = product.desc;

  // 规格参数
  document.getElementById('detailSpecsList').innerHTML = product.specs.map(function (s) {
    return '<div class="detail-spec-item"><span class="detail-spec-label">' + s.label + '</span><span class="detail-spec-value">' + s.value + '</span></div>';
  }).join('');

  // 拼团价格
  updateGroupPrices(product.price);

  // 重置拼团UI
  document.querySelectorAll('.group-spec-chip').forEach(function (c) { c.classList.remove('active'); });
  var chip5 = document.querySelector('.group-spec-chip[data-size="5"]');
  if (chip5) chip5.classList.add('active');
  document.getElementById('groupCustomWrap').classList.add('hidden');
  renderActiveGroup();

  // 底部栏价格
  document.getElementById('dbpCurrent').textContent = '¥' + getGroupPrice(product.price, currentGroupSize);
  document.getElementById('dbpOriginal').textContent = '¥' + product.price.toFixed(1);

  // 重置滚动
  document.getElementById('detailScroll').scrollTop = 0;
  track.scrollLeft = 0;
  initGalleryScroll();
}

// ---- 加入购物车（详情页） ----
function addDetailToCart() {
  var product = productData[currentProductId];
  if (!product) return;
  addToCart(product.emoji, product.name, product.price);
  showToast('已加入购物车');
}

// ---- 立即购买 ----
function buyNow() {
  var product = productData[currentProductId];
  if (!product) return;

  var groupPrice = getGroupPrice(product.price, currentGroupSize);
  addToCart(product.emoji, product.name, product.price);
  showToast('将以 ¥' + groupPrice + ' 下单，请前往购物车结算');
  navigateBackFromDetail();
  var cartNav = document.querySelector('.nav-item[onclick*="cart"]');
  if (cartNav) switchTab('cart', cartNav);
}

// ---- 分享 ----
function shareProduct() {
  var product = productData[currentProductId];
  if (!product) return;
  showToast('已复制「' + product.name + '」分享链接 📋');
}

// ---- 返回首页 ----
function navigateBackFromDetail() {
  document.getElementById('detailPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
  var homeNav = document.querySelector('.nav-item[onclick*="home"]');
  if (homeNav) homeNav.classList.add('active');
  document.getElementById('headerBack').classList.add('hidden');
  if (groupCountdownTimer) {
    clearInterval(groupCountdownTimer);
    groupCountdownTimer = null;
  }
}
