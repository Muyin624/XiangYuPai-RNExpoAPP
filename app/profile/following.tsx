/**
 * Following Screen - 关注列表路由页面
 * 
 * 路由: /profile/following
 * 
 * 功能：
 * - 显示当前登录用户的关注列表
 * - 使用统一的FollowListPage组件，初始Tab为"关注"
 * - 使用ErrorBoundary包裹保证容错性
 */

import { ErrorBoundary } from '@/src/components';
import { FollowListPage } from '@/src/features/Profile';
import React from 'react';

export default function FollowingScreen() {
  return (
    <ErrorBoundary>
      <FollowListPage initialTab="following" />
    </ErrorBoundary>
  );
}

