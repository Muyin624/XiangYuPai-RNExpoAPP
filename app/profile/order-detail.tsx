/**
 * Order Detail Screen - 订单详情页面
 * 
 * Route: /profile/order-detail?orderId={orderId}
 * 
 * Features:
 * - 根据订单状态显示不同内容
 * - 待接单：显示等待接单状态
 * - 进行中：显示服务进度
 * - 已完成：显示评价和完成信息
 * - 已取消：显示取消原因
 */

import OrderDetailPage from '@/src/features/Profile/OrderDetailPage';
import React from 'react';

export default function OrderDetailScreen() {
  return <OrderDetailPage />;
}

