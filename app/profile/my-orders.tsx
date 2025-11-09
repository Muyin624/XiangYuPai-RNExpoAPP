/**
 * My Orders Screen - 我的订单页面
 * 
 * Route: /profile/my-orders
 * 
 * Features:
 * - Tab切换（全部/待接单/进行中/已完成/已取消）
 * - 订单列表展示
 * - 订单状态筛选
 * - 跳转订单详情
 */

import MyOrdersPage from '@/src/features/Profile/MyOrdersPage';
import React from 'react';

export default function MyOrdersScreen() {
  return <MyOrdersPage />;
}

