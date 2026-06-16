// ============ 商品列表页（独立页面） ============

// 商品数据：按分类组织（四个分类）
const shopProducts = {
  snack: [
    {
      id: 'chicken-stick',
      name: '鸡肉缠绕磨牙棒',
      emoji: '🦴',
      price: 25.9,
      orig: 39.9,
      sales: 3280,
      stock: 560,
      tag: 'hot',
      tagText: '热卖',
      desc: '精选鸡胸肉缠绕，低温烘干保留营养，助磨牙洁齿',
    },
    {
      id: 'salmon-freeze',
      name: '深海三文鱼冻干',
      emoji: '🐟',
      price: 39.9,
      orig: 59.9,
      sales: 1890,
      stock: 320,
      tag: 'new',
      tagText: '新品',
      desc: '纯三文鱼制成，富含Omega-3，美毛护肤',
    },
    {
      id: 'cheese-biscuit',
      name: '芝士训练饼干',
      emoji: '🧀',
      price: 18.9,
      orig: 29.9,
      sales: 5120,
      stock: 890,
      tag: 'best',
      tagText: '爆款',
      desc: '添加真实芝士，训练奖励首选，小巧易带',
    },
    {
      id: 'beef-grain',
      name: '原切牛肉粒',
      emoji: '🥩',
      price: 32.9,
      orig: 45.9,
      sales: 2460,
      stock: 410,
      tag: 'hot',
      tagText: '热卖',
      desc: '原切牛肉低温烘干，高蛋白低脂肪',
    },
    {
      id: 'teeth-stick',
      name: '磨牙洁齿棒',
      emoji: '🦴',
      price: 19.9,
      orig: 39.9,
      sales: 5890,
      stock: 1200,
      tag: 'hot',
      tagText: '限时',
      desc: '独特纹理设计，深入牙缝清洁，预防牙结石',
    },
    {
      id: 'duck-strip',
      name: '鸭肉缠绕薯条',
      emoji: '🍟',
      price: 22.9,
      orig: 36.9,
      sales: 1760,
      stock: 380,
      tag: 'new',
      tagText: '新品',
      desc: '鸭肉缠绕红薯条，清火降燥，适合易上火体质',
    },
    {
      id: 'lamb-grain',
      name: '羊肉粒零食',
      emoji: '🍖',
      price: 28.9,
      orig: 42.9,
      sales: 1350,
      stock: 270,
      tag: '',
      tagText: '',
      desc: '新西兰羊肉制成，无添加防腐剂，适口性极佳',
    },
    {
      id: 'shrimp-dry',
      name: '南极磷虾干',
      emoji: '🦐',
      price: 35.9,
      orig: 55.9,
      sales: 980,
      stock: 180,
      tag: 'new',
      tagText: '新品',
      desc: '南极磷虾天然晒干，富含虾青素，提升免疫力',
    },
  ],
  staple: [
    {
      id: 'chicken-rice',
      name: '鸡肉益生菌粮',
      emoji: '🍚',
      price: 89.0,
      orig: 128.0,
      sales: 2100,
      stock: 450,
      tag: 'best',
      tagText: '爆款',
      desc: '添加活性益生菌，呵护肠道健康，全价全期犬粮',
    },
    {
      id: 'salmon-rice',
      name: '三文鱼全期粮',
      emoji: '🐠',
      price: 108.0,
      orig: 158.0,
      sales: 1680,
      stock: 320,
      tag: 'hot',
      tagText: '热卖',
      desc: '三文鱼+糙米配方，美毛亮毛，适合全年龄段',
    },
    {
      id: 'beef-can',
      name: '牛肉蔬菜罐头',
      emoji: '🥫',
      price: 15.9,
      orig: 22.9,
      sales: 4320,
      stock: 980,
      tag: 'hot',
      tagText: '热卖',
      desc: '真实牛肉块+新鲜蔬菜，高肉含量，拌粮更香',
    },
    {
      id: 'lamb-can',
      name: '羊肉胡萝卜罐头',
      emoji: '🥘',
      price: 16.9,
      orig: 24.9,
      sales: 2980,
      stock: 760,
      tag: '',
      tagText: '',
      desc: '羊肉温补配方，搭配胡萝卜，适合体质虚弱犬只',
    },
    {
      id: 'puppy-milk',
      name: '幼犬羊奶粉',
      emoji: '🍼',
      price: 68.0,
      orig: 98.0,
      sales: 1560,
      stock: 210,
      tag: '',
      tagText: '',
      desc: '脱膻羊奶粉，含DHA&ARA，贴近犬乳配方',
    },
    {
      id: 'senior-food',
      name: '老年犬配方粮',
      emoji: '🦴',
      price: 128.0,
      orig: 168.0,
      sales: 890,
      stock: 160,
      tag: 'new',
      tagText: '新品',
      desc: '低脂肪高纤维，添加葡萄糖胺，呵护老年犬关节',
    },
  ],
  brand: [
    {
      id: 'brand-royal',
      name: '皇家犬粮小型犬',
      emoji: '👑',
      price: 158.0,
      orig: 198.0,
      sales: 3450,
      stock: 290,
      tag: 'best',
      tagText: '大牌',
      desc: '皇家专属小型犬配方，颗粒小巧，促进咀嚼',
    },
    {
      id: 'brand-purina',
      name: '冠能全价犬粮',
      emoji: '⭐',
      price: 138.0,
      orig: 168.0,
      sales: 2890,
      stock: 340,
      tag: 'hot',
      tagText: '热卖',
      desc: '冠能旗舰系列，高蛋白配方，支持肌肉发育',
    },
    {
      id: 'brand-hills',
      name: '希尔思处方粮',
      emoji: '💊',
      price: 228.0,
      orig: 268.0,
      sales: 760,
      stock: 95,
      tag: '',
      tagText: '',
      desc: '兽医推荐处方粮，针对敏感肠胃特殊配方',
    },
    {
      id: 'brand-acana',
      name: '爱肯拿草原犬粮',
      emoji: '🌾',
      price: 198.0,
      orig: 248.0,
      sales: 1230,
      stock: 180,
      tag: 'hot',
      tagText: '热卖',
      desc: '加拿大进口，75%肉类含量，无谷物低GI配方',
    },
    {
      id: 'brand-orijen',
      name: '渴望六种鱼',
      emoji: '🐟',
      price: 258.0,
      orig: 298.0,
      sales: 980,
      stock: 120,
      tag: 'best',
      tagText: '大牌',
      desc: '六种野生鱼类配方，Omega丰富，顶级无谷粮',
    },
    {
      id: 'brand-nulo',
      name: 'Nulo自由系列',
      emoji: '🏃',
      price: 168.0,
      orig: 208.0,
      sales: 650,
      stock: 140,
      tag: '',
      tagText: '',
      desc: '美国Nulo，高蛋白低碳水，适合减脂期犬只',
    },
  ],
  clothes: [
    {
      id: 'cloth-vest',
      name: '秋冬保暖马甲',
      emoji: '🦺',
      price: 49.9,
      orig: 79.9,
      sales: 1890,
      stock: 520,
      tag: 'hot',
      tagText: '热卖',
      desc: '加厚棉填充，防风防水面料，四脚设计不勒腿',
    },
    {
      id: 'cloth-rain',
      name: '宠物透明雨衣',
      emoji: '🌂',
      price: 35.9,
      orig: 55.9,
      sales: 1340,
      stock: 380,
      tag: '',
      tagText: '',
      desc: '全透明设计，可爱不减，雨天遛狗必备',
    },
    {
      id: 'cloth-sweater',
      name: '针织毛衣',
      emoji: '🧶',
      price: 42.9,
      orig: 68.9,
      sales: 980,
      stock: 260,
      tag: 'new',
      tagText: '新品',
      desc: '柔软针织面料，V领设计，拍照出片神器',
    },
    {
      id: 'cloth-shoe',
      name: '防滑小鞋子',
      emoji: '👟',
      price: 29.9,
      orig: 45.9,
      sales: 760,
      stock: 410,
      tag: '',
      tagText: '',
      desc: '防滑橡胶底，魔术贴设计，户外出行保护爪垫',
    },
    {
      id: 'cloth-collar',
      name: '真皮项圈',
      emoji: '⭕',
      price: 68.0,
      orig: 98.0,
      sales: 1120,
      stock: 190,
      tag: 'best',
      tagText: '爆款',
      desc: '头层牛皮手工缝制，可刻字定制，经典耐用',
    },
    {
      id: 'cloth-bow',
      name: '蝴蝶结发饰',
      emoji: '🎀',
      price: 12.9,
      orig: 19.9,
      sales: 2560,
      stock: 880,
      tag: 'hot',
      tagText: '热卖',
      desc: '韩系蝴蝶结设计，弹力松紧带，佩戴舒适',
    },
  ],
  toy: [
    {
      id: 'toy-ball',
      name: '耐咬发声球',
      emoji: '⚽',
      price: 19.9,
      orig: 29.9,
      sales: 4320,
      stock: 670,
      tag: 'best',
      tagText: '爆款',
      desc: '天然橡胶材质，内置发声器，激发寻回本能',
    },
    {
      id: 'toy-rope',
      name: '互动拔河绳',
      emoji: '🪢',
      price: 22.9,
      orig: 35.9,
      sales: 2870,
      stock: 540,
      tag: 'hot',
      tagText: '热卖',
      desc: '棉绳编织结实耐咬，清洁牙齿，增进主宠感情',
    },
    {
      id: 'toy-frisbee',
      name: '户外飞盘',
      emoji: '🥏',
      price: 25.9,
      orig: 39.9,
      sales: 1980,
      stock: 320,
      tag: '',
      tagText: '',
      desc: '软性材质不伤嘴，空中飞行稳定，户外必备',
    },
    {
      id: 'toy-plush',
      name: '发声毛绒玩具',
      emoji: '🧸',
      price: 18.9,
      orig: 28.9,
      sales: 3450,
      stock: 780,
      tag: 'hot',
      tagText: '热卖',
      desc: '多种动物造型可选，柔软短绒，抱着睡觉也安心',
    },
    {
      id: 'toy-teaser',
      name: '逗猫棒套装',
      emoji: '🎣',
      price: 15.9,
      orig: 25.9,
      sales: 5120,
      stock: 920,
      tag: 'best',
      tagText: '爆款',
      desc: '3支装超值套装，羽毛+铃铛组合，猫咪疯抢',
    },
    {
      id: 'toy-tunnel',
      name: '折叠隧道',
      emoji: '🕳️',
      price: 39.9,
      orig: 59.9,
      sales: 1230,
      stock: 210,
      tag: '',
      tagText: '',
      desc: '3米加长隧道，可折叠收纳，满足猫咪钻洞天性',
    },
  ],
  clean: [
    {
      id: 'clean-shampoo',
      name: '宠物香波',
      emoji: '🧴',
      price: 39.9,
      orig: 55.9,
      sales: 2890,
      stock: 450,
      tag: 'hot',
      tagText: '热卖',
      desc: '燕麦+芦荟配方，温和洁净不刺激，幼宠适用',
    },
    {
      id: 'clean-tooth',
      name: '宠物牙膏套装',
      emoji: '🪥',
      price: 29.9,
      orig: 45.9,
      sales: 1670,
      stock: 380,
      tag: '',
      tagText: '',
      desc: '鸡肉味牙膏狗狗不抗拒，指套刷深入清洁',
    },
    {
      id: 'clean-wipe',
      name: '除菌湿巾',
      emoji: '🧻',
      price: 15.9,
      orig: 24.9,
      sales: 5430,
      stock: 1200,
      tag: 'best',
      tagText: '爆款',
      desc: '75%酒精除菌，外出清洁爪垫便便，便携随身',
    },
    {
      id: 'clean-ear',
      name: '耳部清洁液',
      emoji: '👂',
      price: 25.9,
      orig: 38.9,
      sales: 1230,
      stock: 290,
      tag: '',
      tagText: '',
      desc: '温和配方溶解耳垢，预防耳螨，每周使用2-3次',
    },
  ],
  health: [
    {
      id: 'health-vitamin',
      name: '综合维生素片',
      emoji: '💊',
      price: 68.0,
      orig: 98.0,
      sales: 1870,
      stock: 340,
      tag: 'hot',
      tagText: '热卖',
      desc: '12种维生素+矿物质，每日一片，全面补充营养',
    },
    {
      id: 'health-probiotic',
      name: '宠物益生菌',
      emoji: '🦠',
      price: 45.9,
      orig: 68.9,
      sales: 2340,
      stock: 380,
      tag: 'best',
      tagText: '爆款',
      desc: '200亿活性益生菌，改善软便腹泻，空腹喂食效果佳',
    },
    {
      id: 'health-joint',
      name: '关节养护片',
      emoji: '🦵',
      price: 78.0,
      orig: 118.0,
      sales: 980,
      stock: 210,
      tag: '',
      tagText: '',
      desc: '氨基葡萄糖+软骨素，中老年犬必备，呵护关节灵活',
    },
    {
      id: 'health-calcium',
      name: '液体钙',
      emoji: '🥛',
      price: 55.9,
      orig: 79.9,
      sales: 1450,
      stock: 270,
      tag: '',
      tagText: '',
      desc: '液态离子钙易吸收，搭配维生素D3，强健骨骼',
    },
  ],
};

// 分类顺序（全部排列）
const catOrder = ['all', 'snack', 'brand', 'clothes', 'toy', 'staple', 'clean', 'health'];

// 当前状态
var currentShopCat = 'all';
var currentShopFilter = 'default';
var currentShopKeyword = '';

// ============ 打开商品列表页 ============
function openShopPage(cat, tabEl) {
  // 更新首页Tab高亮（仅当从首页Tab点击时）
  if (tabEl) {
    document.querySelectorAll('.shop-cat-tab').forEach(function (t) {
      t.classList.remove('active');
    });
    tabEl.classList.add('active');
  }

  // 切换到shopPage
  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.remove('active');
  });
  document.getElementById('shopPage').classList.add('active');

  // 显示返回按钮
  document.getElementById('headerBack').classList.remove('hidden');
  document.getElementById('headerBack').onclick = goBackFromShop;

  // 滚动到顶部
  setTimeout(function () {
    var main = document.querySelector('.main-content');
    if (main) main.scrollTop = 0;
  }, 50);

  // 高亮对应分类
  switchShopCategory(cat || 'all', null);
}

// ============ 从商品列表返回首页 ============
function goBackFromShop() {
  document.getElementById('shopPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.getElementById('headerBack').classList.add('hidden');
  document.querySelectorAll('.nav-item').forEach(function (n) {
    n.classList.remove('active');
  });
  var homeNav = document.querySelector('.nav-item[onclick*="home"]');
  if (homeNav) homeNav.classList.add('active');
}

// ============ 切换分类 ============
function switchShopCategory(cat, el) {
  currentShopCat = cat;
  currentShopFilter = 'default';
  currentShopKeyword = '';
  var input = document.getElementById('shopSearchInput');
  if (input) input.value = '';
  var clear = document.getElementById('shopSearchClear');
  if (clear) clear.classList.add('hidden');

  // 同步侧边栏高亮
  document.querySelectorAll('.shop-sidebar-item').forEach(function (s) {
    s.classList.remove('active');
  });
  if (el && el.classList.contains('shop-sidebar-item')) {
    el.classList.add('active');
  } else {
    var target = document.querySelector('.shop-sidebar-item[data-cat="' + cat + '"]');
    if (target) target.classList.add('active');
  }

  // 重置筛选
  document.querySelectorAll('.shop-filter-chip').forEach(function (c) {
    c.classList.remove('active');
  });
  var defaultChip = document.querySelector('.shop-filter-chip[data-filter="default"]');
  if (defaultChip) defaultChip.classList.add('active');

  renderShopList();
}

// ============ 设置筛选 ============
function setShopFilter(filter, el) {
  currentShopFilter = filter;
  document.querySelectorAll('.shop-filter-chip').forEach(function (c) {
    c.classList.remove('active');
  });
  el.classList.add('active');
  renderShopList();
}

// ============ 搜索过滤 ============
function filterShopProducts() {
  var input = document.getElementById('shopSearchInput');
  currentShopKeyword = input.value.trim().toLowerCase();
  var clear = document.getElementById('shopSearchClear');
  if (clear) clear.classList.toggle('hidden', currentShopKeyword === '');
  renderShopList();
}

function clearShopSearch() {
  document.getElementById('shopSearchInput').value = '';
  currentShopKeyword = '';
  document.getElementById('shopSearchClear').classList.add('hidden');
  renderShopList();
}

// ============ 获取产品列表 ============
function getProducts() {
  if (currentShopCat === 'all') {
    var all = [];
    for (var i = 1; i < catOrder.length; i++) {
      var cat = catOrder[i];
      var items = shopProducts[cat] || [];
      all = all.concat(
        items.map(function (p) {
          var p2 = Object.assign({}, p);
          p2.fromCat = cat;
          return p2;
        }),
      );
    }
    return all;
  }
  return (shopProducts[currentShopCat] || []).slice();
}

// ============ 渲染商品列表 ============
function renderShopList() {
  var list = document.getElementById('shopList');
  if (!list) return;
  var products = getProducts();

  // 关键词过滤
  if (currentShopKeyword) {
    products = products.filter(function (p) {
      return p.name.toLowerCase().indexOf(currentShopKeyword) !== -1;
    });
  }

  // 排序
  if (currentShopFilter === 'sales') {
    products.sort(function (a, b) {
      return b.sales - a.sales;
    });
  } else if (currentShopFilter === 'price-asc') {
    products.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (currentShopFilter === 'price-desc') {
    products.sort(function (a, b) {
      return b.price - a.price;
    });
  }

  if (products.length === 0) {
    list.innerHTML =
      '<div class="shop-empty">' +
      '<div class="shop-empty-icon">🔍</div>' +
      '<div class="shop-empty-text">暂无相关商品</div>' +
      '<div class="shop-empty-sub">换个分类或关键词试试吧</div>' +
      '</div>';
    return;
  }

  list.innerHTML = products
    .map(function (p) {
      return (
        '<div class="shop-product-card" onclick="openProductDetail(\'' +
        p.id +
        '\')">' +
        '<div class="shop-product-img-wrap">' +
        '<div class="shop-product-img">' +
        p.emoji +
        '</div>' +
        (p.tag ? '<span class="shop-product-tag ' + p.tag + '">' + p.tagText + '</span>' : '') +
        '</div>' +
        '<div class="shop-product-info">' +
        '<div class="shop-product-name">' +
        p.name +
        '</div>' +
        '<div class="shop-product-desc">' +
        p.desc +
        '</div>' +
        '<div class="shop-product-meta">' +
        '<span class="shop-product-price"><span class="unit">¥</span>' +
        p.price +
        '</span>' +
        '<span class="shop-product-orig">¥' +
        p.orig +
        '</span>' +
        '</div>' +
        '<div class="shop-product-bottom">' +
        '<span class="shop-product-sales">已售 ' +
        formatSales(p.sales) +
        '</span>' +
        '<span class="shop-product-stock">库存 ' +
        p.stock +
        '</span>' +
        '<span class="shop-product-cart-btn" onclick="event.stopPropagation(); addShopProductToCart(\'' +
        p.id +
        '\')">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>'
      );
    })
    .join('');
}

function formatSales(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

// ============ 通过 id 加入购物车 ============
function addShopProductToCart(id) {
  var product = null;
  var cats = ['snack', 'staple', 'brand', 'clothes', 'toy', 'clean', 'health'];
  for (var c = 0; c < cats.length; c++) {
    var list = shopProducts[cats[c]];
    if (!list) continue;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        product = list[i];
        break;
      }
    }
    if (product) break;
  }
  if (!product) return;
  if (typeof addToCart === 'function') {
    addToCart(product.emoji, product.name, product.price);
  }
}
