/**
 * MyPurchasesPage - 常量配置（客户视角）
 */

import type { PurchaseStatusConfig, TabConfig } from './types';

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

// 订单状态配置（客户视角）
export const PURCHASE_STATUS_CONFIG: Record<string, PurchaseStatusConfig> = {
  pending: {
    label: '待接单',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    actions: [
      { label: '取消订单', type: 'default' },
      { label: '联系客服', type: 'default' },
    ],
  },
  accepted: {
    label: '已接单',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    actions: [
      { label: '查看详情', type: 'primary' },
    ],
  },
  in_progress: {
    label: '进行中',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    actions: [
      { label: '联系服务者', type: 'primary' },
    ],
  },
  completed: {
    label: '已完成',
    color: '#10B981',
    bgColor: '#D1FAE5',
    actions: [
      { label: '评价', type: 'primary' },
      { label: '再来一单', type: 'default' },
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

