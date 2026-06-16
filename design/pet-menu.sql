-- =============================================
-- 梵优茗宠 业务菜单配置
-- 请在数据库中执行此SQL以添加菜单
-- =============================================

-- 一级目录: 宠物电商 (parent_id=0)
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(10, '宠物电商', 0, 5, 'pet', NULL, '', '1', '0', 'M', '0', '0', '', 'shopping', 'admin', NOW(), '', NULL, '宠物电商管理目录', '0');

-- ===== 仪表盘 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2000, '数据总览', 10, 1, 'dashboard', 'pet/dashboard/index', '', '1', '0', 'C', '0', '0', 'pet:dashboard:list', 'dashboard', 'admin', NOW(), '', NULL, '宠物电商仪表盘', '0');

-- ===== 用户管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2010, '用户管理', 10, 2, 'pet-user', 'pet/user/index', '', '1', '0', 'C', '0', '0', 'pet:user:list', 'user', 'admin', NOW(), '', NULL, '用户管理菜单', '0'),
(2011, '用户查询', 2010, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:user:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2012, '用户新增', 2010, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:user:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2013, '用户修改', 2010, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:user:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2014, '用户删除', 2010, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:user:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 会员等级 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2020, '会员等级', 10, 3, 'member-level', 'pet/member-level/index', '', '1', '0', 'C', '0', '0', 'pet:member:list', 'star', 'admin', NOW(), '', NULL, '会员等级菜单', '0'),
(2021, '等级查询', 2020, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:member:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2022, '等级新增', 2020, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:member:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2023, '等级修改', 2020, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:member:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2024, '等级删除', 2020, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:member:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 商品分类 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2030, '商品分类', 10, 4, 'product-category', 'pet/product-category/index', '', '1', '0', 'C', '0', '0', 'pet:category:list', 'tree-table', 'admin', NOW(), '', NULL, '商品分类菜单', '0'),
(2031, '分类查询', 2030, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:category:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2032, '分类新增', 2030, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:category:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2033, '分类修改', 2030, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:category:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2034, '分类删除', 2030, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:category:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== Banner轮播 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2040, 'Banner轮播', 10, 5, 'banner', 'pet/banner/index', '', '1', '0', 'C', '0', '0', 'pet:banner:list', 'picture', 'admin', NOW(), '', NULL, 'Banner轮播菜单', '0'),
(2041, 'Banner查询', 2040, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:banner:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2042, 'Banner新增', 2040, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:banner:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2043, 'Banner修改', 2040, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:banner:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2044, 'Banner删除', 2040, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:banner:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 商品管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2050, '商品管理', 10, 6, 'product', 'pet/product/index', '', '1', '0', 'C', '0', '0', 'pet:product:list', 'shopping', 'admin', NOW(), '', NULL, '商品管理菜单', '0'),
(2051, '商品查询', 2050, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:product:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2052, '商品新增', 2050, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:product:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2053, '商品修改', 2050, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:product:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2054, '商品删除', 2050, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:product:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 组合包管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2060, '组合包管理', 10, 7, 'bundle', 'pet/bundle/index', '', '1', '0', 'C', '0', '0', 'pet:bundle:list', 'component', 'admin', NOW(), '', NULL, '组合包管理菜单', '0'),
(2061, '组合包查询', 2060, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:bundle:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2062, '组合包新增', 2060, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:bundle:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2063, '组合包修改', 2060, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:bundle:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2064, '组合包删除', 2060, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:bundle:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 同城商家 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2070, '同城商家', 10, 8, 'merchant', 'pet/merchant/index', '', '1', '0', 'C', '0', '0', 'pet:merchant:list', 'guide', 'admin', NOW(), '', NULL, '同城商家菜单', '0'),
(2071, '商家查询', 2070, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:merchant:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2072, '商家新增', 2070, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:merchant:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2073, '商家修改', 2070, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:merchant:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2074, '商家删除', 2070, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:merchant:remove', '#', 'admin', NOW(), '', NULL, '', '0'),
(2075, '入驻审核', 10, 9, 'merchant-apply', 'pet/merchant/apply', '', '1', '0', 'C', '0', '0', 'pet:merchant:audit', 'form', 'admin', NOW(), '', NULL, '入驻审核菜单', '0');

-- ===== 订单管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2080, '订单管理', 10, 10, 'order', 'pet/order/index', '', '1', '0', 'C', '0', '0', 'pet:order:list', 'list', 'admin', NOW(), '', NULL, '订单管理菜单', '0'),
(2081, '订单查询', 2080, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:order:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2082, '订单修改', 2080, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:order:edit', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 售后管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2090, '售后管理', 10, 11, 'refund', 'pet/refund/index', '', '1', '0', 'C', '0', '0', 'pet:refund:list', 'log', 'admin', NOW(), '', NULL, '售后管理菜单', '0'),
(2091, '售后查询', 2090, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:refund:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2092, '售后审核', 2090, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:refund:audit', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 课程管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2100, '课程管理', 10, 12, 'course', 'pet/course/index', '', '1', '0', 'C', '0', '0', 'pet:course:list', 'education', 'admin', NOW(), '', NULL, '课程管理菜单', '0'),
(2101, '课程查询', 2100, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:course:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2102, '课程新增', 2100, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:course:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2103, '课程修改', 2100, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:course:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2104, '课程删除', 2100, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:course:remove', '#', 'admin', NOW(), '', NULL, '', '0'),
(2105, '学员管理', 10, 13, 'course-student', 'pet/course/student', '', '1', '0', 'C', '0', '0', 'pet:course:list', 'peoples', 'admin', NOW(), '', NULL, '学员管理菜单', '0');

-- ===== 直播间管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2110, '直播间管理', 10, 14, 'live-room', 'pet/live-room/index', '', '1', '0', 'C', '0', '0', 'pet:live:list', 'video', 'admin', NOW(), '', NULL, '直播间管理菜单', '0'),
(2111, '直播间查询', 2110, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:live:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2112, '直播间新增', 2110, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:live:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2113, '直播间修改', 2110, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:live:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2114, '直播间删除', 2110, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:live:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 分佣管理 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2120, '分佣管理', 10, 15, 'commission', 'pet/commission/index', '', '1', '0', 'C', '0', '0', 'pet:commission:list', 'money', 'admin', NOW(), '', NULL, '分佣管理菜单', '0'),
(2121, '分佣查询', 2120, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:commission:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2122, '分佣新增', 2120, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:commission:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2123, '分佣修改', 2120, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:commission:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2124, '提现审核', 2120, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:commission:audit', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== AI配餐 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2130, 'AI配餐', 10, 16, 'meal', 'pet/meal/index', '', '1', '0', 'C', '0', '0', 'pet:meal:list', 'example', 'admin', NOW(), '', NULL, 'AI配餐管理菜单', '0'),
(2131, '配餐查询', 2130, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:meal:list', '#', 'admin', NOW(), '', NULL, '', '0'),
(2132, '配餐新增', 2130, 2, '#', '', '', '1', '0', 'F', '0', '0', 'pet:meal:add', '#', 'admin', NOW(), '', NULL, '', '0'),
(2133, '配餐修改', 2130, 3, '#', '', '', '1', '0', 'F', '0', '0', 'pet:meal:edit', '#', 'admin', NOW(), '', NULL, '', '0'),
(2134, '配餐删除', 2130, 4, '#', '', '', '1', '0', 'F', '0', '0', 'pet:meal:remove', '#', 'admin', NOW(), '', NULL, '', '0');

-- ===== 积分与财务 =====
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`, `del_flag`) VALUES
(2140, '积分财务', 10, 17, 'finance', 'pet/finance/index', '', '1', '0', 'C', '0', '0', 'pet:finance:list', 'chart', 'admin', NOW(), '', NULL, '积分财务管理菜单', '0'),
(2141, '财务查询', 2140, 1, '#', '', '', '1', '0', 'F', '0', '0', 'pet:finance:list', '#', 'admin', NOW(), '', NULL, '', '0');
