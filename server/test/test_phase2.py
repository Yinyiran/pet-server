# -*- coding: utf-8 -*-
"""
梵优茗宠 - 端到端API测试脚本 Phase 2
完整订单流程: 加购物车 → 下单 → 支付 → 支付回调 → 发货 → 确认收货
"""
import requests
import json
import pymysql
from decimal import Decimal

BASE_URL = "http://localhost:8080"
DB_CONFIG = {
    'host': '127.0.0.1', 'port': 3306, 'user': 'root',
    'password': 'yinyiran', 'database': 'nest-admin', 'charset': 'utf8mb4'
}

test_results = []

def record(name, passed, detail=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    test_results.append({"name": name, "passed": passed, "detail": detail})
    print(f"  {status}: {name}" + (f" — {detail}" if detail else ""))

def api_success(resp):
    if resp.status_code not in (200, 201):
        return False
    try:
        return resp.json().get("code") == 200
    except:
        return False

def resp_data(resp):
    return resp.json().get("data")

def db_query_one(sql, params=None):
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute(sql, params or ())
    row = cursor.fetchone()
    conn.close()
    return row

def db_execute(sql, params=None):
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute(sql, params or ())
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected

# Load tokens
with open("D:/Project/nest-admin/server/test_tokens.json", "r") as f:
    ctx = json.load(f)

token_user3 = ctx["user3_token"]
test_product_id = ctx["test_product_id"]
test_address_id = ctx["test_address_id"]

headers3 = {"Authorization": f"Bearer {token_user3}"}

print("=" * 70)
print("Phase 2: 订单全流程测试")
print("=" * 70)

# 记录初始状态
initial_stock = db_query_one("SELECT stock, sales FROM t_product WHERE id = %s", (test_product_id,))
print(f"\n初始状态: 商品id={test_product_id}, stock={initial_stock[0]}, sales={initial_stock[1]}")
print(f"测试地址: addressId={test_address_id}")

# --- 2.1 加入购物车 ---
print("\n[2.1] 加入购物车")
resp = requests.post(f"{BASE_URL}/app/order/cart", headers=headers3, json={
    "productId": test_product_id,
    "qty": 2,
})
if api_success(resp):
    record("加入购物车", True, f"productId={test_product_id}, qty=2")
else:
    record("加入购物车", False, f"body={resp.text[:300]}")

# --- 2.2 查看购物车 ---
print("\n[2.2] 查看购物车")
resp = requests.get(f"{BASE_URL}/app/order/cart/list", headers=headers3)
if api_success(resp):
    cart = resp_data(resp)
    cart_items = cart if isinstance(cart, list) else cart.get("list", [])
    record("查看购物车", True, f"共{len(cart_items)}件商品")
    if cart_items:
        cart_id = cart_items[0].get("id")
        print(f"       购物车ID: {cart_id}, productId={cart_items[0].get('productId')}, qty={cart_items[0].get('qty')}")
else:
    record("查看购物车", False, f"body={resp.text[:300]}")
    cart_items = []

# --- 2.3 创建订单 ---
print("\n[2.3] 创建订单")
order_no = None
order_id = None
if cart_items:
    # cartIds 需要是逗号分隔的字符串
    cart_ids_str = ",".join([str(item.get("id")) for item in cart_items])
    resp = requests.post(f"{BASE_URL}/app/order", headers=headers3, json={
        "cartIds": cart_ids_str,
        "addressId": test_address_id,
    })
    if api_success(resp):
        d = resp_data(resp)
        order_no = d.get("orderNo")
        order_id = d.get("id")
        total = d.get("totalAmount")
        record("创建订单", True, f"orderNo={order_no}, orderId={order_id}, total={total}")
    else:
        record("创建订单", False, f"body={resp.text[:500]}")
else:
    record("创建订单", False, "购物车为空")

# --- 2.4 验证订单数据 ---
print("\n[2.4] 验证订单数据库记录")
if order_no:
    order_row = db_query_one("SELECT id, order_no, user_id, address_id, total_amount, status FROM t_order WHERE order_no = %s", (order_no,))
    if order_row:
        order_id = order_row[0]
        record("订单DB记录", True, f"id={order_row[0]}, no={order_row[1]}, userId={order_row[2]}, addrId={order_row[3]}, total={order_row[4]}, status={order_row[5]}")
    else:
        record("订单DB记录", False, "未找到订单")

    item_row = db_query_one("SELECT product_name, price, qty, subtotal FROM t_order_item WHERE order_id = %s", (order_id,))
    if item_row:
        record("订单项DB记录", True, f"product={item_row[0]}, price={item_row[1]}, qty={item_row[2]}, subtotal={item_row[3]}")
    else:
        record("订单项DB记录", False, "未找到")

    # 库存应在创建订单时就原子扣减
    stock_after_order = db_query_one("SELECT stock, sales FROM t_product WHERE id = %s", (test_product_id,))
    if stock_after_order:
        stock_diff = initial_stock[0] - stock_after_order[0]
        sales_diff = stock_after_order[1] - initial_stock[1]
        record("库存扣减(下单后)", stock_diff == 2 and sales_diff == 2, 
               f"stock={stock_after_order[0]}(-{stock_diff}), sales={stock_after_order[1]}(+{sales_diff})")
else:
    record("订单DB记录", False, "无订单号")

# --- 2.5 支付订单 ---
print("\n[2.5] 支付订单")
if order_no:
    resp = requests.post(f"{BASE_URL}/app/order/pay", headers=headers3, json={
        "orderNo": order_no,
        "method": "wechat",
    })
    if api_success(resp):
        record("支付订单", True, f"orderNo={order_no}")
    else:
        record("支付订单", False, f"body={resp.text[:300]}")
else:
    record("支付订单", False, "无订单号")

# --- 2.6 模拟支付回调 ---
print("\n[2.6] 模拟微信支付回调 payNotify")
if order_no:
    # payNotify 只接收 orderNo 字符串
    resp = requests.post(f"{BASE_URL}/app/order/payNotify", json={"orderNo": order_no})
    if api_success(resp):
        record("支付回调", True, f"orderNo={order_no}")
    else:
        record("支付回调", False, f"body={resp.text[:300]}")
else:
    record("支付回调", False, "无订单号")

# --- 2.7 验证支付后状态 ---
print("\n[2.7] 验证支付后数据库状态")
if order_no:
    # 订单状态应为 paid
    order_paid = db_query_one("SELECT status, paid_at FROM t_order WHERE order_no = %s", (order_no,))
    if order_paid:
        record("订单状态(支付后)", order_paid[0] == 'paid', f"status={order_paid[0]}, paid_at={order_paid[1]}")
    else:
        record("订单状态(支付后)", False, "未找到")

    # 支付记录
    payment = db_query_one("SELECT method, amount, status, transaction_id FROM t_payment WHERE order_no = %s", (order_no,))
    if payment:
        record("支付记录", payment[2] == 'success', f"method={payment[0]}, amount={payment[1]}, status={payment[2]}, txId={payment[3]}")
    else:
        record("支付记录", False, "未找到")

    # 消费记录
    consumption = db_query_one("SELECT type, totalAmount, status FROM t_consumption_log WHERE userId = 3 ORDER BY id DESC LIMIT 1")
    if consumption:
        record("消费记录", True, f"type={consumption[0]}, amount={consumption[1]}, status={consumption[2]}")
    else:
        record("消费记录", False, "未找到")

    # 分佣应为 pending（确认收货前不结算）
    commission_pending = db_query_one("""
        SELECT COUNT(*), SUM(amount) FROM t_commission_log WHERE order_id = %s AND status = 'pending'
    """, (order_id,))
    if commission_pending and commission_pending[0] > 0:
        record("分佣(pending)", True, f"共{commission_pending[0]}条, 总额={commission_pending[1]}")
    else:
        record("分佣(pending)", False, f"无pending分佣 (count={commission_pending[0] if commission_pending else 0})")

    # 积分不应发放（确认收货才发放）
    user_points = db_query_one("SELECT points, total_spent FROM t_user WHERE id = 3")
    if user_points:
        record("积分未发放(支付后)", user_points[0] == 0, f"points={user_points[0]}(应=0), totalSpent={user_points[1]}")
else:
    record("支付后状态", False, "无订单号")

# --- 2.8 管理员发货 (直接DB操作，因为需要admin权限) ---
print("\n[2.8] 管理员发货")
if order_id:
    # 直接通过数据库模拟管理员发货
    affected = db_execute(
        "UPDATE t_order SET status = 'shipped', logistics_company = %s, logistics_no = %s, shipped_at = NOW() WHERE id = %s AND status = 'paid'",
        ("顺丰速运", f"SF{order_no}", order_id)
    )
    if affected > 0:
        record("管理员发货", True, f"orderId={order_id}, logistics=SF{order_no}")
    else:
        record("管理员发货", False, f"affected={affected}")
else:
    record("管理员发货", False, "无订单ID")

# 验证发货状态
order_shipped = db_query_one("SELECT status, logistics_company, logistics_no, shipped_at FROM t_order WHERE id = %s", (order_id,))
if order_shipped:
    record("订单状态(发货后)", order_shipped[0] == 'shipped', f"status={order_shipped[0]}, logistics={order_shipped[1]}/{order_shipped[2]}")

# --- 2.9 用户确认收货 ---
print("\n[2.9] 用户确认收货")
if order_id:
    resp = requests.put(f"{BASE_URL}/app/order/{order_id}/receive", headers=headers3)
    if api_success(resp):
        record("确认收货", True, f"orderId={order_id}")
    else:
        record("确认收货", False, f"body={resp.text[:300]}")

    order_done = db_query_one("SELECT status, received_at FROM t_order WHERE id = %s", (order_id,))
    if order_done:
        record("订单状态(收货后)", order_done[0] == 'completed', f"status={order_done[0]}, received_at={order_done[1]}")
else:
    record("确认收货", False, "无订单ID")

# --- 2.10 验证收货后积分/分佣/消费额 ---
print("\n[2.10] 验证收货后数据变化")
if order_id:
    # 积分应已发放
    user_final = db_query_one("SELECT points, total_spent, member_level FROM t_user WHERE id = 3")
    if user_final:
        record("用户积分(收货后)", user_final[0] > 0, f"points={user_final[0]}(应>0), totalSpent={user_final[1]}, level={user_final[2]}")

    # 积分日志
    points_log = db_query_one("SELECT type, changeValue, balanceAfter, source FROM t_points_log WHERE userId = 3 ORDER BY id DESC LIMIT 1")
    if points_log:
        record("积分日志", True, f"type={points_log[0]}, change={points_log[1]}, balance={points_log[2]}, source={points_log[3]}")
    else:
        record("积分日志", False, "未找到")

    # 分佣应已结算 (pending → settled)
    commission_settled = db_query_one("""
        SELECT COUNT(*), SUM(amount) FROM t_commission_log WHERE order_id = %s AND status = 'settled'
    """, (order_id,))
    if commission_settled and commission_settled[0] > 0:
        record("分佣(settled)", True, f"共{commission_settled[0]}条, 总额={commission_settled[1]}")
    else:
        record("分佣(settled)", False, f"无settled分佣 (count={commission_settled[0] if commission_settled else 0})")

    # 分佣账户
    acct1 = db_query_one("SELECT total_earned, pending_amount, available_balance FROM t_user_commission WHERE user_id = 1")
    acct2 = db_query_one("SELECT total_earned, pending_amount, available_balance FROM t_user_commission WHERE user_id = 2")
    if acct1:
        record("张三分佣账户", float(acct1[2]) > 0, f"total={acct1[0]}, pending={acct1[1]}, available={acct1[2]}")
    if acct2:
        record("李四分佣账户", float(acct2[2]) > 0, f"total={acct2[0]}, pending={acct2[1]}, available={acct2[2]}")

    # 分佣明细
    print("\n  --- 分佣明细 ---")
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT cl.user_id, u.nickname, cl.amount, cl.commission_level, cl.rate, cl.status
        FROM t_commission_log cl
        JOIN t_user u ON cl.user_id = u.id
        WHERE cl.order_id = %s
        ORDER BY cl.commission_level
    """, (order_id,))
    for r in cursor.fetchall():
        print(f"  {r[1]}(id={r[0]}): 金额=¥{r[2]}, 级别=L{r[3]}, 费率={r[4]}%, 状态={r[5]}")
    conn.close()

# --- 2.11 验证库存最终状态 ---
print("\n[2.11] 验证库存最终状态")
stock_final = db_query_one("SELECT stock, sales FROM t_product WHERE id = %s", (test_product_id,))
if stock_final:
    stock_diff = initial_stock[0] - stock_final[0]
    sales_diff = stock_final[1] - initial_stock[1]
    record("库存(最终)", stock_diff == 2 and sales_diff == 2, 
           f"stock={stock_final[0]}(-{stock_diff}), sales={stock_final[1]}(+{sales_diff})")

# ============================================================
passed = sum(1 for r in test_results if r["passed"])
failed = sum(1 for r in test_results if not r["passed"])
print(f"\n{'=' * 70}")
print(f"Phase 2 结果: {passed} 通过, {failed} 失败, 共 {len(test_results)} 项")
print(f"{'=' * 70}")

# Save order info for phase 3
with open("D:/Project/nest-admin/server/test_order.json", "w") as f:
    json.dump({
        "order_id": order_id,
        "order_no": order_no,
    }, f, indent=2)
