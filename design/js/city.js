// ============ 同城数据 ============
const cityData = [
  {
    cat: 'shop',
    icon: '🛒',
    cls: 'shop',
    name: '宠乐多生活馆',
    tags: ['4.9分', '店铺'],
    desc: '进口主粮、零食、玩具一站式采购，会员享95折',
    addr: '余杭区文一西路998号',
    tel: '0571-88886661',
    products: ['chicken-stick', 'salmon-freeze', 'cheese-biscuit', 'beef-grain'],
  },
  {
    cat: 'shop',
    icon: '🐾',
    cls: 'shop',
    name: '爪爪宠物便利店',
    tags: ['4.7分', '店铺'],
    desc: '社区宠物便利店，主营主粮零食及基础用品',
    addr: '西湖区古墩路388号',
    tel: '0571-88886662',
    products: ['duck-strip', 'lamb-grain', 'shrimp-dry', 'chicken-rice'],
  },
  {
    cat: 'hospital',
    icon: '💉',
    cls: 'hospital',
    name: '瑞鹏宠物医院(城西院)',
    tags: ['4.8分', '医院'],
    desc: '24小时急诊，配备DR、彩超、生化分析仪等设备',
    addr: '拱墅区莫干山路688号',
    tel: '0571-88886663',
    products: ['health-vitamin', 'health-probiotic', 'health-joint', 'health-calcium'],
  },
  {
    cat: 'hospital',
    icon: '🩺',
    cls: 'hospital',
    name: '芭比堂动物医院',
    tags: ['4.9分', '医院'],
    desc: '专科诊疗：骨科、眼科、牙科，拥有多名执业兽医师',
    addr: '上城区望江东路168号',
    tel: '0571-88886664',
    products: ['brand-hills', 'health-joint', 'health-calcium', 'health-probiotic'],
  },
  {
    cat: 'beauty',
    icon: '🛁',
    cls: 'beauty',
    name: '萌宠造型美容工作室',
    tags: ['4.8分', '美容'],
    desc: '韩国宠物美容师驻店，提供造型、SPA、药浴服务',
    addr: '余杭区荆长路58号',
    tel: '0571-88886665',
    products: ['clean-shampoo', 'clean-tooth', 'clean-wipe', 'clean-ear'],
  },
  {
    cat: 'beauty',
    icon: '✂️',
    cls: 'beauty',
    name: '小爪爪宠物美容',
    tags: ['4.6分', '美容'],
    desc: '专业洗护造型，使用进口洗护产品，宠物友好环境',
    addr: '西湖区紫荆花路22号',
    tel: '0571-88886666',
    products: ['clean-shampoo', 'clean-wipe', 'cloth-bow', 'cloth-collar'],
  },
  {
    cat: 'park',
    icon: '🌲',
    cls: 'park',
    name: '汪汪宠物乐园',
    tags: ['4.7分', '乐园'],
    desc: '占地3000㎡，设有敏捷赛道、游泳池、草坪活动区和宠物咖啡',
    addr: '余杭区径山镇双溪路1号',
    tel: '0571-88886667',
    products: ['toy-ball', 'toy-rope', 'toy-frisbee', 'toy-plush'],
  },
  {
    cat: 'park',
    icon: '🏕️',
    cls: 'park',
    name: '毛小孩户外营地',
    tags: ['4.8分', '乐园'],
    desc: '宠物露营地，可烧烤、徒步、宠物摄影，周末亲子好去处',
    addr: '临安区青山湖街道8号',
    tel: '0571-88886668',
    products: ['toy-frisbee', 'cloth-rain', 'cloth-shoe', 'toy-tunnel'],
  },
  {
    cat: 'party',
    icon: '🎂',
    cls: 'party',
    name: '宠爱一生宠友会',
    tags: ['4.6分', '聚会'],
    desc: '每月主题聚会：宠物生日趴、品种交流会、领养日活动',
    addr: '西湖区天目山路208号',
    tel: '0571-88886669',
    products: ['cloth-vest', 'cloth-bow', 'toy-teaser', 'toy-plush'],
  },
  {
    cat: 'party',
    icon: '🐶',
    cls: 'party',
    name: '哈士奇俱乐部',
    tags: ['4.8分', '聚会'],
    desc: '二哈专属社群，定期组织线下遛狗、游泳、拆家大赛',
    addr: '余杭区五常大道77号',
    tel: '0571-88886670',
    products: ['toy-ball', 'toy-rope', 'cloth-vest', 'teeth-stick'],
  },
];

// ============ 同城筛选 ============
function filterCity(cat, el) {
  document.querySelectorAll('.city-filter-chip').forEach((c) => c.classList.remove('active'));
  el.classList.add('active');
  renderCityList(cat);
}

function renderCityList(cat) {
  const filtered = cat === 'all' ? cityData : cityData.filter((d) => d.cat === cat);
  const listEl = document.getElementById('cityList');
  listEl.innerHTML = filtered
    .map(
      (d) => `
    <div class="city-card">
      <div class="city-card-img ${d.cls}">${d.icon}</div>
      <div class="city-card-info">
        <div class="city-card-name-row">
          <span class="city-card-name">${d.name}</span>
          <span class="city-card-enter" onclick="openCityDetail(${cityData.indexOf(d)})">进入店铺</span>
        </div>
        <div class="city-card-tags">
          ${d.tags.map((t) => `<span class="city-card-tag ${t.startsWith('4') ? 'score' : 'type'}">${t}</span>`).join('')}
          <span class="city-card-tel" onclick="copyTel('${d.tel}')" title="点击复制电话">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${d.tel}
          </span>
        </div>
        <div class="city-card-desc">${d.desc}</div>
        <div class="city-card-addr">
          <div class="city-card-addr-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${d.addr}</span>
          </div>
          <div class="city-card-addr-right">
            <span class="city-card-dist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <span>${d.dist || '1.4km'}</span>
            </span>
            <span class="city-card-nav" onclick="navigateTo(${cityData.indexOf(d)})" title="导航">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join('');
}

// ============ 同城详情 ============
function openCityDetail(idx) {
  const d = cityData[idx];
  document.getElementById('detailHero').className = 'city-detail-hero ' + d.cls;
  document.getElementById('detailHero').textContent = d.icon;
  document.getElementById('detailScore').textContent = d.tags[0];
  document.getElementById('detailDist').textContent = '类型：' + d.tags[1];
  document.getElementById('detailDesc').textContent = d.desc + '。我们致力于为每一位毛孩子提供最优质的服务体验，欢迎携宠到店体验！';
  document.getElementById('detailAddr').innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>' +
    d.addr +
    '</span><span class="city-detail-nav" onclick="navigateTo(' +
    idx +
    ')" title="导航"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></span>';
  document.getElementById('detailTel').innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
    d.tel;
  document.getElementById('detailTel').dataset.tel = d.tel;

  // 渲染店铺商品
  var productsEl = document.getElementById('detailProducts');
  var prods = (d.products || [])
    .map(function (pid) {
      for (var cat in shopProducts) {
        var found = shopProducts[cat].find(function (p) {
          return p.id === pid;
        });
        if (found) return found;
      }
      return null;
    })
    .filter(Boolean);

  if (prods.length > 0) {
    productsEl.parentElement.classList.remove('hidden');
    document.getElementById('detailProductsTitle').textContent = d.icon + ' ' + d.name;
    productsEl.innerHTML = prods
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
  } else {
    productsEl.parentElement.classList.add('hidden');
    productsEl.innerHTML = '';
  }

  document.getElementById('cityDetailOverlay').classList.remove('hidden');
}

function closeCityDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('cityDetailOverlay').classList.add('hidden');
}

// ============ 导航功能 ============
function navigateTo(idx) {
  const d = cityData[idx];
  showToast('正在打开导航...');
  // 使用高德地图URI Scheme，根据地址搜索
  const mapUrl = `https://uri.amap.com/search?keyword=${encodeURIComponent(d.addr)}`;
  setTimeout(() => {
    window.open(mapUrl, '_blank');
  }, 500);
}

// ============ 复制电话 ============
function copyDetailTel() {
  var tel = document.getElementById('detailTel').dataset.tel || '';
  if (tel) copyTel(tel);
}

function copyTel(tel) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(tel)
      .then(() => {
        showToast('一键拨打 ' + tel);
      })
      .catch(() => {
        fallbackCopyTel(tel);
      });
  } else {
    fallbackCopyTel(tel);
  }
}

function fallbackCopyTel(tel) {
  const input = document.createElement('input');
  input.value = tel;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    showToast('一键拨打 ' + tel);
  } catch (e) {
    showToast('复制失败，请手动复制：' + tel);
  }
  document.body.removeChild(input);
}
