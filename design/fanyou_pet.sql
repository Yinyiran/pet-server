-- ============================================================
-- 梵优茗宠 宠物电商小程序 - 数据库初始化脚本
-- Database : fanyou_pet
-- Engine   : InnoDB (utf8mb4)
-- Date     : 2026-06-15
-- Tables   : 34
-- ============================================================

CREATE DATABASE IF NOT EXISTS `fanyou_pet`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `fanyou_pet`;

-- -----------------------------------------------------------
-- 1. 用户表
-- -----------------------------------------------------------
CREATE TABLE `t_user` (
  `id`            BIGINT       NOT NULL AUTO_INCREMENT,
  `open_id`       VARCHAR(64)  NOT NULL COMMENT '微信OpenID',
  `phone`         VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
  `nickname`      VARCHAR(64)  DEFAULT NULL COMMENT '昵称',
  `avatar`        VARCHAR(512) DEFAULT NULL COMMENT '头像URL',
  `gender`        TINYINT      NOT NULL DEFAULT 0 COMMENT '性别: 0-未知 1-男 2-女',
  `birthday`      DATE         DEFAULT NULL COMMENT '生日',
  `level`         VARCHAR(32)  DEFAULT NULL COMMENT '轻创等级',
  `member_level`  VARCHAR(32)  DEFAULT 'silver' COMMENT '会员等级: silver/gold/diamond',
  `balance`       DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
  `total_spent`   DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '累计消费金额',
  `points`        INT          NOT NULL DEFAULT 0 COMMENT '积分余额',
  `city`          VARCHAR(64)  DEFAULT NULL COMMENT '所在城市',
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '是否活跃: 0-否 1-是',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_open_id` (`open_id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_member_level` (`member_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- -----------------------------------------------------------
-- 2. 用户收货地址表
-- -----------------------------------------------------------
CREATE TABLE `t_user_address` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT       NOT NULL COMMENT '用户ID',
  `name`       VARCHAR(32)  NOT NULL COMMENT '收货人姓名',
  `phone`      VARCHAR(20)  NOT NULL COMMENT '联系电话',
  `region`     VARCHAR(128) NOT NULL COMMENT '省市区',
  `detail`     VARCHAR(256) NOT NULL COMMENT '详细地址',
  `is_default` TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否默认: 0-否 1-是',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户收货地址表';

-- -----------------------------------------------------------
-- 3. 用户宠物表
-- -----------------------------------------------------------
CREATE TABLE `t_user_pet` (
  `id`           BIGINT        NOT NULL AUTO_INCREMENT,
  `user_id`      BIGINT        NOT NULL COMMENT '用户ID',
  `name`         VARCHAR(64)   NOT NULL COMMENT '宠物名',
  `type`         VARCHAR(16)   NOT NULL COMMENT '宠物类型: cat/dog',
  `breed`        VARCHAR(64)   DEFAULT NULL COMMENT '品种',
  `weight`       DECIMAL(5,2)  DEFAULT NULL COMMENT '体重(kg)',
  `birthday`     DATE          DEFAULT NULL COMMENT '生日',
  `gender`       TINYINT       NOT NULL DEFAULT 0 COMMENT '性别: 0-未知 1-公 2-母',
  `is_neutered`  TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '是否绝育: 0-否 1-是',
  `age_group`    VARCHAR(16)   DEFAULT NULL COMMENT '年龄段: puppy/kitten/adult/senior',
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户宠物表';

-- -----------------------------------------------------------
-- 4. 会员等级配置表
-- -----------------------------------------------------------
CREATE TABLE `t_member_level` (
  `level_key`      VARCHAR(32)   NOT NULL COMMENT '等级标识: silver/gold/diamond',
  `name`           VARCHAR(32)   NOT NULL COMMENT '等级名称',
  `threshold`      DECIMAL(12,2) NOT NULL COMMENT '升级门槛(累计消费)',
  `next_threshold` DECIMAL(12,2) DEFAULT NULL COMMENT '下一档门槛',
  `points_rate`    INT           NOT NULL DEFAULT 1 COMMENT '积分倍率',
  `privileges`     JSON          DEFAULT NULL COMMENT '权益配置JSON',
  `sort_order`     INT           NOT NULL DEFAULT 0 COMMENT '排序权重',
  PRIMARY KEY (`level_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员等级配置表';

-- -----------------------------------------------------------
-- 5. 商品表
-- -----------------------------------------------------------
CREATE TABLE `t_product` (
  `id`             BIGINT        NOT NULL AUTO_INCREMENT,
  `merchant_id`    BIGINT        DEFAULT NULL COMMENT '所属商家ID',
  `name`           VARCHAR(128)  NOT NULL COMMENT '商品名称',
  `description`    TEXT          DEFAULT NULL COMMENT '商品描述',
  `price`          DECIMAL(10,2) NOT NULL COMMENT '售价',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT '原价',
  `stock`          INT           NOT NULL DEFAULT 0 COMMENT '库存数量',
  `category`       VARCHAR(64)   DEFAULT NULL COMMENT '分类编码',
  `tags`           VARCHAR(256)  DEFAULT NULL COMMENT '标签(逗号分隔)',
  `img_url`        VARCHAR(512)  DEFAULT NULL COMMENT '主图URL',
  `gallery`        JSON          DEFAULT NULL COMMENT '轮播图URL数组',
  `specs`          JSON          DEFAULT NULL COMMENT '规格JSON',
  `is_active`      TINYINT(1)    NOT NULL DEFAULT 1 COMMENT '是否上架: 0-下架 1-上架',
  `sales`          INT           NOT NULL DEFAULT 0 COMMENT '销量',
  `is_flash`       TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '是否限时特供: 0-否 1-是',
  `flash_price`    DECIMAL(10,2) DEFAULT NULL COMMENT '特供价',
  `flash_start`    DATETIME      DEFAULT NULL COMMENT '特供开始时间',
  `flash_end`      DATETIME      DEFAULT NULL COMMENT '特供结束时间',
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_category` (`category`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_flash_time` (`is_flash`, `flash_start`, `flash_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- -----------------------------------------------------------
-- 6. 商品分类表
-- -----------------------------------------------------------
CREATE TABLE `t_product_category` (
  `id`         INT         NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(64) NOT NULL COMMENT '分类名称',
  `parent_id`  INT         DEFAULT 0 COMMENT '父分类ID, 0为顶级',
  `sort_order` INT         NOT NULL DEFAULT 0 COMMENT '排序权重',
  `is_active`  TINYINT(1)  NOT NULL DEFAULT 1 COMMENT '是否启用: 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- -----------------------------------------------------------
-- 7. 购物车表
-- -----------------------------------------------------------
CREATE TABLE `t_cart` (
  `id`            BIGINT   NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT   NOT NULL COMMENT '用户ID',
  `product_id`    BIGINT   NOT NULL COMMENT '商品ID',
  `qty`           INT      NOT NULL DEFAULT 1 COMMENT '数量',
  `selected_spec` JSON     DEFAULT NULL COMMENT '选中规格JSON',
  `is_checked`    TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否选中: 0-否 1-是',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- -----------------------------------------------------------
-- 8. 订单表
-- -----------------------------------------------------------
CREATE TABLE `t_order` (
  `id`               BIGINT        NOT NULL AUTO_INCREMENT,
  `order_no`         VARCHAR(32)   NOT NULL COMMENT '订单号',
  `user_id`          BIGINT        NOT NULL COMMENT '用户ID',
  `address_id`       BIGINT        DEFAULT NULL COMMENT '收货地址ID',
  `total_amount`     DECIMAL(10,2) NOT NULL COMMENT '订单总额',
  `original_amount`  DECIMAL(10,2) DEFAULT NULL COMMENT '原始总额',
  `discount_amount`  DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  `shipping_fee`     DECIMAL(10,2) DEFAULT 0.00 COMMENT '运费',
  `status`           VARCHAR(32)   NOT NULL DEFAULT 'pending' COMMENT '订单状态: pending/paid/shipped/received/refunding/closed',
  `payment`          JSON          DEFAULT NULL COMMENT '支付明细JSON',
  `logistics_company` VARCHAR(64)  DEFAULT NULL COMMENT '物流公司',
  `logistics_no`     VARCHAR(64)   DEFAULT NULL COMMENT '物流单号',
  `paid_at`          DATETIME      DEFAULT NULL COMMENT '支付时间',
  `shipped_at`       DATETIME      DEFAULT NULL COMMENT '发货时间',
  `received_at`      DATETIME      DEFAULT NULL COMMENT '收货时间',
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- -----------------------------------------------------------
-- 9. 订单明细表
-- -----------------------------------------------------------
CREATE TABLE `t_order_item` (
  `id`           BIGINT        NOT NULL AUTO_INCREMENT,
  `order_id`     BIGINT        NOT NULL COMMENT '订单ID',
  `product_id`   BIGINT        NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(128)  NOT NULL COMMENT '商品名称(快照)',
  `price`        DECIMAL(10,2) NOT NULL COMMENT '单价(快照)',
  `qty`          INT           NOT NULL COMMENT '购买数量',
  `subtotal`     DECIMAL(10,2) NOT NULL COMMENT '小计金额',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- -----------------------------------------------------------
-- 10. 支付记录表
-- -----------------------------------------------------------
CREATE TABLE `t_payment` (
  `id`             BIGINT        NOT NULL AUTO_INCREMENT,
  `order_no`       VARCHAR(32)   NOT NULL COMMENT '订单号',
  `method`         VARCHAR(32)   NOT NULL COMMENT '支付方式: wechat/balance/card',
  `amount`         DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `status`         VARCHAR(32)   NOT NULL DEFAULT 'pending' COMMENT '支付状态: pending/success/failed',
  `transaction_id` VARCHAR(64)   DEFAULT NULL COMMENT '第三方流水号',
  `paid_at`        DATETIME      DEFAULT NULL COMMENT '支付时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_transaction_id` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- -----------------------------------------------------------
-- 11. 售后退款表
-- -----------------------------------------------------------
CREATE TABLE `t_refund` (
  `id`            BIGINT        NOT NULL AUTO_INCREMENT,
  `order_no`      VARCHAR(32)   NOT NULL COMMENT '订单号',
  `user_id`       BIGINT        NOT NULL COMMENT '用户ID',
  `type`          VARCHAR(16)   NOT NULL COMMENT '售后类型: refund/exchange',
  `reason`        VARCHAR(256)  DEFAULT NULL COMMENT '售后原因',
  `status`        VARCHAR(32)   NOT NULL DEFAULT 'pending' COMMENT '处理状态: pending/processing/approved/rejected/completed',
  `refund_amount` DECIMAL(10,2) DEFAULT NULL COMMENT '退款金额',
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='售后退款表';

-- -----------------------------------------------------------
-- 12. 分佣等级配置表
-- -----------------------------------------------------------
CREATE TABLE `t_commission_tier` (
  `id`                INT         NOT NULL AUTO_INCREMENT,
  `name`              VARCHAR(32) NOT NULL COMMENT '等级名称',
  `level`             INT         NOT NULL COMMENT '等级序号: 1/2/3',
  `icon`              VARCHAR(256) DEFAULT NULL COMMENT '图标URL',
  `commission_rate`   DECIMAL(5,2) NOT NULL COMMENT '佣金率(%): 9/15/18',
  `rates`             JSON         DEFAULT NULL COMMENT '各层级佣金拆分JSON',
  `upgrade_condition` VARCHAR(256) DEFAULT NULL COMMENT '升级条件描述',
  `qualification`     VARCHAR(256) DEFAULT NULL COMMENT '资格获取方式: 购买课程/后端设置',
  `is_hidden`         TINYINT(1)  NOT NULL DEFAULT 0 COMMENT '是否隐藏: 0-否 1-是',
  `color`             VARCHAR(16)  DEFAULT NULL COMMENT '主题色',
  `is_active`         TINYINT(1)  NOT NULL DEFAULT 1 COMMENT '是否启用: 0-否 1-是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分佣等级配置表';

-- -----------------------------------------------------------
-- 13. 用户分佣账户表
-- -----------------------------------------------------------
CREATE TABLE `t_user_commission` (
  `id`                  BIGINT        NOT NULL AUTO_INCREMENT,
  `user_id`             BIGINT        NOT NULL COMMENT '用户ID',
  `tier_id`             INT           DEFAULT NULL COMMENT '分佣等级ID',
  `total_earned`        DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '累计收益',
  `pending_amount`      DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '待结算金额',
  `available_balance`   DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '可提现余额',
  `frozen_amount`       DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '冻结金额',
  `invite_count`        INT           NOT NULL DEFAULT 0 COMMENT '邀请人数',
  `active_invite_count` INT           NOT NULL DEFAULT 0 COMMENT '活跃邀请数',
  `total_views`         INT           NOT NULL DEFAULT 0 COMMENT '总浏览量',
  `this_month_earned`   DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '本月收益',
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_tier_id` (`tier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户分佣账户表';

-- -----------------------------------------------------------
-- 14. 用户邀请关系表
-- -----------------------------------------------------------
CREATE TABLE `t_user_invite` (
  `id`          BIGINT      NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT      NOT NULL COMMENT '被邀请人ID',
  `parent_id`   BIGINT      NOT NULL COMMENT '邀请人ID',
  `level_depth` INT         NOT NULL DEFAULT 1 COMMENT '关系深度: 1=直推 2=间推 3=三代',
  `status`      VARCHAR(16) NOT NULL DEFAULT 'active' COMMENT '状态: active/inactive',
  `created_at`  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '邀请时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_level_depth` (`level_depth`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户邀请关系表';

-- -----------------------------------------------------------
-- 15. 佣金流水日志表
-- -----------------------------------------------------------
CREATE TABLE `t_commission_log` (
  `id`               BIGINT        NOT NULL AUTO_INCREMENT,
  `log_no`           VARCHAR(32)   NOT NULL COMMENT '流水号',
  `user_id`          BIGINT        NOT NULL COMMENT '受益人ID',
  `from_user_id`     BIGINT        DEFAULT NULL COMMENT '消费用户ID',
  `order_id`         BIGINT        DEFAULT NULL COMMENT '关联订单ID',
  `type`             VARCHAR(16)   NOT NULL COMMENT '类型: order/withdraw',
  `title`            VARCHAR(128)  DEFAULT NULL COMMENT '标题',
  `amount`           DECIMAL(12,2) NOT NULL COMMENT '金额',
  `commission_level` INT           DEFAULT NULL COMMENT '佣金层级: 1/2/3',
  `rate`             DECIMAL(5,4)  DEFAULT NULL COMMENT '佣金率',
  `order_amount`     DECIMAL(12,2) DEFAULT NULL COMMENT '订单金额',
  `status`           VARCHAR(16)   NOT NULL DEFAULT 'pending' COMMENT '结算状态: pending/settled',
  `settled_at`       DATETIME      DEFAULT NULL COMMENT '结算时间',
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_log_no` (`log_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_from_user_id` (`from_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='佣金流水日志表';

-- -----------------------------------------------------------
-- 16. 提现申请表
-- -----------------------------------------------------------
CREATE TABLE `t_withdraw` (
  `id`           BIGINT        NOT NULL AUTO_INCREMENT,
  `withdraw_no`  VARCHAR(32)   NOT NULL COMMENT '提现单号',
  `user_id`      BIGINT        NOT NULL COMMENT '用户ID',
  `amount`       DECIMAL(10,2) NOT NULL COMMENT '提现金额',
  `method`       VARCHAR(32)   NOT NULL COMMENT '提现方式: wechat/bank',
  `account_info` VARCHAR(256)  DEFAULT NULL COMMENT '加密账号信息',
  `status`       VARCHAR(16)   NOT NULL DEFAULT 'pending' COMMENT '审核状态: pending/approved/rejected/completed',
  `audit_remark` VARCHAR(256)  DEFAULT NULL COMMENT '审核备注',
  `applied_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `finished_at`  DATETIME      DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_withdraw_no` (`withdraw_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提现申请表';

-- -----------------------------------------------------------
-- 17. AI答题记录表
-- -----------------------------------------------------------
CREATE TABLE `t_quiz_record` (
  `id`                 BIGINT       NOT NULL AUTO_INCREMENT,
  `user_id`            BIGINT       NOT NULL COMMENT '用户ID',
  `pet_id`             BIGINT       DEFAULT NULL COMMENT '关联宠物ID',
  `pet_type`           VARCHAR(16)  NOT NULL COMMENT '宠物类型: cat/dog',
  `answers`            JSON         DEFAULT NULL COMMENT '答题答案JSON',
  `constitution_type`  VARCHAR(32)  DEFAULT NULL COMMENT '体质类型',
  `constitution_desc`  TEXT         DEFAULT NULL COMMENT '体质描述',
  `tags`               VARCHAR(256) DEFAULT NULL COMMENT '体质标签JSON',
  `created_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '答题时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_pet_id` (`pet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI答题记录表';

-- -----------------------------------------------------------
-- 18. 配餐方案表
-- -----------------------------------------------------------
CREATE TABLE `t_meal_plan` (
  `id`            BIGINT        NOT NULL AUTO_INCREMENT,
  `pet_type`      VARCHAR(16)   NOT NULL COMMENT '宠物类型: cat/dog',
  `name`          VARCHAR(64)   NOT NULL COMMENT '方案名称',
  `tag`           VARCHAR(32)   DEFAULT NULL COMMENT '标签',
  `match_rules`   JSON          DEFAULT NULL COMMENT '匹配规则JSON',
  `ingredients`   JSON          DEFAULT NULL COMMENT '食材配方JSON',
  `monthly_price` DECIMAL(10,2) DEFAULT NULL COMMENT '月单价',
  `sort_order`    INT           NOT NULL DEFAULT 0 COMMENT '排序权重',
  `is_default`    TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '是否默认方案: 0-否 1-是',
  `is_active`     TINYINT(1)    NOT NULL DEFAULT 1 COMMENT '是否启用: 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `idx_pet_type` (`pet_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='配餐方案表';

-- -----------------------------------------------------------
-- 19. 配餐食材明细表
-- -----------------------------------------------------------
CREATE TABLE `t_meal_ingredient` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT,
  `plan_id`    BIGINT       NOT NULL COMMENT '配餐方案ID',
  `name`       VARCHAR(64)  NOT NULL COMMENT '食材名称',
  `weight`     VARCHAR(32)  DEFAULT NULL COMMENT '配比用量(如 50g)',
  `sort_order` INT          NOT NULL DEFAULT 0 COMMENT '排序权重',
  PRIMARY KEY (`id`),
  KEY `idx_plan_id` (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='配餐食材明细表';

-- -----------------------------------------------------------
-- 20. 配餐订单表
-- -----------------------------------------------------------
CREATE TABLE `t_meal_order` (
  `id`          BIGINT        NOT NULL AUTO_INCREMENT,
  `order_no`    VARCHAR(32)   NOT NULL COMMENT '配餐订单号',
  `user_id`     BIGINT        NOT NULL COMMENT '用户ID',
  `plan_id`     BIGINT        NOT NULL COMMENT '配餐方案ID',
  `quiz_id`     BIGINT        DEFAULT NULL COMMENT '答题记录ID',
  `meal_freq`   INT           NOT NULL DEFAULT 2 COMMENT '每日餐次',
  `meal_days`   INT           NOT NULL DEFAULT 30 COMMENT '周期天数',
  `total_price` DECIMAL(10,2) NOT NULL COMMENT '总价',
  `status`      VARCHAR(16)   NOT NULL DEFAULT 'pending' COMMENT '状态: pending/paid/completed/cancelled',
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_plan_id` (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='配餐订单表';

-- -----------------------------------------------------------
-- 21. 同城商家表
-- -----------------------------------------------------------
CREATE TABLE `t_city_merchant` (
  `id`             BIGINT        NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(128)  NOT NULL COMMENT '商家名称',
  `type`           VARCHAR(32)   NOT NULL COMMENT '商家类型: shop/hospital/grooming',
  `tags`           JSON          DEFAULT NULL COMMENT '标签JSON',
  `description`    TEXT          DEFAULT NULL COMMENT '商家简介',
  `address`        VARCHAR(256)  DEFAULT NULL COMMENT '地址',
  `phone`          VARCHAR(20)   DEFAULT NULL COMMENT '联系电话',
  `score`          DECIMAL(3,2)  DEFAULT 0.00 COMMENT '评分(0-5)',
  `img_url`        VARCHAR(512)  DEFAULT NULL COMMENT '封面图URL',
  `business_hours` JSON          DEFAULT NULL COMMENT '营业时间JSON',
  `lat`            DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  `lng`            DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  `status`         VARCHAR(16)   NOT NULL DEFAULT 'pending' COMMENT '状态: pending/active/suspended',
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_lat_lng` (`lat`, `lng`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='同城商家表';

-- -----------------------------------------------------------
-- 22. 商家入驻申请表
-- -----------------------------------------------------------
CREATE TABLE `t_merchant_apply` (
  `id`            BIGINT       NOT NULL AUTO_INCREMENT,
  `merchant_type` VARCHAR(32)  NOT NULL COMMENT '商户类型',
  `name`          VARCHAR(128) NOT NULL COMMENT '商户名称',
  `contact`       VARCHAR(32)  NOT NULL COMMENT '联系人',
  `phone`         VARCHAR(20)  NOT NULL COMMENT '联系电话',
  `city`          VARCHAR(64)  DEFAULT NULL COMMENT '所在城市',
  `address`       VARCHAR(256) DEFAULT NULL COMMENT '详细地址',
  `description`   TEXT         DEFAULT NULL COMMENT '申请说明',
  `wechat`        VARCHAR(64)  DEFAULT NULL COMMENT '微信号',
  `status`        VARCHAR(16)  NOT NULL DEFAULT 'pending' COMMENT '审核状态: pending/approved/rejected',
  `reviewer_id`   BIGINT       DEFAULT NULL COMMENT '审核人ID',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商家入驻申请表';

-- -----------------------------------------------------------
-- 23. 课程表
-- -----------------------------------------------------------
CREATE TABLE `t_course` (
  `id`           BIGINT        NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(128)  NOT NULL COMMENT '课程名称',
  `tier`         VARCHAR(16)   NOT NULL COMMENT '课程层级: basic/pro/partner',
  `description`  TEXT          DEFAULT NULL COMMENT '课程简介',
  `price`        DECIMAL(10,2) NOT NULL COMMENT '价格',
  `hero_img`     VARCHAR(512)  DEFAULT NULL COMMENT '封面图URL',
  `features`     JSON          DEFAULT NULL COMMENT '课程特色JSON',
  `chapter_list` JSON          DEFAULT NULL COMMENT '章节列表JSON',
  `sort_order`   INT           NOT NULL DEFAULT 0 COMMENT '排序权重',
  `is_active`    TINYINT(1)    NOT NULL DEFAULT 1 COMMENT '是否上架: 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `idx_tier` (`tier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- -----------------------------------------------------------
-- 24. 课程视频表
-- -----------------------------------------------------------
CREATE TABLE `t_course_video` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT,
  `course_id`  BIGINT       NOT NULL COMMENT '课程ID',
  `title`      VARCHAR(128) NOT NULL COMMENT '视频标题',
  `video_url`  VARCHAR(512) NOT NULL COMMENT '视频地址',
  `thumbnail`  VARCHAR(512) DEFAULT NULL COMMENT '缩略图URL',
  `duration`   INT          DEFAULT 0 COMMENT '时长(秒)',
  `is_free`    TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否免费: 0-否 1-是',
  `sort_order` INT          NOT NULL DEFAULT 0 COMMENT '排序权重',
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程视频表';

-- -----------------------------------------------------------
-- 25. 用户课程购买表
-- -----------------------------------------------------------
CREATE TABLE `t_user_course` (
  `id`         BIGINT      NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT      NOT NULL COMMENT '用户ID',
  `course_id`  BIGINT      NOT NULL COMMENT '课程ID',
  `status`     VARCHAR(16) NOT NULL DEFAULT 'active' COMMENT '学习状态: active/expired/refunded',
  `paid_at`    DATETIME    DEFAULT NULL COMMENT '购买时间',
  `expire_at`  DATETIME    DEFAULT NULL COMMENT '到期时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户课程购买表';

-- -----------------------------------------------------------
-- 26. 直播间表
-- -----------------------------------------------------------
CREATE TABLE `t_live_room` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(128) NOT NULL COMMENT '直播间名称',
  `platform`   VARCHAR(32)  NOT NULL COMMENT '平台: douyin/kuaishou/wechat',
  `room_id`    VARCHAR(64)  DEFAULT NULL COMMENT '房间号',
  `share_code` VARCHAR(128) DEFAULT NULL COMMENT '分享口令',
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '是否启用: 0-否 1-是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='直播间表';

-- -----------------------------------------------------------
-- 27. 积分流水表
-- -----------------------------------------------------------
CREATE TABLE `t_points_log` (
  `id`            BIGINT       NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT       NOT NULL COMMENT '用户ID',
  `type`          VARCHAR(16)  NOT NULL COMMENT '类型: earn/spend/expire',
  `source`        VARCHAR(64)  DEFAULT NULL COMMENT '来源: order/sign_in/activity',
  `change_value`  INT          NOT NULL COMMENT '变动值(正增负减)',
  `balance_after` INT          NOT NULL COMMENT '变动后余额',
  `remark`        VARCHAR(256) DEFAULT NULL COMMENT '备注',
  `related_id`    BIGINT       DEFAULT NULL COMMENT '关联业务ID',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分流水表';

-- -----------------------------------------------------------
-- 28. 充值记录表
-- -----------------------------------------------------------
CREATE TABLE `t_recharge_log` (
  `id`             BIGINT        NOT NULL AUTO_INCREMENT,
  `recharge_no`    VARCHAR(32)   NOT NULL COMMENT '充值单号',
  `user_id`        BIGINT        NOT NULL COMMENT '用户ID',
  `method`         VARCHAR(32)   NOT NULL COMMENT '充值方式: wechat/balance/card',
  `amount`         DECIMAL(10,2) NOT NULL COMMENT '充值金额',
  `gift_amount`    DECIMAL(10,2) DEFAULT 0.00 COMMENT '赠送金额',
  `status`         VARCHAR(16)   NOT NULL DEFAULT 'pending' COMMENT '状态: pending/success/failed',
  `transaction_id` VARCHAR(64)   DEFAULT NULL COMMENT '第三方交易号',
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '充值时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_recharge_no` (`recharge_no`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='充值记录表';

-- -----------------------------------------------------------
-- 29. 消费记录表
-- -----------------------------------------------------------
CREATE TABLE `t_consumption_log` (
  `id`            BIGINT        NOT NULL AUTO_INCREMENT,
  `log_no`        VARCHAR(32)   NOT NULL COMMENT '消费流水号',
  `user_id`       BIGINT        NOT NULL COMMENT '用户ID',
  `type`          VARCHAR(32)   NOT NULL COMMENT '类型: purchase/refund',
  `item_summary`  VARCHAR(256)  DEFAULT NULL COMMENT '商品摘要',
  `total_amount`  DECIMAL(10,2) NOT NULL COMMENT '总金额',
  `balance_pay`   DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额支付',
  `wechat_pay`    DECIMAL(10,2) DEFAULT 0.00 COMMENT '微信支付',
  `status`        VARCHAR(16)   NOT NULL DEFAULT 'success' COMMENT '状态: success/refunded',
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '消费时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_log_no` (`log_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消费记录表';

-- -----------------------------------------------------------
-- 30. Banner轮播表
-- -----------------------------------------------------------
CREATE TABLE `t_banner` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(64)  NOT NULL COMMENT '主标题',
  `subtitle`    VARCHAR(128) DEFAULT NULL COMMENT '副标题',
  `bg_img`      VARCHAR(512) DEFAULT NULL COMMENT '背景图URL',
  `bg_color`    VARCHAR(16)  DEFAULT '#f0f0f0' COMMENT '兜底背景色',
  `btn_text`    VARCHAR(32)  DEFAULT NULL COMMENT '按钮文字',
  `btn_color`   VARCHAR(16)  DEFAULT NULL COMMENT '按钮颜色',
  `link_type`   VARCHAR(16)  DEFAULT 'none' COMMENT '跳转类型: product/merchant/page/url/none',
  `link_value`  VARCHAR(256) DEFAULT NULL COMMENT '跳转目标ID或路径',
  `sort_order`  INT          NOT NULL DEFAULT 0 COMMENT '轮播顺序',
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '是否启用: 0-否 1-是',
  `valid_from`  DATETIME     DEFAULT NULL COMMENT '展示开始时间',
  `valid_until` DATETIME     DEFAULT NULL COMMENT '展示结束时间',
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner轮播表';

-- -----------------------------------------------------------
-- 31. 商品组合包表
-- -----------------------------------------------------------
CREATE TABLE `t_product_bundle` (
  `id`             BIGINT        NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(128)  NOT NULL COMMENT '组合包名称',
  `cover_img`      VARCHAR(512)  DEFAULT NULL COMMENT '封面图URL',
  `bundle_price`   DECIMAL(10,2) NOT NULL COMMENT '组合价',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT '原价合计',
  `description`    TEXT          DEFAULT NULL COMMENT '描述',
  `is_active`      TINYINT(1)    NOT NULL DEFAULT 1 COMMENT '是否上架: 0-否 1-是',
  `sort_order`     INT           NOT NULL DEFAULT 0 COMMENT '排序权重',
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品组合包表';

-- -----------------------------------------------------------
-- 32. 组合包商品明细表
-- -----------------------------------------------------------
CREATE TABLE `t_product_bundle_item` (
  `id`         BIGINT   NOT NULL AUTO_INCREMENT,
  `bundle_id`  BIGINT   NOT NULL COMMENT '所属组合包ID',
  `product_id` BIGINT   NOT NULL COMMENT '商品ID',
  `qty`        INT      NOT NULL DEFAULT 1 COMMENT '数量',
  `sort_order` INT      NOT NULL DEFAULT 0 COMMENT '排序权重',
  PRIMARY KEY (`id`),
  KEY `idx_bundle_id` (`bundle_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组合包商品明细表';

-- -----------------------------------------------------------
-- 33. 拼团活动表
-- -----------------------------------------------------------
CREATE TABLE `t_group_buy` (
  `id`            BIGINT        NOT NULL AUTO_INCREMENT,
  `product_id`    BIGINT        NOT NULL COMMENT '关联商品ID',
  `size`          INT           NOT NULL COMMENT '成团人数',
  `discount_rate` DECIMAL(3,2)  NOT NULL COMMENT '折扣率(如0.80)',
  `status`        VARCHAR(16)   NOT NULL DEFAULT 'active' COMMENT '状态: active/full/success/failed',
  `expire_at`     DATETIME      NOT NULL COMMENT '过期时间',
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`),
  KEY `idx_expire_at` (`expire_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼团活动表';

-- -----------------------------------------------------------
-- 34. 拼团成员表
-- -----------------------------------------------------------
CREATE TABLE `t_group_buy_member` (
  `id`         BIGINT   NOT NULL AUTO_INCREMENT,
  `group_id`   BIGINT   NOT NULL COMMENT '所属拼团ID',
  `user_id`    BIGINT   NOT NULL COMMENT '参团用户ID',
  `joined_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_user` (`group_id`, `user_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼团成员表';

-- ============================================================
-- 初始化数据: 会员等级配置
-- ============================================================
INSERT INTO `t_member_level` (`level_key`, `name`, `threshold`, `next_threshold`, `points_rate`, `privileges`, `sort_order`) VALUES
('silver',  '银牌会员', 500.00,   1000.00, 1, '{"discount": 1.00, "birthday_gift": true}', 1),
('gold',    '金牌会员', 1000.00,  3000.00, 2, '{"discount": 0.95, "birthday_gift": true, "priority_shipping": true}', 2),
('diamond', '黑钻会员', 3000.00,  NULL,    3, '{"discount": 0.90, "birthday_gift": true, "priority_shipping": true, "exclusive_service": true}', 3);

-- ============================================================
-- 初始化数据: 分佣等级配置
-- ============================================================
INSERT INTO `t_commission_tier` (`name`, `level`, `icon`, `commission_rate`, `rates`, `upgrade_condition`, `qualification`, `is_hidden`, `color`, `is_active`) VALUES
('梵优合伙人',     1, NULL,  9.00, '{"direct": 9}',                        NULL,                              '购买梵优合伙人课程(¥2,999)', 0, '#6ee7b7', 1),
('梵优主理人',     2, NULL, 15.00, '{"direct": 9, "team": 6}',             '购买梵优主理人课程(¥5,999)', '购买梵优主理人课程(¥5,999)', 0, '#38bdf8', 1),
('梵优城市分公司', 3, NULL, 18.00, '{"direct": 9, "team": 6, "branch": 3}', NULL,                              '后端手动设置',               1, '#a78bfa', 1);

-- ============================================================
-- 初始化数据: 商品分类
-- ============================================================
INSERT INTO `t_product_category` (`name`, `parent_id`, `sort_order`, `is_active`) VALUES
('零食冻干',  0, 1, 1),
('品牌专区',  0, 2, 1),
('宠物服饰',  0, 3, 1),
('玩具互动',  0, 4, 1),
('主粮罐头',  0, 5, 1),
('清洁洗护',  0, 6, 1),
('保健营养',  0, 7, 1);
