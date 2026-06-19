# -*- coding: utf-8 -*-
"""
梵优茗宠 - 端到端API测试脚本 Phase 1
测试: 登录 → 商品 → 购物车 → 基础API
"""
import requests
import json
import pymysql

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
    """判断API是否成功: HTTP 200/201 且 body code=200"""
    if resp.status_code not in (200, 201):
        return False
    try:
        data = resp.json()
        return data.get("code") == 200
    except:
        return False

def resp_data(resp):
    return resp.json().get("data")

# ============================================================
print("=" * 70)
print("Phase 1: 用户登录与基础API测试")
print("=" * 70)

# --- wxLogin 用户3(王五) ---
print("\n[1.1] wxLogin 用户3(王五 — 下单人)")
resp = requests.post(f"{BASE_URL}/app/user/wxLogin", json={"code": "test_user_003"})
if api_success(resp):
    d = resp_data(resp)
    token_user3 = d["token"]
    user3_id = d["user"]["id"]
    record("wxLogin 王五", True, f"userId={user3_id}, token={token_user3[:30]}...")
else:
    record("wxLogin 王五", False, f"status={resp.status_code}, body={resp.text[:200]}")
    token_user3 = None
    user3_id = 3

# --- wxLogin 用户2(李四) ---
print("\n[1.2] wxLogin 用户2(李四 — 中间邀请人)")
resp = requests.post(f"{BASE_URL}/app/user/wxLogin", json={"code": "test_user_002"})
if api_success(resp):
    d = resp_data(resp)
    token_user2 = d["token"]
    user2_id = d["user"]["id"]
    record("wxLogin 李四", True, f"userId={user2_id}")
else:
    record("wxLogin 李四", False, f"body={resp.text[:200]}")
    token_user2 = None
    user2_id = 2

# --- wxLogin 用户1(张三) ---
print("\n[1.3] wxLogin 用户1(张三 — 顶级邀请人)")
resp = requests.post(f"{BASE_URL}/app/user/wxLogin", json={"code": "test_user_001"})
if api_success(resp):
    d = resp_data(resp)
    token_user1 = d["token"]
    user1_id = d["user"]["id"]
    record("wxLogin 张三", True, f"userId={user1_id}")
else:
    record("wxLogin 张三", False, f"body={resp.text[:200]}")
    token_user1 = None
    user1_id = 1

# --- 未授权访问 ---
print("\n[1.4] 未授权访问 profile")
resp = requests.get(f"{BASE_URL}/app/user/profile")
body = resp.json()
if body.get("code") in (401, 403):
    record("未授权访问被拦截", True, f"code={body.get('code')}, msg={body.get('msg')}")
else:
    record("未授权访问被拦截", False, f"code={body.get('code')}")

# --- 获取profile ---
print("\n[1.5] 获取用户profile (王五)")
headers3 = {"Authorization": f"Bearer {token_user3}"}
resp = requests.get(f"{BASE_URL}/app/user/profile", headers=headers3)
if api_success(resp):
    p = resp_data(resp)
    record("获取profile", True, f"nick={p.get('nickname')}, level={p.get('memberLevel')}, points={p.get('points')}, totalSpent={p.get('totalSpent')}")
else:
    record("获取profile", False, f"body={resp.text[:200]}")
    p = None

# --- 获取Banner ---
print("\n[1.6] 获取活跃Banner列表")
resp = requests.get(f"{BASE_URL}/app/banner/active", headers=headers3)
if api_success(resp):
    banners = resp_data(resp)
    record("获取Banner", True, f"共{len(banners) if isinstance(banners, list) else 1}条")
else:
    record("获取Banner", False, f"body={resp.text[:200]}")

# --- 获取商品分类 ---
print("\n[1.7] 获取商品分类树")
resp = requests.get(f"{BASE_URL}/app/product-category/tree", headers=headers3)
if api_success(resp):
    cats = resp_data(resp)
    record("获取分类树", True, f"共{len(cats)}个分类")
else:
    record("获取分类树", False, f"body={resp.text[:200]}")

# --- 获取商品列表 ---
print("\n[1.8] 获取商品列表")
resp = requests.get(f"{BASE_URL}/app/product/list?page=1&pageSize=10", headers=headers3)
if api_success(resp):
    d = resp_data(resp)
    products = d["list"] if isinstance(d, dict) and "list" in d else d
    record("获取商品列表", True, f"共{len(products)}个商品")
    if products:
        test_product = products[0]
        print(f"       首商品: id={test_product.get('id')}, name={test_product.get('name')}, price={test_product.get('price')}, stock={test_product.get('stock')}")
else:
    record("获取商品列表", False, f"body={resp.text[:200]}")
    products = []

# --- 获取商品详情 ---
print("\n[1.9] 获取商品详情")
if products:
    pid = products[0]["id"]
    resp = requests.get(f"{BASE_URL}/app/product/{pid}", headers=headers3)
    if api_success(resp):
        detail = resp_data(resp)
        record("获取商品详情", True, f"name={detail.get('name')}, price={detail.get('price')}, stock={detail.get('stock')}")
    else:
        record("获取商品详情", False, f"body={resp.text[:200]}")
        detail = products[0]
else:
    record("获取商品详情", False, "无商品")
    detail = None

# --- 获取地址 ---
print("\n[1.10] 获取用户地址列表")
resp = requests.get(f"{BASE_URL}/app/user/address", headers=headers3)
if api_success(resp):
    addrs = resp_data(resp)
    if addrs and isinstance(addrs, list) and len(addrs) > 0:
        test_address_id = addrs[0]["id"]
        record("获取地址列表", True, f"共{len(addrs)}条, firstId={test_address_id}")
    elif addrs and isinstance(addrs, dict):
        test_address_id = addrs.get("id")
        record("获取地址列表", True, f"addressId={test_address_id}")
    else:
        record("获取地址列表", False, "地址为空")
        test_address_id = None
else:
    record("获取地址列表", False, f"body={resp.text[:200]}")
    test_address_id = None

# --- 获取宠物 ---
print("\n[1.11] 获取用户宠物列表")
resp = requests.get(f"{BASE_URL}/app/user/pet", headers=headers3)
if api_success(resp):
    pets = resp_data(resp)
    cnt = len(pets) if isinstance(pets, list) else 1
    record("获取宠物列表", True, f"共{cnt}只")
else:
    record("获取宠物列表", False, f"body={resp.text[:200]}")

# --- 获取分佣账户 ---
print("\n[1.12] 获取分佣账户")
resp = requests.get(f"{BASE_URL}/app/commission/account", headers=headers3)
if api_success(resp):
    acct = resp_data(resp)
    record("获取分佣账户", True, f"available={acct.get('availableBalance')}, pending={acct.get('pendingAmount')}, total={acct.get('totalEarned')}")
else:
    record("获取分佣账户", False, f"body={resp.text[:200]}")

# --- 获取订单列表 ---
print("\n[1.13] 获取订单列表 (空)")
resp = requests.get(f"{BASE_URL}/app/order/list", headers=headers3)
if api_success(resp):
    d = resp_data(resp)
    orders = d["list"] if isinstance(d, dict) and "list" in d else d
    record("获取订单列表", True, f"共{len(orders) if isinstance(orders, list) else 0}条")
else:
    record("获取订单列表", False, f"body={resp.text[:200]}")

# ============================================================
passed = sum(1 for r in test_results if r["passed"])
failed = sum(1 for r in test_results if not r["passed"])
print(f"\n{'=' * 70}")
print(f"Phase 1 结果: {passed} 通过, {failed} 失败, 共 {len(test_results)} 项")
print(f"{'=' * 70}")

# Save context
with open("D:/Project/nest-admin/server/test_tokens.json", "w") as f:
    json.dump({
        "user1_token": token_user1,
        "user2_token": token_user2,
        "user3_token": token_user3,
        "user1_id": user1_id,
        "user2_id": user2_id,
        "user3_id": user3_id,
        "test_product_id": products[0]["id"] if products else None,
        "test_product_name": products[0]["name"] if products else None,
        "test_product_price": float(products[0]["price"]) if products else None,
        "test_product_stock": products[0]["stock"] if products else None,
        "test_address_id": test_address_id,
    }, f, indent=2, ensure_ascii=False)

print(f"\nTokens和上下文已保存至 test_tokens.json")
