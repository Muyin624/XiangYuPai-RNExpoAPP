/**
 * MyOrdersPage - 常量配置
 */

import type { OrderStatusConfig, TabConfig } from './types';

// 颜色常量
export const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  gray: '#6B7280',
} as const;

// Tab配置
export const TABS: TabConfig[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待接单' },
  { key: 'in_progress', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

// 订单状态配置（服务提供者视角）
export const ORDER_STATUS_CONFIG: Record<string, OrderStatusConfig> = {
  pending: {
    label: '待接单',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    actions: [
      { label: '接单', type: 'primary' },
      { label: '拒绝', type: 'default' },
    ],
  },
  accepted: {
    label: '已接单',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    actions: [
      { label: '开始服务', type: 'primary' },
    ],
  },
  in_progress: {
    label: '进行中',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    actions: [
      { label: '完成服务', type: 'primary' },
    ],
  },
  completed: {
    label: '已完成',
    color: '#10B981',
    bgColor: '#D1FAE5',
    actions: [
      { label: '查看评价', type: 'default' },
    ],
  },
  cancelled: {
    label: '已取消',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    actions: [
      { label: '删除订单', type: 'default' },
    ],
  },
} as const;

