// ============ 商品数据 & 拼团配置 ============

const productData = {
  'teeth-stick': {
    id: 'teeth-stick',
    name: '磨牙洁齿棒',
    emoji: '🦴',
    price: 19.9,
    originalPrice: 39.9,
    tag: 'hot',
    tagText: '限时特供',
    sold: 5890,
    images: [
      { emoji: '🦴', bg: 'detail-gallery-slide-bg1' },
      { emoji: '🦷', bg: 'detail-gallery-slide-bg2' },
      { emoji: '🐕', bg: 'detail-gallery-slide-bg3' },
      { emoji: '💪', bg: 'detail-gallery-slide-bg4' }
    ],
    hasVideo: false,
    videoUrl: '',
    desc: `专为爱宠设计的洁齿磨牙棒，每天一根，牙齿更健康！<br><br>
✅ <b>深层洁齿</b>：特殊纹理设计，深入牙缝清除牙垢<br>
✅ <b>强健牙龈</b>：按摩牙龈，预防牙周炎<br>
✅ <b>清新口气</b>：添加天然薄荷，告别口臭<br>
✅ <b>耐咬设计</b>：中大型犬适用，不易咬碎<br><br>
每日建议喂食1-2根，请在主人监护下使用。`,
    specs: [
      { label: '品牌', value: '梵优茗宠' },
      { label: '适用对象', value: '中大型犬' },
      { label: '主要成分', value: '小麦蛋白、薄荷' },
      { label: '净含量', value: '180g/袋' },
      { label: '保质期', value: '12个月' },
      { label: '储存方式', value: '阴凉干燥处' }
    ]
  },
  'chicken-stick': {
    id: 'chicken-stick',
    name: '鸡肉缠绕磨牙棒',
    emoji: '🦴',
    price: 25.9,
    originalPrice: 39.9,
    tag: 'hot',
    tagText: '热卖',
    sold: 3280,
    images: [
      { emoji: '🦴', bg: 'detail-gallery-slide-bg1' },
      { emoji: '🍗', bg: 'detail-gallery-slide-bg2' },
      { emoji: '🦷', bg: 'detail-gallery-slide-bg3' },
      { emoji: '🐕', bg: 'detail-gallery-slide-bg4' }
    ],
    hasVideo: true,
    videoUrl: '',
    desc: `精选优质鸡胸肉，经过低温烘焙工艺，牢牢缠绕在耐咬洁齿棒上，<br><br>
✅ <b>双重功效</b>：外层鸡肉满足味蕾，内层洁齿棒清洁牙垢<br>
✅ <b>耐咬耐磨</b>：专为中大型犬设计，耐咬不碎裂<br>
✅ <b>营养健康</b>：高蛋白低脂肪，不添加人工色素与防腐剂<br>
✅ <b>口气清新</b>：添加薄荷因子，咀嚼同时清新口气<br><br>
适合金毛、哈士奇、拉布拉多等中大型犬日常磨牙使用。`,
    specs: [
      { label: '品牌', value: '梵优茗宠' },
      { label: '适用对象', value: '中大型犬' },
      { label: '主要成分', value: '鸡胸肉、小麦蛋白' },
      { label: '净含量', value: '200g/袋' },
      { label: '保质期', value: '12个月' },
      { label: '储存方式', value: '阴凉干燥处' }
    ]
  },
  'salmon-freeze': {
    id: 'salmon-freeze',
    name: '深海三文鱼冻干',
    emoji: '🐟',
    price: 39.9,
    originalPrice: 59.9,
    tag: 'new',
    tagText: '新品',
    sold: 1890,
    images: [
      { emoji: '🐟', bg: 'detail-gallery-slide-bg4' },
      { emoji: '🐠', bg: 'detail-gallery-slide-bg1' },
      { emoji: '✨', bg: 'detail-gallery-slide-bg2' },
      { emoji: '🐱', bg: 'detail-gallery-slide-bg3' }
    ],
    hasVideo: true,
    videoUrl: '',
    desc: `源自北欧深海的三文鱼，采用-40°C真空冷冻干燥技术，<br><br>
✅ <b>锁住营养</b>：FD冻干工艺，完整保留Omega-3与蛋白质<br>
✅ <b>美毛护肤</b>：丰富不饱和脂肪酸，让毛发更亮泽<br>
✅ <b>适口性佳</b>：天然鱼香浓郁，挑食猫咪也爱吃<br>
✅ <b>猫狗通用</b>：小型犬、猫咪均可放心喂食<br><br>
每粒都是独立包装，开袋即食，也可泡水还原。`,
    specs: [
      { label: '品牌', value: '梵优茗宠' },
      { label: '适用对象', value: '猫狗通用' },
      { label: '主要成分', value: '100%三文鱼' },
      { label: '净含量', value: '80g/罐' },
      { label: '保质期', value: '18个月' },
      { label: '储存方式', value: '密封避光保存' }
    ]
  },
  'cheese-biscuit': {
    id: 'cheese-biscuit',
    name: '芝士味训练饼干',
    emoji: '🧀',
    price: 18.9,
    originalPrice: 29.9,
    tag: 'best',
    tagText: '爆款',
    sold: 5120,
    images: [
      { emoji: '🧀', bg: 'detail-gallery-slide-bg2' },
      { emoji: '🍪', bg: 'detail-gallery-slide-bg3' },
      { emoji: '⭐', bg: 'detail-gallery-slide-bg4' },
      { emoji: '🐶', bg: 'detail-gallery-slide-bg1' }
    ],
    hasVideo: false,
    videoUrl: '',
    desc: `浓郁天然芝士风味搭配小颗粒设计，是训练奖励的首选零食！<br><br>
✅ <b>小颗粒设计</b>：直径约1cm，一口一粒不浪费<br>
✅ <b>低盐配方</b>：专为宠物研发，不增加肾脏负担<br>
✅ <b>钙质丰富</b>：芝士富含天然钙质，助力骨骼健康<br>
✅ <b>互动神器</b>：训练坐、卧、握手等口令时的完美奖励<br><br>
随身携带方便，外出遛狗时的互动必备。`,
    specs: [
      { label: '品牌', value: '梵优茗宠' },
      { label: '适用对象', value: '猫狗通用' },
      { label: '主要成分', value: '芝士粉、小麦粉' },
      { label: '净含量', value: '150g/袋' },
      { label: '保质期', value: '9个月' },
      { label: '储存方式', value: '阴凉干燥处' }
    ]
  },
  'beef-grain': {
    id: 'beef-grain',
    name: '原切牛肉粒零食',
    emoji: '🥩',
    price: 32.9,
    originalPrice: 45.9,
    tag: 'hot',
    tagText: '热卖',
    sold: 2460,
    images: [
      { emoji: '🥩', bg: 'detail-gallery-slide-bg3' },
      { emoji: '🐮', bg: 'detail-gallery-slide-bg1' },
      { emoji: '🔥', bg: 'detail-gallery-slide-bg2' },
      { emoji: '🐾', bg: 'detail-gallery-slide-bg4' }
    ],
    hasVideo: true,
    videoUrl: '',
    desc: `甄选整块优质鲜牛肉，原切制成，每一粒都是真材实料。<br><br>
✅ <b>整块原切</b>：不拼接不注水，看得见的牛肉纹理<br>
✅ <b>高蛋白低脂</b>：蛋白质含量≥65%，脂肪仅8%<br>
✅ <b>低温烘焙</b>：72小时慢烘，锁住原香与营养<br>
✅ <b>天然无添加</b>：0人工色素、0防腐剂<br><br>
适合全犬种日常营养补充及零食奖励。`,
    specs: [
      { label: '品牌', value: '梵优茗宠' },
      { label: '适用对象', value: '全犬种通用' },
      { label: '主要成分', value: '100%鲜牛肉' },
      { label: '净含量', value: '200g/袋' },
      { label: '保质期', value: '12个月' },
      { label: '储存方式', value: '阴凉干燥处' }
    ]
  },
  'family-bucket': {
    id: 'family-bucket',
    name: '超值零食全家桶',
    emoji: '🎁',
    price: 89.0,
    originalPrice: 168.0,
    tag: 'best',
    tagText: '超值',
    sold: 1560,
    images: [
      { emoji: '🎁', bg: 'detail-gallery-slide-bg1' },
      { emoji: '🍖', bg: 'detail-gallery-slide-bg2' },
      { emoji: '🐟', bg: 'detail-gallery-slide-bg3' },
      { emoji: '🧀', bg: 'detail-gallery-slide-bg4' }
    ],
    hasVideo: false,
    videoUrl: '',
    desc: `一桶搞定爱宠所有口味！精选四大爆款零食组合装。<br><br>
🎁 <b>内含4件爆款</b>：<br>
• 磨牙洁齿棒 × 1<br>
• 三文鱼冻干 × 1<br>
• 芝士训练饼干 × 1<br>
• 原切牛肉粒 × 1<br><br>
✅ <b>超值组合</b>：原价¥168，套餐价仅¥89<br>
✅ <b>送礼首选</b>：精美礼盒包装<br>
✅ <b>保质期新鲜</b>：全部当季生产<br><br>
适合新宠到家、节日送礼、日常囤货。`,
    specs: [
      { label: '品牌', value: '梵优茗宠' },
      { label: '组合内容', value: '4件爆款零食' },
      { label: '总净含量', value: '约630g' },
      { label: '适用对象', value: '猫狗通用' },
      { label: '保质期', value: '9-12个月' },
      { label: '包装', value: '礼盒装' }
    ]
  }
};

// 拼团折扣配置
const groupDiscounts = {
  2:  { discount: 0.05, label: '省5%' },
  3:  { discount: 0.10, label: '省10%' },
  5:  { discount: 0.15, label: '省15%' },
  10: { discount: 0.25, label: '省25%' }
};

// 模拟活跃拼团列表
const activeGroups = [
  {
    size: 5,
    joined: 3,
    total: 5,
    countdownEnd: Date.now() + 2 * 3600 * 1000 + 15 * 60 * 1000 + 33 * 1000,
    members: [
      { emoji: '🐱', bg: 'linear-gradient(135deg,#ff9a9e,#fad0c4)' },
      { emoji: '🐶', bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
      { emoji: '🐰', bg: 'linear-gradient(135deg,#d4fc79,#96e6a1)' }
    ]
  },
  {
    size: 3,
    joined: 1,
    total: 3,
    countdownEnd: Date.now() + 5 * 3600 * 1000 + 30 * 60 * 1000,
    members: [
      { emoji: '🐹', bg: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)' }
    ]
  },
  {
    size: 10,
    joined: 6,
    total: 10,
    countdownEnd: Date.now() + 8 * 3600 * 1000 + 45 * 60 * 1000,
    members: [
      { emoji: '🐱', bg: 'linear-gradient(135deg,#ff9a9e,#fad0c4)' },
      { emoji: '🐶', bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
      { emoji: '🐰', bg: 'linear-gradient(135deg,#d4fc79,#96e6a1)' },
      { emoji: '🐹', bg: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)' },
      { emoji: '🐻', bg: 'linear-gradient(135deg,#ffd89b,#19547b)' },
      { emoji: '🦊', bg: 'linear-gradient(135deg,#fddb92,#d1fdff)' }
    ]
  }
];

// ---- 全局状态 ----
let currentProductId = null;
let currentGroupSize = 5;
let currentGroupState = null;
let groupCountdownTimer = null;
