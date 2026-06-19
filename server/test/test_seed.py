# -*- coding: utf-8 -*-
"""
梵优茗宠 - 测试数据初始化脚本
创建完整的测试数据用于端到端业务流程测试
"""
import pymysql
import json
from datetime import datetime
from decimal import Decimal

conn = pymysql.connect(host='127.0.0.1', port=3306, user='root', password='yinyiran', database='nest-admin', charset='utf8mb4')
cursor = conn.cursor()

now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# ============ 1. 商品数据 ============
print(">>> 插入商品数据...")
products = [
    # (name, description, price, original_price, stock, category, tags, img_url, is_active, sales, is_flash, flash_price)
    ('高端猫粮 5kg 三文鱼配方', '进口三文鱼为主要原料，富含Omega-3脂肪酸，呵护猫咪皮毛健康', 128.00, 158.00, 50, '主粮罐头', '热销,进口', 'https://placeholder.com/cat-food.jpg', 1, 23, 0, None),
    ('冻干鸡肉粒 100g', '纯鸡胸肉冻干，无添加，高蛋白低脂肪', 45.00, 58.00, 100, '零食冻干', '爆款,无添加', 'https://placeholder.com/freeze-dried.jpg', 1, 156, 1, 35.00),
    ('宠物自动饮水器 2L', '活泉循环过滤，鼓励宠物多喝水，USB静音水泵', 89.00, 129.00, 30, '清洁洗护', '新品,静音', 'https://placeholder.com/water-fountain.jpg', 1, 12, 0, None),
    ('逗猫棒套装 5件组', '羽毛+铃铛+毛毛虫多种款式，猫咪最爱', 19.90, 29.90, 200, '玩具互动', '性价比,套装', 'https://placeholder.com/cat-toy.jpg', 1, 340, 0, None),
    ('犬用关节保健片 60粒', '氨基葡萄糖+软骨素，中大型犬关节养护', 168.00, 218.00, 40, '保健营养', '保健,关节', 'https://placeholder.com/joint-care.jpg', 1, 8, 0, None),
    ('猫咪恒温窝 冬季加厚', '珊瑚绒材质，保暖舒适，可拆洗', 59.00, 89.00, 60, '宠物服饰', '冬季,保暖', 'https://placeholder.com/cat-bed.jpg', 1, 45, 0, None),
]

for p in products:
    cursor.execute("""
        INSERT INTO t_product (name, description, price, original_price, stock, category, tags, img_url, is_active, sales, is_flash, flash_price, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (p[0], p[1], Decimal(str(p[2])), Decimal(str(p[3])) if p[3] else None, p[4], p[5], p[6], p[7], p[8], p[9], p[10], Decimal(str(p[11])) if p[11] else None, now))

print(f"  插入 {len(products)} 个商品")

# ============ 2. Banner数据 ============
print(">>> 插入Banner数据...")
banners = [
    ('新用户专享 首单立减20元', '注册即享新人优惠', 'https://placeholder.com/banner1.jpg', '#f97316', '立即领取', '#ffffff', 'product', '1', 1, 1),
    ('冻干鸡肉粒 限时秒杀', '原价58元 现仅35元', 'https://placeholder.com/banner2.jpg', '#fb923c', '马上抢', '#ffffff', 'product', '2', 2, 1),
    ('会员日 全场88折', '每月8号 会员专享特权', 'https://placeholder.com/banner3.jpg', '#fdba74', '查看详情', '#ffffff', 'none', '', 3, 1),
]

for b in banners:
    cursor.execute("""
        INSERT INTO t_banner (title, subtitle, bg_img, bg_color, btn_text, btn_color, link_type, link_value, sort_order, is_active)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, b)

print(f"  插入 {len(banners)} 个Banner")

# ============ 3. 用户数据 (3级邀请链) ============
print(">>> 插入用户数据...")

# 更新现有用户1为顶级邀请人
cursor.execute("""
    UPDATE t_user SET nickname=%s, phone=%s, level=%s, member_level=%s, city=%s, is_active=1 WHERE id=1
""", ('张三', '13800000001', 'gold', 'gold', '深圳'))

# 创建用户2 - 被用户1邀请
cursor.execute("""
    INSERT INTO t_user (open_id, phone, nickname, avatar, gender, level, member_level, balance, total_spent, points, city, is_active)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
""", ('test_user_002', '13800000002', '李四', '', 1, 'silver', 'silver', Decimal('0.00'), Decimal('0.00'), 0, '深圳', 1))
user2_id = cursor.lastrowid

# 创建用户3 - 被用户2邀请（下单人）
cursor.execute("""
    INSERT INTO t_user (open_id, phone, nickname, avatar, gender, level, member_level, balance, total_spent, points, city, is_active)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
""", ('test_user_003', '13800000003', '王五', '', 0, 'silver', 'silver', Decimal('0.00'), Decimal('0.00'), 0, '深圳', 1))
user3_id = cursor.lastrowid

print(f"  用户1(id=1, 张三, 邀请人顶级), 用户2(id={user2_id}, 李四), 用户3(id={user3_id}, 王五, 下单人)")

# ============ 4. 用户地址 ============
print(">>> 插入用户地址...")
addresses = [
    (1, '张三', '13800000001', '广东省深圳市南山区科技园', '腾讯大厦1801室', 1),
    (user2_id, '李四', '13800000002', '广东省深圳市福田区华强北', '赛格广场2505', 1),
    (user3_id, '王五', '13800000003', '广东省深圳市罗湖区东门', '茂业百货12楼1203', 1),
]

for a in addresses:
    cursor.execute("""
        INSERT INTO t_user_address (user_id, name, phone, region, detail, is_default, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (a[0], a[1], a[2], a[3], a[4], a[5], now))

print(f"  插入 {len(addresses)} 个地址")

# ============ 5. 用户宠物 ============
print(">>> 插入用户宠物...")
pets = [
    (1, '小橘', 'cat', '橘猫', Decimal('4.50'), '2023-03-15', 1, 1, 'adult'),
    (user2_id, '旺财', 'dog', '金毛寻回犬', Decimal('28.00'), '2022-06-20', 1, 1, 'adult'),
    (user3_id, '布丁', 'cat', '英国短毛猫', Decimal('3.80'), '2023-08-10', 0, 0, 'young'),
]

for p in pets:
    cursor.execute("""
        INSERT INTO t_user_pet (user_id, name, type, breed, weight, birthday, gender, is_neutered, age_group, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], now))

print(f"  插入 {len(pets)} 只宠物")

# ============ 6. 分佣账户 ============
print(">>> 插入分佣账户...")
# 用户1: tier 3 (梵优城市分公司, rate=18%)
cursor.execute("""
    INSERT INTO t_user_commission (user_id, tier_id, total_earned, pending_amount, available_balance, frozen_amount, invite_count, active_invite_count, total_views, this_month_earned)
    VALUES (1, 3, 0, 0, 0, 0, 2, 2, 150, 0)
""")

# 用户2: tier 2 (梵优主理人, rate=15%)
cursor.execute("""
    INSERT INTO t_user_commission (user_id, tier_id, total_earned, pending_amount, available_balance, frozen_amount, invite_count, active_invite_count, total_views, this_month_earned)
    VALUES (%s, 2, 0, 0, 0, 0, 1, 1, 80, 0)
""", (user2_id,))

# 用户3: tier 1 (梵优合伙人, rate=9%)
cursor.execute("""
    INSERT INTO t_user_commission (user_id, tier_id, total_earned, pending_amount, available_balance, frozen_amount, invite_count, active_invite_count, total_views, this_month_earned)
    VALUES (%s, 1, 0, 0, 0, 0, 0, 0, 30, 0)
""", (user3_id,))

print(f"  插入 3 个分佣账户")

# ============ 7. 邀请关系 ============
print(">>> 插入邀请关系...")
# 用户2 被用户1邀请 (depth=1)
cursor.execute("""
    INSERT INTO t_user_invite (user_id, parent_id, level_depth, status, created_at)
    VALUES (%s, 1, 1, 'active', %s)
""", (user2_id, now))

# 用户3 被用户2邀请 (depth=1)
cursor.execute("""
    INSERT INTO t_user_invite (user_id, parent_id, level_depth, status, created_at)
    VALUES (%s, %s, 1, 'active', %s)
""", (user3_id, user2_id, now))

# 用户3 被用户1邀请 (depth=2) - 多级分佣需要
cursor.execute("""
    INSERT INTO t_user_invite (user_id, parent_id, level_depth, status, created_at)
    VALUES (%s, 1, 2, 'active', %s)
""", (user3_id, now))

print(f"  插入 3 条邀请关系 (2级链路)")

conn.commit()

# ============ 验证 ============
print("\n>>> 数据验证:")
tables = {
    't_product': '商品',
    't_banner': 'Banner',
    't_user': '用户',
    't_user_address': '地址',
    't_user_pet': '宠物',
    't_user_commission': '分佣账户',
    't_user_invite': '邀请关系',
}

for tbl, label in tables.items():
    cursor.execute(f'SELECT COUNT(*) FROM {tbl}')
    cnt = cursor.fetchone()[0]
    print(f"  {label:8s} ({tbl}): {cnt} 条")

print("\n>>> 邀请链路:")
cursor.execute("""
    SELECT ui.user_id, u1.nickname as invitee, ui.parent_id, u2.nickname as inviter, ui.level_depth
    FROM t_user_invite ui
    JOIN t_user u1 ON ui.user_id = u1.id
    JOIN t_user u2 ON ui.parent_id = u2.id
    ORDER BY ui.user_id, ui.level_depth
""")
for r in cursor.fetchall():
    print(f"  {r[1]}(id={r[0]}) ← 被邀请 ← {r[3]}(id={r[2]}) [depth={r[4]}]")

print("\n>>> 分佣费率:")
cursor.execute("""
    SELECT u.nickname, u.id, ct.name, ct.commission_rate
    FROM t_user u
    JOIN t_user_commission uc ON u.id = uc.user_id
    JOIN t_commission_tier ct ON uc.tier_id = ct.id
    ORDER BY ct.level DESC
""")
for r in cursor.fetchall():
    print(f"  {r[0]}(id={r[1]}) → {r[2]} (费率={r[3]}%)")

conn.close()
print("\n✅ 测试数据创建完成!")
