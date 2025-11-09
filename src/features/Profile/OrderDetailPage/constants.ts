/**
 * OrderDetailPage - 常量配置
 */

import type { OrderStatusConfig } from './types';

// 颜色常量
export const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  gray: '#6B7280',
} as const;

// 订单状态配置
export const ORDER_STATUS_CONFIG: Record<string, OrderStatusConfig> = {
  pending: {
    label: '待接单',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  accepted: {
    label: '已接单',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  in_progress: {
    label: '进行中',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  completed: {
    label: '已完成',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  cancelled: {
    label: '已取消',
    color: '#6B7280',
    bgColor: '#F3F4F6',
  },
} as const;

