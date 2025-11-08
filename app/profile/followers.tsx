/**
 * Followers Screen - 粉丝列表路由页面
 * 
 * 路由: /profile/followers
 * 
 * 功能：
 * - 显示当前登录用户的粉丝列表
 * - 使用统一的FollowListPage组件，初始Tab为"粉丝"
 * - 使用ErrorBoundary包裹保证容错性
 */

import { ErrorBoundary } from '@/src/components';
import { FollowListPage } from '@/src/features/Profile';
import React from 'react';

export default function FollowersScreen() {
  return (
    <ErrorBoundary>
      <FollowListPage initialTab="followers" />
    </ErrorBoundary>
  );
}

