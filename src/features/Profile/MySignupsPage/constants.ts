/**
 * MySignupsPage - 常量配置（报名客户视角）
 */

import type { SignupStatusConfig, TabConfig } from './types';

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
  { key: 'pending', label: '待确认' },
  { key: 'confirmed', label: '已确认' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

// 报名状态配置
export const SIGNUP_STATUS_CONFIG: Record<string, SignupStatusConfig> = {
  pending: {
    label: '待确认',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    actions: [
      { label: '取消报名', type: 'default' },
    ],
  },
  confirmed: {
    label: '已确认',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    actions: [
      { label: '查看见面码', type: 'primary' },
      { label: '查看详情', type: 'default' },
    ],
  },
  completed: {
    label: '已完成',
    color: '#10B981',
    bgColor: '#D1FAE5',
    actions: [
      { label: '评价', type: 'primary' },
    ],
  },
  cancelled: {
    label: '已取消',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    actions: [
      { label: '删除记录', type: 'default' },
    ],
  },
} as const;

