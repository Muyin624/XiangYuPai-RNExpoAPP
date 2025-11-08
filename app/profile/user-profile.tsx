/**
 * User Profile Screen - 个人中心路由
 * 
 * Route: /profile/user-profile
 * 
 * Features:
 * - 查看当前用户的完整主页
 * - 从"我的"页面的"个人中心"菜单进入
 */

import { ErrorBoundary } from '@/src/components';
import PersonalCenterPage from '@/src/features/Profile/PersonalCenterPage';
import React from 'react';

export default function UserProfileScreen() {
  return (
    <ErrorBoundary>
      <PersonalCenterPage />
    </ErrorBoundary>
  );
}

