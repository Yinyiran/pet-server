/**
 * 梵优茗宠 - 配餐方案数据
 * 来源：static/梵优茗宠狗狗配餐10款搭配方案_8种成分版_豆包AI生成.xlsx
 *        static/梵优茗宠猫咪配餐10款搭配组合方案_豆包AI生成.xlsx
 */

const MEAL_PLANS = {
  dog: [
    {
      id: 1,
      name: '全年龄段通用基础款',
      matchRules: {
        // 全年龄段通用，健康状态良好
        age: null, // 不限制
        health: ['肠胃健康', '皮肤健康', '关节健康', '代谢正常', '无过敏'],
        mode: null,
        isDefault: true // 默认兜底方案
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '7颗' },
        { name: '纯鸭胸肉颗粒', weight: '7颗' },
        { name: '三文鱼多肉颗粒', weight: '6颗' },
        { name: '鹌鹑多肉颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '6颗' },
        { name: '综合美毛颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗+6颗×6+7颗',
      monthlyPrice: 89,
      effect: '全阶段基础营养补充，涵盖8种功能颗粒，肠胃/皮毛/关节/体质全方位养护，未绝育/已绝育通用',
      remark: '全年龄段通用，适口性佳，可作为多宠家庭基础款。每日喂食量约占日粮10%'
    },
    {
      id: 2,
      name: '幼犬专属成长款',
      matchRules: {
        age: ['幼犬0～12月'],
        neuter: ['未绝育'],
        health: ['肠胃健康', '皮肤健康', '关节健康', '代谢正常', '无过敏']
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '7颗' },
        { name: '纯鹿肉颗粒', weight: '6颗' },
        { name: '三文鱼多肉颗粒', weight: '7颗' },
        { name: '鹌鹑多肉颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '6颗' },
        { name: '综合美毛颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗+6颗×6+7颗',
      monthlyPrice: 89,
      effect: '幼犬成长发育专属配方，高蛋白低敏，呵护娇嫩肠胃，促进骨骼与免疫系统发育',
      remark: '0～12月幼犬专用，未绝育适用。补充成长关键营养，适口性优先。'
    },
    {
      id: 3,
      name: '老年犬专属养护款',
      matchRules: {
        age: ['老年犬8岁+'],
        activity: ['低'],
        walk: ['＜1次'],
        health: ['关节老化']
      },
      ingredients: [
        { name: '纯兔肉颗粒', weight: '7颗' },
        { name: '纯鹿肉颗粒', weight: '6颗' },
        { name: '三文鱼多肉颗粒', weight: '6颗' },
        { name: '兔肉雪梨颗粒', weight: '7颗' },
        { name: '兔肉多蔬颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '6颗' },
        { name: '综合美毛颗粒', weight: '6颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗+6颗×6+7颗',
      monthlyPrice: 89,
      effect: '低负担老年犬配方，气血双补，葡萄糖胺+软骨素呵护关节，温和易消化',
      remark: '8岁+老年犬专用，低活动量适用。配方低负担，同时补充关节营养。'
    },
    {
      id: 4,
      name: '泪痕/体热专属调理款',
      matchRules: {
        tear: ['顽固泪痕', '易上火'],
        health: ['肠胃健康', '皮肤健康', '关节健康', '代谢正常', '无过敏']
      },
      ingredients: [
        { name: '纯鸭胸肉颗粒', weight: '7颗' },
        { name: '兔肉雪梨颗粒', weight: '7颗' },
        { name: '三文鱼多肉颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '6颗' },
        { name: '鳕鱼多果颗粒', weight: '6颗' },
        { name: '鸡胸肉多果颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗×2+6颗×6',
      monthlyPrice: 89,
      effect: '鸭肉凉性配方清热降火，配合雪梨/南瓜/鳕鱼多果，从内部调理体热，减轻泪痕',
      remark: '泪痕重/易上火狗狗专属，低敏清淡。配方偏凉性，不推荐体质虚寒长期单独使用。'
    },
    {
      id: 5,
      name: '肠胃敏感/软便专属养护款',
      matchRules: {
        stomach: ['拉稀', '挑食', '积食']
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '7颗' },
        { name: '纯鹿肉颗粒', weight: '6颗' },
        { name: '纯兔肉颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '7颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '6颗' },
        { name: '兔肉多蔬颗粒', weight: '6颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '6颗' },
        { name: '鹌鹑多肉颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗+6颗×6+7颗',
      monthlyPrice: 89,
      effect: '多重益生菌+膳食纤维配方，温和调理肠胃，南瓜/多蔬助消化，超低敏配方',
      remark: '肠胃敏感、软便、挑食狗狗专属。养胃颗粒占比提升，减少肠胃负担。'
    },
    {
      id: 6,
      name: '美毛护肤专属款',
      matchRules: {
        skin: ['异位性皮炎', '季节性脱毛', '瘙痒泛红']
      },
      ingredients: [
        { name: '三文鱼多肉颗粒', weight: '7颗' },
        { name: '综合美毛颗粒', weight: '7颗' },
        { name: '纯瘦牛肉颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '兔肉雪梨颗粒', weight: '6颗' },
        { name: '鳕鱼多果颗粒', weight: '6颗' },
        { name: '鸡胸肉多果颗粒', weight: '6颗' },
        { name: '鹿肉西兰花颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗×2+6颗×6',
      monthlyPrice: 89,
      effect: 'Omega-3+卵磷脂双重美毛，三文鱼/鳕鱼/牛肉多重蛋白，滋养毛囊，被毛蓬松亮泽',
      remark: '美毛护肤专属，换毛季推荐。含西兰花抗氧化，全面改善皮肤屏障。'
    },
    {
      id: 7,
      name: '肥胖/减脂专属款',
      matchRules: {
        metabolism: ['肥胖高血脂'],
        neuter: ['已绝育'],
        activity: ['低'],
        walk: ['＜1次']
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '7颗' },
        { name: '纯鸭胸肉颗粒', weight: '6颗' },
        { name: '纯兔肉颗粒', weight: '6颗' },
        { name: '纯鹿肉颗粒', weight: '6颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '6颗' },
        { name: '兔肉多蔬颗粒', weight: '6颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗+6颗×7',
      monthlyPrice: 89,
      effect: '低热量高纤维配方，鸡胸/兔肉/鹿肉优质低脂蛋白，南瓜/多蔬增加饱腹感，辅助体重管理',
      remark: '肥胖/高血脂狗狗专属，已绝育低活动量适用。配合控制在日粮10%以内效果更佳。'
    },
    {
      id: 8,
      name: '高活动量/运动犬专属款',
      matchRules: {
        activity: ['高'],
        walk: ['3～5次', '每天1次以上']
      },
      ingredients: [
        { name: '纯瘦牛肉颗粒', weight: '7颗' },
        { name: '纯鸡胸肉颗粒', weight: '7颗' },
        { name: '三文鱼多肉颗粒', weight: '6颗' },
        { name: '鹌鹑多肉颗粒', weight: '6颗' },
        { name: '纯鹿肉颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '综合美毛颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗×2+6颗×6',
      monthlyPrice: 89,
      effect: '高蛋白高能量配方，瘦牛肉+鸡胸双重蛋白，快速恢复体力，强健肌肉，支持高强度活动',
      remark: '高活动量/运动犬专属，3～5次遛弯/天适用。能量密度高，运动量大犬只推荐。'
    },
    {
      id: 9,
      name: '低敏/过敏体质专属款',
      matchRules: {
        allergy: ['肉类过敏', '谷物过敏']
      },
      ingredients: [
        { name: '纯鹿肉颗粒', weight: '7颗' },
        { name: '纯兔肉颗粒', weight: '6颗' },
        { name: '纯鸡胸肉颗粒', weight: '6颗' },
        { name: '纯鸭胸肉颗粒', weight: '6颗' },
        { name: '兔肉雪梨颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '兔肉多蔬颗粒', weight: '6颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗+6颗×7',
      monthlyPrice: 89,
      effect: '低敏温和配方，鹿肉/兔肉低敏蛋白源头规避，无谷物添加，纯肉+果蔬组合，无多余添加剂',
      remark: '低敏/过敏体质专属，严格规避过敏源。鹿肉为新型低敏蛋白，推荐过敏体制尝试。'
    },
    {
      id: 10,
      name: '多宠家庭通用款',
      matchRules: {
        mode: ['多宠']
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '7颗' },
        { name: '纯鸭胸肉颗粒', weight: '6颗' },
        { name: '三文鱼多肉颗粒', weight: '6颗' },
        { name: '鹌鹑多肉颗粒', weight: '7颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '6颗' },
        { name: '综合美毛颗粒', weight: '6颗' },
        { name: '综合养胃颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '7颗+6颗×6+7颗',
      monthlyPrice: 89,
      effect: '多宠家庭通用配方，覆盖不同品种/年龄段基础营养，适口性佳，全健康状态通用',
      remark: '多宠饲养家庭专属，全年龄段/全健康状态通用。注意根据各宠体重分别控制喂食量。'
    }
  ],

  cat: [
    {
      id: 1,
      name: '全年龄段通用基础款',
      matchRules: {
        age: null,
        health: ['肠胃健康', '皮肤健康', '泌尿健康', '关节健康', '无过敏'],
        isDefault: true
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '8颗' },
        { name: '纯鸭胸肉颗粒', weight: '7颗' },
        { name: '三文鱼多肉颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '牛肉胡萝卜颗粒', weight: '5颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '6颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '7颗' },
        { name: '综合养胃颗粒', weight: '5颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '8颗+7颗+6颗×2+5颗×2+6颗+7颗',
      monthlyPrice: 89,
      effect: '全阶段基础营养补充，牛磺酸强化配方保护视力与心脏，8种功能颗粒全方位养护',
      remark: '全年龄段通用基础款，成猫(1～7岁)日常营养补充首选。每日喂食量约占日粮10%。'
    },
    {
      id: 2,
      name: '幼猫专属成长款',
      matchRules: {
        age: ['幼猫(0～12月)'],
        neuter: ['未绝育']
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '9颗' },
        { name: '鳕鱼苹果颗粒', weight: '8颗' },
        { name: '鹌鹑多肉颗粒', weight: '7颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '牛肉胡萝卜颗粒', weight: '5颗' },
        { name: '鹿肉西兰花颗粒', weight: '4颗' },
        { name: '鸡胸肉多果颗粒', weight: '4颗' },
        { name: '综合养胃颗粒', weight: '7颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '9颗+8颗+7颗+6颗+5颗×2+4颗×2+7颗',
      monthlyPrice: 89,
      effect: '幼猫成长发育专属配方，高钙磷+牛磺酸，促进骨骼与免疫系统发育，呵护娇嫩肠胃',
      remark: '0～12月幼猫专用，未绝育适用。钙磷比科学配比，成长关键期营养不缺席。'
    },
    {
      id: 3,
      name: '老年猫专属养护款',
      matchRules: {
        age: ['老年猫(7岁+)'],
        stomach: ['软便'],
        joint: ['关节老化']
      },
      ingredients: [
        { name: '纯兔肉颗粒', weight: '9颗' },
        { name: '纯鹿肉颗粒', weight: '8颗' },
        { name: '兔肉雪梨颗粒', weight: '7颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '6颗' },
        { name: '兔肉多蔬颗粒', weight: '5颗' },
        { name: '鹿肉西兰花颗粒', weight: '4颗' },
        { name: '综合养胃颗粒', weight: '4颗' },
        { name: '综合美毛颗粒', weight: '7颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '9颗+8颗+7颗+6颗+5颗+4颗×2+7颗',
      monthlyPrice: 89,
      effect: '低负担老年猫配方，气血双补，氨糖+软骨素呵护关节，兔肉/鹿肉低敏易吸收',
      remark: '7岁+老年猫专属，低活动量适用。配方偏温和，同时覆盖关节与肠胃养护。'
    },
    {
      id: 4,
      name: '泪痕/体热专属调理款',
      matchRules: {
        urinary: ['尿频上火', '泪痕重']
      },
      ingredients: [
        { name: '纯鸭胸肉颗粒', weight: '10颗' },
        { name: '兔肉雪梨颗粒', weight: '9颗' },
        { name: '鳕鱼苹果颗粒', weight: '7颗' },
        { name: '鸡胸肉苹果颗粒', weight: '6颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '5颗' },
        { name: '鹿肉西兰花颗粒', weight: '4颗' },
        { name: '鳕鱼多果颗粒', weight: '4颗' },
        { name: '鸡胸肉多果颗粒', weight: '5颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '10颗+9颗+7颗+6颗+5颗×2+4颗×2',
      monthlyPrice: 89,
      effect: '鸭肉凉性清热，雪梨/南瓜/鳕鱼多果助利尿，从内部调理体热，减轻泪痕与尿频',
      remark: '泪痕重/尿频上火猫咪专属。鸭肉比例为全方案最高，凉性调理效果显著。'
    },
    {
      id: 5,
      name: '肠胃敏感/软便专属养护款',
      matchRules: {
        stomach: ['软便', '便秘', '频繁呕吐']
      },
      ingredients: [
        { name: '纯兔肉颗粒', weight: '9颗' },
        { name: '纯鹿肉颗粒', weight: '8颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '7颗' },
        { name: '兔肉雪梨颗粒', weight: '6颗' },
        { name: '兔肉多蔬颗粒', weight: '5颗' },
        { name: '鹿肉西兰花颗粒', weight: '4颗' },
        { name: '综合养胃颗粒', weight: '4颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '7颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '9颗+8颗+7颗+6颗+5颗+4颗×2+7颗',
      monthlyPrice: 89,
      effect: '兔肉/鹿肉超低敏蛋白，南瓜/多蔬膳食纤维调理菌群，养胃颗粒双重呵护敏感肠胃',
      remark: '肠胃敏感、软便、便秘猫咪专属。兔肉为低敏蛋白之王，配合养胃颗粒效果加倍。'
    },
    {
      id: 6,
      name: '美毛护肤专属款',
      matchRules: {
        skin: ['掉毛重', '皮屑瘙痒', '毛发干枯']
      },
      ingredients: [
        { name: '三文鱼多肉颗粒', weight: '10颗' },
        { name: '纯鸡胸肉颗粒', weight: '8颗' },
        { name: '鳕鱼苹果颗粒', weight: '7颗' },
        { name: '牛肉胡萝卜颗粒', weight: '6颗' },
        { name: '鹿肉西兰花颗粒', weight: '5颗' },
        { name: '鸡胸肉多果颗粒', weight: '4颗' },
        { name: '鳕鱼多果颗粒', weight: '4颗' },
        { name: '综合美毛颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '10颗+8颗+7颗+6颗+5颗+4颗×2+6颗',
      monthlyPrice: 89,
      effect: 'Omega-3+卵磷脂双重美毛，三文鱼/鳕鱼高EPA/DHA，滋养毛囊，减少异常掉毛',
      remark: '美毛护肤专属，掉毛重/皮屑瘙痒/毛发干枯猫咪推荐。换毛季效果尤为明显。'
    },
    {
      id: 7,
      name: '肥胖/减脂专属款',
      matchRules: {
        metabolism: ['肥胖高血脂'],
        neuter: ['已绝育'],
        activity: ['低']
      },
      ingredients: [
        { name: '纯兔肉颗粒', weight: '10颗' },
        { name: '纯鸡胸肉颗粒', weight: '8颗' },
        { name: '纯鸭胸肉颗粒', weight: '7颗' },
        { name: '鸡胸肉多蔬颗粒', weight: '6颗' },
        { name: '兔肉多蔬颗粒', weight: '5颗' },
        { name: '鹿肉西兰花颗粒', weight: '4颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '4颗' },
        { name: '综合养胃颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '10颗+8颗+7颗+6颗+5颗+4颗×2+6颗',
      monthlyPrice: 89,
      effect: '低热量高纤维配方，兔肉/鸡胸低脂高蛋白，南瓜/西兰花/多蔬增加饱腹感，辅助体重管理',
      remark: '肥胖/高血脂猫咪专属，已绝育低活动量适用。兔肉热量是全肉类中最低之一。'
    },
    {
      id: 8,
      name: '高活动量/活泼猫专属款',
      matchRules: {
        activity: ['高']
      },
      ingredients: [
        { name: '纯瘦牛肉颗粒', weight: '10颗' },
        { name: '纯鸡胸肉颗粒', weight: '8颗' },
        { name: '鹌鹑多肉颗粒', weight: '7颗' },
        { name: '三文鱼多肉颗粒', weight: '6颗' },
        { name: '牛肉胡萝卜颗粒', weight: '5颗' },
        { name: '鹿肉西兰花颗粒', weight: '4颗' },
        { name: '鸡胸肉多果颗粒', weight: '4颗' },
        { name: '综合美毛颗粒', weight: '6颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '10颗+8颗+7颗+6颗+5颗+4颗×2+6颗',
      monthlyPrice: 89,
      effect: '高蛋白高能量配方，瘦牛肉+鸡胸+鹌鹑多重蛋白，快速恢复体力，支持高强度活动与玩耍',
      remark: '高活动量/活泼猫专属，精力旺盛爱跑酷适用。能量密度高，运动量大猫只推荐。'
    },
    {
      id: 9,
      name: '低敏/过敏体质专属款',
      matchRules: {
        allergy: ['肉类过敏', '谷物过敏']
      },
      ingredients: [
        { name: '纯鹿肉颗粒', weight: '10颗' },
        { name: '纯兔肉颗粒', weight: '9颗' },
        { name: '鳕鱼苹果颗粒', weight: '7颗' },
        { name: '兔肉雪梨颗粒', weight: '6颗' },
        { name: '鹿肉西兰花颗粒', weight: '5颗' },
        { name: '兔肉多蔬颗粒', weight: '4颗' },
        { name: '鳕鱼多果颗粒', weight: '4颗' },
        { name: '综合养胃颗粒', weight: '5颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '10颗+9颗+7颗+5颗+6颗+4颗×2+5颗',
      monthlyPrice: 89,
      effect: '低敏温和配方，鹿肉/兔肉/鳕鱼新型低敏蛋白，无谷物无多余添加，严格规避过敏源',
      remark: '低敏/过敏体质专属，肉类/谷物过敏猫咪推荐。鹿肉+兔肉双重低敏蛋白，过敏体制首选。'
    },
    {
      id: 10,
      name: '多宠家庭通用款',
      matchRules: {
        mode: ['多宠']
      },
      ingredients: [
        { name: '纯鸡胸肉颗粒', weight: '9颗' },
        { name: '纯鸭胸肉颗粒', weight: '8颗' },
        { name: '三文鱼多肉颗粒', weight: '7颗' },
        { name: '鳕鱼苹果颗粒', weight: '6颗' },
        { name: '鸡胸肉苹果颗粒', weight: '5颗' },
        { name: '鸭胸肉南瓜颗粒', weight: '4颗' },
        { name: '牛肉胡萝卜颗粒', weight: '4颗' },
        { name: '综合养胃颗粒', weight: '7颗' }
      ],
      dailyGrams: '50g',
      totalWeight: '9颗+8颗+7颗+6颗+5颗+4颗×2+7颗',
      monthlyPrice: 89,
      effect: '多宠家庭通用配方，覆盖不同品种/年龄段猫咪基础营养，适口性佳，全健康状态通用',
      remark: '多宠饲养家庭专属，全年龄段/全健康状态通用。请根据各猫体重分别控制喂食量。'
    }
  ]
};
